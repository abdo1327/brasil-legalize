import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  requireAdminAuth,
  getJsonBody,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// POST - Send notification (creates in database)
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authenticated) {
    return auth.error!;
  }

  const body = await getJsonBody(request);
  const { type, title, message, applicationId, clientName, action } = body;

  if (!title) {
    return errorResponse('Title is required', 400);
  }

  try {
    const result = await query(
      `INSERT INTO notifications (type, title, message, application_id, client_name, action, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        type || 'system',
        title,
        message || null,
        applicationId || null,
        clientName || null,
        action || null,
      ]
    );

    return jsonResponse({
      success: true,
      notification: result.rows[0],
    });
  } catch (error) {
    console.error('Notification create error:', error);
    return errorResponse('Failed to create notification', 500);
  }
}
