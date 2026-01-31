---
storyId: "3.3"
epicId: "3"
title: "Application Management & Workflow"
status: "ready"
priority: "critical"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-31"
completedAt: null
tags:
  - admin
  - applications
  - workflow
  - notifications
  - client-tracker
  - leads
functionalRequirements:
  - FR9
  - FR14
nonFunctionalRequirements:
  - NFR1
  - NFR3
  - NFR6
dependencies:
  - "3.1"
  - "3.2"
blockedBy:
  - "3.2"
blocks:
  - "3.4"
---

# Story 3.3: Application Management & Workflow

## User Story

**As an** administrator,
**I want** to manage client applications through defined workflow phases,
**So that** I can track progress, update statuses, and ensure applications move efficiently through the immigration process.

**As a** client,
**I want** to track my application progress and receive notifications,
**So that** I stay informed about my immigration journey and know when action is needed from me.

---

## Story Description

The Application Management System is the operational core of Brasil Legalize. It tracks the complete client journey from initial lead capture through application completion.

### Client Journey Phases

The system manages THREE distinct phases, each with its own statuses:

1. **Lead Phase** - Initial contact, generates unique Lead ID (no portal access)
2. **Potential Client Phase** - After consultation meeting, decision pending
3. **Client Phase** - After payment, gains portal access with token link + password

### Key Concepts

- **Lead ID**: Auto-generated unique identifier (format: `BL-2026-00001`)
- **Application ID**: Generated when Lead becomes Client (format: `APP-2026-00001`)
- **Token Link**: Generated ONLY after payment confirmation by admin
- **Access Password**: Sent separately via email or WhatsApp (manual by admin)

### Client Tracker (Not a Portal)

The client interface is a **tracker**, not a full portal. Clients can:
- View application progress
- See pending actions
- Upload required documents
- View notifications

### Admin Notification System

End-to-end tracking with notifications for every significant event.

---

## Phase & Status Workflow (4 × 4 = 16 Total Statuses)

### PHASE 1: LEAD (No Portal Access) - 4 Statuses

| Status | Description | Color | Badge | Next Status |
|--------|-------------|-------|-------|-------------|
| `new` | Just submitted eligibility | Gray | ⚪ New | contacted |
| `contacted` | Admin reached out | Blue | 🔵 Contacted | meeting_scheduled |
| `meeting_scheduled` | Consultation booked | Yellow | 🟡 Meeting | meeting_completed |
| `meeting_completed` | Consultation done | Blue | 🔵 Consulted | → PHASE 2 |

**Trigger to Phase 2:** Admin moves lead to `proposal_sent`

---

### PHASE 2: POTENTIAL CLIENT (No Portal Access) - 4 Statuses

| Status | Description | Color | Badge | Next Status |
|--------|-------------|-------|-------|-------------|
| `proposal_sent` | Package/price quoted | Yellow | 🟡 Proposal | negotiating |
| `negotiating` | Discussing terms | Yellow | 🟡 Negotiating | awaiting_payment |
| `awaiting_payment` | Waiting for payment | Yellow | 🟡 Pending | payment_received |
| `payment_received` | Payment confirmed | Blue | 🔵 Paid | → PHASE 3 + TOKEN |

**Trigger to Phase 3:** `payment_received` → System generates Token Link + Password

---

### PHASE 3: ACTIVE CLIENT (Portal Access Granted) - 4 Statuses

When payment is received:
1. Admin updates status to `payment_received`
2. System generates Token Link + Password
3. Client receives access to tracker

| Status | Description | Color | Badge | Next Status | Client Notified |
|--------|-------------|-------|-------|-------------|-----------------|
| `onboarding` | Initial setup & welcome | Blue | 🔵 Setup | documents_pending | ✅ Welcome email |
| `documents_pending` | Awaiting docs from client | Yellow | 🟡 Docs Needed | documents_review | ✅ Email |
| `documents_review` | Admin reviewing docs | Blue | 🔵 Reviewing | application_submitted | - |
| `application_submitted` | Filed with authorities | Blue | 🔵 Submitted | → PHASE 4 | ✅ Milestone |

**Trigger to Phase 4:** Application filed with authorities

---

### PHASE 4: COMPLETION (Portal Access) - 4 Statuses

