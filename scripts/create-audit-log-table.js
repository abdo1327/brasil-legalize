const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function createAuditLogTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_audit_log (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id VARCHAR(100),
        ip_address VARCHAR(50),
        user_agent TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('admin_audit_log table created successfully');
    
    const result = await pool.query('SELECT COUNT(*) FROM admin_audit_log');
    console.log('Audit log count:', result.rows[0].count);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
}

createAuditLogTable();
