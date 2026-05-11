import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { FossilizationService } from '../services/fossilization.js';
import { getDb } from '../database/index.js';

const fossilizationService = new FossilizationService();

export async function searchRoutes(server: FastifyInstance) {
  // First occurrence search
  server.post(
    '/first-occurrence',
    {
      schema: {
        body: z.object({
          query: z.string(),
          fromDate: z.string().optional(),
          toDate: z.string().optional(),
        }),
      },
    },
    async (request) => {
      // Semantic similarity search
      const similar = await fossilizationService.searchSimilar(
        request.user.organizationId,
        request.body.query,
        20
      );

      // Get full details and sort by timestamp
      const db = getDb();
      const results = [];

      for (const match of similar) {
        const fossil = await db
          .selectFrom('knowledge_fossils')
          .select([
            'id',
            'hash',
            'content_preview',
            'source_type',
            'timestamp',
            'stratigraphic_depth',
          ])
          .where('id', '=', match.id)
          .executeTakeFirst();

        if (fossil) {
          results.push({
            ...fossil,
            similarity: match.similarity,
          });
        }
      }

      // Sort by timestamp (oldest first = first occurrence)
      results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      return {
        success: true,
        data: {
          firstOccurrence: results[0] || null,
          allMatches: results,
        },
      };
    }
  );

  // Temporal similarity search
  server.get(
    '/temporal/:query',
    {
      schema: {
        params: z.object({
          query: z.string(),
        }),
        querystring: z.object({
          limit: z.coerce.number().default(10),
        }),
      },
    },
    async (request) => {
      const results = await fossilizationService.searchSimilar(
        request.user.organizationId,
        request.params.query,
        request.query.limit
      );

      return {
        success: true,
        data: results,
      };
    }
  );
}
