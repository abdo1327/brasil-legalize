const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function main() {
  try {
    // Get packages columns
    const packagesRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'packages'
      ORDER BY ordinal_position
    `);
    console.log('Packages columns:');
    packagesRes.rows.forEach(x => console.log('  ' + x.column_name + ': ' + x.data_type));
    
    // Get a sample package
    const samplePkg = await pool.query('SELECT * FROM packages LIMIT 1');
    console.log('\nSample package:', JSON.stringify(samplePkg.rows[0], null, 2));
    
    // Get leads columns
    const leadsRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads'
      ORDER BY ordinal_position
    `);
    console.log('\nLeads columns:');
    leadsRes.rows.forEach(x => console.log('  ' + x.column_name + ': ' + x.data_type));
    
    // Get a sample lead
    const sampleLead = await pool.query('SELECT * FROM leads LIMIT 1');
    console.log('\nSample lead:', JSON.stringify(sampleLead.rows[0], null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

main();
