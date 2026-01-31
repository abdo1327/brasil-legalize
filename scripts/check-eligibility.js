const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'brasil_legalize',
  user: 'postgres',
  password: '1234'
});

async function checkTables() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'eligibility%'
    `);
    console.log('Eligibility tables:', result.rows);
    
    // Check leads table
    const leadsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads'
    `);
    console.log('\nLeads table columns:', leadsResult.rows);
    
  } finally {
    client.release();
    pool.end();
  }
}

checkTables();
