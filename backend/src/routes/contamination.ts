import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../database/index.js';

export async function contaminationRoutes(server: FastifyInstance) {
  // Scan for knowledge contamination
  server.get(
    '/scan',
    {
      schema: {
        querystring: z.object({
          severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      let query = db
        .selectFrom('contamination_events')
        .innerJoin('knowledge_fossils', 'knowledge_fossils.id', 'contamination_events.fossil_id')
        .select([
          'contamination_events.id',
          'contamination_events.fossil_id',
          'knowledge_fossils.content_preview',
          'contamination_events.severity',
          'contamination_events.score',
          'contamination_events.detection_method',
          'contamination_events.remediated',
          'contamination_events.created_at',
        ])
        .where('knowledge_fossils.organization_id', '=', request.user.organizationId);

      if (request.query.severity) {
        query = query.where('contamination_events.severity', '=', request.query.severity);
      }

      const events = await query.orderBy('contamination_events.score', 'desc').execute();

      return {
        success: true,
        data: {
          events,
          summary: {
            total: events.length,
            bySeverity: {
              critical: events.filter((e) => e.severity === 'critical').length,
              high: events.filter((e) => e.severity === 'high').length,
              medium: events.filter((e) => e.severity === 'medium').length,
              low: events.filter((e) => e.severity === 'low').length,
            },
          },
        },
      };
    }
  );

  // Get contamination details for a specific fossil
  server.get(
    '/:fossilId',
    {
      schema: {
        params: z.object({
          fossilId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      const events = await db
        .selectFrom('contamination_events')
        .select([
          'id',
          'severity',
          'score',
          'detection_method',
          'mutation_details',
          'remediated',
          'created_at',
        ])
        .where('fossil_id', '=', request.params.fossilId)
        .orderBy('created_at', 'desc')
        .execute();

      return {
        success: true,
        data: events,
      };
    }
  );

  // Get severity heatmap data
  server.get('/heatmap', async (request) => {
    const db = getDb();
    
    const events = await db
      .selectFrom('contamination_events')
      .innerJoin('knowledge_fossils', 'knowledge_fossils.id', 'contamination_events.fossil_id')
      .select([
        'contamination_events.severity',
        'contamination_events.score',
        'knowledge_fossils.stratigraphic_depth',
        'contamination_events.created_at',
      ])
      .where('knowledge_fossils.organization_id', '=', request.user.organizationId)
      .execute();

    // Group by depth and time for heatmap
    const heatmapData = events.map((e) => ({
      depth: e.stratigraphic_depth,
      timestamp: e.created_at,
      severity: e.severity,
      score: e.score,
    }));

    return {
      success: true,
      data: heatmapData,
    };
  });

  // Remediate contamination
  server.post(
    '/remediate',
    {
      schema: {
        body: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      await db
        .updateTable('contamination_events')
        .set({
          remediated: true,
          remediated_at: new Date(),
        })
        .where('id', '=', request.body.eventId)
        .execute();

      return {
        success: true,
        message: 'Contamination marked as remediated',
      };
    }
  );
}
