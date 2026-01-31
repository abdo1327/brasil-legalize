import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  getJsonBody,
  getClientIp,
  generateApplicationId,
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

// GET - List applications/cases
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const phase = searchParams.get('phase');
  const clientId = searchParams.get('clientId');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    let sql = `SELECT a.*, c.name as client_name, c.email as client_email 
               FROM applications a 
               LEFT JOIN clients c ON a.client_id = c.id
               WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND a.status = $${paramIndex++}`;
      params.push(status);
    }
    if (phase) {
      sql += ` AND a.phase = $${paramIndex++}`;
      params.push(parseInt(phase));
    }
    if (clientId) {
      sql += ` AND a.client_id = $${paramIndex++}`;
      params.push(parseInt(clientId));
    }

    sql += ` ORDER BY a.updated_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    return jsonResponse({
      success: true,
      items: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return errorResponse('Failed to fetch applications', 500);
  }
}

// POST - Create new application
export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await getJsonBody(request);

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();

  if (!name) {
    return errorResponse('Name is required', 400);
  }

  try {
    const applicationId = generateApplicationId();

    const result = await query(
      `INSERT INTO applications (application_id, name, email, phone, locale, service_type, package, phase, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 'new', NOW(), NOW())
       RETURNING *`,
      [
        applicationId,
        name,
        email,
        body.phone || null,
        body.locale || 'en',
        body.serviceType || null,
        body.package || null,
      ]
    );

    const application = result.rows[0];

    return jsonResponse({
      success: true,
      message: 'Application created',
      application,
    });
  } catch (error) {
    console.error('Application creation error:', error);
    return errorResponse('Failed to create application', 500);
  }
}

// PATCH - Update application
export async function PATCH(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await getJsonBody(request);
  const { id, ...updates } = body;

  if (!id) {
    return errorResponse('Application ID is required', 400);
  }

  try {
    const setClauses: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['status', 'phase', 'name', 'email', 'phone', 'notes', 'timeline', 'documents', 'payment_amount', 'payment_method', 'token', 'password'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex++}`);
        params.push(field === 'notes' || field === 'timeline' || field === 'documents' 
          ? JSON.stringify(updates[field]) 
          : updates[field]);
      }
    }

    // Update phase based on status if not explicitly set
    if (updates.status && !updates.phase) {
      const statusPhaseMap: Record<string, number> = {
        new: 1, contacted: 1, meeting_scheduled: 1, meeting_completed: 1,
        proposal_sent: 2, negotiating: 2, awaiting_payment: 2, payment_received: 2,
        onboarding: 3, documents_pending: 3, documents_review: 3, application_submitted: 3,
        processing: 4, approved: 4, finalizing: 4, completed: 4,
      };
      if (statusPhaseMap[updates.status]) {
        setClauses.push(`phase = $${paramIndex++}`);
        params.push(statusPhaseMap[updates.status]);
      }
    }

    params.push(id);
    const sql = `UPDATE applications SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return errorResponse('Application not found', 404);
    }

    return jsonResponse({
      success: true,
      message: 'Application updated',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Application update error:', error);
    return errorResponse('Failed to update application', 500);
  }
}

// PUT - Update application (alias for PATCH)
export async function PUT(request: NextRequest) {
  return PATCH(request);
}
