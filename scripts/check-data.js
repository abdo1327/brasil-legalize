const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'brasil_legalize',
  user: 'postgres',
  password: '1234'
});

async function checkData() {
  const client = await pool.connect();
  try {
    const questions = await client.query('SELECT COUNT(*) FROM eligibility_questions');
    console.log('Questions count:', questions.rows[0].count);
    
    const options = await client.query('SELECT COUNT(*) FROM eligibility_options');
    console.log('Options count:', options.rows[0].count);
    
    const rules = await client.query('SELECT COUNT(*) FROM eligibility_rules');
    console.log('Rules count:', rules.rows[0].count);
    
    const results = await client.query('SELECT COUNT(*) FROM eligibility_results');
    console.log('Results count:', results.rows[0].count);
    
    // Show results data
    const resultsData = await client.query('SELECT result_type, heading_en FROM eligibility_results');
    console.log('\nResults:', resultsData.rows);
    
  } finally {
    client.release();
    pool.end();
  }
}

checkData();
