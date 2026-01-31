// Database Setup Script
// Run: node scripts/setup-db.js

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

async function setup() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up CRM database tables...\n');

    // Read setup SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'setup-crm.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Execute the SQL
    await client.query(sql);
    console.log('✅ CRM tables created successfully!\n');
    
    // Show table status
    const tables = ['leads', 'applications', 'notifications'];
    console.log('📊 Table Status:');
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ✅ ${table}: ${result.rows[0].count} rows`);
      } catch (err) {
        console.log(`   ❌ ${table}: ${err.message}`);
      }
    }

    console.log('\n✨ Database setup complete!');
    console.log('\nYou can now run: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure PostgreSQL is running on localhost:5432');
      console.log('   Or set these environment variables:');
      console.log('   - PGHOST');
      console.log('   - PGPORT');
      console.log('   - PGUSER');
      console.log('   - PGPASSWORD');
      console.log('   - PGDATABASE');
    }
    
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
