import { NextRequest, NextResponse } from 'next/server';
import { query, jsonResponse, errorResponse, corsHeaders, handleCors, getJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET - Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT * FROM contacts WHERE id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse('Contact not found', 404);
    }

    return jsonResponse({ contact: result.rows[0] });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return errorResponse('Failed to fetch contact', 500);
  }
}

// PATCH - Update contact status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await getJsonBody(request);
    const { status, notes } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }

    if (updates.length === 0) {
      return errorResponse('No fields to update', 400);
    }

    values.push(params.id);
    const result = await query(
      `UPDATE contacts SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return errorResponse('Contact not found', 404);
    }

    return jsonResponse({ success: true, contact: result.rows[0] });
  } catch (error) {
    console.error('Error updating contact:', error);
    return errorResponse('Failed to update contact', 500);
  }
}

// DELETE - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `DELETE FROM contacts WHERE id = $1 RETURNING id`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse('Contact not found', 404);
    }

    return jsonResponse({ success: true, deleted: params.id });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return errorResponse('Failed to delete contact', 500);
  }
}
