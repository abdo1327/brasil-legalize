// Run this script with: node scripts/create-clients-table.js

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function createClientsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating clients table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(50) UNIQUE NOT NULL,
        lead_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        whatsapp VARCHAR(50),
        city VARCHAR(100),
        country VARCHAR(100),
        locale VARCHAR(10) DEFAULT 'en',
        avatar_url VARCHAR(512),
        service_type VARCHAR(50),
        package VARCHAR(50),
        family_adults INT DEFAULT 2,
        family_children INT DEFAULT 0,
        expected_travel_date DATE,
        expected_due_date DATE,
        source VARCHAR(50) DEFAULT 'eligibility',
        referral_source VARCHAR(255),
        is_historical BOOLEAN DEFAULT FALSE,
        tags JSONB DEFAULT '[]'::jsonb,
        total_paid DECIMAL(10,2) DEFAULT 0,
        total_due DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        payments JSONB DEFAULT '[]'::jsonb,
        documents JSONB DEFAULT '[]'::jsonb,
        notes JSONB DEFAULT '[]'::jsonb,
        communications JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(20) DEFAULT 'active',
        archived BOOLEAN DEFAULT FALSE,
        archived_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ clients table created');

    // Create indexes
    console.log('Creating indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON clients(lead_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_source ON clients(source);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_time ON clients(created_at);`);
    console.log('✓ indexes created');

    // Add client_id to applications table if not exists
    console.log('Adding client_id column to applications table...');
    try {
      await client.query(`ALTER TABLE applications ADD COLUMN IF NOT EXISTS client_id INT;`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_applications_client ON applications(client_id);`);
      console.log('✓ client_id column added to applications');
    } catch (e) {
      console.log('Note: client_id column may already exist or applications table not found');
    }

    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createClientsTable();
