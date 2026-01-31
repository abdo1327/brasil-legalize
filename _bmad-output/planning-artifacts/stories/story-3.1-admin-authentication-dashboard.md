---
storyId: "3.1"
epicId: "3"
title: "Admin Authentication & Dashboard Shell"
status: "ready"
priority: "critical"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - admin
  - authentication
  - dashboard
  - security
  - role-based-access
functionalRequirements:
  - FR9
  - FR10
nonFunctionalRequirements:
  - NFR1
  - NFR2
  - NFR4
dependencies: []
blockedBy: []
blocks:
  - "3.2"
  - "3.3"
  - "3.4"
  - "3.5"
---

# Story 3.1: Admin Authentication & Dashboard Shell

## User Story

**As an** administrator,
**I want** to securely log in to a dedicated admin console,
**So that** I can manage clients, cases, and business operations with appropriate access controls.

---

## Story Description

This story establishes the foundation for the entire admin console: secure authentication, role-based access control (RBAC), and the dashboard shell that houses all admin functionality. The admin console is completely separate from the public site and client portal.

Security is paramount - administrators have access to sensitive client data, legal case information, and financial records. Multi-factor authentication, session management, and comprehensive audit logging are required.

The dashboard shell provides the navigation, layout, and common components used by all admin features in subsequent stories.

---

## Acceptance Criteria

### AC 3.1.1: Admin Login Page

**Given** an admin navigates to `/admin` or `/admin/login`
**When** the page loads
**Then** they see:

1. **Login Form:**
   - Brasil Legalize logo
   - "Admin Console" title
   - Email input field
   - Password input field (with show/hide toggle)
   - "Remember this device" checkbox
   - "Sign In" button
   - "Forgot Password" link

2. **Security Notices:**
   - "This is a restricted area"
   - "All access is logged"

3. **Design:**
   - Clean, professional layout
   - Primary brand colors
   - Centered form
   - Mobile responsive

---

### AC 3.1.2: Admin Authentication

**Given** an admin submits valid credentials
**When** authentication is processed
**Then**:
  - Email and password verified against admin table
  - Password hashed with Argon2ID (same as clients)
  - TOTP MFA code requested if enabled
  - Session created on success
  - Redirect to dashboard

**Given** invalid credentials
**Then**:
  - Generic error: "Invalid email or password"
  - No user enumeration
  - Failed attempt logged
  - Rate limiting applied

---

### AC 3.1.3: Multi-Factor Authentication (MFA)

**Given** an admin has MFA enabled
**When** they submit valid email/password
**Then**:
  - MFA code entry screen appears
  - 6-digit TOTP code required
  - "Remember this device for 30 days" option
  - Backup codes accepted
  - Invalid code shows error
  - 3 failed attempts locks temporarily

**MFA Setup (in Profile settings):**
  - QR code displayed for authenticator apps
  - Manual key shown as backup
  - 10 backup codes generated (single-use)
  - Test code required to complete setup

---

### AC 3.1.4: Admin Roles & Permissions

**Given** the admin system has roles
**When** defining access control
**Then** these roles exist:

| Role | Permissions | Description |
|------|-------------|-------------|
| `super_admin` | All | Full system access, can manage admins |
| `admin` | Clients, Cases, Documents, Messages | Standard admin operations |
| `support` | View clients, Send messages, View cases | Read-heavy support role |
| `finance` | View payments, Export reports | Financial access only |

**Permission Matrix:**

| Feature | super_admin | admin | support | finance |
|---------|-------------|-------|---------|---------|
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| Manage Clients | ✓ | ✓ | Read | ✗ |
| Manage Cases | ✓ | ✓ | Read | ✗ |
| View Documents | ✓ | ✓ | ✓ | ✗ |
| Download Documents | ✓ | ✓ | ✗ | ✗ |
| Send Messages | ✓ | ✓ | ✓ | ✗ |
| View Payments | ✓ | ✓ | ✗ | ✓ |
| Export Reports | ✓ | ✓ | ✗ | ✓ |
| Manage Admins | ✓ | ✗ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ | ✗ |

---

### AC 3.1.5: Admin Session Management

