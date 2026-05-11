import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDb } from '../database/index.js';

export async function networkRoutes(server: FastifyInstance) {
  // Get knowledge diffusion network
  server.get(
    '/diffusion',
    {
      schema: {
        querystring: z.object({
          limit: z.coerce.number().default(100),
        }),
      },
    },
    async (request) => {
      const db = getDb();
      
      // Get model nodes
      const nodes = await db
        .selectFrom('model_nodes')
        .select(['id', 'name', 'type', 'version', 'parent_id'])
        .where('organization_id', '=', request.user.organizationId)
        .limit(request.query.limit)
        .execute();

      // Get propagation edges
      const edges = await db
        .selectFrom('propagation_edges')
        .select([
          'id',
          'from_node_id',
          'to_node_id',
          'transfer_method',
          'timestamp',
          'confidence',
          'contamination_introduced',
        ])
        .where('organization_id', '=', request.user.organizationId)
        .limit(request.query.limit)
        .execute();

      // Format for Sigma.js
      const sigmaNodes = nodes.map((n) => ({
        id: n.id,
        label: n.name,
        size: Math.max(5, Math.min(20, 10 + (edges.filter((e) => 
          e.from_node_id === n.id || e.to_node_id === n.id
        ).length * 2))),
        color: getNodeColor(n.type),
        type: n.type,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      }));

      const sigmaEdges = edges.map((e) => ({
        id: e.id,
        source: e.from_node_id,
        target: e.to_node_id,
        label: e.transfer_method,
        size: e.confidence * 3,
        color: e.contamination_introduced > 0.3 ? '#ef4444' : '#22c55e',
      }));

      return {
        success: true,
        data: {
          nodes: sigmaNodes,
          edges: sigmaEdges,
        },
      };
    }
  );

  // Get network metrics
  server.get('/metrics', async (request) => {
    const db = getDb();
    
    const [nodeCount, edgeCount, avgContamination] = await Promise.all([
      db
        .selectFrom('model_nodes')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst(),
      db
        .selectFrom('propagation_edges')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst(),
      db
        .selectFrom('propagation_edges')
        .select((eb) => eb.fn.avg('contamination_introduced').as('avg'))
        .where('organization_id', '=', request.user.organizationId)
        .executeTakeFirst(),
    ]);

    return {
      success: true,
      data: {
        nodeCount: parseInt((nodeCount as any).count || '0'),
        edgeCount: parseInt((edgeCount as any).count || '0'),
        averageContamination: parseFloat((avgContamination as any).avg || '0'),
      },
    };
  });

  // Get animation-ready network data (for landing page)
  server.get('/animate', async () => {
    // Generate demo network data for animation
    const demoNodes = [];
    const demoEdges = [];
    
    const modelTypes = ['model', 'agent', 'dataset', 'training_run'];
    const transferMethods = ['finetune', 'distillation', 'rag', 'api'];
    
    for (let i = 0; i < 30; i++) {
      demoNodes.push({
        id: `node-${i}`,
        label: `Model ${i}`,
        size: 5 + Math.random() * 15,
        color: getNodeColor(modelTypes[Math.floor(Math.random() * modelTypes.length)]),
        x: Math.random() * 1000,
        y: Math.random() * 1000,
      });
    }
    
    for (let i = 0; i < 50; i++) {
      const source = Math.floor(Math.random() * 30);
      let target = Math.floor(Math.random() * 30);
      while (target === source) target = Math.floor(Math.random() * 30);
      
      demoEdges.push({
        id: `edge-${i}`,
        source: `node-${source}`,
        target: `node-${target}`,
        label: transferMethods[Math.floor(Math.random() * transferMethods.length)],
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.8 ? '#ef4444' : '#22c55e',
      });
    }

    return {
      success: true,
      data: { nodes: demoNodes, edges: demoEdges },
    };
  });
}

function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    model: '#3b82f6',
    agent: '#8b5cf6',
    dataset: '#10b981',
    training_run: '#f59e0b',
  };
  return colors[type] || '#64748b';
}
