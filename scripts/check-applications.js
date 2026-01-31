const { Pool } = require('pg');
const pool = new Pool({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'brasil_legalize', 
  password: '1234', 
  port: 5432 
});

async function main() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'applications' 
      ORDER BY ordinal_position
    `);
    console.log('Applications table columns:');
    result.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}

main();
