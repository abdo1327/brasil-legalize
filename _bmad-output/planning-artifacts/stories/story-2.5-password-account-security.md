---
storyId: "2.5"
epicId: "2"
title: "Client Password Self-Set & Account Security"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - security
  - password
  - authentication
  - self-service
  - client-portal
functionalRequirements:
  - FR7
  - FR8
nonFunctionalRequirements:
  - NFR1
  - NFR2
  - NFR4
dependencies:
  - "2.1"
  - "2.2"
blockedBy:
  - "2.2"
blocks: []
---

# Story 2.5: Client Password Self-Set & Account Security

## User Story

**As a** client with a token link,
**I want** the option to set a password for easier future access,
**So that** I can log in directly without needing the email link every time.

---

## Story Description

While the token-link system provides passwordless access, some clients may prefer traditional password-based login for convenience. This story implements an optional password-setting feature that allows clients to create credentials while maintaining backward compatibility with token links.

The password system must be highly secure (Argon2ID hashing, strength requirements, brute-force protection) and optional - clients who prefer token-only access can continue using their links.

---

## Acceptance Criteria

### AC 2.5.1: Set Password Prompt

**Given** a client successfully accesses their portal via token
**When** they have not set a password yet
**Then** a subtle prompt appears:
  - Banner or card: "Want easier access? Set a password"
  - "Set Password" button
  - "Not now" dismissal option
  - Don't show again for 7 days after dismissal

**And** the prompt:
  - Does not block portal access
  - Is not intrusive
  - Can be permanently dismissed in settings

---

### AC 2.5.2: Set Password Page

**Given** a client clicks "Set Password"
**When** the password setup page loads
**Then** they see:

1. **Explanation:**
   - "Create a password for quicker access"
   - "Your token link will still work"
   - "Password is optional"

2. **Email Display:**
   - Their email address (read-only)
   - "This will be your login email"

3. **Password Fields:**
   - New password input (with show/hide toggle)
   - Confirm password input
   - Password strength indicator
   - Requirements list

4. **Submit Button:**
   - "Set Password"
   - Disabled until requirements met

---

### AC 2.5.3: Password Requirements

**Given** a client is setting a password
**When** they type in the password field
**Then** these requirements are enforced:

| Requirement | Rule | UI Feedback |
|-------------|------|-------------|
| Minimum length | At least 8 characters | ✓/✗ indicator |
| Maximum length | No more than 128 characters | Warning at limit |
| Number | At least 1 digit | ✓/✗ indicator |
| Uppercase | At least 1 uppercase letter | ✓/✗ indicator |
| Lowercase | At least 1 lowercase letter | ✓/✗ indicator |
| Special | At least 1 special character | ✓/✗ indicator |
| Not common | Not in top 10,000 passwords | ✓/✗ indicator |
| Not email | Doesn't contain email username | ✓/✗ indicator |

**And** visual feedback updates as they type

---

### AC 2.5.4: Password Strength Indicator

**Given** a client is typing a password
**When** the strength is evaluated
**Then** the indicator shows:

| Strength | Criteria | Color |
|----------|----------|-------|
| Weak | Meets minimum only | Red |
| Fair | Meets minimum + 2 extra | Orange |
| Good | Meets minimum + 4 extra | Yellow |
| Strong | All criteria + 12+ chars | Green |

**Strength Visual:**
```
Password Strength: [████████░░] Good
```

---

### AC 2.5.5: Password Confirmation

**Given** both password fields are filled
**When** they don't match
**Then**:
  - Error message: "Passwords do not match"
  - Submit button remains disabled
  - Visual indicator on confirm field

**Given** passwords match and meet requirements
**When** client clicks "Set Password"
**Then**:
  - Loading state shows
  - Password is hashed and stored
  - Success message displays
  - Redirect to portal dashboard

---

### AC 2.5.6: Password Storage - Argon2ID

**Given** a password is submitted
**When** it is stored in the database
**Then**:
  - Password is hashed using Argon2ID
  - Hash parameters: memory=64MB, time=3, parallelism=4
  - Salt is automatically included
  - Raw password is never logged or stored

