const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function checkAndCreateTable() {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'document_requests'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('Table document_requests does not exist. Creating...');
      
      // Create the document_requests table
      await pool.query(`
        CREATE TABLE document_requests (
          id SERIAL PRIMARY KEY,
          request_id VARCHAR(50) UNIQUE NOT NULL,
          client_id INT REFERENCES clients(id) ON DELETE CASCADE,
          case_id INT REFERENCES applications(id) ON DELETE SET NULL,
          requested_documents JSONB DEFAULT '[]',
          message TEXT,
          upload_token VARCHAR(64) UNIQUE NOT NULL,
          upload_link VARCHAR(255),
          due_date TIMESTAMP,
          status VARCHAR(50) DEFAULT 'pending',
          uploaded_files JSONB DEFAULT '[]',
          notes TEXT,
          completed_at TIMESTAMP,
          created_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create indexes
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_client ON document_requests(client_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_case ON document_requests(case_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_status ON document_requests(status)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_doc_requests_token ON document_requests(upload_token)`);

      console.log('Table document_requests created successfully!');
    } else {
      console.log('document_requests columns:');
      tableCheck.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));

      // Check if uploaded_files column exists
      const hasUploadedFiles = tableCheck.rows.some(r => r.column_name === 'uploaded_files');
      if (!hasUploadedFiles) {
        console.log('\nAdding uploaded_files column...');
        await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]'`);
        console.log('Column added!');
      }

      // Check if upload_token column exists
      const hasUploadToken = tableCheck.rows.some(r => r.column_name === 'upload_token');
      if (!hasUploadToken) {
        console.log('\nAdding upload_token column...');
        await pool.query(`ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS upload_token VARCHAR(64)`);
        console.log('Column added!');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
}

checkAndCreateTable();
