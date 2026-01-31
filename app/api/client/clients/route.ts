import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

async function generateClientId(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM clients WHERE client_id LIKE $1',
    [`CLT-${year}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `CLT-${year}-${String(count).padStart(5, '0')}`;
}

async function generateApplicationId(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM applications WHERE application_id LIKE $1',
    [`APP-${year}${month}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `APP-${year}${month}-${String(count).padStart(4, '0')}`;
}

async function getClientById(id: string | number) {
  // If id looks like a client_id (starts with CLT-), search by client_id
  if (typeof id === 'string' && id.startsWith('CLT-')) {
    const result = await pool.query('SELECT * FROM clients WHERE client_id = $1', [id]);
    return result.rows[0] || null;
  }
  
  // Try by numeric id first, then by client_id
  let result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    result = await pool.query('SELECT * FROM clients WHERE client_id = $1', [id]);
  }
  return result.rows[0] || null;
}

async function getClientByEmail(email: string) {
  const result = await pool.query(
    'SELECT * FROM clients WHERE LOWER(email) = LOWER($1) AND (archived = false OR archived IS NULL)',
    [email]
  );
  return result.rows[0] || null;
}

async function getClientCases(clientId: string | number) {
  const client = await getClientById(clientId);
  if (!client) return [];

  const result = await pool.query(
    'SELECT * FROM applications WHERE client_id = $1 OR email = $2',
    [client.id, client.email]
  );
  return result.rows;
}