**Implementation:**
```php
function hashPassword(string $password): string {
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536, // 64MB
        'time_cost' => 3,
        'threads' => 4,
    ]);
}

function verifyPassword(string $password, string $hash): bool {
    return password_verify($password, $hash);
}
```

---

### AC 2.5.7: Client Login Page

**Given** a client wants to log in with password
**When** they navigate to `/[locale]/login`
**Then** they see:

1. **Login Form:**
   - Email input
   - Password input (with show/hide)
   - "Remember me" checkbox
   - "Log In" button

2. **Alternative Options:**
   - "Forgot Password?" link
   - "Use your email link instead" option
   - "Don't have an account? Contact us"

---

### AC 2.5.8: Login Validation

**Given** a client submits the login form
**When** credentials are validated
**Then**:

| Scenario | Response |
|----------|----------|
| Email not found | Generic error: "Invalid email or password" |
| Password incorrect | Same generic error (no enumeration) |
| Account locked | "Account temporarily locked. Try again in X minutes" |
| Password not set | "Please use your email link to access" |
| Success | Redirect to dashboard |

**And** rate limiting is enforced (see AC 2.5.10)

---

### AC 2.5.9: Session After Login

**Given** a client logs in successfully
**When** session is created
**Then**:
  - Session stored in database (not just cookie)
  - Session expires after 4 hours of inactivity
  - "Remember me" extends to 30 days
  - Session can be invalidated server-side
  - Multiple sessions allowed (different devices)

**Session Data:**
```php
$session = [
    'session_id' => generateSecureId(),
    'client_id' => $clientId,
    'created_at' => now(),
    'expires_at' => now() + 4 hours,
    'ip_address' => $ip,
    'user_agent' => $ua,
    'remember_me' => $rememberMe,
];
```

---

### AC 2.5.10: Brute Force Protection

**Given** login attempts are being made
**When** too many failures occur
**Then**:

| Failures | Action |
|----------|--------|
| 3 | Add CAPTCHA requirement |
| 5 | Lock for 5 minutes |
| 10 | Lock for 30 minutes |
| 15+ | Lock for 24 hours |

**And**:
  - Rate limiting is per email, not just IP
  - Lockout notification email sent to client
  - Admin alerted on repeated lockouts
  - Successful login resets counter

---

### AC 2.5.11: Forgot Password Flow

**Given** a client clicks "Forgot Password"
**When** the page loads
**Then** they see:
  - Email input
  - "Send Reset Link" button
  - "Back to login" link

**Given** they submit a valid email
**When** processed
**Then**:
  - Reset token generated (48 chars, 1 hour expiry)
  - Email sent with reset link
  - Generic success: "If email exists, reset link sent"
  - No email enumeration possible

---

### AC 2.5.12: Password Reset Page

**Given** a client clicks the reset link
**When** the page loads
**Then**:
  - Token is validated
  - If valid: Show password reset form
  - If invalid/expired: Show error with "Request new link" option

**Reset Form:**
  - New password field (same requirements)
  - Confirm password field
  - Strength indicator
  - "Reset Password" button

**Given** password is reset
**Then**:
  - Old password hash replaced
  - All existing sessions invalidated
  - Client redirected to login
  - Confirmation email sent

---

### AC 2.5.13: Change Password (In Portal)

**Given** a client is logged in
**When** they go to Settings > Security
**Then** they can:
  - See "Change Password" option
  - Enter current password
  - Enter new password (with requirements)
  - Confirm new password
  - Submit change

**Given** change is successful
**Then**:
  - Password updated
  - Current session remains valid
  - Other sessions optionally invalidated
  - Confirmation message shown

---

### AC 2.5.14: Active Sessions Management

**Given** a client is logged in
**When** they view Settings > Security
**Then** they see:
  - List of active sessions
  - Current session highlighted
  - Device/browser info
  - IP address (masked partially)
  - Last activity time
  - "Log out" button per session
  - "Log out all other sessions" button

---

### AC 2.5.15: Token Link Still Works

**Given** a client has set a password
**When** they use their original token link
**Then**:
  - Token is still validated
  - They are logged into the portal
  - No password required
  - Token usage is logged

**And** having a password does NOT invalidate token links

---

### AC 2.5.16: Remove Password Option

