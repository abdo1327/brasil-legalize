import { NextRequest, NextResponse } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  getJsonBody,
  generateClientId,
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

// GET - List clients or get single client profile
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const action = searchParams.get('action');
  const limit = parseInt(searchParams.get('limit') || '100');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const archived = searchParams.get('archived') === 'true';

  try {
    // Get single client by ID
    if (clientId) {
      // Try to find by client_id (CLT-2026-00001) or numeric id
      let clientResult = await query(
        'SELECT * FROM clients WHERE client_id = $1',
        [clientId]
      );
      
      if (clientResult.rows.length === 0) {
        // Try numeric ID
        clientResult = await query(
          'SELECT * FROM clients WHERE id = $1',
          [clientId]
        );
      }

      if (clientResult.rows.length === 0) {
        return errorResponse('Client not found', 404);
      }

      const client = clientResult.rows[0];

      // If action is profile, fetch related data
      if (action === 'profile') {
        // Get related cases/applications
        const casesResult = await query(
          'SELECT * FROM applications WHERE client_id = $1 OR email = $2 ORDER BY created_at DESC',
          [client.id, client.email]
        );
        client.cases_data = casesResult.rows;

        // Get lead data if exists
        if (client.lead_id) {
          const leadResult = await query('SELECT * FROM leads WHERE id = $1', [client.lead_id]);
          if (leadResult.rows.length > 0) {
            client.lead_data = leadResult.rows[0];
          }
        }
      }

      return jsonResponse({
        success: true,
        client,
      });
    }

    // List all clients with case counts
    let sql = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM applications a WHERE a.client_id = c.id OR a.email = c.email) as cases_count
      FROM clients c 
      WHERE c.archived = $1`;
    const params: any[] = [archived];
    let paramIndex = 2;

    if (status) {
      sql += ` AND c.status = $${paramIndex++}`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.client_id ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    return jsonResponse({
      success: true,
      items: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Clients fetch error:', error);
    return errorResponse('Failed to fetch clients', 500);
  }
}

// POST - Create new client
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
  if (!email) {
    return errorResponse('Email is required', 400);
  }

  try {
    const clientId = generateClientId();

    const result = await query(
      `INSERT INTO clients (client_id, name, email, phone, whatsapp, city, country, locale, service_type, package, source, tags, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
       RETURNING *`,
      [
        clientId,
        name,
        email,
        body.phone || null,
        body.whatsapp || null,
        body.city || null,
        body.country || null,
        body.locale || 'en',
        body.serviceType || null,
        body.package || null,
        body.source || 'manual',
        JSON.stringify(body.tags || []),
      ]
    );

    const client = result.rows[0];

    return jsonResponse({
      success: true,
      message: 'Client created',
      client,
    });
  } catch (error) {
    console.error('Client creation error:', error);
    return errorResponse('Failed to create client', 500);
  }
}

// PATCH - Update client
export async function PATCH(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await getJsonBody(request);
  const { id, action, ...updates } = body;

  if (!id) {
    return errorResponse('Client ID is required', 400);
  }

  try {
    // First find the client by client_id or id
    let clientResult = await query('SELECT * FROM clients WHERE client_id = $1', [id]);
    if (clientResult.rows.length === 0) {
      clientResult = await query('SELECT * FROM clients WHERE id = $1', [id]);
    }
    if (clientResult.rows.length === 0) {
      return errorResponse('Client not found', 404);
    }
    const client = clientResult.rows[0];
    const clientDbId = client.id;

    // Handle specific actions
    if (action === 'add-note') {
      const notes = Array.isArray(client.notes) ? client.notes : [];
      notes.push({
        id: `note-${Date.now()}`,
        content: updates.note || updates.content,
        created_at: new Date().toISOString(),
        created_by: updates.by || 'admin',
      });
      await query(
        'UPDATE clients SET notes = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(notes), clientDbId]
      );
      return jsonResponse({ success: true, message: 'Note added' });
    }

    if (action === 'add-payment') {
      const payments = Array.isArray(client.payments) ? client.payments : [];
      payments.push({
        id: `pay-${Date.now()}`,
        amount: updates.amount,
        method: updates.method || 'other',
        reference: updates.reference || null,
        date: new Date().toISOString().split('T')[0],
        notes: updates.description || updates.notes || '',
        recorded_at: new Date().toISOString(),
        recorded_by: updates.by || 'admin',
      });
      const newTotalPaid = (parseFloat(client.total_paid) || 0) + parseFloat(updates.amount);
      await query(
        'UPDATE clients SET payments = $1, total_paid = $2, updated_at = NOW() WHERE id = $3',
        [JSON.stringify(payments), newTotalPaid, clientDbId]
      );
      return jsonResponse({ success: true, message: 'Payment added' });
    }

    if (action === 'add-communication') {
      const comms = Array.isArray(client.communications) ? client.communications : [];
      comms.push({
        id: `comm-${Date.now()}`,
        type: updates.type || 'note',
        subject: updates.subject || '',
        content: updates.content,
        sent_at: new Date().toISOString(),
        sent_by: updates.by || 'admin',
      });
      await query(
        'UPDATE clients SET communications = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(comms), clientDbId]
      );
      return jsonResponse({ success: true, message: 'Communication added' });
    }

    // Regular update
    const setClauses: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 1;

    const allowedFields = ['name', 'email', 'phone', 'whatsapp', 'city', 'country', 'locale', 'service_type', 'package', 'status', 'tags', 'notes', 'archived', 'total_paid', 'total_due'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex++}`);
        params.push(field === 'tags' || field === 'notes' || field === 'payments' || field === 'communications'
          ? JSON.stringify(updates[field]) 
          : updates[field]);
      }
    }

    params.push(clientDbId);
    const sql = `UPDATE clients SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return errorResponse('Client not found', 404);
    }

    return jsonResponse({
      success: true,
      message: 'Client updated',
      client: result.rows[0],
    });
  } catch (error) {
    console.error('Client update error:', error);
    return errorResponse('Failed to update client', 500);
  }
}
