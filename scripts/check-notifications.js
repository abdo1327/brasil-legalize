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
    // Check notifications count
    const countResult = await pool.query('SELECT COUNT(*) FROM notifications');
    console.log('Notifications count:', countResult.rows[0].count);

    // Check columns
    const colsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      ORDER BY ordinal_position
    `);
    console.log('\nNotifications columns:');
    colsResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));

    // Add a test notification if none exist
    if (parseInt(countResult.rows[0].count) === 0) {
      console.log('\nAdding test notification...');
      await pool.query(`
        INSERT INTO notifications (title, message, type, read, created_at)
        VALUES ('Welcome!', 'Welcome to the Brasil Legalize admin panel', 'system', false, NOW())
      `);
      console.log('Test notification added!');
    }

    // Check case counts
    const caseResult = await pool.query(`
      SELECT c.client_id, c.email, 
        (SELECT COUNT(*) FROM applications a WHERE a.client_id = c.id OR a.email = c.email) as case_count
      FROM clients c
    `);
    console.log('\nClient case counts:');
    caseResult.rows.forEach(row => console.log(`  ${row.client_id}: ${row.email} -> ${row.case_count} cases`));

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    pool.end();
  }
}

main();
