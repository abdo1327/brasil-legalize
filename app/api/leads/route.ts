import { NextRequest, NextResponse } from 'next/server';
import {
  auditLog,
  checkRateLimit,
  getClientIp,
  getJsonBody,
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

// Public POST - Create lead from eligibility form
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';

  // Rate limit: 10 per minute per IP
  const rateLimit = checkRateLimit(`leads:${ip}`, 10, 60000);
  if (!rateLimit.allowed) {
    await auditLog('lead_rate_limited', { ip }, undefined, ip, userAgent);
    return errorResponse('Too many requests. Please try again later.', 429);
  }

  const body = await getJsonBody(request);
  const name = (body.name || '').trim();
  const email = (body.email || body.contact || '').trim();
  const phone = (body.phone || '').trim();
  const country = (body.country || '').trim();
  const serviceType = (body.serviceType || '').trim();
  const consent = body.consent ?? false;

  if (!name || name.length < 2) {
    return errorResponse('Name is required (minimum 2 characters)', 400);
  }
  if (!email || email.length < 5) {
    return errorResponse('Valid contact information is required', 400);
  }
  if (!consent) {
    return errorResponse('Consent is required', 400);
  }

  // Honeypot check
  if (body.website) {
    await auditLog('lead_honeypot_detected', { ip }, undefined, ip, userAgent);
    return jsonResponse({ message: 'Lead captured', leadId: 'honeypot' });
  }

  try {
    const result = await query(
      `INSERT INTO leads (name, email, phone, country, service_type, answers, consent, consent_version, consent_timestamp, source, ip_address, user_agent, locale, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11, $12, NOW())
       RETURNING id`,
      [
        name,
        email,
        phone,
        country,
        serviceType,
        JSON.stringify(body.answers || {}),
        consent,
        body.consentVersion || 'v1',
        body.source || 'eligibility',
        ip,
        userAgent,
        body.locale || 'en',
      ]
    );

    const leadId = result.rows[0].id;
    await auditLog('lead_created', { leadId, name, email }, undefined, ip, userAgent);

    // Create notification for admin about new lead
    try {
      await query(
        `INSERT INTO notifications (type, title, message, client_name, read, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          'new_lead',
          'New Eligibility Lead',
          `New lead from ${country || 'Unknown'} interested in ${serviceType || 'citizenship services'}`,
          name,
          false,
        ]
      );
    } catch (notifyError) {
      console.error('Failed to create notification:', notifyError);
      // Don't fail the lead creation if notification fails
    }

    return jsonResponse({ message: 'Lead captured successfully', leadId });
  } catch (error) {
    console.error('Lead creation error:', error);
    return errorResponse('Failed to save lead', 500);
  }
}

// Admin GET - List leads
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authenticated) {
    return auth.error!;
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    let sql = `SELECT * FROM leads WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    return jsonResponse({
      success: true,
      items: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Leads fetch error:', error);
    return errorResponse('Failed to fetch leads', 500);
  }
}
