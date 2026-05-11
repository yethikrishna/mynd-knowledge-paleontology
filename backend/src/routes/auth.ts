import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/index.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/error-handler.js';
import { config } from '../config/index.js';

export async function authRoutes(server: FastifyInstance) {
  // Register
  server.post(
    '/register',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
          name: z.string().optional(),
          organizationName: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const db = getDb();
      const { email, password, name, organizationName } = request.body;

      // Check if user exists
      const existingUser = await db
        .selectFrom('users')
        .select('id')
        .where('email', '=', email)
        .executeTakeFirst();

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Create password hash
      const passwordHash = await bcrypt.hash(password, 12);

      // Create organization slug
      const slug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create organization
      const [organization] = await db
        .insertInto('organizations')
        .values({
          id: uuidv4(),
          name: organizationName,
          slug,
          plan: 'free',
        })
        .returning(['id'])
        .execute();

      // Create user
      const [user] = await db
        .insertInto('users')
        .values({
          id: uuidv4(),
          email,
          password_hash: passwordHash,
          name,
        })
        .returning(['id', 'email', 'name'])
        .execute();

      // Add as owner
      await db
        .insertInto('organization_members')
        .values({
          id: uuidv4(),
          organization_id: organization.id,
          user_id: user.id,
          role: 'owner',
        })
        .execute();

      // Generate tokens
      const accessToken = server.jwt.sign({ sub: user.id });
      const refreshToken = server.jwt.sign(
        { sub: user.id },
        { expiresIn: '7d' }
      );

      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            organizationId: organization.id,
          },
          accessToken,
        },
      };
    }
  );

  // Login
  server.post(
    '/login',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const db = getDb();
      const { email, password } = request.body;

      const user = await db
        .selectFrom('users')
        .select(['id', 'email', 'name', 'password_hash'])
        .where('email', '=', email)
        .executeTakeFirst();

      if (!user || !user.password_hash) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Get organization
      const member = await db
        .selectFrom('organization_members')
        .select(['organization_id', 'role'])
        .where('user_id', '=', user.id)
        .orderBy('created_at', 'desc')
        .executeTakeFirst();

      // Generate tokens
      const accessToken = server.jwt.sign({ sub: user.id });
      const refreshToken = server.jwt.sign(
        { sub: user.id },
        { expiresIn: '7d' }
      );

      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            organizationId: member?.organization_id,
            role: member?.role,
          },
          accessToken,
        },
      };
    }
  );

  // Refresh token
  server.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token');
    }

    try {
      const decoded: any = server.jwt.verify(refreshToken);
      const accessToken = server.jwt.sign({ sub: decoded.sub });
      
      return {
        success: true,
        data: { accessToken },
      };
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  });

  // Logout
  server.post('/logout', async (request, reply) => {
    reply.clearCookie('refresh_token', { path: '/' });
    return { success: true };
  });

  // Get current user
  server.get('/me', async (request) => {
    try {
      await request.jwtVerify();
      const db = getDb();
      const userId = (request.user as any).sub;

      const user = await db
        .selectFrom('users')
        .select(['id', 'email', 'name', 'avatar_url'])
        .where('id', '=', userId)
        .executeTakeFirst();

      const member = await db
        .selectFrom('organization_members')
        .innerJoin('organizations', 'organizations.id', 'organization_members.organization_id')
        .select([
          'organization_members.organization_id',
          'organization_members.role',
          'organizations.name as organization_name',
          'organizations.plan',
        ])
        .where('user_id', '=', userId)
        .orderBy('organization_members.created_at', 'desc')
        .executeTakeFirst();

      return {
        success: true,
        data: {
          user,
          organization: member
            ? {
                id: member.organization_id,
                name: member.organization_name,
                role: member.role,
                plan: member.plan,
              }
            : null,
        },
      };
    } catch {
      throw new UnauthorizedError();
    }
  });
}
