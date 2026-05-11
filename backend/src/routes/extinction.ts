import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../database/index.js';

export async function extinctionRoutes(server: FastifyInstance) {
  // Get extinction events timeline
  server.get(
    '/timeline',
    {
      schema: {
        querystring: z.object({
          limit: z.coerce.number().default(50),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      const events = await db
        .selectFrom('extinction_events')
        .innerJoin('knowledge_fossils', 'knowledge_fossils.id', 'extinction_events.knowledge_id')
        .innerJoin('model_nodes', 'model_nodes.id', 'extinction_events.model_id')
        .select([
          'extinction_events.id',
          'knowledge_fossils.content_preview',
          'model_nodes.name as model_name',
          'extinction_events.model_version',
          'extinction_events.timestamp',
          'extinction_events.severity',
          'extinction_events.recovery_suggestions',
          'extinction_events.affected_downstream',
        ])
        .where('extinction_events.organization_id', '=', request.user.organizationId)
        .orderBy('extinction_events.timestamp', 'desc')
        .limit(request.query.limit)
        .execute();

      return {
        success: true,
        data: events.map((e) => ({
          ...e,
          recovery_suggestions: e.recovery_suggestions 
            ? JSON.parse(e.recovery_suggestions as string) 
            : [],
          affected_downstream: e.affected_downstream
            ? JSON.parse(e.affected_downstream as string)
            : [],
        })),
      };
    }
  );

  // Get recovery recommendations
  server.get(
    '/:eventId/recommendations',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      const event = await db
        .selectFrom('extinction_events')
        .select(['recovery_suggestions'])
        .where('id', '=', request.params.eventId)
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      const suggestions = event?.recovery_suggestions
        ? JSON.parse(event.recovery_suggestions as string)
        : [
            'Re-fine-tune on the original knowledge base',
            'Add explicit RAG retrieval for this concept',
            'Perform knowledge distillation from parent model',
          ];

      return {
        success: true,
        data: suggestions,
      };
    }
  );
}

// Stub remaining routes
export async function organizationRoutes(server: FastifyInstance) {
  server.get('/', async (request) => {
    const db = getDb();
    const org = await db
      .selectFrom('organizations')
      .select(['id', 'name', 'slug', 'plan', 'subscription_status', 'created_at'])
      .where('id', '=', request.user.organizationId)
      .executeTakeFirst();

    const members = await db
      .selectFrom('organization_members')
      .innerJoin('users', 'users.id', 'organization_members.user_id')
      .select(['users.id', 'users.email', 'users.name', 'organization_members.role'])
      .where('organization_members.organization_id', '=', request.user.organizationId)
      .execute();

    return {
      success: true,
      data: { organization: org, members },
    };
  });
}

export async function billingRoutes(server: FastifyInstance) {
  server.get('/subscription', async (request) => {
    const db = getDb();
    const org = await db
      .selectFrom('organizations')
      .select(['plan', 'subscription_status', 'stripe_customer_id'])
      .where('id', '=', request.user.organizationId)
      .executeTakeFirst();

    return {
      success: true,
      data: {
        plan: org?.plan || 'free',
        status: org?.subscription_status || 'active',
        limits: getPlanLimits(org?.plan || 'free'),
      },
    };
  });

  server.post('/create-checkout-session', async () => {
    // Stripe checkout session creation would go here
    return {
      success: true,
      data: {
        checkoutUrl: 'https://checkout.stripe.com/demo',
      },
    };
  });
}

function getPlanLimits(plan: string) {
  const limits: Record<string, any> = {
    free: {
      fossils: 100,
      models: 5,
      storage: '1GB',
      apiCalls: 1000,
    },
    pro: {
      fossils: 10000,
      models: 50,
      storage: '100GB',
      apiCalls: 100000,
    },
    enterprise: {
      fossils: -1,
      models: -1,
      storage: 'Unlimited',
      apiCalls: -1,
    },
  };
  return limits[plan] || limits.free;
}
