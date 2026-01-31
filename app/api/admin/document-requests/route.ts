import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

// Generate a unique upload token
function generateUploadToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Generate unique request ID
async function generateRequestId(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM document_requests WHERE request_id LIKE $1',
    [`REQ-${year}${month}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `REQ-${year}${month}-${String(count).padStart(4, '0')}`;
}

// GET - List document requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const caseId = searchParams.get('caseId');
  const status = searchParams.get('status');

  try {
    let query = `
      SELECT dr.*, 
             c.name as client_name, 
             c.email as client_email,
             c.client_id as client_code,
             a.application_id as case_code
      FROM document_requests dr
      LEFT JOIN clients c ON dr.client_id = c.id
      LEFT JOIN applications a ON dr.case_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (clientId) {
      query += ` AND dr.client_id = $${paramIndex}`;
      params.push(clientId);
      paramIndex++;
    }

    if (caseId) {
      query += ` AND dr.case_id = $${paramIndex}`;
      params.push(caseId);
      paramIndex++;
    }

    if (status && status !== 'all') {
      query += ` AND dr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY dr.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      requests: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching document requests:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch document requests' }, { status: 500 });
  }
}

// POST - Create a new document request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      client_id, 
      case_id, 
      requested_documents, 
      message, 
      due_date,
      admin_name = 'Admin'
    } = body;

    if (!client_id) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    // Get client info
    const clientResult = await pool.query('SELECT * FROM clients WHERE id = $1', [client_id]);
    if (clientResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }
    const client = clientResult.rows[0];

    // Get case info if provided
    let caseInfo = null;
    if (case_id) {
      const caseResult = await pool.query('SELECT * FROM applications WHERE id = $1', [case_id]);
      if (caseResult.rows.length > 0) {
        caseInfo = caseResult.rows[0];
      }
    }

    // Generate unique tokens
    const requestId = await generateRequestId();
    const uploadToken = generateUploadToken();
    const now = new Date();

    // Create folder structure for uploads
    // Structure: storage/clients/{client_id}/requests/{request_id}/
    const uploadDir = path.join(
      process.cwd(), 
      'storage', 
      'clients', 
      client.client_id, 
      'requests', 
      requestId
    );
    await mkdir(uploadDir, { recursive: true });

    // Also create in cases folder if case_id provided
    if (caseInfo) {
      const caseUploadDir = path.join(
        process.cwd(),
        'storage',
        'cases',
        caseInfo.application_id,
        'requests',
        requestId
      );
      await mkdir(caseUploadDir, { recursive: true });
    }

    // Insert document request into database
    const result = await pool.query(`
      INSERT INTO document_requests (
        request_id, client_id, case_id, requested_documents, message,
        upload_token, upload_link, due_date, status, 
        created_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *
    `, [
      requestId,
      client_id,
      case_id || null,
      JSON.stringify(requested_documents || []),
      message || 'Please upload the requested documents.',
      uploadToken,
      `/upload/${uploadToken}`, // Relative upload link
      due_date || null,
      'pending',
      admin_name,
      now,
      now
    ]);

    const newRequest = result.rows[0];

    // Update application to enable document uploads if case_id provided
    if (case_id) {
      await pool.query(`
        UPDATE applications 
        SET updated_at = NOW()
        WHERE id = $1
      `, [case_id]);
    }

    // Create notification for the client
    await pool.query(`
      INSERT INTO notifications (
        type, title, message, data, read, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `, [
      'document_request',
      'New Document Request',
      `Document request created for ${client.name}`,
      JSON.stringify({
        request_id: requestId,
        client_id: client.id,
        client_name: client.name,
        case_id: case_id,
        upload_token: uploadToken,
      }),
      false,
      now
    ]);

    return NextResponse.json({
      success: true,
      request: newRequest,
      upload_link: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/upload/${uploadToken}`,
      upload_token: uploadToken,
      message: 'Document request created successfully',
    });
  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json({ success: false, error: 'Failed to create document request' }, { status: 500 });
  }
}

// PATCH - Update document request status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Request ID is required' }, { status: 400 });
    }

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;

      if (status === 'completed') {
        updates.push(`completed_at = NOW()`);
      }
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      params.push(notes);
      paramIndex++;
    }

    params.push(id);

    const result = await pool.query(`
      UPDATE document_requests 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      request: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating document request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update document request' }, { status: 500 });
  }
}

// PUT - Alias for PATCH
export async function PUT(request: NextRequest) {
  return PATCH(request);
}

// DELETE - Cancel/delete a document request
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Request ID is required' }, { status: 400 });
  }

  try {
    await pool.query('DELETE FROM document_requests WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Document request deleted',
    });
  } catch (error) {
    console.error('Error deleting document request:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete document request' }, { status: 500 });
  }
}
