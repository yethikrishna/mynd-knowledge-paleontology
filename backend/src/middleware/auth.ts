import { FastifyRequest, FastifyReply } from 'fastify';
import { getDb } from '../database/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/error-handler.js';
import crypto from 'crypto';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  organizationId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  // Check for API key first
  const apiKey = request.headers['x-api-key'] as string;
  if (apiKey) {
    await authenticateApiKey(request, apiKey);
    return;
  }

  // Then check JWT
  try {
    await request.jwtVerify();
    const userId = (request.user as any).sub;
    
    const db = getDb();
    const member = await db
      .selectFrom('organization_members')
      .innerJoin('users', 'users.id', 'organization_members.user_id')
      .select([
        'users.id',
        'users.email',
        'users.name',
        'organization_members.organization_id',
        'organization_members.role',
      ])
      .where('users.id', '=', userId)
      .orderBy('organization_members.created_at', 'desc')
      .executeTakeFirst();

    if (!member) {
      throw new UnauthorizedError('User not found');
    }

    request.user = {
      id: member.id,
      email: member.email,
      name: member.name,
      organizationId: member.organization_id,
      role: member.role as any,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
}

async function authenticateApiKey(request: FastifyRequest, apiKey: string) {
  const db = getDb();
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const apiKeyRecord = await db
    .selectFrom('api_keys')
    .select(['id', 'organization_id', 'expires_at'])
    .where('key_hash', '=', keyHash)
    .executeTakeFirst();

  if (!apiKeyRecord) {
    throw new UnauthorizedError('Invalid API key');
  }

  if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
    throw new UnauthorizedError('API key expired');
  }

  // Update last used
  await db
    .updateTable('api_keys')
    .set({ last_used_at: new Date() })
    .where('id', '=', apiKeyRecord.id)
    .execute();

  // Create system user context for API key access
  request.user = {
    id: 'api-key-' + apiKeyRecord.id,
    email: 'api@mynd.local',
    name: 'API Key',
    organizationId: apiKeyRecord.organization_id,
    role: 'editor', // API keys have editor access by default
  };
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticate(request, reply);
    
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Insufficient permissions. Required: ${roles.join(', ')}`
      );
    }
  };
}

export const requireAuth = authenticate;
export const requireEditor = requireRole('owner', 'admin', 'editor');
export const requireAdmin = requireRole('owner', 'admin');
export const requireOwner = requireRole('owner');
