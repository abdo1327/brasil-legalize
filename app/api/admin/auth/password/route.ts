import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import * as argon2 from 'argon2';

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin from session
    const sessionResult = await query(
      `SELECT a.id, a.password_hash 
       FROM admin_sessions s 
       JOIN admins a ON s.admin_id = a.id 
       WHERE s.id = $1 AND s.expires_at > NOW() AND s.revoked_at IS NULL`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }

    const admin = sessionResult.rows[0];
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Both current and new password are required' }, { status: 400 });
    }

    // Verify current password
    const isValid = await argon2.verify(admin.password_hash, currentPassword);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    // Hash new password
    const newHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Update password
    await query(
      `UPDATE admins SET password_hash = $1, password_changed_at = NOW(), updated_at = NOW() WHERE id = $2`,
      [newHash, admin.id]
    );

    // Log the action
    try {
      await query(
        `INSERT INTO admin_audit_log (admin_id, action, resource_type, details) VALUES ($1, $2, $3, $4)`,
        [admin.id, 'password_changed', 'admin', JSON.stringify({ admin_id: admin.id })]
      );
    } catch (auditError) {
      console.error('Failed to log password change:', auditError);
    }

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 });
  }
}
