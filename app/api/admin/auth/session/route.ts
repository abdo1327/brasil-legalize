import { NextRequest, NextResponse } from 'next/server';
import {
  errorResponse,
  corsHeaders,
  handleCors,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  let token: string | null = null;

  // Check cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  // Check Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      message: 'No session token found',
    });
  }

  // Get session from global store
  const sessionStore = (global as any).__adminSessions as Map<string, { adminId: number; email: string; expiresAt: number }>;
  
  if (!sessionStore) {
    return NextResponse.json({
      authenticated: false,
      message: 'No active sessions',
    });
  }

  const session = sessionStore.get(token);
  
  if (!session || Date.now() > session.expiresAt) {
    if (session) sessionStore.delete(token);
    return NextResponse.json({
      authenticated: false,
      message: 'Invalid or expired session',
    });
  }

  // Get admin details from database
  try {
    const result = await query(
      `SELECT id, email, name, role FROM admin_users WHERE id = $1 AND is_active = TRUE`,
      [session.adminId]
    );

    if (result.rows.length === 0) {
      sessionStore.delete(token);
      return NextResponse.json({
        authenticated: false,
        message: 'Admin not found',
      });
    }

    const admin = result.rows[0];

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      permissions: admin.role === 'super_admin' ? ['*'] : ['dashboard.view', 'clients.view', 'cases.view'],
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Session check failed',
    });
  }
}