**Given** a client has set a password
**When** they want to remove it
**Then** in Settings > Security:
  - "Remove Password" option visible
  - Requires current password confirmation
  - Warning: "You'll need to use email links"
  - Confirmation step

**Given** password is removed
**Then**:
  - Password hash deleted
  - Client can only access via token
  - Confirmation message shown

---

### AC 2.5.17: Localization

**Given** any password-related page is viewed
**When** in different locales
**Then** all text is translated:
  - Form labels
  - Password requirements
  - Error messages
  - Success messages
  - Email templates

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/[locale]/login/page.tsx` | Create | Client login page |
| `app/[locale]/case/[token]/settings/page.tsx` | Create | Settings page |
| `app/[locale]/forgot-password/page.tsx` | Create | Forgot password |
| `app/[locale]/reset-password/[token]/page.tsx` | Create | Reset password |
| `components/portal/SetPasswordPrompt.tsx` | Create | Password prompt |
| `components/portal/SetPasswordForm.tsx` | Create | Password form |
| `components/portal/PasswordStrength.tsx` | Create | Strength indicator |
| `components/portal/ActiveSessions.tsx` | Create | Sessions list |
| `lib/password.ts` | Create | Password utilities |
| `api/auth/login.php` | Create | Login endpoint |
| `api/auth/logout.php` | Create | Logout endpoint |
| `api/auth/set-password.php` | Create | Set password |
| `api/auth/forgot-password.php` | Create | Request reset |
| `api/auth/reset-password.php` | Create | Process reset |
| `api/auth/sessions.php` | Create | Manage sessions |

---

### Database Schema

```sql
-- Client credentials (optional password)
ALTER TABLE clients ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL;
ALTER TABLE clients ADD COLUMN password_set_at DATETIME DEFAULT NULL;
ALTER TABLE clients ADD COLUMN password_updated_at DATETIME DEFAULT NULL;