async function getClientProfile(clientId: string | number) {
  const client = await getClientById(clientId);
  if (!client) return null;

  // Get all cases
  client.cases_data = await getClientCases(clientId);

  // Get lead data if exists
  if (client.lead_id) {
    const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [client.lead_id]);
    if (leadResult.rows.length > 0) {
      client.lead_data = leadResult.rows[0];
    }
  }

  return client;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const action = searchParams.get('action');
  const search = searchParams.get('search');
  const source = searchParams.get('source');
  const historical = searchParams.get('historical');

  try {
    if (clientId) {
      if (action === 'profile') {
        const client = await getClientProfile(clientId);
        if (client) {
          return NextResponse.json({ success: true, client });
        } else {
          return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
        }
      } else if (action === 'cases') {
        const cases = await getClientCases(clientId);
        return NextResponse.json({ success: true, cases });
      } else {
        const client = await getClientById(clientId);
        if (client) {
          return NextResponse.json({ success: true, client });
        } else {
          return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
        }
      }
    } else {
      // List all clients with filters
      let query = 'SELECT * FROM clients WHERE (archived = false OR archived IS NULL)';
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND (LOWER(name) LIKE LOWER($${paramIndex}) OR LOWER(email) LIKE LOWER($${paramIndex}) OR phone LIKE $${paramIndex} OR client_id LIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (source) {
        query += ` AND source = $${paramIndex}`;
        params.push(source);
        paramIndex++;
      }

      if (historical !== null) {
        const isHistorical = historical === 'true';
        query += ` AND (is_historical = $${paramIndex})`;
        params.push(isHistorical);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      return NextResponse.json({
        success: true,
        clients: result.rows,
        items: result.rows,
        total: result.rows.length,
      });
    }
  } catch (error) {
    console.error('Error in clients API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    if (!input.name || !input.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    // Check if client with email already exists
    const existingClient = await getClientByEmail(input.email);
    if (existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client with this email already exists',
          existing_client_id: existingClient.client_id || existingClient.id,
        },
        { status: 409 }
      );
    }

    const clientId = await generateClientId();
    const now = new Date();

    const result = await pool.query(`
      INSERT INTO clients (
        client_id, lead_id, name, email, phone, whatsapp, city, country,
        locale, avatar_url, service_type, package, family_adults, family_children,
        expected_travel_date, expected_due_date, source, referral_source,
        is_historical, tags, total_paid, total_due, currency, payments,
        notes, communications, status, archived, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30
      ) RETURNING *
    `, [
      clientId,
      input.lead_id || null,
      input.name,
      input.email,
      input.phone || null,
      input.whatsapp || input.phone || null,
      input.city || null,
      input.country || null,
      input.locale || 'en',
      input.avatar_url || null,
      input.service_type || null,
      input.package || null,
      input.family_adults || 2,
      input.family_children || 0,
      input.expected_travel_date || null,
      input.expected_due_date || null,
      input.source || 'manual',
      input.referral_source || null,
      input.is_historical || false,
      JSON.stringify(input.tags || []),
      input.total_paid || 0,
      input.total_due || 0,
      input.currency || 'USD',
      JSON.stringify(input.payments || []),
      input.initial_note 
        ? JSON.stringify([{
            id: `note-${Date.now()}`,
            content: input.initial_note,
            created_at: now.toISOString(),
            created_by: input.created_by || 'admin',
          }])
        : JSON.stringify([]),
      JSON.stringify([]),
      'active',
      false,
      now,
      now
    ]);

    const newClient = result.rows[0];

    // Also create an application/case linked to this client
    const applicationId = await generateApplicationId();
    const appResult = await pool.query(`
      INSERT INTO applications (
        application_id, client_id, lead_id, name, email, phone, locale,
        service_type, package, phase, status, timeline, notes, documents,
        created_at, updated_at, archived
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17
      ) RETURNING *
    `, [
      applicationId,
      newClient.id, // Link to the new client's database ID
      input.lead_id || null,
      input.name,
      input.email,
      input.phone || null,
      input.locale || 'en',
      input.service_type || null,
      input.package || null,
      1, // Phase 1: Lead
      'new', // Initial status
      JSON.stringify([{
        status: 'new',
        timestamp: now.toISOString(),
        by: input.created_by || 'admin',
        note: 'Client and case created'
      }]),
      JSON.stringify([]),
      JSON.stringify([]),
      now,
      now,
      false
    ]);

    return NextResponse.json({
      success: true,
      client: newClient,
      application: appResult.rows[0],
      message: 'Client and case created successfully',
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const action = searchParams.get('action');

  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Client ID required' }, { status: 400 });
  }

  try {
    const input = await request.json();
    const client = await getClientById(clientId);

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const now = new Date();
    let updateQuery = '';
    let updateParams: any[] = [];

    if (action === 'add-note') {
      const notes = client.notes || [];
      notes.push({
        id: `note-${Date.now()}`,
        content: input.content,
        created_at: now.toISOString(),
        created_by: input.created_by || 'admin',
      });
      updateQuery = 'UPDATE clients SET notes = $1, updated_at = $2 WHERE id = $3 RETURNING *';
      updateParams = [JSON.stringify(notes), now, client.id];
    } else if (action === 'add-communication') {
      const comms = client.communications || [];
      comms.push({
        id: `comm-${Date.now()}`,
        type: input.type || 'note',
        subject: input.subject || '',
        content: input.content,
        sent_at: now.toISOString(),
        sent_by: input.sent_by || 'admin',
      });
      updateQuery = 'UPDATE clients SET communications = $1, updated_at = $2 WHERE id = $3 RETURNING *';
      updateParams = [JSON.stringify(comms), now, client.id];
    } else if (action === 'add-payment') {
      const payments = client.payments || [];
      payments.push({
        id: `pay-${Date.now()}`,
        amount: input.amount,
        method: input.method || 'other',
        reference: input.reference || null,
        date: input.date || now.toISOString().split('T')[0],
        notes: input.notes || '',
        recorded_at: now.toISOString(),
        recorded_by: input.recorded_by || 'admin',
      });
      const newTotalPaid = (parseFloat(client.total_paid) || 0) + parseFloat(input.amount);
      updateQuery = 'UPDATE clients SET payments = $1, total_paid = $2, updated_at = $3 WHERE id = $4 RETURNING *';
      updateParams = [JSON.stringify(payments), newTotalPaid, now, client.id];
    } else if (action === 'link-case') {
      // This would typically update a junction table or applications table
      return NextResponse.json({ success: true, client, message: 'Case linked (applications reference client)' });
    } else {
      // Regular update - build dynamic query
      const updateableFields = [
        'name', 'email', 'phone', 'whatsapp', 'city', 'country',
        'locale', 'avatar_url', 'service_type', 'package',
        'family_adults', 'family_children', 'expected_travel_date',
        'expected_due_date', 'tags', 'is_historical', 'referral_source',
        'total_paid', 'total_due', 'currency', 'status'
      ];

      // Date fields that need to convert empty strings to null
      const dateFields = ['expected_travel_date', 'expected_due_date'];

      const updates: string[] = [];
      updateParams = [];
      let paramIdx = 1;

      for (const field of updateableFields) {
        if (input[field] !== undefined) {
          let value = input[field];
          
          // Handle date fields - convert empty strings to null
          if (dateFields.includes(field)) {
            value = value === '' || value === null ? null : value;
          }
          
          if (field === 'tags') {
            updates.push(`${field} = $${paramIdx}`);
            updateParams.push(JSON.stringify(value));
          } else {
            updates.push(`${field} = $${paramIdx}`);
            updateParams.push(value);
          }
          paramIdx++;
        }
      }

      if (updates.length === 0) {
        return NextResponse.json({ success: true, client });
      }

      updates.push(`updated_at = $${paramIdx}`);
      updateParams.push(now);
      paramIdx++;

      updateParams.push(client.id);
      updateQuery = `UPDATE clients SET ${updates.join(', ')} WHERE id = $${paramIdx} RETURNING *`;
    }

    const result = await pool.query(updateQuery, updateParams);
    return NextResponse.json({ success: true, client: result.rows[0] });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');

  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Client ID required' }, { status: 400 });
  }

  try {
    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const now = new Date();
    await pool.query(
      'UPDATE clients SET archived = true, archived_at = $1, updated_at = $2 WHERE id = $3',
      [now, now, client.id]
    );

    return NextResponse.json({ success: true, message: 'Client archived successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
