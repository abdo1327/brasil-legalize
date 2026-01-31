import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  getJsonBody,
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

// GET - Get pricing for admin
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const packagesResult = await query(`SELECT * FROM packages ORDER BY sort_order`);
    const servicesResult = await query(`SELECT * FROM services ORDER BY display_order`);

    return jsonResponse({
      success: true,
      packages: packagesResult.rows,
      services: servicesResult.rows,
    });
  } catch (error) {
    console.error('Admin pricing fetch error:', error);
    return errorResponse('Failed to fetch pricing', 500);
  }
}

// PATCH - Update pricing
export async function PATCH(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await getJsonBody(request);
  const { type, id, ...updates } = body;

  if (!type || !id) {
    return errorResponse('Type and ID are required', 400);
  }

  try {
    if (type === 'package') {
      const setClauses: string[] = ['updated_at = NOW()'];
      const params: any[] = [];
      let paramIndex = 1;

      const allowedFields = ['price', 'is_active', 'is_popular', 'adults_included', 'children_included', 'price_per_extra_adult', 'price_per_extra_child', 'discount_percent'];
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = $${paramIndex++}`);
          params.push(updates[field]);
        }
      }

      params.push(id);
      await query(`UPDATE packages SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, params);
    } else if (type === 'service') {
      const setClauses: string[] = ['updated_at = NOW()'];
      const params: any[] = [];
      let paramIndex = 1;

      const allowedFields = ['price', 'is_active', 'icon', 'color', 'category', 'included_in_basic', 'included_in_complete'];
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = $${paramIndex++}`);
          params.push(updates[field]);
        }
      }

      params.push(id);
      await query(`UPDATE services SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, params);
    }

    return jsonResponse({ success: true, message: 'Pricing updated' });
  } catch (error) {
    console.error('Pricing update error:', error);
    return errorResponse('Failed to update pricing', 500);
  }
}

// PUT - Alias for PATCH (update pricing)
export async function PUT(request: NextRequest) {
  return PATCH(request);
}