**Given** an admin logs in
**When** session is created
**Then**:
  - Session stored in database (not just cookie)
  - Session expires after 4 hours of inactivity
  - "Remember device" extends to 7 days
  - Only 3 concurrent sessions allowed
  - Sessions can be revoked remotely

**Session Data:**
```php
$session = [
    'session_id' => bin2hex(random_bytes(32)),
    'admin_id' => $adminId,
    'role' => $admin['role'],
    'permissions' => $rolePermissions,
    'created_at' => now(),
    'expires_at' => now() + 4 hours,
    'ip_address' => $ip,
    'user_agent' => $ua,
    'device_trusted' => $rememberDevice,
];
```

---

### AC 3.1.6: Brute Force Protection

**Given** login attempts are monitored
**When** failures occur
**Then**:

| Failures | Action |
|----------|--------|
| 3 | Add CAPTCHA |
| 5 | Lock for 15 minutes |
| 10 | Lock for 1 hour |
| 15+ | Lock for 24 hours + email alert |

**And**:
  - Rate limiting is per email + IP combination
  - Successful login resets counter
  - Lockout email sent to admin
  - Super admin alerted on repeated lockouts

---

### AC 3.1.7: Dashboard Shell Layout

**Given** an admin is authenticated
**When** they view the dashboard
**Then** the layout includes:

1. **Top Header Bar:**
   - Brasil Legalize logo (links to dashboard)
   - Search bar (global search)
   - Notification bell (with count)
   - Profile dropdown (name, photo, menu)

2. **Left Sidebar Navigation:**
   - Dashboard (home icon)
   - Clients (users icon)
   - Cases (briefcase icon)
   - Documents (folder icon)
   - Messages (chat icon)
   - Appointments (calendar icon)
   - Reports (chart icon)
   - Settings (gear icon) - super_admin only
   - Collapse button

3. **Main Content Area:**
   - Breadcrumb navigation
   - Page title
   - Content container
   - Responsive padding

4. **Footer:**
   - Version number
   - Support link

---

### AC 3.1.8: Dashboard Home Page

**Given** an admin logs in
**When** they see the dashboard home
**Then** it displays:

1. **Quick Stats Cards:**
   - Total Clients (with trend)
   - Active Cases (with trend)
   - Pending Documents (requiring review)
   - Unread Messages (requiring response)
   - Today's Appointments

2. **Recent Activity Feed:**
   - Last 10 system activities
   - Client registrations
   - Document uploads
   - Status changes
   - Messages received

3. **Quick Actions:**
   - "New Client" button
   - "Generate Token Link" button
   - "View Appointments" button

4. **Charts (if time permits):**
   - Client registration over time (30 days)
   - Case status distribution

---

### AC 3.1.9: Navigation Based on Permissions

**Given** an admin has a specific role
**When** they view the sidebar
**Then**:
  - Only permitted sections visible
  - Clicking unauthorized URL → 403 page
  - API calls return 403 if unauthorized

**Example:**
  - `support` role doesn't see "Settings"
  - `finance` role only sees Dashboard and Reports
  - `super_admin` sees everything

---

### AC 3.1.10: Global Search

**Given** an admin uses the search bar
**When** they type a query
**Then**:
  - Live search with debounce (300ms)
  - Searches clients, cases, documents
  - Results grouped by type
  - Click result → navigate to detail page
  - Keyboard navigation (arrows, enter)
  - Results respect permissions

**Search Results:**
```
Clients:
  → João Silva (joao@email.com)
  → Maria Santos (maria@email.com)

Cases:
  → Case #2024-001 - João Silva

Documents:
  → passport.pdf - João Silva
```

---

### AC 3.1.11: Notifications System

**Given** the notification bell in header
**When** clicked
**Then**:
  - Dropdown shows recent notifications
  - Mark as read option
  - "View All" link to notifications page

**Notification Types:**
| Type | Description | Trigger |
|------|-------------|---------|
| new_client | New client registered | Lead form submission |
| document_uploaded | Client uploaded document | Document upload |
| message_received | New message from client | Message sent |
| appointment_upcoming | Appointment in 1 hour | Scheduled time |
| case_status_change | Case status updated | Status update |

