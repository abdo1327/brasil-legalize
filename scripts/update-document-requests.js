const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function updateTable() {
  try {
    console.log('Adding missing columns to document_requests...');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS request_id VARCHAR(50)`);
    console.log('  - request_id added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS requested_documents JSONB DEFAULT '[]'::jsonb`);
    console.log('  - requested_documents added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS message TEXT`);
    console.log('  - message added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS upload_link VARCHAR(255)`);
    console.log('  - upload_link added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS due_date TIMESTAMP`);
    console.log('  - due_date added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP`);
    console.log('  - completed_at added');
    
    await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS notes TEXT`);
    console.log('  - notes added');

    // Create index on upload_token
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_token ON document_requests(upload_token)`);
    console.log('  - index on upload_token created');

    // Create unique constraint on request_id
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_doc_requests_request_id ON document_requests(request_id) WHERE request_id IS NOT NULL`);
    console.log('  - unique index on request_id created');

    console.log('\nAll columns added successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
}

updateTable();
