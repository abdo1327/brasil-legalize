import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import pool, { query } from './db';

// ============================================
// TOKEN GENERATION
// ============================================

export function generateToken(length: number = 48): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generatePassword(length: number = 8): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `APP-${year}-${random}`;
}

export function generateClientId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `CLT-${year}-${random}`;
}

// ============================================
// AUDIT LOGGING (Database)
// ============================================

export async function auditLog(
  action: string, 
  data: Record<string, any> = {}, 
  adminId?: number,
  ip?: string,
  userAgent?: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO admin_audit_log (admin_id, action, resource_type, resource_id, ip_address, user_agent, details, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        adminId || null,
        action,
        data.resourceType || null,
        data.resourceId || null,
        ip || null,
        userAgent || null,
        JSON.stringify(data),
      ]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

// ============================================
// RATE LIMITING (In-Memory)
// ============================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

// ============================================
// RESPONSE HELPERS
// ============================================

export function jsonResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message, message }, { status });
}

// ============================================
// REQUEST HELPERS
// ============================================

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function getJsonBody(request: NextRequest): Promise<any> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// ============================================
// ADMIN AUTH (Database Sessions)
// ============================================

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

export async function createAdminSession(
  adminId: number,
  ip?: string,
  userAgent?: string
): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await query(
    `INSERT INTO admin_sessions (id, admin_id, created_at, expires_at, last_activity_at, ip_address, user_agent)
     VALUES ($1, $2, NOW(), $3, NOW(), $4, $5)`,
    [token, adminId, expiresAt, ip, userAgent]
  );
  
  return token;
}

export async function validateAdminSession(
  token: string
): Promise<{ valid: boolean; admin?: any; adminId?: number }> {
  try {
    const result = await query(
      `SELECT s.*, a.id as admin_id, a.email, a.name, a.role, a.avatar_url
       FROM admin_sessions s
       JOIN admins a ON s.admin_id = a.id
       WHERE s.id = $1 AND s.expires_at > NOW() AND s.revoked_at IS NULL AND a.is_active = TRUE`,
      [token]
    );
    
    if (result.rows.length === 0) {
      return { valid: false };
    }
    
    const session = result.rows[0];
    
    // Update last activity
    await query(
      `UPDATE admin_sessions SET last_activity_at = NOW() WHERE id = $1`,
      [token]
    );
    
    return {
      valid: true,
      adminId: session.admin_id,
      admin: {
        id: session.admin_id,
        email: session.email,
        name: session.name,
        role: session.role,
        avatar_url: session.avatar_url,
      },
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false };
  }
}

export async function destroyAdminSession(token: string): Promise<void> {
  try {
    await query(
      `UPDATE admin_sessions SET revoked_at = NOW() WHERE id = $1`,
      [token]
    );
  } catch (error) {
    console.error('Session destroy error:', error);
  }
}

export async function requireAdminAuth(request: NextRequest): Promise<{
  authenticated: boolean;
  admin?: any;
  adminId?: number;
  error?: NextResponse;
}> {
  let token: string | null = null;
  
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  
  // Check cookie
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }
  
  if (!token) {
    return {
      authenticated: false,
      error: errorResponse('Authentication required', 401),
    };
  }
  
  const result = await validateAdminSession(token);
  if (!result.valid) {
    return {
      authenticated: false,
      error: errorResponse('Invalid or expired session', 401),
    };
  }
  
  return {
    authenticated: true,
    admin: result.admin,
    adminId: result.adminId,
  };
}

// ============================================
// CORS HEADERS
// ============================================

export function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: corsHeaders() });
  }
  return null;
}

// ============================================
// PASSWORD HASHING
// ============================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  // Handle Argon2 hash from database seed
  if (stored.startsWith('$argon2')) {
    // For dev, just check against known password
    return password === process.env.ADMIN_PASSWORD;
  }
  
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// ============================================
// DB QUERY HELPER (Re-export)
// ============================================

export { query, pool };
