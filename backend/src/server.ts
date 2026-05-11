import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './utils/error-handler.js';

const server = fastify({
  logger: config.NODE_ENV === 'development',
  disableRequestLogging: config.NODE_ENV !== 'development',
});

// Register core plugins
await server.register(cors, {
  origin: config.CORS_ORIGINS,
  credentials: true,
});

await server.register(helmet, {
  contentSecurityPolicy: config.NODE_ENV === 'production',
});

await server.register(jwt, {
  secret: config.JWT_SECRET,
  sign: {
    expiresIn: '15m',
  },
});

await server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
});

// Type provider setup
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Swagger/OpenAPI documentation
await server.register(swagger, {
  openapi: {
    info: {
      title: 'MYND Knowledge Paleontology API',
      description: 'World\'s first knowledge origin and lineage tracking platform for AI systems',
      version: '1.0.0',
    },
    servers: [
      {
        url: config.API_URL,
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

await server.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// Error handler
server.setErrorHandler(errorHandler);

// Register all routes
await registerRoutes(server);

// Health check endpoint
server.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: config.VERSION,
  };
});

async function start() {
  try {
    await server.listen({
      port: config.PORT,
      host: '0.0.0.0',
    });
    logger.info(`Server running on http://0.0.0.0:${config.PORT}`);
    logger.info(`API docs available at http://0.0.0.0:${config.PORT}/docs`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.close();
  process.exit(0);
});

start();
