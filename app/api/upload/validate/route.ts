import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brasil_legalize',
  password: '1234',
  port: 5432,
});

// GET - Validate upload token and get document request info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
  }

  try {
    // First check document_requests table
    const docRequestResult = await pool.query(`
      SELECT dr.*, c.name as client_name, c.email as client_email
      FROM document_requests dr
      LEFT JOIN clients c ON dr.client_id = c.id
      WHERE dr.upload_token = $1
    `, [token]);

    if (docRequestResult.rows.length > 0) {
      const request = docRequestResult.rows[0];
      return NextResponse.json({
        success: true,
        valid: true,
        type: 'document_request',
        documentRequest: {
          id: request.id,
          request_id: request.request_id,
          requested_documents: typeof request.requested_documents === 'string' 
            ? JSON.parse(request.requested_documents) 
            : request.requested_documents || [],
          message: request.message,
          due_date: request.due_date,
          status: request.status,
          client_name: request.client_name,
        },
      });
    }

    // Then check applications table for case token
    const appResult = await pool.query(`
      SELECT id, application_id, name, email, status
      FROM applications
      WHERE token = $1
    `, [token]);

    if (appResult.rows.length > 0) {
      const app = appResult.rows[0];
      return NextResponse.json({
        success: true,
        valid: true,
        type: 'application',
        application: {
          id: app.application_id,
          name: app.name,
          status: app.status,
        },
      });
    }

    // Token not found
    return NextResponse.json({
      success: false,
      valid: false,
      error: 'Invalid or expired upload token',
    }, { status: 404 });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 500 });
  }
}
