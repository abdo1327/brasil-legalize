import { NextRequest, NextResponse } from 'next/server';
import {
  getJsonBody,
  errorResponse,
  corsHeaders,
  handleCors,
  getClientIp,
  generateSecureToken,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

// In-memory session store (for simplicity - in production use Redis or DB table)
const sessionStore = new Map<string, { adminId: number; email: string; expiresAt: number }>();

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await getJsonBody(request);

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return errorResponse('Email and password are required', 400);
  }

  try {
    // Find admin in admin_users table
    const adminResult = await query(
      `SELECT id, email, password, name, role, is_active 
       FROM admin_users WHERE LOWER(email) = $1`,
      [email]
    );

    let admin = adminResult.rows[0];
    let authenticated = false;

    if (admin && admin.is_active) {
      // Plain text password comparison (as stored in DB)
      authenticated = password === admin.password;
    }
    
    // Fallback to env vars
    if (!authenticated) {
      const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD;

      if (email === envEmail && password === envPassword) {
        if (!admin) {
          const insertResult = await query(
            `INSERT INTO admin_users (email, password, name, role, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
             ON CONFLICT (email) DO UPDATE SET is_active = TRUE
             RETURNING id, email, name, role`,
            [email, password, 'System Admin', 'super_admin']
          );
          admin = insertResult.rows[0];
        }
        authenticated = true;
      }
    }

    if (!authenticated || !admin) {
      return errorResponse('Invalid email or password', 401);
    }

    // Create session token (in-memory)
    const token = generateSecureToken();
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    sessionStore.set(token, { adminId: admin.id, email: admin.email, expiresAt });
    
    // Export for session validation
    (global as any).__adminSessions = sessionStore;
    
    await query(`UPDATE admin_users SET updated_at = NOW() WHERE id = $1`, [admin.id]);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        avatar_url: admin.avatar_url,
      },
      permissions: admin.role === 'super_admin' ? ['*'] : ['dashboard.view', 'clients.view', 'cases.view'],
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
