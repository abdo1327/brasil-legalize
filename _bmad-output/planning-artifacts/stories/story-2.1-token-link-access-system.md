---
storyId: "2.1"
epicId: "2"
title: "Token-Link Generation & Access System"
status: "ready"
priority: "critical"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-31"
completedAt: null
tags:
  - token
  - security
  - email
  - backend
  - php
  - resend
functionalRequirements:
  - FR7
  - FR8
nonFunctionalRequirements:
  - NFR1
  - NFR2
  - NFR4
  - NFR8
dependencies:
  - "3.3"
blockedBy:
  - "3.3"
blocks:
  - "2.2"
  - "2.3"
---

# Story 2.1: Token-Link Generation & Access System

## User Story

**As an** admin user,
**I want** the system to generate secure token links when payment is confirmed,
**So that** clients can access their application tracker with a link + password combination.

---

## Story Description

This story implements the token-link system that grants clients access to their Application Tracker. Unlike traditional username/password systems, clients receive:

1. **Token Link** - Automatically emailed when payment is confirmed
2. **Access Password** - Sent separately by admin via email/WhatsApp

This two-factor approach:
- Eliminates the need for client account creation
- Provides security through link + password combination
- Allows admin control over when access is granted
- Integrates with the application workflow (Story 3.3)

### Key Integration Points

- **Triggered By**: Payment confirmation in Story 3.3
- **Sends Via**: Resend API for reliable email delivery
- **Password Delivery**: Manual by admin (email/WhatsApp)

---

## Acceptance Criteria

### AC 2.1.1: Token Generation on Payment Confirmation

**Given** an admin confirms payment for a Potential Client
**When** status changes to `payment_received`
**Then**:
  - Application record is created
  - Application ID is generated (APP-YYYY-NNNNN)
  - Token is generated (48 hex chars, 192 bits entropy)
  - Token is hashed and stored
  - Token link email is sent via Resend
  - Admin is prompted to send password separately

**Automatic Flow:**
```
Admin confirms payment
    → Application created
    → Token generated
    → Email sent with link
    → Admin notification: "Send password to client"
```

---

### AC 2.1.2: Token Generation - Cryptographic Security

**Given** a token needs to be generated
**When** the token is created
**Then**:
  - Uses `random_bytes(24)` for 192 bits entropy
  - Results in 48 hexadecimal characters
  - Is checked for uniqueness against existing tokens
  - Is generated server-side only

```php
function generateToken(): string {
    return bin2hex(random_bytes(24)); // 48 hex chars
}
```

---

### AC 2.1.3: Token Storage - Secure Hashing

**Given** a token has been generated
**When** it is stored
**Then**:
  - Raw token is NEVER stored
  - Token is hashed using SHA-256
  - First 8 chars stored as prefix for lookup
  - Hash stored in `token_hash` column

```sql
CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL UNIQUE,
    
    -- Token data (hashed)
    token_prefix CHAR(8) NOT NULL,
    token_hash CHAR(64) NOT NULL,
    
    -- Password tracking
    password_hash CHAR(60),  -- bcrypt hash
    password_set_at DATETIME,
    
    -- Expiry & Usage
    expires_at DATETIME NOT NULL,
    last_used_at DATETIME,
    use_count INT DEFAULT 0,
    
    -- Revocation
    revoked_at DATETIME,
    revoked_by INT,
    revoke_reason VARCHAR(255),
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    
    INDEX idx_prefix (token_prefix),
    INDEX idx_application (application_id),
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (created_by) REFERENCES admins(id),
    FOREIGN KEY (revoked_by) REFERENCES admins(id)
);
```

---

### AC 2.1.4: Access Password Generation

**Given** a token link is created
**When** admin needs to send password
**Then**:
  - System generates a random 8-character password
  - Password contains: uppercase, lowercase, numbers
  - Password is displayed ONCE to admin
  - Password is hashed (bcrypt) and stored
  - Admin copies password to send via email/WhatsApp