| Status | Description | Color | Badge | Next Status | Client Notified |
|--------|-------------|-------|-------|-------------|-----------------|
| `processing` | Authorities processing | Yellow | 🟡 Processing | approved | - |
| `approved` | Application approved! | Blue | 🔵 Approved | finalizing | ✅ Celebration |
| `finalizing` | Final paperwork | Blue | 🔵 Finalizing | completed | ✅ |
| `completed` | Successfully completed | Blue | 🔵 Complete | (final) | ✅ Final email |

---

### Status Flow Diagram (4 Phases × 4 Statuses = 16 Total)

```
PHASE 1: LEAD        PHASE 2: POTENTIAL     PHASE 3: ACTIVE       PHASE 4: COMPLETION
─────────────        ──────────────────     ───────────────       ───────────────────
new                  proposal_sent          onboarding            processing
  ↓                    ↓                      ↓                     ↓
contacted            negotiating            documents_pending     approved
  ↓                    ↓                      ↓                     ↓
meeting_scheduled    awaiting_payment       documents_review      finalizing
  ↓                    ↓                      ↓                     ↓
meeting_completed → payment_received →     application_submitted → completed
                    [TOKEN GENERATED]       [FILED]               [DONE!]
```

---

## Acceptance Criteria

### AC 3.3.1: Lead Management

**Given** a new eligibility submission
**When** the lead is created
**Then**:
  - Unique Lead ID generated (format: `BL-YYYY-NNNNN`)
  - Status set to `new_lead`
  - Admin notification sent
  - Appears in Lead pipeline view
  - NO portal access granted

---

### AC 3.3.2: Application List View

**Given** an admin navigates to `/admin/applications`
**When** the page loads
**Then** they see:

1. **Page Header:**
   - "Applications" title
   - Phase tabs: Leads | Potential Clients | Active Clients | Archived
   - "Create Lead" button
   - Toggle: List View / Pipeline View

2. **Search & Filters:**
   - Search (Lead ID, Application ID, name, email, phone)
   - Status filter (grouped by phase)
   - Service type filter
   - Assigned admin filter
   - Date range filter
   - Payment status filter (Phase 2+)

3. **Application Table:**
   - ID (Lead ID or Application ID)
   - Client Name (with contact icons)
   - Service Type
   - Status (color-coded badge)
   - Phase indicator
   - Assigned To
   - Next Action (if any)
   - Days in Status
   - Actions

4. **Quick Stats Bar:**
   - New Leads (today/this week)
   - Pending Payments
   - Documents Pending
   - Applications in Progress

---

### AC 3.3.3: Pipeline/Kanban View

**Given** an admin toggles to Pipeline View
**When** the board loads
**Then**:

1. **Phase Tabs:**
   - Switch between Lead Pipeline, Potential Pipeline, Client Pipeline

2. **Lead Pipeline Columns:**
   - New → Contacted → Meeting Scheduled → Completed/Lost

3. **Potential Client Pipeline Columns:**
   - Consulted → Proposal Sent → Awaiting Payment → Paid/Lost

4. **Client Pipeline Columns:**
   - Onboarding → Documents → Processing → Completed

5. **Card Display:**
   - ID + Client Name
   - Service type icon
   - Days in column
   - Priority indicator (colored dot)
   - Assigned admin avatar
   - Quick action icons

6. **Drag & Drop:**
   - Valid transitions only
   - Confirmation modal for critical changes
   - Visual feedback on invalid drop

---

### AC 3.3.4: Payment Confirmation Flow

**Given** a Potential Client is in `awaiting_payment`
**When** admin confirms payment received
**Then**:

1. **Payment Details Modal:**
   - Amount received (required)
   - Payment method (required)
   - Payment date (required)
   - Transaction reference (optional)
   - Notes (optional)

2. **System Actions:**
   - Status → `payment_received`
   - Application ID generated
   - Token Link generated (48-char secure token)
   - Email queued with Token Link
   - Timeline entry created
   - Admin notification sent

3. **Token Link Email (via Resend):**
   ```
   Subject: [locale] Access Your Brasil Legalize Application Tracker
   
   - Welcome message
   - Application ID
   - Token Link button
   - Instructions to await password
   - Expiry notice (180 days)
   - Contact info
   ```

4. **Password Delivery:**
   - Admin notified to send password separately
   - UI shows "Password not sent" warning
   - Admin can mark as "Password sent" with method (Email/WhatsApp)

---

### AC 3.3.5: Application Detail Page

