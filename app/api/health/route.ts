import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Simple health check - test database connection
  let dbStatus = 'unknown';
  let dbError = null;
  
  try {
    const result = await pool.query('SELECT 1 as test');
    dbStatus = result.rows[0]?.test === 1 ? 'connected' : 'error';
  } catch (error: any) {
    dbStatus = 'error';
    dbError = error.message;
  }

  return NextResponse.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      error: dbError,
      hasUrl: !!process.env.DATABASE_URL,
    },
    nodeVersion: process.version,
  });
}