**Password Format:** `A3b7X9kM` (8 chars, mixed case + numbers)

```php
function generatePassword(): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    $password = '';
    for ($i = 0; $i < 8; $i++) {
        $password .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $password;
}
```

---

### AC 2.1.5: Token Link URL Format

**Given** a token is generated
**When** the link is created
**Then** the URL format is:

```
https://app.brasillegalize.com/{locale}/track/{token}
```

**Examples:**
```
https://app.brasillegalize.com/en/track/a1b2c3d4e5f6...
https://app.brasillegalize.com/pt-br/track/a1b2c3d4e5f6...
https://app.brasillegalize.com/ar/track/a1b2c3d4e5f6...
```

**Note:** URL uses `/track/` not `/case/` to reflect the tracker nature.

---

### AC 2.1.6: Token Link Email (via Resend)

**Given** payment is confirmed
**When** token link email is sent
**Then** the email contains:

1. **Subject Line (localized):**
   - EN: "Access Your Brasil Legalize Application Tracker"
   - PT-BR: "Acesse Seu Rastreador de Aplicação - Brasil Legalize"
   - ES: "Acceda a Su Rastreador de Aplicación - Brasil Legalize"
   - AR: "تتبع طلبك - براسيل ليغالايز"

2. **Email Body:**
   - Brasil Legalize logo
   - Personalized greeting
   - Application ID
   - Explanation that this is their tracker link
   - **Large CTA button with link**
   - Note: "You will receive your access password separately"
   - Expiry date (180 days)
   - Security warning (don't share)
   - Contact information

3. **Design:**
   - Brand colors: #004956 (Deep Teal), #00A19D (Bright Teal), #F4C542 (Golden Yellow)
   - Mobile-responsive
   - Plain text fallback

**Email Template:**
```html
Subject: Access Your Brasil Legalize Application Tracker

Hi {clientName},

Welcome to Brasil Legalize! Your payment has been confirmed and your 
application is now being processed.

Application ID: {applicationId}

Track your application progress using the link below:

[Access My Tracker →]

IMPORTANT: You will receive your access password separately via 
email or WhatsApp from your advisor.

This link expires on {expiryDate}.

Questions? Contact us at contact@brasillegalize.com

Best regards,
Brasil Legalize Team
```

---

### AC 2.1.7: Password Delivery Tracking

**Given** admin needs to send password
**When** admin views the application
**Then** they see:

```
┌─────────────────────────────────────────────────┐
│  🔐 Client Access                               │
├─────────────────────────────────────────────────┤
│  Token Link: ✅ Sent on Jan 30, 2026            │
│                                                 │
│  Access Password: ⚠️ NOT SENT                   │
│                                                 │
│  Password: ••••••••  [Show] [Copy] [Regenerate] │
│                                                 │
│  [ ] Mark as sent via:                          │
│      ○ Email    ○ WhatsApp                      │
│                                                 │
│  [Confirm Password Sent]                        │
└─────────────────────────────────────────────────┘
```

**After marking sent:**
```
│  Access Password: ✅ Sent via WhatsApp          │
│                   on Jan 30, 2026 by Admin1     │
```

---

### AC 2.1.8: Token + Password Validation

**Given** a client accesses their tracker link
**When** they enter their password
**Then**:

1. **Token Validation:**
   - Extract prefix (first 8 chars)
   - Find token by prefix
   - Hash full token and compare
   - Check not expired
   - Check not revoked

2. **Password Validation:**
   - Verify against bcrypt hash
   - Max 5 attempts before lockout
   - 15-minute lockout on failure

3. **On Success:**
   - Create session (4 hours)
   - Update `last_used_at`
   - Increment `use_count`
   - Log access

4. **On Failure:**
   - Log failed attempt
   - Show appropriate error

**Validation Response:**
```php
// Success
[
    'valid' => true,
    'application_id' => 42,
    'client' => [
        'name' => 'João Silva',
        'email' => 'joao@example.com',
        'locale' => 'pt-br',
    ],
    'application' => [
        'id' => 'APP-2026-00042',
        'status' => 'documents_pending',
        'service_type' => 'Brazilian Citizenship',
    ],
    'session_expires' => '2026-01-30T18:00:00Z',
]

// Failures
['valid' => false, 'error' => 'invalid_token']
['valid' => false, 'error' => 'expired']
['valid' => false, 'error' => 'revoked']
['valid' => false, 'error' => 'invalid_password']
['valid' => false, 'error' => 'locked_out', 'unlock_at' => '...']
```

---

### AC 2.1.9: Token Expiration

**Given** a token is created
**When** expiry is set
**Then**:
  - Default: 180 days from creation
  - Configurable: 30, 90, 180, 365 days
  - Expired tokens cannot be used
  - Daily cron marks expired tokens
  - Client notified 14 days before expiry

---

### AC 2.1.10: Admin API - Regenerate Token

**Given** a token needs to be replaced
**When** admin calls `POST /api/admin/tokens/{id}/regenerate`
**Then**:
  - Old token is revoked
  - New token is generated
  - New email is sent
  - New password is generated
  - Admin prompted to send new password

**Use Cases:**
- Client lost access
- Security concern
- Token expired

---

### AC 2.1.11: Admin API - Revoke Token

**Given** access needs to be removed
**When** admin calls `DELETE /api/admin/tokens/{id}`
**Then**:
  - Token marked as revoked (not deleted)
  - `revoked_at` and `revoked_by` set
  - Client can no longer access
  - Audit log entry created

---

### AC 2.1.12: Admin API - Resend Token Email

**Given** client didn't receive token email
**When** admin calls `POST /api/admin/tokens/{id}/resend-email`
**Then**:
  - Same token link is resent
  - New email log entry created
  - Resend count tracked

---

### AC 2.1.13: Rate Limiting

**Given** token operations are performed
**When** rate limits are checked
**Then**:
  - Token creation: Max 10/admin/hour
  - Email resend: Max 3/client/hour
  - Password attempts: Max 5 then 15-min lockout
  - Token validation: Max 20/IP/minute

---

### AC 2.1.14: Audit Trail

**Given** any token/access operation
**When** operation completes
**Then** log entry created:

```sql
CREATE TABLE access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    action ENUM(
        'token_created', 'token_regenerated', 'token_revoked',
        'email_sent', 'password_generated', 'password_sent',
        'login_success', 'login_failed', 'session_started', 'session_expired'
    ) NOT NULL,
    
    application_id INT,
    token_id INT,
    
    actor_type ENUM('admin', 'client', 'system') NOT NULL,
    actor_id INT,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_action (action),
    INDEX idx_application (application_id),
    INDEX idx_created (created_at)
);
```

---

## Technical Implementation

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `api/lib/TokenService.php` | Create | Token generation & validation |
| `api/lib/AccessService.php` | Create | Login/session management |
| `api/lib/ResendService.php` | Create | Resend API wrapper |
| `api/tokens/validate.php` | Create | Token+password validation |
| `api/admin/tokens/regenerate.php` | Create | Regenerate token |
| `api/admin/tokens/revoke.php` | Create | Revoke token |
| `api/admin/tokens/resend-email.php` | Create | Resend email |
| `api/templates/email/` | Create | Email templates (all locales) |

---

### Token Service Implementation

```php
<?php
// api/lib/TokenService.php

namespace BrasilLegalize\Api;

use PDO;
use DateTime;

class TokenService
{
    private PDO $db;
    private ResendService $resend;
    
    const TOKEN_BYTES = 24;         // 48 hex chars
    const PREFIX_LENGTH = 8;
    const PASSWORD_LENGTH = 8;
    const DEFAULT_EXPIRY_DAYS = 180;
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_MINUTES = 15;
    
    public function __construct(PDO $db, ResendService $resend)
    {
        $this->db = $db;
        $this->resend = $resend;
    }
    
    /**
     * Create token when payment is confirmed
     * Called from application workflow
     */
    public function createForApplication(
        int $applicationId,
        int $adminId,
        int $expiryDays = self::DEFAULT_EXPIRY_DAYS
    ): array {
        // Get application & lead data
        $app = $this->getApplicationWithLead($applicationId);
        if (!$app) {
            throw new \Exception('Application not found');
        }
        
        // Generate token
        $token = bin2hex(random_bytes(self::TOKEN_BYTES));
        $tokenPrefix = substr($token, 0, self::PREFIX_LENGTH);
        $tokenHash = hash('sha256', $token);
        
        // Generate password
        $password = $this->generatePassword();
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        
        // Calculate expiry
        $expiresAt = new DateTime("+{$expiryDays} days");
        
        // Store token
        $stmt = $this->db->prepare('
            INSERT INTO tokens 
                (application_id, token_prefix, token_hash, password_hash, 
                 password_set_at, expires_at, created_by)
            VALUES 
                (:app_id, :prefix, :hash, :pwd_hash, NOW(), :expires, :admin)
        ');
        
        $stmt->execute([
            'app_id' => $applicationId,
            'prefix' => $tokenPrefix,
            'hash' => $tokenHash,
            'pwd_hash' => $passwordHash,
            'expires' => $expiresAt->format('Y-m-d H:i:s'),
            'admin' => $adminId,
        ]);
        
        $tokenId = (int) $this->db->lastInsertId();
        
        // Update application with token_id
        $this->db->prepare('
            UPDATE applications SET token_id = ? WHERE id = ?
        ')->execute([$tokenId, $applicationId]);
        
        // Build tracker URL
        $locale = $app['preferred_locale'] ?? 'en';
        $trackerUrl = $this->buildTrackerUrl($token, $locale);
        
        // Send token email via Resend
        $emailResult = $this->resend->sendTokenLinkEmail(
            $app['email'],
            $app['full_name'],
            $app['application_number'],
            $trackerUrl,
            $expiresAt,
            $locale
        );
        
        // Log
        $this->logAccess('token_created', $applicationId, $tokenId, 'admin', $adminId);
        $this->logAccess('email_sent', $applicationId, $tokenId, 'system', null, [
            'resend_id' => $emailResult['id'] ?? null,
        ]);
        
        return [
            'token_id' => $tokenId,
            'tracker_url' => $trackerUrl,
            'password' => $password,  // Show once to admin
            'expires_at' => $expiresAt->format('c'),
            'email_sent' => $emailResult['success'] ?? false,
        ];
    }
    
    /**
     * Validate token + password for client login
     */
    public function validateAccess(string $token, string $password, string $ip): array
    {
        // Check token format
        if (strlen($token) !== self::TOKEN_BYTES * 2) {
            return ['valid' => false, 'error' => 'invalid_token'];
        }
        
        $tokenPrefix = substr($token, 0, self::PREFIX_LENGTH);
        $tokenHash = hash('sha256', $token);
        
        // Find token
        $stmt = $this->db->prepare('
            SELECT t.*, a.*, l.full_name, l.email, l.preferred_locale
            FROM tokens t
            JOIN applications a ON a.id = t.application_id
            JOIN leads l ON l.id = a.lead_id
            WHERE t.token_prefix = :prefix
        ');
        $stmt->execute(['prefix' => $tokenPrefix]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row || !hash_equals($row['token_hash'], $tokenHash)) {
            $this->logAccess('login_failed', null, null, 'client', null, [
                'reason' => 'invalid_token',
                'ip' => $ip,
            ]);
            return ['valid' => false, 'error' => 'invalid_token'];
        }
        
        // Check revoked
        if ($row['revoked_at'] !== null) {
            return ['valid' => false, 'error' => 'revoked'];
        }
        
        // Check expired
        if (new DateTime($row['expires_at']) < new DateTime()) {
            return ['valid' => false, 'error' => 'expired'];
        }
        
        // Check lockout
        $lockout = $this->checkLockout($row['id'], $ip);
        if ($lockout) {
            return [
                'valid' => false,
                'error' => 'locked_out',
                'unlock_at' => $lockout,
            ];
        }
        
        // Verify password
        if (!password_verify($password, $row['password_hash'])) {
            $this->recordFailedAttempt($row['id'], $ip);
            return ['valid' => false, 'error' => 'invalid_password'];
        }
        
        // Success! Update usage
        $this->db->prepare('
            UPDATE tokens 
            SET last_used_at = NOW(), use_count = use_count + 1 
            WHERE id = ?
        ')->execute([$row['id']]);
        
        // Clear failed attempts
        $this->clearFailedAttempts($row['id'], $ip);
        
        // Log success
        $this->logAccess('login_success', $row['application_id'], $row['id'], 'client', null, [
            'ip' => $ip,
        ]);
        
        // Return session data
        $sessionExpires = new DateTime('+4 hours');
        
        return [
            'valid' => true,
            'application_id' => $row['application_id'],
            'client' => [
                'name' => $row['full_name'],
                'email' => $row['email'],
                'locale' => $row['preferred_locale'],
            ],
            'application' => [
                'id' => $row['application_number'],
                'status' => $row['status'],
                'service_type' => $row['service_type'],
            ],
            'session_expires' => $sessionExpires->format('c'),
        ];
    }
    
    private function generatePassword(): string
    {
        // Exclude confusing chars: 0/O, 1/l/I
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        $password = '';
        for ($i = 0; $i < self::PASSWORD_LENGTH; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $password;
    }
    
    private function buildTrackerUrl(string $token, string $locale): string
    {
        $baseUrl = getenv('APP_URL') ?: 'https://app.brasillegalize.com';
        return "{$baseUrl}/{$locale}/track/{$token}";
    }
    
    // ... additional helper methods
}
```

---

### Resend Service Implementation

```php
<?php
// api/lib/ResendService.php

namespace BrasilLegalize\Api;

use DateTime;

class ResendService
{
    private string $apiKey;
    private string $fromEmail = 'Brasil Legalize <noreply@brasillegalize.com>';
    private string $replyTo = 'contact@brasillegalize.com';
    
    public function __construct()
    {
        $this->apiKey = getenv('RESEND_API_KEY');
    }
    
    public function sendTokenLinkEmail(
        string $email,
        string $clientName,
        string $applicationId,
        string $trackerUrl,
        DateTime $expiresAt,
        string $locale
    ): array {
        $template = $this->getTokenLinkTemplate($locale);
        
        $html = $this->renderTemplate($template['html'], [
            'clientName' => $clientName,
            'applicationId' => $applicationId,
            'trackerUrl' => $trackerUrl,
            'expiryDate' => $this->formatDate($expiresAt, $locale),
        ]);
        
        $text = $this->renderTemplate($template['text'], [
            'clientName' => $clientName,
            'applicationId' => $applicationId,
            'trackerUrl' => $trackerUrl,
            'expiryDate' => $this->formatDate($expiresAt, $locale),
        ]);
        
        return $this->send([
            'to' => $email,
            'subject' => $template['subject'],
            'html' => $html,
            'text' => $text,
            'tags' => [
                ['name' => 'type', 'value' => 'token_link'],
                ['name' => 'application', 'value' => $applicationId],
            ],
        ]);
    }
    
    public function sendStatusUpdateEmail(
        string $email,
        string $clientName,
        string $applicationId,
        string $newStatus,
        array $context,
        string $locale
    ): array {
        $template = $this->getStatusTemplate($newStatus, $locale);
        
        if (!$template) {
            return ['skipped' => true, 'reason' => 'no_template'];
        }
        
        $html = $this->renderTemplate($template['html'], array_merge([
            'clientName' => $clientName,
            'applicationId' => $applicationId,
        ], $context));
        
        return $this->send([
            'to' => $email,
            'subject' => $template['subject'],
            'html' => $html,
            'tags' => [
                ['name' => 'type', 'value' => 'status_update'],
                ['name' => 'status', 'value' => $newStatus],
                ['name' => 'application', 'value' => $applicationId],
            ],
        ]);
    }
    
    private function send(array $payload): array
    {
        $payload['from'] = $this->fromEmail;
        $payload['reply_to'] = $this->replyTo;
        
        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_RETURNTRANSFER => true,
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        return [
            'success' => $httpCode >= 200 && $httpCode < 300,
            'id' => $result['id'] ?? null,
            'error' => $result['error'] ?? null,
        ];
    }
    
    private function getTokenLinkTemplate(string $locale): array
    {
        $templates = [
            'en' => [
                'subject' => 'Access Your Brasil Legalize Application Tracker',
                'html' => file_get_contents(__DIR__ . '/../templates/email/token-link.en.html'),
                'text' => file_get_contents(__DIR__ . '/../templates/email/token-link.en.txt'),
            ],
            'pt-br' => [
                'subject' => 'Acesse Seu Rastreador de Aplicação - Brasil Legalize',
                'html' => file_get_contents(__DIR__ . '/../templates/email/token-link.pt-br.html'),
                'text' => file_get_contents(__DIR__ . '/../templates/email/token-link.pt-br.txt'),
            ],
            'es' => [
                'subject' => 'Acceda a Su Rastreador de Aplicación - Brasil Legalize',
                'html' => file_get_contents(__DIR__ . '/../templates/email/token-link.es.html'),
                'text' => file_get_contents(__DIR__ . '/../templates/email/token-link.es.txt'),
            ],
            'ar' => [
                'subject' => 'تتبع طلبك - براسيل ليغالايز',
                'html' => file_get_contents(__DIR__ . '/../templates/email/token-link.ar.html'),
                'text' => file_get_contents(__DIR__ . '/../templates/email/token-link.ar.txt'),
            ],
        ];
        
        return $templates[$locale] ?? $templates['en'];
    }
    
    // ... additional methods for other email types
}
```

---

## Client Login Flow (UI)

### Login Page (`/[locale]/track/[token]`)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Brasil Legalize Logo]                 │
│                                                     │
│         Access Your Application Tracker             │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Access Password                              │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ ••••••••                           👁️  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  [    Access My Application    ]              │  │
│  │                                               │  │
│  │  Forgot password? Contact your advisor        │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│         Need help? contact@brasillegalize.com       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**States:**
- **Loading**: Validating token...
- **Invalid Token**: "This link is invalid or has expired"
- **Password Entry**: Form shown above
- **Failed Password**: "Incorrect password. X attempts remaining."
- **Locked Out**: "Too many attempts. Try again in X minutes."
- **Success**: Redirect to tracker dashboard

---

## Testing Requirements

### Unit Tests

| Test | Expected |
|------|----------|
| `token-generation` | 48 hex chars, unique |
| `password-generation` | 8 chars, valid charset |
| `token-hashing` | SHA-256, 64 chars |
| `password-hashing` | bcrypt, verifiable |
| `expiry-calculation` | Correct date |

### Integration Tests

| Test | Expected |
|------|----------|
| `payment-triggers-token` | Token created on payment |
| `email-sent-via-resend` | Resend API called |
| `login-success` | Session created |
| `login-lockout` | Locked after 5 fails |
| `token-revoke` | Access denied after |

---

## Definition of Done

- [ ] Token generation on payment confirmation
- [ ] Password generation and display to admin
- [ ] Token link email via Resend
- [ ] Password delivery tracking
- [ ] Token + password validation
- [ ] Login lockout mechanism
- [ ] Token regeneration
- [ ] Token revocation
- [ ] All localized emails
- [ ] Audit logging
- [ ] Rate limiting
- [ ] All tests pass

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story |
| 2026-01-31 | Updated | Integrated with payment flow, added password system, changed to tracker URL |
