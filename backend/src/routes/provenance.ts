import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../database/index.js';
import { NotFoundError } from '../utils/error-handler.js';

export async function provenanceRoutes(server: FastifyInstance) {
  // Get complete provenance chain for a fossil
  server.get(
    '/:knowledgeId',
    {
      schema: {
        params: z.object({
          knowledgeId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      // Get the main fossil
      const fossil = await db
        .selectFrom('knowledge_fossils')
        .select(['id', 'hash', 'content_preview', 'timestamp', 'merkle_root'])
        .where('id', '=', request.params.knowledgeId)
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst();

      if (!fossil) {
        throw new NotFoundError('Knowledge fossil not found');
      }

      // Get provenance chain
      const chain = await db
        .selectFrom('provenance_chains')
        .select([
          'id',
          'fossil_id',
          'parent_fossil_id',
          'transfer_method',
          'transfer_timestamp',
          'confidence_score',
          'contamination_introduced',
          'proof_verified',
        ])
        .where('fossil_id', '=', request.params.knowledgeId)
        .orderBy('transfer_timestamp', 'asc')
        .execute();

      return {
        success: true,
        data: {
          fossil,
          chain,
        },
      };
    }
  );

  // Get provenance as graph structure
  server.get(
    '/:knowledgeId/graph',
    {
      schema: {
        params: z.object({
          knowledgeId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      // Simple graph structure for demo
      const chain = await db
        .selectFrom('provenance_chains')
        .select(['fossil_id', 'parent_fossil_id', 'transfer_method', 'confidence_score'])
        .where('fossil_id', '=', request.params.knowledgeId)
        .execute();

      const nodes: Array<{ id: string; label: string; type: string }> = [];
      const edges: Array<{ source: string; target: string; label: string }> = [];

      // Build nodes and edges from chain
      nodes.push({ id: request.params.knowledgeId, label: 'Current', type: 'fossil' });
      
      for (const link of chain) {
        if (link.parent_fossil_id) {
          nodes.push({ id: link.parent_fossil_id, label: 'Ancestor', type: 'fossil' });
          edges.push({
            source: link.parent_fossil_id,
            target: link.fossil_id,
            label: link.transfer_method,
          });
        }
      }

      return {
        success: true,
        data: { nodes, edges },
      };
    }
  );

  // Verify chain-of-custody
  server.post(
    '/verify',
    {
      schema: {
        body: z.object({
          knowledgeId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      const chain = await db
        .selectFrom('provenance_chains')
        .select(['proof_verified', 'contamination_introduced'])
        .where('fossil_id', '=', request.body.knowledgeId)
        .execute();

      const allVerified = chain.every((c) => c.proof_verified);
      const totalContamination = chain.reduce((sum, c) => sum + c.contamination_introduced, 0);

      return {
        success: true,
        data: {
          chainLength: chain.length,
          allVerified,
          totalContamination,
          trustScore: allVerified ? Math.max(0, 1 - totalContamination) : 0,
        },
      };
    }
  );
}