**Given** an admin clicks an application
**When** navigating to `/admin/applications/[id]`
**Then** the page displays:

1. **Header:**
   - Lead ID + Application ID (if applicable)
   - Client name + contact shortcuts
   - Phase badge (Lead/Potential/Client)
   - Status badge (large, color-coded)
   - "Change Status" button
   - "Send Notification" button
   - Assignment dropdown

2. **Alert Bar (conditional):**
   - ⚠️ "Payment pending for 7 days"
   - ⚠️ "Documents overdue"
   - ⚠️ "Password not sent to client"
   - ⚠️ "No activity for 14 days"

3. **Tabs:**
   - Overview
   - Documents (Phase 3 only)
   - Timeline
   - Communications
   - Notes
   - Payment History (Phase 2+)

---

### AC 3.3.6: Application Overview Tab

**Given** the Overview tab is active
**Then** sections include:

1. **Progress Tracker:**
   - Visual phase indicator (1 → 2 → 3)
   - Current phase highlighted
   - Status within phase shown

2. **Client Information:**
   - Name, email, phone, locale
   - Eligibility answers summary
   - Communication preferences

3. **Service Details:**
   - Selected service/package
   - Price quoted
   - Payment status + history link
   - Services included checklist

4. **Application Stats:**
   - Lead Date
   - Payment Date (if applicable)
   - Days as Lead → Potential → Client
   - Total journey duration
   - Documents: X/Y uploaded

5. **Quick Actions:**
   - 📧 Send Email
   - 💬 Send WhatsApp
   - 📅 Schedule Meeting
   - 📄 Request Document
   - 🔗 Resend Token Link

---

### AC 3.3.7: Change Status Modal

**Given** an admin clicks "Change Status"
**When** the modal opens
**Then**:

1. **Current State:**
   - Current Phase + Status badge
   - Days in this status

2. **Available Transitions:**
   - Buttons for valid next statuses only
   - Grouped by action type:
     - Progress Forward →
     - Needs Attention ⚠️
     - Close/Archive ✕

3. **Conditional Fields:**

| Transition | Required Fields |
|------------|-----------------|
| → meeting_scheduled | Meeting datetime, method (video/in-person) |
| → proposal_sent | Package, quoted price |
| → payment_received | Amount, method, date, reference |
| → documents_rejected | Rejection reasons (checkboxes + custom) |
| → submitted | Submission date, reference number |
| → rejected | Rejection reason |
| → on_hold | Hold reason, expected resume date |
| → closed | Close reason |

4. **Notification Options:**
   - [ ] Notify client (pre-checked for client-facing statuses)
   - [ ] Custom message (optional)

5. **Confirmation:**
   - Summary of changes
   - "Confirm" / "Cancel" buttons

---

### AC 3.3.8: Notification System - Admin

**Given** events occur in the system
**When** notifications are triggered
**Then** admins receive:

| Event | Notification | Delivery |
|-------|--------------|----------|
| New lead | "New lead: {name}" | In-app + Email digest |
| Meeting in 1 hour | "Reminder: Meeting with {name}" | In-app |
| Payment received | "💰 Payment from {name}" | In-app + Email |
| Document uploaded | "📄 {name} uploaded {doc}" | In-app |
| Status stuck >7 days | "⚠️ {name} stuck in {status}" | Email |
| Client message | "💬 Message from {name}" | In-app |
| Urgent application | "🚨 Urgent: {name}" | In-app + SMS |

**Admin Notification Center:**
- Bell icon with unread count
- Dropdown with recent notifications
- "Mark all read" option
- Link to full notifications page
- Filter by type

---

### AC 3.3.9: Notification System - Client (via Resend)

**Given** client notification is triggered
**When** the status changes or action is needed
**Then** client receives email:

| Trigger | Email Type | Template |
|---------|------------|----------|
| `payment_received` | Welcome | token-link + instructions |
| `documents_pending` | Action Required | document list + tracker link |
| `documents_rejected` | Action Required | issues + reupload link |
| `documents_approved` | Progress Update | confirmation + next steps |
| `submitted` | Major Milestone | celebration + timeline |
| `additional_docs` | Urgent Action | document request + deadline |
| `approved` | Celebration | success + next steps |
| `completed` | Final | thank you + feedback request |

