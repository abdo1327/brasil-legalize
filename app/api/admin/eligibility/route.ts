import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Fetch eligibility data (questions, rules, results, leads)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const locale = searchParams.get('locale') || 'en';

    let data;

    switch (type) {
      case 'questions':
        data = await getQuestions(locale);
        break;
      case 'rules':
        data = await getRules();
        break;
      case 'results':
        data = await getResults(locale);
        break;
      case 'leads':
        data = await getLeads();
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching eligibility data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update eligibility data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    let result;

    switch (type) {
      case 'question':
        result = await updateQuestion(id, data);
        break;
      case 'rule':
        result = await updateRule(id, data);
        break;
      case 'result':
        result = await updateResult(id, data);
        break;
      case 'lead':
        result = await updateLead(id, data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating eligibility data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// POST - Create new eligibility data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'rule':
        result = await createRule(data);
        break;
      case 'result':
        result = await createResult(data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating eligibility data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete eligibility data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'rule':
        result = await deleteRule(parseInt(id));
        break;
      case 'result':
        result = await deleteResult(parseInt(id));
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting eligibility data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

// Helper functions

async function getQuestions(locale: string) {
  const client = await pool.connect();
  try {
    // Get questions
    const questionsResult = await client.query(`
      SELECT 
        eq.id,
        eq.step_number,
        eq.question_key,
        eq.question_${locale} as question_en,
        eq.question_type,
        eq.is_required,
        eq.is_conditional,
        eq.parent_question_key,
        eq.parent_answer_value,
        eq.is_active,
        eq.display_order
      FROM eligibility_questions eq
      ORDER BY eq.step_number, eq.display_order
    `);

    // Get options for each question
    const optionsResult = await client.query(`
      SELECT 
        eo.question_id,
        eo.option_key as value,
        eo.label_${locale} as label,
        eo.icon
      FROM eligibility_options eo
      WHERE eo.is_active = true
      ORDER BY eo.display_order
    `);

    // Group options by question
    const optionsByQuestion: Record<number, Array<{ value: string; label: string; icon?: string }>> = {};
    for (const opt of optionsResult.rows) {
      if (!optionsByQuestion[opt.question_id]) {
        optionsByQuestion[opt.question_id] = [];
      }
      optionsByQuestion[opt.question_id].push({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
      });
    }

    // Combine questions with their options
    return questionsResult.rows.map((q: any) => ({
      ...q,
      options: optionsByQuestion[q.id] || [],
    }));
  } finally {
    client.release();
  }
}

async function getRules() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        id,
        rule_name,
        result_type,
        conditions,
        priority,
        is_active
      FROM eligibility_rules
      ORDER BY priority DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

async function getResults(locale: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        id,
        result_type,
        icon,
        icon_color as "iconColor",
        bg_color as "bgColor",
        heading_${locale} as heading,
        description_${locale} as description,
        primary_cta_text_${locale} as "primaryCtaText",
        primary_cta_link as "primaryCtaLink",
        secondary_cta_text_${locale} as "secondaryCtaText",
        secondary_cta_link as "secondaryCtaLink",
        is_active
      FROM eligibility_results
      ORDER BY id
    `);
    
    return result.rows.map((r: any) => ({
      ...r,
      primaryCTA: r.primaryCtaText ? { text: r.primaryCtaText, action: r.primaryCtaLink } : null,
      secondaryCTA: r.secondaryCtaText ? { text: r.secondaryCtaText, action: r.secondaryCtaLink } : null,
    }));
  } finally {
    client.release();
  }
}

async function getLeads() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        service_type,
        eligibility_result,
        status,
        created_at
      FROM leads
      WHERE source = 'eligibility' OR eligibility_result IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 100
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

async function updateQuestion(id: number, data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE eligibility_questions SET
        question_en = $1,
        is_required = $2,
        is_active = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [data.question_en, data.is_required, data.is_active, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateRule(id: number, data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE eligibility_rules SET
        rule_name = $1,
        result_type = $2,
        conditions = $3,
        priority = $4,
        is_active = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        data.rule_name || `Rule ${id}`,
        data.result_type,
        JSON.stringify(data.conditions),
        data.priority,
        data.is_active !== false,
        id,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateResult(id: number, data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE eligibility_results SET
        icon = $1,
        icon_color = $2,
        bg_color = $3,
        heading_en = $4,
        description_en = $5,
        primary_cta_text_en = $6,
        primary_cta_link = $7,
        secondary_cta_text_en = $8,
        secondary_cta_link = $9,
        is_active = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *`,
      [
        data.icon,
        data.iconColor,
        data.bgColor,
        data.heading,
        data.description,
        data.primaryCTA?.text,
        data.primaryCTA?.action,
        data.secondaryCTA?.text,
        data.secondaryCTA?.action,
        data.is_active,
        id,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateLead(id: number, data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE leads SET
        status = $1,
        notes = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
      [data.status, data.notes, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function createRule(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO eligibility_rules (rule_name, result_type, conditions, priority, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        data.rule_name || 'New Rule',
        data.result_type,
        JSON.stringify(data.conditions),
        data.priority || 50,
        data.is_active !== false,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function createResult(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO eligibility_results (
        result_type, icon, icon_color, bg_color,
        heading_en, description_en,
        primary_cta_text_en, primary_cta_link,
        secondary_cta_text_en, secondary_cta_link,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.result_type,
        data.icon,
        data.iconColor,
        data.bgColor,
        data.heading,
        data.description,
        data.primaryCTA?.text,
        data.primaryCTA?.action,
        data.secondaryCTA?.text,
        data.secondaryCTA?.action,
        data.is_active !== false,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteRule(id: number) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM eligibility_rules WHERE id = $1', [id]);
    return { deleted: true };
  } finally {
    client.release();
  }
}

async function deleteResult(id: number) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM eligibility_results WHERE id = $1', [id]);
    return { deleted: true };
  } finally {
    client.release();
  }
}
