import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/index.js';
import { createFossilProof, MerkleProof } from './merkle-tree.js';
import { logger } from '../utils/logger.js';
import { ChromaClient } from 'chromadb';
import { config } from '../config/index.js';

export interface FossilizationResult {
  id: string;
  hash: string;
  merkleRoot: string;
  merkleProof: MerkleProof;
  timestamp: Date;
  stratigraphicDepth: number;
  contaminationScore: number;
}

export interface FossilizationOptions {
  sourceType: 'model' | 'dataset' | 'training_run' | 'manual' | 'api';
  sourceId?: string;
  sourceMetadata?: Record<string, unknown>;
  calculateDepth?: boolean;
  detectContamination?: boolean;
}

export class FossilizationService {
  private chromaClient: ChromaClient;
  private collection: any;

  constructor() {
    this.chromaClient = new ChromaClient({
      path: config.CHROMA_DB_URL,
    });
  }

  private async initCollection() {
    if (!this.collection) {
      try {
        this.collection = await this.chromaClient.getOrCreateCollection({
          name: 'knowledge_fossils',
        });
      } catch (error) {
        logger.warn('ChromaDB not available, proceeding without vector search');
      }
    }
  }

  static calculateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  static generateEmbedding(content: string): number[] {
    // Simple deterministic embedding for demo
    // In production, use OpenAI/Cohere embeddings API
    const hash = FossilizationService.calculateHash(content);
    const embedding: number[] = [];
    
    for (let i = 0; i < 128; i++) {
      const byte = parseInt(hash.substr((i * 2) % 64, 2), 16);
      embedding.push((byte - 128) / 128);
    }
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map((v) => v / magnitude);
  }

  calculateStratigraphicDepth(
    content: string,
    timestamp: Date,
    propagationHistory: unknown[] = []
  ): number {
    // Stratigraphic depth algorithm based on:
    // 1. Temporal distance from now (older = deeper)
    // 2. Propagation velocity (wider spread = deeper)
    // 3. Content complexity (more information = deeper)
    
    const now = Date.now();
    const ageMs = now - timestamp.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    
    // Temporal score: log scale for age
    const temporalScore = Math.log10(ageDays + 1) / 5; // Normalized 0-1
    
    // Complexity score: entropy of content
    const entropy = this.calculateEntropy(content);
    const complexityScore = entropy / 8; // Normalized 0-1
    
    // Propagation score
    const propagationScore = Math.min(propagationHistory.length / 10, 1);
    
    // Combined depth (0-10 scale)
    const depth = (temporalScore * 0.4 + complexityScore * 0.4 + propagationScore * 0.2) * 10;
    
    return Math.round(depth * 100) / 100;
  }

  private calculateEntropy(str: string): number {
    const freq: Record<string, number> = {};
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    let entropy = 0;
    const len = str.length;
    for (const char in freq) {
      const p = freq[char] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  calculateContaminationScore(
    content: string,
    parentContent?: string
  ): number {
    if (!parentContent) return 0;
    
    // Simple semantic similarity using cosine distance between embeddings
    const embedding1 = FossilizationService.generateEmbedding(content);
    const embedding2 = FossilizationService.generateEmbedding(parentContent);
    
    const cosineSimilarity = this.cosineSimilarity(embedding1, embedding2);
    const contaminationScore = 1 - cosineSimilarity;
    
    return Math.round(contaminationScore * 1000) / 1000;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async fossilize(
    organizationId: string,
    content: string,
    options: FossilizationOptions
  ): Promise<FossilizationResult> {
    const db = getDb();
    const hash = FossilizationService.calculateHash(content);
    const timestamp = new Date();
    
    // Create Merkle proof
    const { proof, root, tree } = createFossilProof(content);
    
    // Calculate stratigraphic depth
    const stratigraphicDepth = options.calculateDepth !== false
      ? this.calculateStratigraphicDepth(content, timestamp)
      : 0;
    
    // Calculate contamination score (if parent provided)
    const contaminationScore = 0; // Would compare with parent fossil
    
    // Generate embedding
    const embedding = FossilizationService.generateEmbedding(content);
    
    // Content preview (first 500 chars)
    const contentPreview = content.substring(0, 500) + (content.length > 500 ? '...' : '');
    
    // Insert into database
    const [fossil] = await db
      .insertInto('knowledge_fossils')
      .values({
        id: uuidv4(),
        organization_id: organizationId,
        hash,
        content,
        content_preview: contentPreview,
        embedding: JSON.stringify(embedding),
        source_type: options.sourceType,
        source_id: options.sourceId,
        source_metadata: options.sourceMetadata ? JSON.stringify(options.sourceMetadata) : null,
        merkle_root: root,
        merkle_proof: JSON.stringify(proof),
        timestamp,
        stratigraphic_depth: stratigraphicDepth,
        contamination_score: contaminationScore,
      })
      .returning(['id'])
      .execute();

    // Store in ChromaDB for semantic search
    try {
      await this.initCollection();
      if (this.collection) {
        await this.collection.add({
          ids: [fossil.id],
          embeddings: [embedding],
          metadatas: [{
            organization_id: organizationId,
            hash,
            timestamp: timestamp.toISOString(),
            source_type: options.sourceType,
          }],
          documents: [content],
        });
      }
    } catch (error) {
      logger.warn('Failed to store in ChromaDB', error);
    }

    logger.info(`Knowledge fossilized: ${fossil.id} (depth: ${stratigraphicDepth})`);

    return {
      id: fossil.id,
      hash,
      merkleRoot: root,
      merkleProof: proof,
      timestamp,
      stratigraphicDepth,
      contaminationScore,
    };
  }

  async verifyFossil(fossilId: string): Promise<{ valid: boolean; verifiedAt: Date }> {
    const db = getDb();
    
    const fossil = await db
      .selectFrom('knowledge_fossils')
      .select(['content', 'merkle_root', 'merkle_proof'])
      .where('id', '=', fossilId)
      .executeTakeFirst();

    if (!fossil) {
      throw new Error('Fossil not found');
    }

    const proof = JSON.parse(fossil.merkle_proof as string) as MerkleProof;
    const contentHash = FossilizationService.calculateHash(fossil.content);
    
    // Verify leaf hash matches content
    if (proof.leaf !== contentHash) {
      return { valid: false, verifiedAt: new Date() };
    }

    // Verify Merkle proof
    const { MerkleTree } = await import('./merkle-tree.js');
    const valid = MerkleTree.verifyProof(proof);

    return { valid, verifiedAt: new Date() };
  }

  async searchSimilar(
    organizationId: string,
    query: string,
    limit: number = 10
  ): Promise<Array<{ id: string; similarity: number; contentPreview: string }>> {
    await this.initCollection();
    
    if (!this.collection) {
      return [];
    }

    const queryEmbedding = FossilizationService.generateEmbedding(query);
    
    const results = await this.collection.query({
      query_embeddings: [queryEmbedding],
      n_results: limit,
      where: {
        organization_id: organizationId,
      },
    });

    return results.ids[0].map((id: string, index: number) => ({
      id,
      similarity: 1 - (results.distances?.[0]?.[index] || 0),
      contentPreview: results.documents?.[0]?.[index]?.substring(0, 200) || '',
    }));
  }
}
