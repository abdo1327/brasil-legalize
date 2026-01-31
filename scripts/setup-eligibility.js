const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'brasil_legalize',
  user: 'postgres',
  password: '1234'
});

async function createEligibilityTables() {
  const client = await pool.connect();
  try {
    console.log('Creating eligibility tables...');

    // Create eligibility_questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eligibility_questions (
        id SERIAL PRIMARY KEY,
        step_number INT NOT NULL,
        question_key VARCHAR(50) UNIQUE NOT NULL,
        question_en TEXT NOT NULL,
        question_ar TEXT,
        question_es TEXT,
        question_pt TEXT,
        question_type VARCHAR(20) NOT NULL DEFAULT 'single_select',
        is_required BOOLEAN DEFAULT TRUE,
        is_conditional BOOLEAN DEFAULT FALSE,
        parent_question_key VARCHAR(50),
        parent_answer_value VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ eligibility_questions table created');

    // Create eligibility_options table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eligibility_options (
        id SERIAL PRIMARY KEY,
        question_id INT NOT NULL REFERENCES eligibility_questions(id) ON DELETE CASCADE,
        option_key VARCHAR(50) NOT NULL,
        label_en VARCHAR(255) NOT NULL,
        label_ar VARCHAR(255),
        label_es VARCHAR(255),
        label_pt VARCHAR(255),
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(question_id, option_key)
      );
    `);
    console.log('✓ eligibility_options table created');

    // Create eligibility_rules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eligibility_rules (
        id SERIAL PRIMARY KEY,
        rule_name VARCHAR(100) NOT NULL,
        result_type VARCHAR(30) NOT NULL,
        conditions JSONB NOT NULL,
        priority INT DEFAULT 50,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ eligibility_rules table created');

    // Create eligibility_results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS eligibility_results (
        id SERIAL PRIMARY KEY,
        result_type VARCHAR(30) UNIQUE NOT NULL,
        icon VARCHAR(50),
        icon_color VARCHAR(50),
        bg_color VARCHAR(50),
        heading_en VARCHAR(255) NOT NULL,
        heading_ar VARCHAR(255),
        heading_es VARCHAR(255),
        heading_pt VARCHAR(255),
        description_en TEXT NOT NULL,
        description_ar TEXT,
        description_es TEXT,
        description_pt TEXT,
        primary_cta_text_en VARCHAR(100),
        primary_cta_text_ar VARCHAR(100),
        primary_cta_text_es VARCHAR(100),
        primary_cta_text_pt VARCHAR(100),
        primary_cta_link VARCHAR(255),
        secondary_cta_text_en VARCHAR(100),
        secondary_cta_text_ar VARCHAR(100),
        secondary_cta_text_es VARCHAR(100),
        secondary_cta_text_pt VARCHAR(100),
        secondary_cta_link VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ eligibility_results table created');

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_eq_step ON eligibility_questions(step_number);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_eq_key ON eligibility_questions(question_key);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_eq_active ON eligibility_questions(is_active);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_eo_question ON eligibility_options(question_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_er_result ON eligibility_rules(result_type);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_er_priority ON eligibility_rules(priority DESC);`);
    console.log('✓ Indexes created');

    // Insert default data
    console.log('\nInserting default eligibility data...');

    // Insert default questions
    await client.query(`
      INSERT INTO eligibility_questions (step_number, question_key, question_en, question_type, is_required, is_conditional, display_order)
      VALUES 
        (1, 'service_interest', 'What service are you interested in?', 'single_select', true, false, 1),
        (2, 'current_status', 'What is your current status?', 'single_select', true, false, 1),
        (3, 'timeline', 'What is your timeline?', 'single_select', true, false, 1),
        (4, 'contact_info', 'Please provide your contact information', 'contact', true, false, 1)
      ON CONFLICT (question_key) DO NOTHING;
    `);
    console.log('✓ Default questions inserted');

    // Get question IDs
    const qResult = await client.query(`SELECT id, question_key FROM eligibility_questions`);
    const questions = {};
    qResult.rows.forEach(q => { questions[q.question_key] = q.id; });

    // Insert options for service_interest
    if (questions['service_interest']) {
      await client.query(`
        INSERT INTO eligibility_options (question_id, option_key, label_en, icon, display_order)
        VALUES 
          ($1, 'citizenship', 'Brazilian Citizenship', 'passport', 1),
          ($1, 'residency', 'Permanent Residency', 'home', 2),
          ($1, 'visa', 'Visa Services', 'file-text', 3),
          ($1, 'other', 'Other Services', 'more-horizontal', 4)
        ON CONFLICT (question_id, option_key) DO NOTHING;
      `, [questions['service_interest']]);
    }

    // Insert options for current_status
    if (questions['current_status']) {
      await client.query(`
        INSERT INTO eligibility_options (question_id, option_key, label_en, icon, display_order)
        VALUES 
          ($1, 'married_to_brazilian', 'Married to a Brazilian citizen', 'heart', 1),
          ($1, 'brazilian_descent', 'Have Brazilian ancestry', 'users', 2),
          ($1, 'living_in_brazil', 'Currently living in Brazil', 'map-pin', 3),
          ($1, 'none', 'None of the above', 'x-circle', 4)
        ON CONFLICT (question_id, option_key) DO NOTHING;
      `, [questions['current_status']]);
    }

    // Insert options for timeline
    if (questions['timeline']) {
      await client.query(`
        INSERT INTO eligibility_options (question_id, option_key, label_en, icon, display_order)
        VALUES 
          ($1, 'urgent', 'As soon as possible', 'zap', 1),
          ($1, '3_months', 'Within 3 months', 'calendar', 2),
          ($1, '6_months', 'Within 6 months', 'clock', 3),
          ($1, 'exploring', 'Just exploring options', 'search', 4)
        ON CONFLICT (question_id, option_key) DO NOTHING;
      `, [questions['timeline']]);
    }
    console.log('✓ Default options inserted');

    // Insert default rules
    await client.query(`
      INSERT INTO eligibility_rules (rule_name, result_type, conditions, priority, is_active)
      VALUES 
        ('Married to Brazilian', 'likely_eligible', '{"current_status": "married_to_brazilian"}', 100, true),
        ('Brazilian Descent', 'likely_eligible', '{"current_status": "brazilian_descent"}', 90, true),
        ('Living in Brazil', 'may_need_review', '{"current_status": "living_in_brazil"}', 80, true),
        ('Default', 'contact_for_assessment', '{}', 1, true)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Default rules inserted');

    // Insert default results
    await client.query(`
      INSERT INTO eligibility_results (result_type, icon, icon_color, bg_color, heading_en, description_en, primary_cta_text_en, primary_cta_link, secondary_cta_text_en, secondary_cta_link, is_active)
      VALUES 
        ('likely_eligible', 'checkbox-circle', 'text-green-500', 'bg-green-100', 'You Are Likely Eligible!', 'Based on your answers, you appear to meet the basic requirements for Brazilian citizenship. Our team can help you through the process.', 'Book a Consultation', '/book', 'Learn More', '/services'),
        ('may_need_review', 'alert-circle', 'text-yellow-500', 'bg-yellow-100', 'Further Review Needed', 'Your situation requires a detailed assessment. Our experts can evaluate your specific case and advise on the best path forward.', 'Schedule Assessment', '/book', 'Contact Us', '/contact'),
        ('contact_for_assessment', 'info-circle', 'text-blue-500', 'bg-blue-100', 'Let''s Discuss Your Options', 'Every case is unique. Contact our team to discuss your specific situation and explore available options.', 'Contact Us', '/contact', 'View Services', '/services')
      ON CONFLICT (result_type) DO NOTHING;
    `);
    console.log('✓ Default results inserted');

    console.log('\n✅ All eligibility tables and default data created successfully!');

  } catch (error) {
    console.error('Error creating eligibility tables:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
}

createEligibilityTables();