-- Login sessions
CREATE TABLE client_sessions (
    id VARCHAR(64) PRIMARY KEY,
    client_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_remember_me BOOLEAN DEFAULT FALSE,
    revoked_at DATETIME DEFAULT NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Login attempts (for rate limiting)
CREATE TABLE login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success BOOLEAN NOT NULL,
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_ip (ip_address),
    INDEX idx_attempted_at (attempted_at)
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token_hash (token_hash),
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

---

### Password Strength Component

```typescript
// components/portal/PasswordStrength.tsx
'use client';

import { useMemo } from 'react';
import { Locale, getTranslation } from '@/lib/i18n';
import { analyzePassword, PasswordAnalysis } from '@/lib/password';

interface PasswordStrengthProps {
  password: string;
  locale: Locale;
  email?: string;
}

export function PasswordStrength({ password, locale, email }: PasswordStrengthProps) {
  const t = (key: string) => getTranslation(locale, key);
  
  const analysis = useMemo(() => {
    return analyzePassword(password, email);
  }, [password, email]);
  
  const strengthConfig = {
    weak: { color: 'bg-red-500', text: t('password.weak'), width: '25%' },
    fair: { color: 'bg-orange-500', text: t('password.fair'), width: '50%' },
    good: { color: 'bg-yellow-500', text: t('password.good'), width: '75%' },
    strong: { color: 'bg-green-500', text: t('password.strong'), width: '100%' },
  };
  
  const config = strengthConfig[analysis.strength];
  
  const requirements = [
    { key: 'minLength', label: t('password.req.minLength'), met: analysis.checks.minLength },
    { key: 'hasUppercase', label: t('password.req.uppercase'), met: analysis.checks.hasUppercase },
    { key: 'hasLowercase', label: t('password.req.lowercase'), met: analysis.checks.hasLowercase },
    { key: 'hasNumber', label: t('password.req.number'), met: analysis.checks.hasNumber },
    { key: 'hasSpecial', label: t('password.req.special'), met: analysis.checks.hasSpecial },
    { key: 'notCommon', label: t('password.req.notCommon'), met: analysis.checks.notCommon },
    { key: 'notEmail', label: t('password.req.notEmail'), met: analysis.checks.notEmail },
  ];
  
  if (!password) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{t('password.strength')}</span>
          <span className={`font-medium ${
            analysis.strength === 'weak' ? 'text-red-600' :
            analysis.strength === 'fair' ? 'text-orange-600' :
            analysis.strength === 'good' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {config.text}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color} transition-all duration-300`}
            style={{ width: config.width }}
          />
        </div>
      </div>
      
      {/* Requirements List */}
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li
            key={req.key}
            className={`flex items-center gap-2 text-sm ${
              req.met ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {req.met ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Password Analysis Library

```typescript
// lib/password.ts

// Top common passwords to reject
const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  // ... extend with more common passwords
]);

export interface PasswordAnalysis {
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  checks: {
    minLength: boolean;
    maxLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    notCommon: boolean;
    notEmail: boolean;
  };
  valid: boolean;
}

export function analyzePassword(password: string, email?: string): PasswordAnalysis {
  const checks = {
    minLength: password.length >= 8,
    maxLength: password.length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>[\]\\\/`~\-_=+;']/.test(password),
    notCommon: !COMMON_PASSWORDS.has(password.toLowerCase()),
    notEmail: !email || !password.toLowerCase().includes(email.split('@')[0].toLowerCase()),
  };
  
  // Calculate score (0-100)
  let score = 0;
  
  // Base requirements (must have)
  if (checks.minLength) score += 10;
  if (checks.hasUppercase) score += 10;
  if (checks.hasLowercase) score += 10;
  if (checks.hasNumber) score += 10;
  if (checks.hasSpecial) score += 15;
  if (checks.notCommon) score += 15;
  if (checks.notEmail) score += 5;
  
  // Length bonus
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 5;
  
  // Determine strength
  let strength: PasswordAnalysis['strength'];
  if (score < 40) {
    strength = 'weak';
  } else if (score < 60) {
    strength = 'fair';
  } else if (score < 80) {
    strength = 'good';
  } else {
    strength = 'strong';
  }
  
  // Check validity (all requirements met)
  const valid = checks.minLength && checks.maxLength &&
    checks.hasUppercase && checks.hasLowercase &&
    checks.hasNumber && checks.hasSpecial &&
    checks.notCommon && checks.notEmail;
  
  return {
    strength,
    score,
    checks,
    valid,
  };
}

export function validatePasswords(
  password: string,
  confirmPassword: string,
  email?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const analysis = analyzePassword(password, email);
  
  if (!analysis.checks.minLength) {
    errors.push('Password must be at least 8 characters');
  }
  if (!analysis.checks.hasUppercase) {
    errors.push('Password must include an uppercase letter');
  }
  if (!analysis.checks.hasLowercase) {
    errors.push('Password must include a lowercase letter');
  }
  if (!analysis.checks.hasNumber) {
    errors.push('Password must include a number');
  }
  if (!analysis.checks.hasSpecial) {
    errors.push('Password must include a special character');
  }
  if (!analysis.checks.notCommon) {
    errors.push('Password is too common');
  }
  if (!analysis.checks.notEmail) {
    errors.push('Password cannot contain your email username');
  }
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

### PHP Authentication Service

```php
<?php
// api/lib/AuthService.php

namespace BrasilLegalize\Api\Lib;

use PDO;

class AuthService
{
    private PDO $db;
    private const SESSION_DURATION = 4 * 60 * 60; // 4 hours
    private const REMEMBER_DURATION = 30 * 24 * 60 * 60; // 30 days
    private const MAX_ATTEMPTS = 5;
    private const LOCKOUT_DURATION = 5 * 60; // 5 minutes
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
    
    /**
     * Set password for client
     */
    public function setPassword(int $clientId, string $password): bool
    {
        $hash = password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 3,
            'threads' => 4,
        ]);
        
        $stmt = $this->db->prepare('
            UPDATE clients 
            SET password_hash = :hash, password_set_at = NOW(), password_updated_at = NOW()
            WHERE id = :id
        ');
        
        return $stmt->execute(['hash' => $hash, 'id' => $clientId]);
    }
    
    /**
     * Attempt login with email and password
     */
    public function login(
        string $email,
        string $password,
        bool $rememberMe,
        string $ip,
        string $userAgent
    ): array {
        // Check rate limiting
        if ($this->isLockedOut($email, $ip)) {
            $remainingTime = $this->getLockoutTimeRemaining($email);
            return [
                'success' => false,
                'error' => 'locked_out',
                'message' => "Account temporarily locked. Try again in {$remainingTime} minutes.",
            ];
        }
        
        // Find client
        $stmt = $this->db->prepare('SELECT id, password_hash, name, email FROM clients WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$client || !$client['password_hash']) {
            $this->recordLoginAttempt($email, $ip, false);
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
            ];
        }
        
        // Verify password
        if (!password_verify($password, $client['password_hash'])) {
            $this->recordLoginAttempt($email, $ip, false);
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
            ];
        }
        
        // Successful login
        $this->recordLoginAttempt($email, $ip, true);
        
        // Create session
        $sessionId = $this->createSession($client['id'], $rememberMe, $ip, $userAgent);
        
        return [
            'success' => true,
            'session_id' => $sessionId,
            'client' => [
                'id' => $client['id'],
                'name' => $client['name'],
                'email' => $client['email'],
            ],
            'expires_at' => date('c', time() + ($rememberMe ? self::REMEMBER_DURATION : self::SESSION_DURATION)),
        ];
    }
    
    /**
     * Validate session
     */
    public function validateSession(string $sessionId): ?array
    {
        $stmt = $this->db->prepare('
            SELECT s.*, c.id as client_id, c.name, c.email
            FROM client_sessions s
            JOIN clients c ON c.id = s.client_id
            WHERE s.id = :id AND s.expires_at > NOW() AND s.revoked_at IS NULL
        ');
        $stmt->execute(['id' => $sessionId]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session) {
            return null;
        }
        
        // Update last activity
        $this->db->prepare('UPDATE client_sessions SET last_activity_at = NOW() WHERE id = :id')
            ->execute(['id' => $sessionId]);
        
        return [
            'client_id' => $session['client_id'],
            'name' => $session['name'],
            'email' => $session['email'],
        ];
    }
    
    /**
     * Create session
     */
    private function createSession(int $clientId, bool $rememberMe, string $ip, string $ua): string
    {
        $sessionId = bin2hex(random_bytes(32));
        $duration = $rememberMe ? self::REMEMBER_DURATION : self::SESSION_DURATION;
        
        $stmt = $this->db->prepare('
            INSERT INTO client_sessions (id, client_id, expires_at, ip_address, user_agent, is_remember_me)
            VALUES (:id, :client_id, :expires_at, :ip, :ua, :remember)
        ');
        
        $stmt->execute([
            'id' => $sessionId,
            'client_id' => $clientId,
            'expires_at' => date('Y-m-d H:i:s', time() + $duration),
            'ip' => $ip,
            'ua' => $ua,
            'remember' => $rememberMe ? 1 : 0,
        ]);
        
        return $sessionId;
    }
    
    /**
     * Logout (revoke session)
     */
    public function logout(string $sessionId): bool
    {
        $stmt = $this->db->prepare('UPDATE client_sessions SET revoked_at = NOW() WHERE id = :id');
        return $stmt->execute(['id' => $sessionId]);
    }
    
    /**
     * Get active sessions for client
     */
    public function getActiveSessions(int $clientId): array
    {
        $stmt = $this->db->prepare('
            SELECT id, created_at, last_activity_at, ip_address, user_agent, is_remember_me
            FROM client_sessions
            WHERE client_id = :client_id AND expires_at > NOW() AND revoked_at IS NULL
            ORDER BY last_activity_at DESC
        ');
        $stmt->execute(['client_id' => $clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Revoke all sessions except current
     */
    public function revokeOtherSessions(int $clientId, string $currentSessionId): int
    {
        $stmt = $this->db->prepare('
            UPDATE client_sessions 
            SET revoked_at = NOW() 
            WHERE client_id = :client_id AND id != :current_id AND revoked_at IS NULL
        ');
        $stmt->execute(['client_id' => $clientId, 'current_id' => $currentSessionId]);
        return $stmt->rowCount();
    }
    
    /**
     * Check if locked out
     */
    private function isLockedOut(string $email, string $ip): bool
    {
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as attempts
            FROM login_attempts
            WHERE email = :email AND success = 0 AND attempted_at > DATE_SUB(NOW(), INTERVAL :duration SECOND)
        ');
        $stmt->execute(['email' => $email, 'duration' => self::LOCKOUT_DURATION]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result['attempts'] >= self::MAX_ATTEMPTS;
    }
    
    /**
     * Get lockout time remaining
     */
    private function getLockoutTimeRemaining(string $email): int
    {
        $stmt = $this->db->prepare('
            SELECT MIN(TIMESTAMPDIFF(SECOND, attempted_at, DATE_ADD(attempted_at, INTERVAL :duration SECOND))) as remaining
            FROM login_attempts
            WHERE email = :email AND success = 0 AND attempted_at > DATE_SUB(NOW(), INTERVAL :duration2 SECOND)
            ORDER BY attempted_at DESC
            LIMIT 1
        ');
        $stmt->execute(['email' => $email, 'duration' => self::LOCKOUT_DURATION, 'duration2' => self::LOCKOUT_DURATION]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return ceil(($result['remaining'] ?? 0) / 60);
    }
    
    /**
     * Record login attempt
     */
    private function recordLoginAttempt(string $email, string $ip, bool $success): void
    {
        $stmt = $this->db->prepare('
            INSERT INTO login_attempts (email, ip_address, success)
            VALUES (:email, :ip, :success)
        ');
        $stmt->execute(['email' => $email, 'ip' => $ip, 'success' => $success ? 1 : 0]);
        
        // Clear old attempts on success
        if ($success) {
            $this->db->prepare('DELETE FROM login_attempts WHERE email = :email')
                ->execute(['email' => $email]);
        }
    }
}
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `password-strength-weak` | Short password | Weak strength |
| `password-strength-strong` | Long complex password | Strong strength |
| `password-common` | "password123" | Fails notCommon |
| `password-has-email` | Contains email part | Fails notEmail |
| `hash-verify` | Hash and verify password | Matches |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `set-password` | Store password hash | Hash stored |
| `login-success` | Valid credentials | Session created |
| `login-fail` | Wrong password | Error returned |
| `session-valid` | Valid session ID | Client returned |
| `session-expired` | Expired session | Null returned |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-set-password` | Set password via UI | Password works |
| `login-via-form` | Login page login | Dashboard shown |
| `forgot-password` | Request and use reset | Password changed |
| `lockout` | 5 failed attempts | Account locked |
| `session-management` | View and revoke sessions | Sessions updated |

---

## Edge Cases and Error Handling

### Edge Case 1: Token Access After Password Set
- **Scenario:** Client set password, then uses token link
- **Handling:** Token still works, creates session
- **User Impact:** Both methods work

### Edge Case 2: Password Reset While Logged In
- **Scenario:** Reset password link used while session active
- **Handling:** All sessions invalidated, must log in fresh
- **User Impact:** Clear communication

### Edge Case 3: Concurrent Login Attempts
- **Scenario:** Multiple login attempts same time
- **Handling:** Database-level locking on rate limit
- **User Impact:** One succeeds, others may be rate limited

### Edge Case 4: Very Long Password
- **Scenario:** User pastes 500 character password
- **Handling:** Truncate at 128, show warning
- **User Impact:** Informed of limit

---

## Security Considerations

1. **Argon2ID:** Memory-hard algorithm resistant to GPU attacks
2. **No Password Enumeration:** Same error for "no user" and "wrong password"
3. **Brute Force Protection:** Exponential lockout
4. **Session Security:** Server-side sessions, not just JWT
5. **Password Reset:** Single-use tokens, 1 hour expiry
6. **Session Invalidation:** Ability to revoke all sessions

---

## Definition of Done

- [ ] Set password prompt appears
- [ ] Set password form works
- [ ] Password requirements enforced
- [ ] Strength indicator accurate
- [ ] Argon2ID hashing used
- [ ] Login page works
- [ ] Brute force protection active
- [ ] Forgot password flow works
- [ ] Password reset works
- [ ] Sessions are created properly
- [ ] Sessions can be revoked
- [ ] Token links still work with password
- [ ] Change password works
- [ ] Remove password option works
- [ ] All locales supported
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security review complete
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