**Email Template Variables:**
```typescript
interface EmailContext {
  clientName: string;
  applicationId: string;
  currentStatus: string;
  trackerUrl: string;
  pendingActions?: PendingAction[];
  rejectionReasons?: string[];
  nextSteps?: string[];
  locale: 'en' | 'pt-br' | 'es' | 'ar';
}
```

**Resend Integration:**
```php
// Triggered automatically on status change
function sendClientNotification(
    int $applicationId,
    string $newStatus,
    array $context = []
): array {
    $app = getApplication($applicationId);
    $template = getEmailTemplate($newStatus, $app->locale);
    
    if (!$template->shouldSend) {
        return ['skipped' => true];
    }
    
    $resend = new Resend(getenv('RESEND_API_KEY'));
    
    return $resend->emails->send([
        'from' => 'Brasil Legalize <noreply@brasillegalize.com>',
        'to' => $app->email,
        'subject' => $template->subject,
        'html' => renderTemplate($template, $context),
        'tags' => [
            ['name' => 'application_id', 'value' => $app->id],
            ['name' => 'status', 'value' => $newStatus],
        ],
    ]);
}
```

---

### AC 3.3.10: Client Tracker Interface

**Given** a client accesses their tracker via token link
**When** authenticated with password
**Then** they see a **simplified tracker** (not a full portal):

1. **Header:**
   - Brasil Legalize logo
   - "Your Application Tracker"
   - Application ID
   - Locale selector

2. **Main Content - Progress Tracker:**
   ```
   ┌─────────────────────────────────────────────────┐
   │  Application #APP-2026-00042                    │
   │  Service: Brazilian Citizenship                 │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  ✅ Payment Confirmed                           │
   │  ✅ Onboarding Complete                         │
   │  ⏳ Documents In Review ← YOU ARE HERE          │
   │  ○ Application Preparation                      │
   │  ○ Submitted to Authorities                     │
   │  ○ Processing                                   │
   │  ○ Approved                                     │
   │                                                 │
   │  Last Update: Jan 30, 2026 at 2:30 PM          │
   └─────────────────────────────────────────────────┘
   ```

3. **Pending Actions (if any):**
   ```
   ┌─────────────────────────────────────────────────┐
   │  ⚠️ Action Required                            │
   ├─────────────────────────────────────────────────┤
   │  📄 Upload Birth Certificate                   │
   │     Please upload a certified copy             │
   │     [Upload Document]                          │
   │                                                │
   │  📄 Upload Proof of Address                    │
   │     Utility bill or bank statement             │
   │     [Upload Document]                          │
   └─────────────────────────────────────────────────┘
   ```

4. **Document Upload Section:**
   - Simple drag-drop upload
   - File type/size validation
   - Upload status indicator
   - View uploaded documents list

5. **Contact Section:**
   - Assigned advisor name
   - Contact options (email, WhatsApp)
   - Office hours

**NO Complex Features:**
- ❌ No messaging system
- ❌ No appointment scheduling
- ❌ No payment portal
- ❌ No settings/profile editing

---

### AC 3.3.11: Documents Tab (Admin)

**Given** viewing a Phase 3 application
**When** the Documents tab is selected
**Then**:

1. **Required Documents Checklist:**
   - Based on selected service/package
   - Status per document: ⬜ Pending, 📤 Uploaded, ✅ Approved, ❌ Rejected

2. **Uploaded Documents:**
   - Thumbnail preview
   - Document name + type
   - Uploaded date
   - Status badge
   - Actions: View, Download, Approve, Reject, Request New

3. **Reject Document Modal:**
   - Checkboxes for common issues:
     - [ ] Image quality too low
     - [ ] Document expired
     - [ ] Wrong document type
     - [ ] Missing translation
     - [ ] Information illegible
     - [ ] Other: ________
   - Auto-notifies client with issues

4. **Request Document:**
   - Document type dropdown
   - Custom instructions
   - Deadline (optional)
   - Sends email to client

---

### AC 3.3.12: Timeline Tab

**Given** the Timeline tab is selected
**Then**:

1. **Visual Timeline:**
   - Vertical line with event nodes
   - Color-coded by event type:
     - 🔵 Blue: Status changes
     - 🟡 Yellow: Client actions
     - ⚪ Gray: Admin actions
     - 📧 Purple: Communications

2. **Event Types:**
   - Status changes (from → to)
   - Document uploads
   - Document reviews (approved/rejected)
   - Emails sent
   - Admin notes
   - Payment records
   - Assignment changes

