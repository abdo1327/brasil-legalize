import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

// Simple auth check
async function checkAuth(request: NextRequest): Promise<boolean> {
  let token: string | null = null;
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }
  if (!token) return false;
  const sessionStore = (global as any).__adminSessions;
  if (!sessionStore) return false;
  const session = sessionStore.get(token);
  return session && Date.now() < session.expiresAt;
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET - List notifications
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const unreadOnly = searchParams.get('unread') === 'true';

  try {
    let sql = `SELECT * FROM notifications WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (unreadOnly) {
      sql += ` AND read = FALSE`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    // Get unread count
    const unreadResult = await query(`SELECT COUNT(*) as count FROM notifications WHERE read = FALSE`);
    const unreadCount = parseInt(unreadResult.rows[0]?.count || '0');

    return jsonResponse({
      success: true,
      items: result.rows,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return jsonResponse({ success: true, items: [], unreadCount: 0 });
  }
}

// PATCH - Mark notification as read
export async function PATCH(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const markAllRead = searchParams.get('markAllRead') === 'true';

  // Also try reading from body
  let bodyId = null;
  let bodyMarkAllRead = false;
  try {
    const body = await request.json();
    bodyId = body.id;
    bodyMarkAllRead = body.markAllRead === true;
  } catch {
    // No body or invalid JSON
  }

  const notifId = id || bodyId;
  const shouldMarkAllRead = markAllRead || bodyMarkAllRead;

  try {
    if (shouldMarkAllRead) {
      await query(`UPDATE notifications SET read = TRUE WHERE read = FALSE`);
    } else if (notifId) {
      await query(`UPDATE notifications SET read = TRUE WHERE id = $1`, [notifId]);
    }

    return jsonResponse({ success: true, message: 'Notifications updated' });
  } catch (error) {
    console.error('Notification update error:', error);
    return errorResponse('Failed to update notifications', 500);
  }
}

// PUT - Alias for PATCH
export async function PUT(request: NextRequest) {
  return PATCH(request);
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return errorResponse('Notification ID is required', 400);
  }

  try {
    await query(`DELETE FROM notifications WHERE id = $1`, [id]);
    return jsonResponse({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Notification delete error:', error);
    return errorResponse('Failed to delete notification', 500);
  }
}
