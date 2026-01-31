const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function checkTables() {
  try {
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('Existing tables:', tables.rows.map(r => r.table_name).join(', '));
    
    // Check admin_users structure
    const adminCols = await pool.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'admin_users' ORDER BY ordinal_position
    `);
    console.log('\nadmin_users columns:');
    adminCols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
    
    // Check if there's data
    const adminData = await pool.query('SELECT * FROM admin_users LIMIT 1');
    console.log('\nadmin_users data:', adminData.rows);
    
    // Check clients structure
    const clientCols = await pool.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'clients' ORDER BY ordinal_position
    `);
    console.log('\nclients columns:');
    clientCols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
    
    // Check applications
    const appCols = await pool.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'applications' ORDER BY ordinal_position
    `);
    console.log('\napplications columns:');
    appCols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkTables();
