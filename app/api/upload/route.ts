import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  jsonResponse,
  errorResponse,
  corsHeaders,
  handleCors,
  auditLog,
  getClientIp,
  query,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// POST - Upload file for a case or document request
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const files = formData.getAll('files[]') as File[];
    const token = formData.get('token') as string | null;
    const applicationId = formData.get('applicationId') as string | null;
    const documentType = formData.get('type') as string | null;

    // Handle multiple files or single file
    const filesToProcess = files.length > 0 ? files : (file ? [file] : []);

    if (filesToProcess.length === 0) {
      return errorResponse('No file provided', 400);
    }

    if (!token && !applicationId) {
      return errorResponse('Token or application ID is required', 400);
    }

    // Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    for (const f of filesToProcess) {
      if (!allowedTypes.includes(f.type)) {
        return errorResponse('Invalid file type. Only PDF and images are allowed.', 400);
      }
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (f.size > maxSize) {
        return errorResponse('File too large. Maximum size is 10MB.', 400);
      }
    }

    let uploadDir: string;
    let appId: string | null = null;
    let docRequestId: number | null = null;
    let clientId: string | null = null;

    // First, check if this is a document request upload token
    if (token) {
      const docRequestResult = await query(
        `SELECT dr.*, c.client_id as client_code, a.application_id as app_code
         FROM document_requests dr
         LEFT JOIN clients c ON dr.client_id = c.id
         LEFT JOIN applications a ON dr.case_id = a.id
         WHERE dr.upload_token = $1 AND dr.status = 'pending'`,
        [token]
      );

      if (docRequestResult.rows.length > 0) {
        // This is a document request upload
        const docRequest = docRequestResult.rows[0];
        docRequestId = docRequest.id;
        clientId = docRequest.client_code;
        appId = docRequest.app_code;

        // Use client folder structure
        uploadDir = path.join(
          process.cwd(),
          'storage',
          'clients',
          docRequest.client_code,
          'requests',
          docRequest.request_id
        );
      } else {
        // Try application token
        const appResult = await query(
          `SELECT id, application_id, documents FROM applications WHERE token = $1`,
          [token]
        );

        if (appResult.rows.length === 0) {
          return errorResponse('Invalid token or application not found', 404);
        }

        const app = appResult.rows[0];
        appId = app.application_id;
        uploadDir = path.join(process.cwd(), 'storage', 'cases', app.application_id);
      }
    } else {
      // Application ID provided
      const appResult = await query(
        `SELECT id, application_id, documents FROM applications WHERE application_id = $1`,
        [applicationId]
      );

      if (appResult.rows.length === 0) {
        return errorResponse('Application not found', 404);
      }

      const app = appResult.rows[0];
      appId = app.application_id;
      uploadDir = path.join(process.cwd(), 'storage', 'cases', app.application_id);
    }

    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const fileToUpload of filesToProcess) {
      // Generate unique filename
      const ext = path.extname(fileToUpload.name);
      const filename = `${Date.now()}-${documentType || 'document'}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Save file
      const bytes = await fileToUpload.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      await writeFile(filepath, buffer);

      uploadedFiles.push({
        name: fileToUpload.name,
        filename,
        type: documentType || 'other',
        mimeType: fileToUpload.type,
        size: fileToUpload.size,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
      });
    }

    // Update application documents if we have an app
    if (appId && token) {
      const appResult = await query(
        `SELECT id, documents FROM applications WHERE application_id = $1 OR token = $2`,
        [appId, token]
      );

      if (appResult.rows.length > 0) {
        const app = appResult.rows[0];
        const documents = typeof app.documents === 'string'
          ? JSON.parse(app.documents)
          : app.documents || [];

        documents.push(...uploadedFiles);

        await query(
          `UPDATE applications SET documents = $1, updated_at = NOW() WHERE id = $2`,
          [JSON.stringify(documents), app.id]
        );
      }
    }

    // Update document request status if applicable
    if (docRequestId) {
      await query(
        `UPDATE document_requests 
         SET status = 'partially_completed', 
             uploaded_files = COALESCE(uploaded_files, '[]'::jsonb) || $1::jsonb,
             updated_at = NOW() 
         WHERE id = $2`,
        [JSON.stringify(uploadedFiles), docRequestId]
      );
    }

    await auditLog('file_uploaded', {
      applicationId: appId,
      documentRequestId: docRequestId,
      files: uploadedFiles.map(f => f.filename),
      type: documentType,
    }, undefined, ip, userAgent);

    return jsonResponse({
      success: true,
      message: uploadedFiles.length > 1 ? 'Files uploaded successfully' : 'File uploaded successfully',
      documents: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Upload failed', 500);
  }
}

// GET - List uploaded documents for a case
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const applicationId = searchParams.get('applicationId');

  if (!token && !applicationId) {
    return errorResponse('Token or application ID is required', 400);
  }

  try {
    let result;
    if (token) {
      result = await query(
        `SELECT documents FROM applications WHERE token = $1`,
        [token]
      );
    } else {
      result = await query(
        `SELECT documents FROM applications WHERE application_id = $1`,
        [applicationId]
      );
    }

    if (result.rows.length === 0) {
      return errorResponse('Application not found', 404);
    }

    const documents = typeof result.rows[0].documents === 'string'
      ? JSON.parse(result.rows[0].documents)
      : result.rows[0].documents || [];

    return jsonResponse({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Documents fetch error:', error);
    return errorResponse('Failed to fetch documents', 500);
  }
}
