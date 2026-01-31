import { Pool } from 'pg';

// PostgreSQL connection pool
// Supports DATABASE_URL (Railway/Neon) or individual env vars (local dev)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('railway')
          ? { rejectUnauthorized: false }
          : undefined,
      }
    : {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'brasil_legalize',
        password: process.env.PGPASSWORD || '1234',
        port: parseInt(process.env.PGPORT || '5432'),
      }
);

export default pool;

// Helper function to run queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
