<?php
/**
 * Admin Authentication Service
 * Handles login, logout, session management, and role-based access
 */

namespace BrasilLegalize\Api\Lib;

use PDO;

class AdminAuthService
{
    private PDO $db;
    
    // Session configuration
    private const SESSION_DURATION = 4 * 60 * 60; // 4 hours
    private const REMEMBER_DURATION = 7 * 24 * 60 * 60; // 7 days
    private const MAX_CONCURRENT_SESSIONS = 3;
    
    // Rate limiting thresholds
    private const CAPTCHA_THRESHOLD = 3;
    private const LOCKOUT_1_THRESHOLD = 5;
    private const LOCKOUT_2_THRESHOLD = 10;
    private const LOCKOUT_3_THRESHOLD = 15;
    
    private const LOCKOUT_1_DURATION = 15 * 60;    // 15 minutes
    private const LOCKOUT_2_DURATION = 60 * 60;    // 1 hour
    private const LOCKOUT_3_DURATION = 24 * 60 * 60; // 24 hours
    
    // Role permissions
    private const ROLE_PERMISSIONS = [
        'super_admin' => ['*'],
        'admin' => [
            'dashboard.view',
            'clients.view', 'clients.create', 'clients.update',
            'cases.view', 'cases.create', 'cases.update',
            'documents.view', 'documents.download',
            'messages.view', 'messages.send',
            'pricing.view', 'pricing.update',
            'reports.view', 'reports.export',
        ],
        'support' => [
            'dashboard.view',
            'clients.view',
            'cases.view',
            'documents.view',
            'messages.view', 'messages.send',
        ],
        'finance' => [
            'dashboard.view',
            'pricing.view',
            'reports.view', 'reports.export',
        ],
    ];
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
    
    /**
     * Attempt admin login
     */
    public function login(string $email, string $password, bool $rememberMe, string $ip, string $userAgent): array
    {
        // Check rate limiting
        $rateLimitResult = $this->checkRateLimit($email, $ip);
        if ($rateLimitResult['blocked']) {
            return [
                'success' => false,
                'error' => 'rate_limited',
                'message' => $rateLimitResult['message'],
                'lockout_minutes' => $rateLimitResult['lockout_minutes'] ?? 0,
            ];
        }
        
        // Find admin
        $stmt = $this->db->prepare('
            SELECT id, email, password_hash, name, role, avatar_url, is_active
            FROM admins WHERE LOWER(email) = LOWER(:email)
        ');
        $stmt->execute(['email' => $email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin || !$admin['is_active']) {
            $this->recordLoginAttempt($email, $ip, false, 'user_not_found');
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
                'requires_captcha' => $rateLimitResult['requires_captcha'] ?? false,
            ];
        }
        
        // Verify password
        if (!password_verify($password, $admin['password_hash'])) {
            $this->recordLoginAttempt($email, $ip, false, 'wrong_password');
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
                'requires_captcha' => $rateLimitResult['requires_captcha'] ?? false,
            ];
        }
        
        // Successful login
        $this->recordLoginAttempt($email, $ip, true, null);
        
        // Enforce max concurrent sessions
        $this->enforceMaxSessions($admin['id']);
        
        // Create session
        $sessionId = $this->createSession($admin['id'], $rememberMe, $ip, $userAgent);
        
        // Update last login
        $this->db->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = :id')
            ->execute(['id' => $admin['id']]);
        
        // Log audit
        $this->logAudit($admin['id'], 'login', null, null, $ip, $userAgent);
        
        return [
            'success' => true,
            'session_id' => $sessionId,
            'admin' => [
                'id' => (int)$admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name'],
                'role' => $admin['role'],
                'avatar_url' => $admin['avatar_url'],
            ],
            'permissions' => $this->getPermissionsForRole($admin['role']),
            'expires_at' => date('c', time() + ($rememberMe ? self::REMEMBER_DURATION : self::SESSION_DURATION)),
        ];
    }
    
