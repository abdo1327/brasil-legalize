import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  getJsonBody,
  getClientIp,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// POST - Log consent action
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';
  const body = await getJsonBody(request);

  const { action, locale, referrer } = body;

  if (!action || !['accepted', 'rejected', 'withdrawn'].includes(action)) {
    return errorResponse('Valid action is required', 400);
  }

  try {
    // Generate visitor ID from IP + user agent
    const visitorId = crypto
      .createHash('sha256')
      .update(`${ip}:${userAgent}`)
      .digest('hex')
      .substring(0, 64);

    const consentStatus = action === 'accepted' ? 'accepted' : 'rejected';

    await query(
      `INSERT INTO consent_log (visitor_id, action, consent_status, policy_version, ip_address, user_agent, locale, referrer, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        visitorId,
        action,
        consentStatus,
        '1.0',
        ip,
        userAgent,
        locale || 'en',
        referrer || null,
      ]
    );

    return jsonResponse({
      success: true,
      message: 'Consent recorded',
      visitorId,
    });
  } catch (error) {
    console.error('Consent log error:', error);
    return errorResponse('Failed to record consent', 500);
  }
}

// GET - Check consent status
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const visitorId = crypto
      .createHash('sha256')
      .update(`${ip}:${userAgent}`)
      .digest('hex')
      .substring(0, 64);

    const result = await query(
      `SELECT consent_status, created_at FROM consent_log 
       WHERE visitor_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [visitorId]
    );

    if (result.rows.length === 0) {
      return jsonResponse({
        hasConsent: false,
        status: null,
      });
    }

    return jsonResponse({
      hasConsent: true,
      status: result.rows[0].consent_status,
      timestamp: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('Consent check error:', error);
    return jsonResponse({ hasConsent: false, status: null });
  }
}