3. **Event Details:**
   - Timestamp (relative + absolute)
   - Actor (Admin name, Client, System)
   - Description
   - Related links

4. **Filters:**
   - All events
   - Status changes only
   - Client actions only
   - Communications only

---

### AC 3.3.13: Communications Tab

**Given** the Communications tab is selected
**Then**:

1. **Email History:**
   - All emails sent to client
   - Subject, date, status (sent/delivered/opened)
   - Preview content
   - Resend option

2. **Send Manual Email:**
   - Template selector (or custom)
   - Subject line
   - Body (rich text)
   - Send button
   - Logs to timeline

3. **WhatsApp Log:**
   - Manual entries by admin
   - Date, summary, admin name
   - "Log WhatsApp Contact" button

---

### AC 3.3.14: Notes Tab

**Given** the Notes tab is selected
**Then**:

1. **Internal Notes:**
   - Only visible to admins
   - Markdown supported
   - Pinnable notes
   - Author + timestamp

2. **Add Note:**
   - Text area
   - [ ] Pin this note
   - Save button

---

### AC 3.3.15: Create Lead Manually

**Given** admin clicks "Create Lead"
**Then** the form includes:

| Field | Required | Notes |
|-------|----------|-------|
| Full Name | Yes | |
| Email | Yes | Unique validation |
| Phone | Yes | WhatsApp format |
| Preferred Locale | Yes | en, pt-br, es, ar |
| Service Interest | Yes | From services list |
| Source | Yes | Referral, Website, Social, etc. |
| Notes | No | Initial notes |

**On Submit:**
- Lead ID generated
- Status = `new_lead`
- Timeline entry created
- Admin notified

---

### AC 3.3.16: Bulk Actions

**Given** multiple items selected
**When** admin performs bulk action
**Then** available actions:

| Action | Available For | Notes |
|--------|--------------|-------|
| Change Status | Same status items | Valid transitions only |
| Assign To | Any | Select admin |
| Send Reminder | documents_pending | Batch email |
| Export | Any | CSV download |
| Archive | Closed items | Move to archive |

---

### AC 3.3.17: Dashboard Integration

**Given** admin views dashboard
**Then** Application widgets show:

1. **Pipeline Overview:**
   - Leads: X new, Y contacted, Z scheduled
   - Potential: X proposals, Y awaiting payment
   - Active: X in progress, Y documents pending

2. **Action Required:**
   - Applications stuck >7 days
   - Documents pending review
   - Payments overdue
   - Meetings today

3. **My Applications:**
   - Assigned to current admin
   - Sorted by priority/age

4. **Recent Activity:**
   - Latest 10 events across all applications

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/admin/applications/page.tsx` | Create | Application list |
| `app/admin/applications/[id]/page.tsx` | Create | Application detail |
| `app/admin/applications/new/page.tsx` | Create | Create lead |
| `app/[locale]/track/[token]/page.tsx` | Create | Client tracker |
| `components/admin/applications/` | Create | All components |
| `lib/admin/applicationWorkflow.ts` | Create | Workflow logic |
| `lib/notifications/` | Create | Notification services |
| `api/admin/applications/` | Create | API endpoints |
| `api/admin/notifications/` | Create | Notification APIs |
| `api/lib/NotificationService.php` | Create | Notification logic |
| `api/lib/ResendService.php` | Create | Resend integration |

---

### Database Schema

```sql
-- Leads table (all start here)
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Contact info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    preferred_locale ENUM('en', 'pt-br', 'es', 'ar') DEFAULT 'en',
    
    -- Lead info
    service_interest VARCHAR(100),
    source ENUM('website', 'referral', 'social', 'ad', 'other') DEFAULT 'website',
    eligibility_data JSON,
    
    -- Phase & Status
    phase ENUM('lead', 'potential', 'client') NOT NULL DEFAULT 'lead',
    status VARCHAR(50) NOT NULL DEFAULT 'new_lead',
    status_changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Assignment
    assigned_to INT,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (phase, status),
    INDEX idx_email (email),
    INDEX idx_assigned (assigned_to),
    FOREIGN KEY (assigned_to) REFERENCES admins(id)
);

