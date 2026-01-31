// Script to add documents table to the database
// Run this script with: node scripts/add-documents-table.js

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting documents table migration...');

    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES clients(id) ON DELETE CASCADE,
        case_id INT,
        request_id INT,
        
        -- File info
        original_name VARCHAR(255) NOT NULL,
        stored_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        
        -- Document metadata
        document_type VARCHAR(100) DEFAULT 'general',
        label VARCHAR(255),
        description TEXT,
        
        -- Status
        status VARCHAR(50) DEFAULT 'pending',
        rejection_reason TEXT,
        reviewed_by VARCHAR(255),
        reviewed_at TIMESTAMP,
        
        -- Upload info
        uploaded_by_type VARCHAR(20) DEFAULT 'client',
        uploaded_by VARCHAR(255),
        
        -- For replacement documents
        replaced_by INT,
        replaced_at TIMESTAMP,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Documents table created');

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(uploaded_by_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_documents_time ON documents(created_at DESC)`);
    console.log('✓ Documents indexes created');

    // Create document_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_requests (
        id SERIAL PRIMARY KEY,
        client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        case_id INT,
        
        document_type VARCHAR(100) NOT NULL,
        label VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        
        is_required BOOLEAN DEFAULT TRUE,
        deadline DATE,
        
        -- Status
        status VARCHAR(50) DEFAULT 'pending',
        
        -- Fulfillment
        fulfilled_by INT,
        fulfilled_at TIMESTAMP,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Document requests table created');

    // Create indexes for document_requests
    await client.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_client ON document_requests(client_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_case ON document_requests(case_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_status ON document_requests(status)`);
    console.log('✓ Document requests indexes created');

    // Create admin_settings table (optional - may fail if admins table doesn't exist)
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id SERIAL PRIMARY KEY,
          admin_id INT,
          setting_key VARCHAR(100) NOT NULL,
          setting_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(admin_id, setting_key)
        )
      `);
      console.log('✓ Admin settings table created');

      // Create indexes for admin_settings
      await client.query(`CREATE INDEX IF NOT EXISTS idx_admin_settings_admin ON admin_settings(admin_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key)`);
      console.log('✓ Admin settings indexes created');
    } catch (settingsError) {
      console.log('⚠ Admin settings table skipped (admins table may not exist)');
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
