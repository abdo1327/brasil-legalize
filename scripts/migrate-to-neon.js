const { Pool } = require('pg');

// Local database
const localPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

// Neon database
const neonPool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_XdQ1ksacEnN0@ep-cool-moon-ahkp7lkk-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Starting migration to Neon...\n');

  try {
    // Test Neon connection
    console.log('Testing Neon connection...');
    await neonPool.query('SELECT NOW()');
    console.log('✓ Connected to Neon\n');

    // Get all tables from local
    const tablesResult = await localPool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log('Local tables:', tables.join(', '), '\n');

    // Create schema on Neon
    console.log('Creating schema on Neon...');
    
    // Drop existing tables in reverse order (to handle foreign keys)
    for (const table of tables.reverse()) {
      try {
        await neonPool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      } catch (e) {
        // Ignore errors
      }
    }
    tables.reverse(); // Restore original order

    // Get and execute CREATE TABLE statements
    for (const table of tables) {
      // Get column definitions
      const colsResult = await localPool.query(`
        SELECT column_name, data_type, character_maximum_length, 
               is_nullable, column_default, udt_name
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [table]);

      // Get primary key
      const pkResult = await localPool.query(`
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `, [table]);
      const pkColumns = pkResult.rows.map(r => r.attname);

      // Build CREATE TABLE
      const columns = colsResult.rows.map(col => {
        let type = col.data_type;
        if (type === 'character varying') {
          type = col.character_maximum_length ? `VARCHAR(${col.character_maximum_length})` : 'VARCHAR';
        } else if (type === 'ARRAY') {
          type = col.udt_name.replace('_', '') + '[]';
        } else if (type === 'timestamp without time zone') {
          type = 'TIMESTAMP';
        } else if (type === 'timestamp with time zone') {
          type = 'TIMESTAMPTZ';
        }
        
        let def = `"${col.column_name}" ${type}`;
        if (col.column_default && col.column_default.includes('nextval')) {
          def = `"${col.column_name}" SERIAL`;
        } else if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }
        if (col.is_nullable === 'NO' && !col.column_default?.includes('nextval')) {
          def += ' NOT NULL';
        }
        return def;
      });

      if (pkColumns.length > 0) {
        columns.push(`PRIMARY KEY (${pkColumns.map(c => `"${c}"`).join(', ')})`);
      }

      const createSQL = `CREATE TABLE IF NOT EXISTS "${table}" (\n  ${columns.join(',\n  ')}\n)`;
      
      try {
        await neonPool.query(createSQL);
        console.log(`✓ Created table: ${table}`);
      } catch (e) {
        console.error(`✗ Failed to create ${table}:`, e.message);
        console.log('SQL:', createSQL);
      }
    }

    console.log('\nMigrating data...');

    // Copy data for each table
    for (const table of tables) {
      try {
        const data = await localPool.query(`SELECT * FROM "${table}"`);
        if (data.rows.length === 0) {
          console.log(`  ${table}: 0 rows (empty)`);
          continue;
        }

        const columns = Object.keys(data.rows[0]);
        
        // Clear existing data
        await neonPool.query(`DELETE FROM "${table}"`);
        
        // Insert in batches
        let inserted = 0;
        for (const row of data.rows) {
          const values = columns.map((_, i) => `$${i + 1}`);
          const rowValues = columns.map(c => {
            const val = row[c];
            if (Array.isArray(val)) {
              return val;
            }
            return val;
          });
          
          try {
            await neonPool.query(
              `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')})`,
              rowValues
            );
            inserted++;
          } catch (e) {
            if (!e.message.includes('duplicate key')) {
              console.error(`    Error inserting into ${table}:`, e.message);
            }
          }
        }
        console.log(`  ${table}: ${inserted} rows`);

        // Reset sequence if table has serial column
        try {
          const seqResult = await localPool.query(`
            SELECT pg_get_serial_sequence($1, column_name) as seq, column_name
            FROM information_schema.columns 
            WHERE table_name = $1 AND column_default LIKE 'nextval%'
          `, [table]);
          
          for (const seq of seqResult.rows) {
            if (seq.seq) {
              const maxResult = await neonPool.query(`SELECT COALESCE(MAX("${seq.column_name}"), 0) + 1 as next FROM "${table}"`);
              const seqName = seq.seq.split('.').pop().replace(/'/g, '');
              await neonPool.query(`SELECT setval('${seqName}', $1, false)`, [maxResult.rows[0].next]);
            }
          }
        } catch (e) {
          // Ignore sequence errors
        }
      } catch (e) {
        console.error(`  ${table}: Error - ${e.message}`);
      }
    }

    console.log('\n✓ Migration complete!');
    
    // Verify
    console.log('\nVerifying Neon data:');
    for (const table of tables) {
      const count = await neonPool.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`  ${table}: ${count.rows[0].count} rows`);
    }

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await localPool.end();
    await neonPool.end();
  }
}

migrate();