-- Applications table (created when payment received)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(20) UNIQUE NOT NULL,
    lead_id INT NOT NULL UNIQUE,
    
    -- Service & Package
    service_type VARCHAR(100) NOT NULL,
    package_id INT,
    quoted_price DECIMAL(10,2),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'payment_received',
    status_changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Token access
    token_id INT UNIQUE,
    password_sent BOOLEAN DEFAULT FALSE,
    password_sent_method ENUM('email', 'whatsapp') NULL,
    password_sent_at DATETIME NULL,
    
    -- Assignment
    assigned_to INT,
    
    -- Dates
    expected_completion DATE,
    actual_completion DATE,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_lead (lead_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (token_id) REFERENCES tokens(id),
    FOREIGN KEY (assigned_to) REFERENCES admins(id)
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    application_id INT,
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    method ENUM('bank_transfer', 'credit_card', 'pix', 'cash', 'other') NOT NULL,
    reference VARCHAR(255),
    
    payment_date DATE NOT NULL,
    received_by INT NOT NULL,
    notes TEXT,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_lead (lead_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (received_by) REFERENCES admins(id)
);

-- Timeline events
CREATE TABLE timeline_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    application_id INT,
    
    event_type ENUM(
        'status_change', 'phase_change',
        'document_uploaded', 'document_approved', 'document_rejected',
        'email_sent', 'whatsapp_logged',
        'note_added', 'assignment_changed',
        'payment_received', 'meeting_scheduled', 'meeting_completed',
        'created'
    ) NOT NULL,
    
    actor_type ENUM('admin', 'client', 'system') NOT NULL,
    actor_id INT,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSON,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_lead (lead_id),
    INDEX idx_application (application_id),
    INDEX idx_created (created_at),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- Admin notifications
CREATE TABLE admin_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    
    type ENUM('new_lead', 'payment', 'document', 'message', 'reminder', 'alert') NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    
    lead_id INT,
    application_id INT,
    
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_admin (admin_id),
    INDEX idx_read (admin_id, read_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- Client email logs
CREATE TABLE client_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    application_id INT,
    
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_used VARCHAR(100),
    
    resend_message_id VARCHAR(100),
    status ENUM('queued', 'sent', 'delivered', 'opened', 'failed') DEFAULT 'queued',
    
    sent_at DATETIME,
    delivered_at DATETIME,
    opened_at DATETIME,
    
    error_message TEXT,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_lead (lead_id),
    INDEX idx_resend (resend_message_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id),
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- Generate lead number function
DELIMITER //
CREATE FUNCTION generate_lead_number() RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE seq_num INT;
    
    SET year_part = YEAR(CURDATE());
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(lead_number, 9) AS UNSIGNED)), 0) + 1
    INTO seq_num
    FROM leads
    WHERE lead_number LIKE CONCAT('BL-', year_part, '-%');
    
    RETURN CONCAT('BL-', year_part, '-', LPAD(seq_num, 5, '0'));
END //
DELIMITER ;

-- Generate application number function
DELIMITER //
CREATE FUNCTION generate_application_number() RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE seq_num INT;
    
    SET year_part = YEAR(CURDATE());
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number, 10) AS UNSIGNED)), 0) + 1
    INTO seq_num
    FROM applications
    WHERE application_number LIKE CONCAT('APP-', year_part, '-%');
    
    RETURN CONCAT('APP-', year_part, '-', LPAD(seq_num, 5, '0'));
END //
DELIMITER ;
```

---

### Workflow Logic

```typescript
// lib/admin/applicationWorkflow.ts

export type Phase = 'lead' | 'potential' | 'client';

export type LeadStatus = 
  | 'new_lead' | 'contacted' | 'meeting_scheduled' | 'no_show' | 'not_interested';

export type PotentialStatus = 
  | 'meeting_completed' | 'proposal_sent' | 'negotiating' 
  | 'awaiting_payment' | 'payment_overdue' | 'declined' | 'closed_lost';

export type ClientStatus =
  | 'payment_received' | 'onboarding' | 'documents_pending' | 'documents_received'
  | 'documents_review' | 'documents_rejected' | 'documents_approved'
  | 'application_prep' | 'under_review' | 'submitted' | 'processing'
  | 'additional_docs' | 'approved' | 'rejected' | 'appeal' | 'completed'
  | 'on_hold' | 'closed';

export type Status = LeadStatus | PotentialStatus | ClientStatus;

