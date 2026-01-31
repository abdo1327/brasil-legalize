/**
 * Migration: Add completed_at and archive_after columns to applications table
 * 
 * Run with: node scripts/add-archive-columns.js
 */

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration: Adding archive columns to applications...');
    
    // Add completed_at column
    await client.query(`
      ALTER TABLE applications
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NULL
    `);
    console.log('✓ Added completed_at column');
    
    // Add archive_after column
    await client.query(`
      ALTER TABLE applications
      ADD COLUMN IF NOT EXISTS archive_after TIMESTAMPTZ DEFAULT NULL
    `);
    console.log('✓ Added archive_after column');
    
    // Add archived column (boolean for manual archive)
    await client.query(`
      ALTER TABLE applications
      ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE
    `);
    console.log('✓ Added archived column');
    
    // Create index for efficient filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_archive
      ON applications (archive_after, archived)
      WHERE archive_after IS NOT NULL OR archived = TRUE
    `);
    console.log('✓ Created archive index');
    
    // Update existing completed applications to have archive dates
    const result = await client.query(`
      UPDATE applications
      SET 
        completed_at = COALESCE(completed_at, updated_at, created_at),
        archive_after = COALESCE(archive_after, (COALESCE(updated_at, created_at) + INTERVAL '7 days'))
      WHERE status = 'completed' AND archive_after IS NULL
      RETURNING application_id
    `);
    console.log(`✓ Updated ${result.rowCount} existing completed applications`);
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
