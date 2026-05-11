import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import type { DB } from './types.js';

let db: Kysely<DB>;
let pool: Pool;

export async function initDatabase() {
  pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
  });

  const dialect = new PostgresDialect({ pool });

  db = new Kysely<DB>({
    dialect,
  });

  // Test connection
  try {
    await db.selectFrom('pg_class').select('oid').limit(1).execute();
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }

  return db;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
}

export function getDb(): Kysely<DB> {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
}