export interface StatusConfig {
  label: string;
  phase: Phase;
  color: 'gray' | 'blue' | 'yellow';
  allowedTransitions: Status[];
  requiresFields: string[];
  notifyClient: boolean;
  emailTemplate?: string;
}

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  // PHASE 1: LEAD
  new_lead: {
    label: 'New Lead',
    phase: 'lead',
    color: 'gray',
    allowedTransitions: ['contacted'],
    requiresFields: [],
    notifyClient: false,
  },
  contacted: {
    label: 'Contacted',
    phase: 'lead',
    color: 'blue',
    allowedTransitions: ['meeting_scheduled', 'not_interested'],
    requiresFields: [],
    notifyClient: false,
  },
  meeting_scheduled: {
    label: 'Meeting Scheduled',
    phase: 'lead',
    color: 'yellow',
    allowedTransitions: ['meeting_completed', 'no_show'],
    requiresFields: ['meeting_datetime', 'meeting_method'],
    notifyClient: true,
    emailTemplate: 'meeting_confirmation',
  },
  no_show: {
    label: 'No Show',
    phase: 'lead',
    color: 'gray',
    allowedTransitions: ['meeting_scheduled', 'not_interested'],
    requiresFields: [],
    notifyClient: false,
  },
  not_interested: {
    label: 'Not Interested',
    phase: 'lead',
    color: 'gray',
    allowedTransitions: [],
    requiresFields: ['close_reason'],
    notifyClient: false,
  },
  
  // PHASE 2: POTENTIAL CLIENT
  meeting_completed: {
    label: 'Meeting Completed',
    phase: 'potential',
    color: 'blue',
    allowedTransitions: ['proposal_sent'],
    requiresFields: [],
    notifyClient: false,
  },
  proposal_sent: {
    label: 'Proposal Sent',
    phase: 'potential',
    color: 'yellow',
    allowedTransitions: ['awaiting_payment', 'negotiating', 'declined'],
    requiresFields: ['package_id', 'quoted_price'],
    notifyClient: true,
    emailTemplate: 'proposal',
  },
  negotiating: {
    label: 'Negotiating',
    phase: 'potential',
    color: 'yellow',
    allowedTransitions: ['proposal_sent', 'awaiting_payment', 'declined'],
    requiresFields: [],
    notifyClient: false,
  },
  awaiting_payment: {
    label: 'Awaiting Payment',
    phase: 'potential',
    color: 'yellow',
    allowedTransitions: ['payment_received', 'payment_overdue'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'payment_instructions',
  },
  payment_overdue: {
    label: 'Payment Overdue',
    phase: 'potential',
    color: 'gray',
    allowedTransitions: ['payment_received', 'closed_lost'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'payment_reminder',
  },
  declined: {
    label: 'Declined',
    phase: 'potential',
    color: 'gray',
    allowedTransitions: [],
    requiresFields: ['decline_reason'],
    notifyClient: false,
  },
  closed_lost: {
    label: 'Closed - Lost',
    phase: 'potential',
    color: 'gray',
    allowedTransitions: [],
    requiresFields: ['close_reason'],
    notifyClient: false,
  },
  
  // PHASE 3: CLIENT
  payment_received: {
    label: 'Payment Received',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['onboarding'],
    requiresFields: ['payment_amount', 'payment_method', 'payment_date'],
    notifyClient: true,
    emailTemplate: 'welcome_token_link',
  },
  onboarding: {
    label: 'Onboarding',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['documents_pending'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'onboarding_welcome',
  },
  documents_pending: {
    label: 'Documents Pending',
    phase: 'client',
    color: 'yellow',
    allowedTransitions: ['documents_received'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'documents_request',
  },
  documents_received: {
    label: 'Documents Received',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['documents_review'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'documents_received_confirmation',
  },
  documents_review: {
    label: 'Documents Under Review',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['documents_approved', 'documents_rejected'],
    requiresFields: [],
    notifyClient: false,
  },
  documents_rejected: {
    label: 'Documents Rejected',
    phase: 'client',
    color: 'yellow',
    allowedTransitions: ['documents_pending'],
    requiresFields: ['rejection_reasons'],
    notifyClient: true,
    emailTemplate: 'documents_rejected',
  },
  documents_approved: {
    label: 'Documents Approved',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['application_prep'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'documents_approved',
  },
  application_prep: {
    label: 'Application Preparation',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['under_review'],
    requiresFields: [],
    notifyClient: false,
  },
  under_review: {
    label: 'Under Review',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['submitted'],
    requiresFields: [],
    notifyClient: false,
  },
  submitted: {
    label: 'Submitted',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['processing'],
    requiresFields: ['submission_date', 'submission_reference'],
    notifyClient: true,
    emailTemplate: 'application_submitted',
  },
  processing: {
    label: 'Processing',
    phase: 'client',
    color: 'yellow',
    allowedTransitions: ['additional_docs', 'approved', 'rejected'],
    requiresFields: [],
    notifyClient: false,
  },
  additional_docs: {
    label: 'Additional Documents Required',
    phase: 'client',
    color: 'yellow',
    allowedTransitions: ['documents_pending'],
    requiresFields: ['required_documents'],
    notifyClient: true,
    emailTemplate: 'additional_documents_urgent',
  },
  approved: {
    label: 'Approved',
    phase: 'client',
    color: 'blue',
    allowedTransitions: ['completed'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'application_approved',
  },
  rejected: {
    label: 'Rejected',
    phase: 'client',
    color: 'gray',
    allowedTransitions: ['appeal', 'closed'],
    requiresFields: ['rejection_reason'],
    notifyClient: true,
    emailTemplate: 'application_rejected',
  },
  appeal: {
    label: 'Appeal',
    phase: 'client',
    color: 'yellow',
    allowedTransitions: ['processing', 'closed'],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'appeal_filed',
  },
  completed: {
    label: 'Completed',
    phase: 'client',
    color: 'blue',
    allowedTransitions: [],
    requiresFields: [],
    notifyClient: true,
    emailTemplate: 'completion_congratulations',
  },
  on_hold: {
    label: 'On Hold',
    phase: 'client',
    color: 'gray',
    allowedTransitions: [], // Dynamic based on previous status
    requiresFields: ['hold_reason'],
    notifyClient: true,
    emailTemplate: 'application_on_hold',
  },
  closed: {
    label: 'Closed',
    phase: 'client',
    color: 'gray',
    allowedTransitions: [],
    requiresFields: ['close_reason'],
    notifyClient: true,
    emailTemplate: 'application_closed',
  },
};

// Color mappings for UI
export const PHASE_COLORS = {
  lead: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  potential: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
  client: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
};

export const STATUS_COLORS = {
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
};

export function canTransition(from: Status, to: Status): boolean {
  const config = STATUS_CONFIG[from];
  return config.allowedTransitions.includes(to);
}

export function getPhaseForStatus(status: Status): Phase {
  return STATUS_CONFIG[status].phase;
}

export function shouldNotifyClient(status: Status): boolean {
  return STATUS_CONFIG[status].notifyClient;
}

export function getRequiredFields(status: Status): string[] {
  return STATUS_CONFIG[status].requiresFields;
}
```

---

## Testing Requirements

### Unit Tests

| Test | Description | Expected |
|------|-------------|----------|
| `lead-number-generation` | Generate unique lead ID | Format BL-YYYY-NNNNN |
| `app-number-generation` | Generate app ID on payment | Format APP-YYYY-NNNNN |
| `workflow-valid-transition` | Lead → Potential → Client | Allowed |
| `workflow-invalid-transition` | new_lead → completed | Blocked |
| `payment-triggers-token` | Payment confirmed | Token generated |
| `notification-sent` | Status with notifyClient | Email queued |

### Integration Tests

| Test | Description | Expected |
|------|-------------|----------|
| `lead-to-client-flow` | Full journey | All stages work |
| `resend-integration` | Email delivery | Email sent via Resend |
| `token-generation` | Payment → Token | Token created, email sent |
| `document-upload` | Client uploads | Appears in admin view |

---

## Definition of Done

- [ ] Lead management CRUD
- [ ] Application management CRUD
- [ ] Pipeline/Kanban views
- [ ] Status transitions with validation
- [ ] Payment confirmation flow
- [ ] Token link generation on payment
- [ ] Client tracker interface
- [ ] Document upload functionality
- [ ] Admin notification system
- [ ] Client email notifications (Resend)
- [ ] Timeline tracking
- [ ] All tests pass
- [ ] Code reviewed

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |
| 2026-01-31 | Updated | Complete rewrite: Lead→Potential→Client flow, notification system, tracker vs portal, color scheme |
