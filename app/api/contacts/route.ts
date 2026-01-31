import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

// Ensure contacts table exists
async function ensureContactsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT,
      locale VARCHAR(10) DEFAULT 'en',
      status VARCHAR(50) DEFAULT 'new',
      assigned_to INTEGER REFERENCES admin_users(id),
      notes JSONB DEFAULT '[]'::JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      archived BOOLEAN DEFAULT FALSE
    )
  `);
}

export async function POST(request: NextRequest) {
  try {
    await ensureContactsTable();

    const body = await request.json();
    const { name, email, phone, message, locale = 'en' } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const now = new Date();

    // Insert contact
    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, message, locale, status, created_at, updated_at, archived)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      message.trim(),
      locale,
      'new',
      now,
      now,
      false,
    ]);

    const contactId = result.rows[0].id;

    // Create notification for admin
    await pool.query(`
      INSERT INTO notifications (type, title, message, client_name, read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'new_contact',
      'New Contact Form Submission',
      `${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
      name,
      false,
      now,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      contact_id: contactId,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit contact form' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureContactsTable();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params: (string | boolean)[] = [];
    let paramIndex = 1;

    if (!includeArchived) {
      query += ` AND (archived = false OR archived IS NULL)`;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      contacts: result.rows,
    });
  } catch (error) {
    console.error('GET contacts error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
