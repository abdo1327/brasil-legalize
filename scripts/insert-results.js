const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'brasil_legalize',
  user: 'postgres',
  password: '1234'
});

async function insertResults() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO eligibility_results (result_type, icon, icon_color, bg_color, heading_en, description_en, primary_cta_text_en, primary_cta_link, secondary_cta_text_en, secondary_cta_link, is_active)
      VALUES 
        ('likely_eligible', 'checkbox-circle', 'text-green-500', 'bg-green-100', 'You Are Likely Eligible!', 'Based on your answers, you appear to meet the basic requirements for Brazilian citizenship.', 'Book a Consultation', '/book', 'Learn More', '/services', true),
        ('may_need_review', 'alert-circle', 'text-yellow-500', 'bg-yellow-100', 'Further Review Needed', 'Your situation requires a detailed assessment.', 'Schedule Assessment', '/book', 'Contact Us', '/contact', true),
        ('contact_for_assessment', 'info-circle', 'text-blue-500', 'bg-blue-100', 'Lets Discuss Your Options', 'Every case is unique. Contact our team.', 'Contact Us', '/contact', 'View Services', '/services', true)
      ON CONFLICT (result_type) DO NOTHING
    `);
    console.log('Results inserted:', result.rowCount);
  } finally {
    client.release();
    pool.end();
  }
}

insertResults();