    /**
     * Validate existing session
     */
    public function validateSession(string $sessionId): ?array
    {
        $stmt = $this->db->prepare('
            SELECT s.*, a.id as admin_id, a.email, a.name, a.role, a.avatar_url, a.is_active
            FROM admin_sessions s
            JOIN admins a ON a.id = s.admin_id
            WHERE s.id = :id AND s.expires_at > NOW() AND s.revoked_at IS NULL
        ');
        $stmt->execute(['id' => $sessionId]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session || !$session['is_active']) {
            return null;
        }
        
        // Update last activity
        $this->db->prepare('UPDATE admin_sessions SET last_activity_at = NOW() WHERE id = :id')
            ->execute(['id' => $sessionId]);
        
        return [
            'session_id' => $sessionId,
            'admin' => [
                'id' => (int)$session['admin_id'],
                'email' => $session['email'],
                'name' => $session['name'],
                'role' => $session['role'],
                'avatar_url' => $session['avatar_url'],
            ],
            'permissions' => $this->getPermissionsForRole($session['role']),
        ];
    }
    
    /**
     * Logout - revoke session
     */
    public function logout(string $sessionId, int $adminId, string $ip, string $userAgent): bool
    {
        $stmt = $this->db->prepare('UPDATE admin_sessions SET revoked_at = NOW() WHERE id = :id');
        $result = $stmt->execute(['id' => $sessionId]);
        
        $this->logAudit($adminId, 'logout', null, null, $ip, $userAgent);
        
        return $result;
    }
    
    /**
     * Get permissions for a role
     */
    public function getPermissionsForRole(string $role): array
    {
        return self::ROLE_PERMISSIONS[$role] ?? [];
    }
    
    /**
     * Check if admin has specific permission
     */
    public function hasPermission(string $role, string $permission): bool
    {
        $permissions = $this->getPermissionsForRole($role);
        
        // Super admin has all permissions
        if (in_array('*', $permissions)) {
            return true;
        }
        
        return in_array($permission, $permissions);
    }
    
    /**
     * Hash password using Argon2ID
     */
    public function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 3,
            'threads' => 4,
        ]);
    }
    
    /**
     * Change password
     */
    public function changePassword(int $adminId, string $currentPassword, string $newPassword): array
    {
        // Get current hash
        $stmt = $this->db->prepare('SELECT password_hash FROM admins WHERE id = :id');
        $stmt->execute(['id' => $adminId]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin) {
            return ['success' => false, 'error' => 'Admin not found'];
        }
        
        // Verify current password
        if (!password_verify($currentPassword, $admin['password_hash'])) {
            return ['success' => false, 'error' => 'Current password is incorrect'];
        }
        
        // Update password
        $newHash = $this->hashPassword($newPassword);
        $stmt = $this->db->prepare('
            UPDATE admins SET password_hash = :hash, password_changed_at = NOW(), updated_at = NOW()
            WHERE id = :id
        ');
        $stmt->execute(['hash' => $newHash, 'id' => $adminId]);
        
        return ['success' => true];
    }
    
    /**
     * Log audit event
     */
    public function logAudit(
        int $adminId,
        string $action,
        ?string $resourceType = null,
        ?int $resourceId = null,
        ?string $ip = null,
        ?string $userAgent = null,
        ?array $details = null
    ): void {
        $stmt = $this->db->prepare('
            INSERT INTO admin_audit_log (admin_id, action, resource_type, resource_id, ip_address, user_agent, details)
            VALUES (:admin_id, :action, :resource_type, :resource_id, :ip, :ua, :details)
        ');
        $stmt->execute([
            'admin_id' => $adminId,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'ip' => $ip,
            'ua' => $userAgent,
            'details' => $details ? json_encode($details) : null,
        ]);
    }
    
    /**
     * Get active sessions for admin
     */
    public function getActiveSessions(int $adminId): array
    {
        $stmt = $this->db->prepare('
            SELECT id, created_at, last_activity_at, ip_address, user_agent, device_trusted
            FROM admin_sessions
            WHERE admin_id = :admin_id AND expires_at > NOW() AND revoked_at IS NULL
            ORDER BY last_activity_at DESC
        ');
        $stmt->execute(['admin_id' => $adminId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Revoke specific session
     */
    public function revokeSession(string $sessionId, int $adminId): bool
    {
        $stmt = $this->db->prepare('
            UPDATE admin_sessions SET revoked_at = NOW()
            WHERE id = :id AND admin_id = :admin_id
        ');
        return $stmt->execute(['id' => $sessionId, 'admin_id' => $adminId]);
    }
    
    /**
     * Revoke all sessions except current
     */
    public function revokeOtherSessions(int $adminId, string $currentSessionId): int
    {
        $stmt = $this->db->prepare('
            UPDATE admin_sessions 
            SET revoked_at = NOW() 
            WHERE admin_id = :admin_id AND id != :current_id AND revoked_at IS NULL
        ');
        $stmt->execute(['admin_id' => $adminId, 'current_id' => $currentSessionId]);
        return $stmt->rowCount();
    }
    
    // ========== Private Helper Methods ==========
    
    private function createSession(int $adminId, bool $rememberMe, string $ip, string $ua): string
    {
        $sessionId = bin2hex(random_bytes(32));
        $duration = $rememberMe ? self::REMEMBER_DURATION : self::SESSION_DURATION;
        
        $stmt = $this->db->prepare('
            INSERT INTO admin_sessions (id, admin_id, expires_at, ip_address, user_agent, device_trusted)
            VALUES (:id, :admin_id, :expires_at, :ip, :ua, :trusted)
        ');
        
        // Use database-agnostic date format
        $expiresAt = date('Y-m-d H:i:s', time() + $duration);
        
        $stmt->execute([
            'id' => $sessionId,
            'admin_id' => $adminId,
            'expires_at' => $expiresAt,
            'ip' => $ip,
            'ua' => $ua,
            'trusted' => $rememberMe ? 1 : 0,
        ]);
        
        return $sessionId;
    }
    
    private function enforceMaxSessions(int $adminId): void
    {
        // Get active session count
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as count FROM admin_sessions
            WHERE admin_id = :admin_id AND expires_at > NOW() AND revoked_at IS NULL
        ');
        $stmt->execute(['admin_id' => $adminId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] >= self::MAX_CONCURRENT_SESSIONS) {
            // Revoke oldest session
            $stmt = $this->db->prepare('
                UPDATE admin_sessions SET revoked_at = NOW()
                WHERE admin_id = :admin_id AND revoked_at IS NULL
                ORDER BY created_at ASC
                LIMIT 1
            ');
            $stmt->execute(['admin_id' => $adminId]);
        }
    }
    
    private function checkRateLimit(string $email, string $ip): array
    {
        // Count recent failed attempts
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as attempts FROM admin_login_attempts
            WHERE email = :email AND success = FALSE
            AND attempted_at > NOW() - INTERVAL \'1 hour\'
        ');
        $stmt->execute(['email' => strtolower($email)]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $attempts = (int)$result['attempts'];
        
        // Check lockout levels
        if ($attempts >= self::LOCKOUT_3_THRESHOLD) {
            return [
                'blocked' => true,
                'message' => 'Account locked for 24 hours due to too many failed attempts.',
                'lockout_minutes' => ceil(self::LOCKOUT_3_DURATION / 60),
            ];
        }
        
        if ($attempts >= self::LOCKOUT_2_THRESHOLD) {
            return [
                'blocked' => true,
                'message' => 'Account locked for 1 hour due to too many failed attempts.',
                'lockout_minutes' => ceil(self::LOCKOUT_2_DURATION / 60),
            ];
        }
        
        if ($attempts >= self::LOCKOUT_1_THRESHOLD) {
            return [
                'blocked' => true,
                'message' => 'Account locked for 15 minutes due to too many failed attempts.',
                'lockout_minutes' => ceil(self::LOCKOUT_1_DURATION / 60),
            ];
        }
        
        return [
            'blocked' => false,
            'requires_captcha' => $attempts >= self::CAPTCHA_THRESHOLD,
        ];
    }
    
    private function recordLoginAttempt(string $email, string $ip, bool $success, ?string $reason): void
    {
        $stmt = $this->db->prepare('
            INSERT INTO admin_login_attempts (email, ip_address, success, failure_reason)
            VALUES (:email, :ip, :success, :reason)
        ');
        $stmt->execute([
            'email' => strtolower($email),
            'ip' => $ip,
            'success' => $success ? 1 : 0,
            'reason' => $reason,
        ]);
        
        // Clear old attempts on success
        if ($success) {
            $this->db->prepare('DELETE FROM admin_login_attempts WHERE email = :email')
                ->execute(['email' => strtolower($email)]);
        }
    }
}
