// Database Migration Script
// Run: npx ts-node scripts/migrate.ts

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'brasil_legalize',
  password: process.env.PGPASSWORD || '1234',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split into statements (simple split on semicolons followed by newline)
    const statements = schema
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      
      try {
        await client.query(stmt);
        console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
      } catch (err: any) {
        // Ignore "already exists" errors
        if (err.code === '42P07' || err.code === '42710' || err.message.includes('already exists')) {
          console.log(`⏭️  [${i + 1}/${statements.length}] Skipped (already exists): ${preview}...`);
        } else {
          console.error(`❌ [${i + 1}/${statements.length}] Error: ${err.message}`);
          console.error(`   Statement: ${preview}...`);
        }
      }
    }

    console.log('\n✨ Migration completed successfully!');
    
    // Show table counts
    const tables = ['admins', 'leads', 'applications', 'notifications', 'pricing', 'service_pricing'];
    console.log('\n📊 Table Status:');
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${result.rows[0].count} rows`);
      } catch {
        console.log(`   ${table}: table not found`);
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
