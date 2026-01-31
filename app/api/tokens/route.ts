import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  query,
  generateToken,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// POST - Validate token and password for client portal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return errorResponse('Token and password are required', 400);
    }

    // Find application by token
    const result = await query(
      `SELECT id, application_id, name, email, phone, locale, service_type, package, phase, status
       FROM applications 
       WHERE token = $1 AND password = $2`,
      [token, password]
    );

    if (result.rows.length === 0) {
      return errorResponse('Invalid token or password', 401);
    }

    const application = result.rows[0];

    return jsonResponse({
      success: true,
      message: 'Authentication successful',
      application: {
        id: application.application_id,
        name: application.name,
        email: application.email,
        phone: application.phone,
        locale: application.locale,
        serviceType: application.service_type,
        package: application.package,
        phase: application.phase,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return errorResponse('Validation failed', 500);
  }
}

// GET - Check token status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return errorResponse('Token is required', 400);
  }

  try {
    const result = await query(
      `SELECT application_id, name, phase, status FROM applications WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return jsonResponse({ valid: false, message: 'Token not found' });
    }

    const app = result.rows[0];
    return jsonResponse({
      valid: true,
      applicationId: app.application_id,
      name: app.name,
      phase: app.phase,
      status: app.status,
    });
  } catch (error) {
    console.error('Token check error:', error);
    return errorResponse('Token check failed', 500);
  }
}
