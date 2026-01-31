import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  requireAdminAuth,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET - Get audit logs
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authenticated) {
    return auth.error!;
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const action = searchParams.get('action');
  const adminId = searchParams.get('adminId');

  try {
    let sql = `
      SELECT al.*, a.name as admin_name, a.email as admin_email
      FROM admin_audit_log al
      LEFT JOIN admins a ON al.admin_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (action) {
      sql += ` AND al.action = $${paramIndex++}`;
      params.push(action);
    }
    if (adminId) {
      sql += ` AND al.admin_id = $${paramIndex++}`;
      params.push(parseInt(adminId));
    }

    sql += ` ORDER BY al.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    return jsonResponse({
      success: true,
      items: result.rows.map((row: any) => ({
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
        adminId: row.admin_id,
        adminName: row.admin_name,
        adminEmail: row.admin_email,
        ipAddress: row.ip_address,
        createdAt: row.created_at,
      })),
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    return errorResponse('Failed to fetch audit logs', 500);
  }
}
