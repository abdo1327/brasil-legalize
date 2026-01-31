import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { jsonResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const storageDir = path.join(process.cwd(), 'storage', 'data');
  const storageExists = fs.existsSync(storageDir);

  // Check if data files are accessible
  let dataFilesStatus = 'ok';
  try {
    if (!storageExists) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    // Test write
    const testFile = path.join(storageDir, '.health-check');
    fs.writeFileSync(testFile, Date.now().toString());
    fs.unlinkSync(testFile);
  } catch (error) {
    dataFilesStatus = 'error: ' + String(error);
  }

  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      storage: dataFilesStatus,
      nodeVersion: process.version,
    },
    endpoints: {
      leads: '/api/leads',
      tokens: '/api/tokens',
      status: '/api/status',
      upload: '/api/upload',
      pricing: '/api/pricing',
      consent: '/api/consent',
      notify: '/api/notify',
      audit: '/api/audit',
      admin: {
        login: '/api/admin/auth/login',
        logout: '/api/admin/auth/logout',
        session: '/api/admin/auth/session',
        cases: '/api/admin/cases',
        clients: '/api/client/clients',
      },
    },
  });
}
