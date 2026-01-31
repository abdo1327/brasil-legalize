import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  getJsonBody,
  getClientIp,
  generateApplicationId,
  generateSecureToken,
  generatePassword,
  query,
} from '@/lib/api-utils';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const { searchParams } = new URL(request.url);
  const tokenParam = searchParams.get('token');

  // Public access by token (for client track page)
  if (tokenParam) {
    try {
      const result = await query(
        `SELECT id, application_id, name, status, phase, timeline, documents, created_at, updated_at
         FROM applications WHERE token = $1`,
        [tokenParam]
      );

      if (result.rows.length === 0) {
        return jsonResponse({ success: false, error: 'Application not found' }, 404);
      }

      const app = result.rows[0];
      // Parse JSON fields
      const timeline = typeof app.timeline === 'string' ? JSON.parse(app.timeline) : (app.timeline || []);
      const documents = typeof app.documents === 'string' ? JSON.parse(app.documents) : (app.documents || []);

      // Get status info
      const statusPhase: Record<string, number> = {
        new: 1, contacted: 1, meeting_scheduled: 1, meeting_completed: 1,
        proposal_sent: 2, negotiating: 2, awaiting_payment: 2, payment_received: 2,
        onboarding: 3, documents_pending: 3, documents_review: 3, application_submitted: 3,
        processing: 4, approved: 4, finalizing: 4, completed: 4,
      };

      const statusLabels: Record<string, string> = {
        new: 'New', contacted: 'Contacted', meeting_scheduled: 'Meeting Scheduled', meeting_completed: 'Meeting Completed',
        proposal_sent: 'Proposal Sent', negotiating: 'Negotiating', awaiting_payment: 'Awaiting Payment', payment_received: 'Payment Received',
        onboarding: 'Onboarding', documents_pending: 'Documents Pending', documents_review: 'Documents Review', application_submitted: 'Application Submitted',
        processing: 'Processing', approved: 'Approved', finalizing: 'Finalizing', completed: 'Completed',
      };

      return jsonResponse({
        success: true,
        data: {
          id: app.application_id,
          name: app.name,
          status: app.status,
          phase: app.phase,
          statusInfo: {
            phase: statusPhase[app.status] || 1,
            label: statusLabels[app.status] || app.status,
            color: 'bg-primary text-white',
          },
          timeline,
          documents,
        },
      });
    } catch (error) {
      console.error('Token lookup error:', error);
      return errorResponse('Failed to fetch application', 500);
    }
  }

  // Admin access (requires auth)
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

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
    // First, check if we need to generate token/password
    // This happens when status is changing to payment_received and no token exists
    let generateCredentials = false;
    if (updates.status === 'payment_received' && !updates.token) {
      // Check if application already has a token
      const existingApp = await query('SELECT token FROM applications WHERE id = $1', [id]);
      if (existingApp.rows.length > 0 && !existingApp.rows[0].token) {
        generateCredentials = true;
      }
    }

    const setClauses: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 1;

    // Auto-generate token and password if needed
    if (generateCredentials) {
      const newToken = generateSecureToken();
      const newPassword = generatePassword();
      setClauses.push(`token = $${paramIndex++}`);
      params.push(newToken);
      setClauses.push(`password = $${paramIndex++}`);
      params.push(newPassword);
    }

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

    const updatedApp = result.rows[0];

    // If credentials were generated, send welcome email with portal access
    if (generateCredentials && updatedApp.email) {
      const trackerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://maocean360.com'}/en/track/${updatedApp.token}`;
      
      try {
        await resend.emails.send({
          from: 'Brasil Legalize <noreply@maocean360.com>',
          to: [updatedApp.email],
          subject: 'Payment Received - Your Portal Access is Ready!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">Payment Received - Thank You!</h2>
              <p>Dear ${updatedApp.name},</p>
              <p>We have received your payment. Thank you for choosing Brasil Legalize!</p>
              <p>Your client portal is now ready. You can track your application progress using the link below:</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Portal Link:</strong></p>
                <a href="${trackerUrl}" style="color: #059669; word-break: break-all;">${trackerUrl}</a>
                <p style="margin: 15px 0 5px 0;"><strong>Password:</strong></p>
                <code style="background: #fff; padding: 5px 10px; border-radius: 4px; font-size: 16px;">${updatedApp.password}</code>
              </div>
              <p style="color: #666; font-size: 14px;">Keep your password secure. You'll need it to access your portal.</p>
              <p>Best regards,<br>Brasil Legalize Team</p>
            </div>
          `,
        });
        console.log('Welcome email sent to:', updatedApp.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the update if email fails
      }
    }

    // If credentials were generated, include a message
    const response: any = {
      success: true,
      message: generateCredentials 
        ? 'Application updated. Token and password generated for client access.' 
        : 'Application updated',
      application: updatedApp,
    };

    if (generateCredentials) {
      response.credentialsGenerated = true;
      response.emailSent = true;
    }

    return jsonResponse(response);
  } catch (error) {
    console.error('Application update error:', error);
    return errorResponse('Failed to update application', 500);
  }
}

// PUT - Update application (alias for PATCH)
export async function PUT(request: NextRequest) {
  return PATCH(request);
}
