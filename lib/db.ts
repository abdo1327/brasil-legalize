import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

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