---

### AC 3.1.12: Profile Dropdown

**Given** an admin clicks their profile
**When** the dropdown opens
**Then** options include:
  - View Profile
  - Change Password
  - MFA Settings
  - Active Sessions
  - Language/Theme (future)
  - Sign Out

---

### AC 3.1.13: Sign Out

**Given** an admin clicks "Sign Out"
**When** logging out
**Then**:
  - Session invalidated server-side
  - Cookie cleared
  - Redirect to login page
  - Logout event logged

---

### AC 3.1.14: Password Reset Flow

**Given** an admin forgets password
**When** clicking "Forgot Password"
**Then**:
  - Email input page
  - Submit sends reset link (if email exists)
  - No email enumeration
  - Reset token expires in 1 hour
  - Link leads to password reset form
  - After reset, all sessions invalidated

---

### AC 3.1.15: Audit Logging

**Given** admin performs any action
**When** the action completes
**Then** audit log records:

| Field | Description |
|-------|-------------|
| `timestamp` | When action occurred |
| `admin_id` | Who performed action |
| `action` | What action (login, create, update, delete, view) |
| `resource_type` | What type (client, case, document) |
| `resource_id` | Which specific resource |
| `ip_address` | From where |
| `user_agent` | Browser/device |
| `details` | JSON of relevant details |

**Example Log Entries:**
```json
{ "action": "login", "admin_id": 1, "ip": "192.168.1.1" }
{ "action": "view", "resource_type": "client", "resource_id": 42 }
{ "action": "update", "resource_type": "case", "resource_id": 15, "details": {"field": "status", "old": "pending", "new": "active"} }
```

---

### AC 3.1.16: Responsive Design

**Given** an admin uses mobile/tablet
**When** viewing the admin console
**Then**:
  - Sidebar collapses to hamburger menu
  - Tables become scrollable or cards
  - Touch-friendly buttons
  - Forms stack vertically
  - Minimum tap target: 44x44px

---

### AC 3.1.17: Error Handling

**Given** an error occurs
**When** displayed to admin
**Then**:
  - User-friendly message
  - Error code for support reference
  - Log full details server-side
  - Don't expose stack traces

**Error Pages:**
- 403: "Access Denied" - Contact your administrator
- 404: "Page Not Found" - Return to dashboard
- 500: "Something went wrong" - Error code: XXXX

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/admin/layout.tsx` | Create | Admin layout shell |
| `app/admin/page.tsx` | Create | Redirect to login or dashboard |
| `app/admin/login/page.tsx` | Create | Admin login page |
| `app/admin/dashboard/page.tsx` | Create | Dashboard home |
| `app/admin/dashboard/layout.tsx` | Create | Dashboard layout with sidebar |
| `app/admin/forgot-password/page.tsx` | Create | Password reset request |
| `app/admin/reset-password/[token]/page.tsx` | Create | Password reset form |
| `components/admin/Sidebar.tsx` | Create | Navigation sidebar |
| `components/admin/Header.tsx` | Create | Top header bar |
| `components/admin/GlobalSearch.tsx` | Create | Search component |
| `components/admin/NotificationBell.tsx` | Create | Notifications dropdown |
| `components/admin/ProfileDropdown.tsx` | Create | Profile menu |
| `components/admin/StatsCard.tsx` | Create | Stat card component |
| `components/admin/ActivityFeed.tsx` | Create | Activity list |
| `lib/admin/auth.ts` | Create | Admin auth utilities |
| `lib/admin/permissions.ts` | Create | RBAC helpers |
| `api/admin/auth/login.php` | Create | Login endpoint |
| `api/admin/auth/logout.php` | Create | Logout endpoint |
| `api/admin/auth/mfa.php` | Create | MFA verification |
| `api/admin/auth/session.php` | Create | Session management |
| `api/admin/dashboard/stats.php` | Create | Dashboard stats |
| `api/admin/search.php` | Create | Global search |
| `api/admin/notifications.php` | Create | Notifications |

---

### Database Schema

```sql
-- Admin users table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'support', 'finance') NOT NULL DEFAULT 'support',
    avatar_url VARCHAR(512),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(64),
    mfa_backup_codes TEXT, -- JSON array of hashed codes
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME,
    password_changed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_email (email),
    INDEX idx_role (role),
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- Admin sessions table
CREATE TABLE admin_sessions (
    id VARCHAR(64) PRIMARY KEY,
    admin_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_trusted BOOLEAN DEFAULT FALSE,
    mfa_verified BOOLEAN DEFAULT FALSE,
    revoked_at DATETIME DEFAULT NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Admin login attempts (rate limiting)
CREATE TABLE admin_login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(50),
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_ip (ip_address),
    INDEX idx_attempted_at (attempted_at)
);

