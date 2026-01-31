const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function runSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database...');
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute...`);
    
    let executed = 0;
    let errors = 0;
    
    for (const statement of statements) {
      try {
        await client.query(statement);
        executed++;
      } catch (err) {
        // Ignore "already exists" errors
        if (err.code === '42P07' || err.code === '42710' || err.message.includes('already exists')) {
          console.log(`  Skipped (already exists): ${statement.substring(0, 50)}...`);
        } else if (err.code === '23505') {
          console.log(`  Skipped (duplicate): ${statement.substring(0, 50)}...`);
        } else {
          console.error(`  Error: ${err.message}`);
          console.error(`  Statement: ${statement.substring(0, 100)}...`);
          errors++;
        }
      }
    }
    
    console.log(`\nExecuted ${executed} statements with ${errors} errors`);
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\nCreated tables:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Check for admin user
    const adminCheck = await client.query('SELECT email, name, role FROM admins LIMIT 1');
    if (adminCheck.rows.length > 0) {
      console.log('\nAdmin user exists:', adminCheck.rows[0]);
    } else {
      console.log('\nNo admin user found - you may need to create one');
    }
    
  } catch (err) {
    console.error('Schema execution failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSchema();
