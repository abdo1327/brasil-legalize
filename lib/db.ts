import { Pool } from 'pg';

// PostgreSQL connection pool
// Supports DATABASE_URL (for Neon/production) or individual env vars (for local dev)

// Production Neon database URL (fallback if env var not available)
const NEON_URL = 'postgresql://neondb_owner:npg_XdQ1ksacEnN0@ep-cool-moon-ahkp7lkk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Get connection string - prioritize env var, fallback to Neon URL in production
const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // In production, use Neon; in dev, use localhost
  if (process.env.NODE_ENV === 'production') {
    return NEON_URL;
  }
  return null;
};

const connectionString = getConnectionString();

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
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
