const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

async function check() {
  const pkgCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'packages' ORDER BY ordinal_position`);
  console.log('packages:', pkgCols.rows.map(c => c.column_name).join(', '));
  
  const svcCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'services' ORDER BY ordinal_position`);
  console.log('services:', svcCols.rows.map(c => c.column_name).join(', '));
  
  const pkgData = await pool.query('SELECT * FROM packages LIMIT 2');
  console.log('packages data:', pkgData.rows);
  
  const svcData = await pool.query('SELECT * FROM services LIMIT 2');
  console.log('services data:', svcData.rows);
  
  await pool.end();
}

check().catch(console.error);
