import { NextRequest, NextResponse } from 'next/server';
import { query, jsonResponse, errorResponse, corsHeaders, handleCors, getJsonBody } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET - List all contacts
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100`
    );
    return jsonResponse({ contacts: result.rows });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return errorResponse('Failed to fetch contacts', 500);
  }
}

// POST - Create new contact submission
export async function POST(request: NextRequest) {
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const body = await getJsonBody(request);
    const { name, email, phone, message, locale = 'en' } = body;

    if (!name || !email || !message) {
      return errorResponse('Name, email, and message are required', 400);
    }

    const result = await query(
      `INSERT INTO contacts (name, email, phone, message, locale, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'new', NOW())
       RETURNING *`,
      [name, email, phone || null, message, locale]
    );

    return jsonResponse({ success: true, contact: result.rows[0] }, 201);
  } catch (error) {
    console.error('Error creating contact:', error);
    return errorResponse('Failed to submit contact form', 500);
  }
}