-- Admin audit log
CREATE TABLE admin_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Notifications table
CREATE TABLE admin_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT, -- NULL = all admins
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(512),
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Trusted devices for MFA
CREATE TABLE admin_trusted_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    device_hash VARCHAR(64) NOT NULL,
    device_name VARCHAR(255),
    trusted_until DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_device (admin_id, device_hash),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Password reset tokens
CREATE TABLE admin_password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token_hash (token_hash),
    INDEX idx_admin_id (admin_id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Insert default super admin (password: change_me_immediately)
INSERT INTO admins (email, password_hash, name, role, is_active) VALUES
('admin@brasillegalize.com', '$argon2id$v=19$m=65536,t=3,p=4$...', 'System Admin', 'super_admin', TRUE);
```

---

### Admin Dashboard Layout

```typescript
// app/admin/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { validateAdminSession, AdminSession } from '@/lib/admin/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('admin_session')?.value;
  
  if (!sessionId) {
    redirect('/admin/login');
  }
  
  const session = await validateAdminSession(sessionId);
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header admin={session.admin} />
      <div className="flex">
        <Sidebar 
          role={session.admin.role} 
          permissions={session.permissions} 
        />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### Sidebar Component

```typescript
// components/admin/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/admin/clients', icon: UsersIcon, permission: 'clients.view' },
  { name: 'Cases', href: '/admin/cases', icon: BriefcaseIcon, permission: 'cases.view' },
  { name: 'Documents', href: '/admin/documents', icon: FolderIcon, permission: 'documents.view' },
  { name: 'Messages', href: '/admin/messages', icon: ChatBubbleLeftRightIcon, permission: 'messages.view' },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarIcon, permission: 'appointments.view' },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon, permission: 'reports.view' },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, permission: 'settings.view' },
];

interface SidebarProps {
  role: string;
  permissions: string[];
}

export function Sidebar({ role, permissions }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (role === 'super_admin') return true;
    return permissions.includes(permission);
  };
  
  const visibleNavItems = navigation.filter(item => hasPermission(item.permission));
  
  return (
    <aside
      className={`
        bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      <nav className="flex flex-col h-full p-4">
        <ul className="space-y-1 flex-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-colors duration-150
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="ml-2 text-sm">Collapse</span>
            </>
          )}
        </button>
      </nav>
    </aside>
  );
}
```

---

### Header Component

```typescript
// components/admin/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GlobalSearch } from './GlobalSearch';
import { NotificationBell } from './NotificationBell';
import { ProfileDropdown } from './ProfileDropdown';

interface AdminInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface HeaderProps {
  admin: AdminInfo;
}

export function Header({ admin }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Brasil Legalize"
            width={40}
            height={40}
          />
          <span className="font-semibold text-lg text-primary hidden sm:block">
            Admin Console
          </span>
        </Link>
        
        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <GlobalSearch />
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <ProfileDropdown admin={admin} />
        </div>
      </div>
    </header>
  );
}
```

---

### Admin Authentication Service (PHP)

```php
<?php
// api/lib/AdminAuthService.php

namespace BrasilLegalize\Api\Lib;

use PDO;

class AdminAuthService
{
    private PDO $db;
    private const SESSION_DURATION = 4 * 60 * 60; // 4 hours
    private const TRUSTED_DEVICE_DURATION = 7 * 24 * 60 * 60; // 7 days
    private const MFA_TRUST_DURATION = 30 * 24 * 60 * 60; // 30 days
    private const MAX_CONCURRENT_SESSIONS = 3;
    
