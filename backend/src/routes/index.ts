import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.js';
import { fossilsRoutes } from './fossils.js';
import { provenanceRoutes } from './provenance.js';
import { networkRoutes } from './network.js';
import { contaminationRoutes } from './contamination.js';
import { searchRoutes } from './search.js';
import { extinctionRoutes } from './extinction.js';
import { organizationRoutes } from './organizations.js';
import { billingRoutes } from './billing.js';

export async function registerRoutes(server: FastifyInstance) {
  // API v1 prefix
  await server.register(
    async (api) => {
      // Public routes
      await api.register(authRoutes, { prefix: '/auth' });
      
      // Protected routes
      await api.register(async (protectedApi) => {
        protectedApi.addHook('onRequest', async (request, reply) => {
          const { requireAuth } = await import('../middleware/auth.js');
          await requireAuth(request, reply);
        });

        await protectedApi.register(fossilsRoutes, { prefix: '/fossils' });
        await protectedApi.register(provenanceRoutes, { prefix: '/provenance' });
        await protectedApi.register(networkRoutes, { prefix: '/network' });
        await protectedApi.register(contaminationRoutes, { prefix: '/contamination' });
        await protectedApi.register(searchRoutes, { prefix: '/search' });
        await protectedApi.register(extinctionRoutes, { prefix: '/extinction' });
        await protectedApi.register(organizationRoutes, { prefix: '/organizations' });
        await protectedApi.register(billingRoutes, { prefix: '/billing' });
      });
    },
    { prefix: '/api/v1' }
  );
}
