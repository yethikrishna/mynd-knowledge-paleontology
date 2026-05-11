import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { FossilizationService } from '../services/fossilization.js';
import { getDb } from '../database/index.js';
import { requireEditor } from '../middleware/auth.js';
import { BadRequestError, NotFoundError } from '../utils/error-handler.js';

const fossilizationService = new FossilizationService();

export async function fossilsRoutes(server: FastifyInstance) {
  // Create new knowledge fossil
  server.post(
    '/',
    {
      onRequest: requireEditor,
      schema: {
        body: z.object({
          content: z.string().min(1),
          sourceType: z.enum(['model', 'dataset', 'training_run', 'manual', 'api']),
          sourceId: z.string().optional(),
          sourceMetadata: z.record(z.any()).optional(),
        }),
      },
    },
    async (request) => {
      const result = await fossilizationService.fossilize(
        request.user.organizationId,
        request.body.content,
        {
          sourceType: request.body.sourceType as any,
          sourceId: request.body.sourceId,
          sourceMetadata: request.body.sourceMetadata,
        }
      );

      return {
        success: true,
        data: result,
      };
    }
  );

  // Get fossil by ID
  server.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      const fossil = await db
        .selectFrom('knowledge_fossils')
        .select([
          'id',
          'hash',
          'content_preview',
          'source_type',
          'timestamp',
          'merkle_root',
          'stratigraphic_depth',
          'contamination_score',
          'created_at',
        ])
        .where('id', '=', request.params.id)
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      if (!fossil) {
        throw new NotFoundError('Fossil not found');
      }

      return {
        success: true,
        data: fossil,
      };
    }
  );

  // Get fossil full content
  server.get(
    '/:id/content',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      const fossil = await db
        .selectFrom('knowledge_fossils')
        .select(['content'])
        .where('id', '=', request.params.id)
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      if (!fossil) {
        throw new NotFoundError('Fossil not found');
      }

      return {
        success: true,
        data: { content: fossil.content },
      };
    }
  );

  // Get Merkle proof for fossil
  server.get(
    '/:id/proof',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      const fossil = await db
        .selectFrom('knowledge_fossils')
        .select(['merkle_proof'])
        .where('id', '=', request.params.id)
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      if (!fossil) {
        throw new NotFoundError('Fossil not found');
      }

      return {
        success: true,
        data: {
          proof: JSON.parse(fossil.merkle_proof as string),
        },
      };
    }
  );

  // Verify fossil authenticity
  server.post(
    '/:id/verify',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const result = await fossilizationService.verifyFossil(request.params.id);
      return {
        success: true,
        data: result,
      };
    }
  );

  // List fossils with pagination
  server.get(
    '/',
    {
      schema: {
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0),
          sourceType: z.string().optional(),
          minDepth: z.coerce.number().optional(),
          maxDepth: z.coerce.number().optional(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      let query = db
        .selectFrom('knowledge_fossils')
        .select([
          'id',
          'hash',
          'content_preview',
          'source_type',
          'timestamp',
          'stratigraphic_depth',
          'contamination_score',
          'created_at',
        ])
        .where('organization_id', '=', request.user.organizationId);

      if (request.query.sourceType) {
        query = query.where('source_type', '=', request.query.sourceType);
      }
      if (request.query.minDepth !== undefined) {
        query = query.where('stratigraphic_depth', '>=', request.query.minDepth);
      }
      if (request.query.maxDepth !== undefined) {
        query = query.where('stratigraphic_depth', '<=', request.query.maxDepth);
      }

      const fossils = await query
        .orderBy('created_at', 'desc')
        .limit(request.query.limit)
        .offset(request.query.offset)
        .execute();

      const total = await db
        .selectFrom('knowledge_fossils')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      return {
        success: true,
        data: {
          fossils,
          pagination: {
            total: parseInt((total as any).count),
            limit: request.query.limit,
            offset: request.query.offset,
          },
        },
      };
    }
  );

  // Get fossils stats
  server.get('/stats', async (request) => {
    const db = getDb();
    
    const [totalResult, bySource, avgDepth] = await Promise.all([
      db
        .selectFrom('knowledge_fossils')
        .select((eb) => eb.fn.count('id').as('total'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst(),
      db
        .selectFrom('knowledge_fossils')
        .select(['source_type', (eb) => eb.fn.count('id').as('count')])
        .where('organization_id', '=', request.user.organizationId)
        .groupBy('source_type')
        .execute(),
      db
        .selectFrom('knowledge_fossils')
        .select((eb) => eb.fn.avg('stratigraphic_depth').as('avg_depth'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst(),
    ]);

    return {
      success: true,
      data: {
        total: parseInt((totalResult as any).total),
        bySource: Object.fromEntries(
          bySource.map((r) => [r.source_type, parseInt((r as any).count)])
        ),
        averageDepth: parseFloat((avgDepth as any).avg_depth || '0'),
      },
    };
  });
}