    // Rate limiting thresholds
    private const CAPTCHA_THRESHOLD = 3;
    private const LOCKOUT_1_THRESHOLD = 5;
    private const LOCKOUT_2_THRESHOLD = 10;
    private const LOCKOUT_3_THRESHOLD = 15;
    
    private const LOCKOUT_1_DURATION = 15 * 60;    // 15 minutes
    private const LOCKOUT_2_DURATION = 60 * 60;    // 1 hour
    private const LOCKOUT_3_DURATION = 24 * 60 * 60; // 24 hours
    
    // Permissions per role
    private const ROLE_PERMISSIONS = [
        'super_admin' => ['*'],
        'admin' => [
            'clients.view', 'clients.create', 'clients.update',
            'cases.view', 'cases.create', 'cases.update',
            'documents.view', 'documents.download',
            'messages.view', 'messages.send',
            'appointments.view', 'appointments.manage',
            'reports.view', 'reports.export',
        ],
        'support' => [
            'clients.view',
            'cases.view',
            'documents.view',
            'messages.view', 'messages.send',
            'appointments.view',
        ],
        'finance' => [
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
    public function login(string $email, string $password, string $ip, string $userAgent): array
    {
        // Check rate limiting
        $rateLimitResult = $this->checkRateLimit($email, $ip);
        if ($rateLimitResult['blocked']) {
            return [
                'success' => false,
                'error' => 'rate_limited',
                'message' => $rateLimitResult['message'],
                'requires_captcha' => $rateLimitResult['requires_captcha'],
            ];
        }
        
        // Find admin
        $stmt = $this->db->prepare('
            SELECT id, email, password_hash, name, role, avatar_url, mfa_enabled, mfa_secret, is_active
            FROM admins WHERE email = :email
        ');
        $stmt->execute(['email' => strtolower($email)]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin || !$admin['is_active']) {
            $this->recordLoginAttempt($email, $ip, false, 'user_not_found');
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
            ];
        }
        
        // Verify password
        if (!password_verify($password, $admin['password_hash'])) {
            $this->recordLoginAttempt($email, $ip, false, 'wrong_password');
            return [
                'success' => false,
                'error' => 'invalid_credentials',
                'message' => 'Invalid email or password.',
            ];
        }
        
        // Check if MFA required
        if ($admin['mfa_enabled']) {
            // Check if device is trusted
            $deviceHash = $this->getDeviceHash($ip, $userAgent);
            if (!$this->isDeviceTrusted($admin['id'], $deviceHash)) {
                // Create temporary session for MFA
                $tempSession = $this->createMfaPendingSession($admin['id'], $ip, $userAgent);
                return [
                    'success' => false,
                    'requires_mfa' => true,
                    'mfa_session' => $tempSession,
                ];
            }
        }
        
        // Successful login
        $this->recordLoginAttempt($email, $ip, true, null);
        
        // Create full session
        $sessionId = $this->createSession($admin['id'], $ip, $userAgent, false);
        
        // Update last login
        $this->db->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = :id')
            ->execute(['id' => $admin['id']]);
        
        // Log audit
        $this->logAudit($admin['id'], 'login', null, null, $ip, $userAgent);
        
        return [
            'success' => true,
            'session_id' => $sessionId,
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => $admin['role'],
                'avatar_url' => $admin['avatar_url'],
            ],
            'permissions' => $this->getPermissionsForRole($admin['role']),
        ];
    }
    
    /**
     * Verify MFA code
     */
    public function verifyMfa(string $mfaSession, string $code, bool $trustDevice, string $ip, string $userAgent): array
    {
        // Get pending session
        $stmt = $this->db->prepare('
            SELECT s.*, a.mfa_secret, a.mfa_backup_codes, a.name, a.email, a.role, a.avatar_url
            FROM admin_sessions s
            JOIN admins a ON a.id = s.admin_id
            WHERE s.id = :id AND s.mfa_verified = FALSE AND s.expires_at > NOW()
        ');
        $stmt->execute(['id' => $mfaSession]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session) {
            return [
                'success' => false,
                'error' => 'invalid_session',
                'message' => 'Session expired. Please log in again.',
            ];
        }
        
        // Verify TOTP code
        $validCode = $this->verifyTotpCode($session['mfa_secret'], $code);
        
        // Or check backup codes
        if (!$validCode) {
            $validCode = $this->verifyBackupCode($session['admin_id'], $code);
        }
        
        if (!$validCode) {
            return [
                'success' => false,
                'error' => 'invalid_code',
                'message' => 'Invalid verification code.',
            ];
        }
        
        // Mark session as MFA verified
        $this->db->prepare('UPDATE admin_sessions SET mfa_verified = TRUE WHERE id = :id')
            ->execute(['id' => $mfaSession]);
        
        // Trust device if requested
        if ($trustDevice) {
            $deviceHash = $this->getDeviceHash($ip, $userAgent);
            $this->trustDevice($session['admin_id'], $deviceHash, $userAgent);
        }
        
        // Log audit
        $this->logAudit($session['admin_id'], 'mfa_verified', null, null, $ip, $userAgent);
        
        return [
            'success' => true,
            'session_id' => $mfaSession,
            'admin' => [
                'id' => $session['admin_id'],
                'name' => $session['name'],
                'email' => $session['email'],
                'role' => $session['role'],
                'avatar_url' => $session['avatar_url'],
            ],
            'permissions' => $this->getPermissionsForRole($session['role']),
        ];
    }
    
    /**
     * Validate existing session
     */
    public function validateSession(string $sessionId): ?array
    {
        $stmt = $this->db->prepare('
            SELECT s.*, a.id as admin_id, a.name, a.email, a.role, a.avatar_url
            FROM admin_sessions s
            JOIN admins a ON a.id = s.admin_id
            WHERE s.id = :id 
              AND s.expires_at > NOW() 
              AND s.revoked_at IS NULL
              AND (s.mfa_verified = TRUE OR a.mfa_enabled = FALSE)
              AND a.is_active = TRUE
        ');
        $stmt->execute(['id' => $sessionId]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session) {
            return null;
        }
        
        // Update last activity
        $this->db->prepare('UPDATE admin_sessions SET last_activity_at = NOW() WHERE id = :id')
            ->execute(['id' => $sessionId]);
        
        return [
            'admin' => [
                'id' => $session['admin_id'],
                'name' => $session['name'],
                'email' => $session['email'],
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
     * Check if admin has permission
     */
    public function hasPermission(string $role, string $permission): bool
    {
        $permissions = $this->getPermissionsForRole($role);
        
        if (in_array('*', $permissions)) {
            return true;
        }
        
        return in_array($permission, $permissions);
    }
    
    /**
     * Log audit event
     */
    public function logAudit(
        int $adminId,
        string $action,
        ?string $resourceType,
        ?int $resourceId,
        string $ip,
        string $userAgent,
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
    
    // ... Private helper methods ...
    
    private function createSession(int $adminId, string $ip, string $ua, bool $mfaPending): string
    {
        // Enforce max concurrent sessions
        $this->enforceMaxSessions($adminId);
        
        $sessionId = bin2hex(random_bytes(32));
        
        $stmt = $this->db->prepare('
            INSERT INTO admin_sessions (id, admin_id, expires_at, ip_address, user_agent, mfa_verified)
            VALUES (:id, :admin_id, :expires_at, :ip, :ua, :mfa_verified)
        ');
        
        $stmt->execute([
            'id' => $sessionId,
            'admin_id' => $adminId,
            'expires_at' => date('Y-m-d H:i:s', time() + self::SESSION_DURATION),
            'ip' => $ip,
            'ua' => $ua,
            'mfa_verified' => !$mfaPending ? 1 : 0,
        ]);
        
        return $sessionId;
    }
    
    private function createMfaPendingSession(int $adminId, string $ip, string $ua): string
    {
        return $this->createSession($adminId, $ip, $ua, true);
    }
    
    private function enforceMaxSessions(int $adminId): void
    {
        // Get active session count
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as count FROM admin_sessions 
            WHERE admin_id = :id AND expires_at > NOW() AND revoked_at IS NULL
        ');
        $stmt->execute(['id' => $adminId]);
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($count >= self::MAX_CONCURRENT_SESSIONS) {
            // Revoke oldest session
            $this->db->prepare('
                UPDATE admin_sessions 
                SET revoked_at = NOW() 
                WHERE admin_id = :id AND revoked_at IS NULL
                ORDER BY created_at ASC
                LIMIT 1
            ')->execute(['id' => $adminId]);
        }
    }
    
    private function checkRateLimit(string $email, string $ip): array
    {
        $stmt = $this->db->prepare('
            SELECT COUNT(*) as attempts FROM admin_login_attempts
            WHERE email = :email AND success = FALSE 
            AND attempted_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ');
        $stmt->execute(['email' => $email]);
        $attempts = $stmt->fetch(PDO::FETCH_ASSOC)['attempts'];
        
        if ($attempts >= self::LOCKOUT_3_THRESHOLD) {
            return ['blocked' => true, 'message' => 'Account locked for 24 hours.', 'requires_captcha' => false];
        }
        if ($attempts >= self::LOCKOUT_2_THRESHOLD) {
            return ['blocked' => true, 'message' => 'Account locked for 1 hour.', 'requires_captcha' => false];
        }
        if ($attempts >= self::LOCKOUT_1_THRESHOLD) {
            return ['blocked' => true, 'message' => 'Account locked for 15 minutes.', 'requires_captcha' => false];
        }
        if ($attempts >= self::CAPTCHA_THRESHOLD) {
            return ['blocked' => false, 'requires_captcha' => true];
        }
        
        return ['blocked' => false, 'requires_captcha' => false];
    }
    
    private function recordLoginAttempt(string $email, string $ip, bool $success, ?string $reason): void
    {
        $stmt = $this->db->prepare('
            INSERT INTO admin_login_attempts (email, ip_address, success, failure_reason)
            VALUES (:email, :ip, :success, :reason)
        ');
        $stmt->execute([
            'email' => $email,
            'ip' => $ip,
            'success' => $success ? 1 : 0,
            'reason' => $reason,
        ]);
    }
    
    private function getDeviceHash(string $ip, string $userAgent): string
    {
        return hash('sha256', $ip . '|' . $userAgent);
    }
    
    private function isDeviceTrusted(int $adminId, string $deviceHash): bool
    {
        $stmt = $this->db->prepare('
            SELECT 1 FROM admin_trusted_devices
            WHERE admin_id = :admin_id AND device_hash = :hash AND trusted_until > NOW()
        ');
        $stmt->execute(['admin_id' => $adminId, 'hash' => $deviceHash]);
        return $stmt->fetch() !== false;
    }
    
    private function trustDevice(int $adminId, string $deviceHash, string $userAgent): void
    {
        // Extract device name from user agent
        $deviceName = $this->extractDeviceName($userAgent);
        
        $stmt = $this->db->prepare('
            INSERT INTO admin_trusted_devices (admin_id, device_hash, device_name, trusted_until)
            VALUES (:admin_id, :hash, :name, :until)
            ON DUPLICATE KEY UPDATE trusted_until = :until2
        ');
        $stmt->execute([
            'admin_id' => $adminId,
            'hash' => $deviceHash,
            'name' => $deviceName,
            'until' => date('Y-m-d H:i:s', time() + self::MFA_TRUST_DURATION),
            'until2' => date('Y-m-d H:i:s', time() + self::MFA_TRUST_DURATION),
        ]);
    }
    
    private function extractDeviceName(string $userAgent): string
    {
        // Simple device detection
        if (strpos($userAgent, 'iPhone') !== false) return 'iPhone';
        if (strpos($userAgent, 'iPad') !== false) return 'iPad';
        if (strpos($userAgent, 'Android') !== false) return 'Android Device';
        if (strpos($userAgent, 'Windows') !== false) return 'Windows PC';
        if (strpos($userAgent, 'Macintosh') !== false) return 'Mac';
        if (strpos($userAgent, 'Linux') !== false) return 'Linux PC';
        return 'Unknown Device';
    }
    
    private function verifyTotpCode(string $secret, string $code): bool
    {
        // Using TOTP library (e.g., OTPHP)
        // For now, placeholder implementation
        $totp = new \OTPHP\TOTP($secret);
        return $totp->verify($code);
    }
    
    private function verifyBackupCode(int $adminId, string $code): bool
    {
        $stmt = $this->db->prepare('SELECT mfa_backup_codes FROM admins WHERE id = :id');
        $stmt->execute(['id' => $adminId]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin || !$admin['mfa_backup_codes']) {
            return false;
        }
        
        $backupCodes = json_decode($admin['mfa_backup_codes'], true);
        $codeHash = hash('sha256', $code);
        
        foreach ($backupCodes as $i => $storedHash) {
            if (hash_equals($storedHash, $codeHash)) {
                // Remove used code
                unset($backupCodes[$i]);
                $this->db->prepare('UPDATE admins SET mfa_backup_codes = :codes WHERE id = :id')
                    ->execute(['codes' => json_encode(array_values($backupCodes)), 'id' => $adminId]);
                return true;
            }
        }
        
        return false;
    }
}
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `login-valid` | Valid credentials | Session created |
| `login-invalid-email` | Wrong email | Generic error |
| `login-invalid-password` | Wrong password | Generic error |
| `login-inactive-admin` | Disabled account | Generic error |
| `mfa-valid-code` | Correct TOTP | Session verified |
| `mfa-backup-code` | Use backup code | Session verified, code consumed |
| `session-valid` | Valid session ID | Admin data returned |
| `session-expired` | Expired session | Null returned |
| `permission-super` | Super admin check | All permissions |
| `permission-support` | Support role check | Limited permissions |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-login-flow` | Login → MFA → Dashboard | Success |
| `rate-limiting` | 5 failed logins | Account locked |
| `session-management` | Multiple sessions | Oldest revoked |
| `audit-logging` | Login actions | Logged correctly |
| `forgot-password` | Reset flow | Password changed |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `login-page-renders` | Visit /admin/login | Form displayed |
| `successful-login` | Enter valid creds | Redirect to dashboard |
| `failed-login` | Enter wrong password | Error message shown |
| `dashboard-renders` | Visit dashboard authenticated | Stats displayed |
| `sidebar-navigation` | Click sidebar items | Pages load correctly |
| `permission-denied` | Support visits settings | 403 page shown |

---

## Edge Cases and Error Handling

### Edge Case 1: Concurrent Login Same Account
- **Scenario:** Admin logs in from two devices
- **Handling:** Both sessions valid until limit reached
- **User Impact:** Informed oldest session was revoked

### Edge Case 2: Password Change While Logged In
- **Scenario:** Password changed, existing sessions
- **Handling:** Option to invalidate all other sessions
- **User Impact:** Other devices logged out

### Edge Case 3: MFA Lost Device
- **Scenario:** Admin loses phone, needs MFA
- **Handling:** Backup codes work, super_admin can reset
- **User Impact:** Contact super_admin if no backup codes

### Edge Case 4: Session Timeout During Form
- **Scenario:** Session expires while filling long form
- **Handling:** Auto-save to localStorage, re-authenticate modal
- **User Impact:** Data not lost

---

## Security Considerations

1. **Argon2ID Passwords:** Same as client passwords, memory-hard
2. **MFA Requirement:** Can be enforced per role
3. **Session Security:** Database-backed, revocable
4. **Audit Trail:** All actions logged
5. **Rate Limiting:** Prevents brute force
6. **IP/Device Tracking:** Anomaly detection possible
7. **No Enumeration:** Same errors for all failures

---

## Definition of Done

- [ ] Login page implemented and styled
- [ ] Authentication flow works
- [ ] MFA verification works
- [ ] Session management implemented
- [ ] Rate limiting active
- [ ] Dashboard layout complete
- [ ] Sidebar navigation working
- [ ] Header with search/notifications
- [ ] Role-based access enforced
- [ ] Audit logging active
- [ ] Password reset flow works
- [ ] Responsive design verified
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Security review complete
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

