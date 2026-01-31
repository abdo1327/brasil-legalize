// Track page visits/sessions for analytics
// This script creates a simple page_visits table

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/brasil_legalize'
});

async function createPageVisitsTable() {
  const client = await pool.connect();
  try {
    // Create page_visits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page_path VARCHAR(500) NOT NULL,
        visitor_id VARCHAR(100),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer TEXT,
        country VARCHAR(50),
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
      CREATE INDEX IF NOT EXISTS idx_page_visits_visitor_id ON page_visits(visitor_id);
      CREATE INDEX IF NOT EXISTS idx_page_visits_page_path ON page_visits(page_path);
    `);
    
    console.log('✅ page_visits table created successfully');
    
    // Insert some sample data for testing
    await client.query(`
      INSERT INTO page_visits (page_path, visitor_id, created_at)
      SELECT 
        CASE (random() * 5)::int
          WHEN 0 THEN '/en'
          WHEN 1 THEN '/en/eligibility'
          WHEN 2 THEN '/en/services'
          WHEN 3 THEN '/pt-br'
          ELSE '/en/about'
        END,
        'visitor_' || (random() * 100)::int,
        NOW() - (random() * interval '7 days')
      FROM generate_series(1, 25);
    `);
    
    console.log('✅ Sample page visits added');
    
  } catch (error) {
    console.error('Error creating page_visits table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createPageVisitsTable().catch(console.error);
