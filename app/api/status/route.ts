import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET - Get case status by token
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const applicationId = searchParams.get('id');

  if (!token && !applicationId) {
    return errorResponse('Token or application ID is required', 400);
  }

  try {
    let result;
    
    if (token) {
      result = await query(
        `SELECT a.*, c.name as client_name, c.email as client_email
         FROM applications a
         LEFT JOIN clients c ON a.client_id = c.id
         WHERE a.token = $1`,
        [token]
      );
    } else {
      result = await query(
        `SELECT a.*, c.name as client_name, c.email as client_email
         FROM applications a
         LEFT JOIN clients c ON a.client_id = c.id
         WHERE a.application_id = $1`,
        [applicationId]
      );
    }

    if (result.rows.length === 0) {
      return errorResponse('Case not found', 404);
    }

    const app = result.rows[0];
    const timeline = typeof app.timeline === 'string' ? JSON.parse(app.timeline) : app.timeline || [];
    const documents = typeof app.documents === 'string' ? JSON.parse(app.documents) : app.documents || [];

    // Map phase to status text
    const phaseNames: Record<number, string> = {
      1: 'Lead',
      2: 'Potential Client',
      3: 'Active Client',
      4: 'Completion',
    };

    return jsonResponse({
      success: true,
      case: {
        id: app.application_id,
        name: app.name || app.client_name,
        email: app.email || app.client_email,
        phone: app.phone,
        serviceType: app.service_type,
        package: app.package,
        phase: app.phase,
        phaseName: phaseNames[app.phase] || 'Unknown',
        status: app.status,
        timeline,
        documents: documents.map((doc: any) => ({
          name: doc.name,
          type: doc.type,
          status: doc.status,
          uploadedAt: doc.uploadedAt,
        })),
        createdAt: app.created_at,
        updatedAt: app.updated_at,
      },
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    return errorResponse('Failed to fetch status', 500);
  }
}
