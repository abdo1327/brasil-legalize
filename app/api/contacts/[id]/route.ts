import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      contact: result.rows[0],
    });
  } catch (error) {
    console.error('GET contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contact' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, assigned_to, notes } = body;

    // Check if contact exists
    const existing = await pool.query('SELECT * FROM contacts WHERE id = $1', [params.id]);
    if (existing.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramIndex}`);
      values.push(assigned_to);
      paramIndex++;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      values.push(JSON.stringify(notes));
      paramIndex++;
    }

    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;

    values.push(params.id);

    const query = `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      contact: result.rows[0],
    });
  } catch (error) {
    console.error('PUT contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete - archive the contact
    const result = await pool.query(
      'UPDATE contacts SET archived = true, updated_at = NOW() WHERE id = $1 RETURNING *',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact archived successfully',
    });
  } catch (error) {
    console.error('DELETE contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to archive contact' }, { status: 500 });
  }
}
