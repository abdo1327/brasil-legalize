---
storyId: "2.4"
epicId: "2"
title: "Client Email Notifications (Resend)"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-31"
completedAt: null
tags:
  - notifications
  - email
  - resend
  - communication
  - client-tracker
functionalRequirements:
  - FR12
  - FR13
nonFunctionalRequirements:
  - NFR1
  - NFR3
dependencies:
  - "2.1"
  - "3.3"
blockedBy:
  - "2.1"
blocks: []
---

# Story 2.4: Client Email Notifications (Resend)

## User Story

**As a** client,
**I want** to receive email notifications about my application status and required actions,
**So that** I stay informed without needing to constantly check the tracker.

---

## Story Description

This story implements the **automated email notification system** for clients using **Resend API**. Since the client interface is a simple tracker (not a messaging portal), all communication happens via email.

### Notification Types:
1. **Phase Updates** - Major milestones in the application journey
2. **Action Required** - When client needs to do something (upload docs)
3. **Document Status** - Document approved/rejected
4. **Reminders** - Pending actions that are overdue

### NO In-App Messaging:
- ❌ No chat/messaging system
- ❌ No inbox in the tracker
- All communication via email
- Client contacts advisor via email/WhatsApp directly

---

## Email Notification Matrix

| Trigger | Email Sent | Priority | Template |
|---------|------------|----------|----------|
| Payment confirmed | ✅ Welcome + Token Link | High | `welcome_token_link` |
| Onboarding started | ✅ Getting Started | Normal | `onboarding_start` |
| Documents requested | ✅ Action Required | High | `documents_request` |
| Document uploaded (client) | ❌ No email | - | - |
| Document approved | ✅ Progress Update | Normal | `document_approved` |
| Document rejected | ✅ Action Required | High | `document_rejected` |
| Application submitted | ✅ Major Milestone | High | `application_submitted` |
| Additional docs needed | ✅ Urgent Action | Urgent | `additional_docs_urgent` |
| Application approved | ✅ Celebration | High | `application_approved` |
| Application rejected | ✅ Important Update | High | `application_rejected` |
| Application completed | ✅ Final/Thank You | High | `completion` |
| On hold | ✅ Status Update | Normal | `on_hold` |
| Reminder (7 days pending) | ✅ Reminder | Normal | `reminder_pending` |
| Reminder (overdue) | ✅ Urgent Reminder | High | `reminder_overdue` |

---

## Acceptance Criteria

### AC 2.4.1: Welcome Email (Payment Confirmed)

**Given** payment is confirmed
**When** status changes to `payment_received`
**Then** email is sent:

**Subject:** Access Your Brasil Legalize Application Tracker

**Content:**
```
Hi {clientName},

Welcome to Brasil Legalize! Your payment has been confirmed.

Your Application ID: {applicationId}

Access your application tracker using the secure link below:

[Access My Tracker →]

IMPORTANT: You will receive your access password separately 
from your advisor via email or WhatsApp.

This link expires on {expiryDate}.

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Sent immediately on payment confirmation
- Contains tracker URL with token
- Mentions password will arrive separately
- Available in all 4 locales

---

### AC 2.4.2: Document Request Email

**Given** admin requests a document
**When** request is created
**Then** email is sent:

**Subject:** Action Required: {documentName} Needed

**Content:**
```
Hi {clientName},

We need you to upload a document for your application.

📄 Document Required: {documentName}

{instructions}

Please upload this document in your tracker:
[Upload Document →]

{deadline ? "Please submit by: {deadline}" : ""}

Questions? Contact your advisor at {advisorEmail}

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Sent immediately when admin requests
- Clear instructions included
- Deadline shown if applicable
- Direct link to tracker

---

### AC 2.4.3: Document Rejected Email

**Given** admin rejects a document
**When** rejection is saved
**Then** email is sent:

**Subject:** Action Required: Please Resubmit {documentName}

**Content:**
```
Hi {clientName},

Unfortunately, we couldn't accept the {documentName} you submitted.

❌ Reason: {rejectionReason}

Please upload a new version that addresses this issue:
[Upload Replacement →]

If you have questions about what's needed, contact your advisor.

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Sent immediately on rejection
- Clear rejection reason
- Direct upload link
- Tone is helpful, not harsh

---

### AC 2.4.4: Document Approved Email

**Given** admin approves a document
**When** approval is saved
**Then** email is sent:

**Subject:** ✅ {documentName} Approved

**Content:**
```
Hi {clientName},

Great news! Your {documentName} has been approved.

You can view your application progress in your tracker:
[View Progress →]

{remainingDocs > 0 ? 
  "You still have {remainingDocs} document(s) to submit." : 
  "All your documents are now complete! We'll proceed with the next steps."
}

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Positive, encouraging tone
- Shows remaining documents if any
- Links to tracker

---

### AC 2.4.5: Application Submitted Email

**Given** application is submitted to authorities
**When** status changes to `submitted`
**Then** email is sent:

**Subject:** 🚀 Your Application Has Been Submitted!

**Content:**
```
Hi {clientName},

Great news! Your {serviceType} application has been officially 
submitted to the authorities.

📋 Submission Details:
- Submission Date: {submissionDate}
- Reference Number: {referenceNumber}

What happens next:
1. The authorities will review your application
2. This typically takes {processingTime}
3. We'll notify you of any updates

You can track your progress here:
[View Progress →]

Thank you for trusting Brasil Legalize!

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Celebratory tone
- Includes submission details
- Sets expectations for processing time

---

### AC 2.4.6: Application Approved Email

**Given** application is approved
**When** status changes to `approved`
**Then** email is sent:

**Subject:** 🎉 Congratulations! Your Application is Approved!

**Content:**
```
Hi {clientName},

CONGRATULATIONS! 🎉

Your {serviceType} application has been APPROVED!

This is a major milestone in your immigration journey.

Next Steps:
{nextSteps}

View the details in your tracker:
[View My Application →]

Thank you for choosing Brasil Legalize. We're honored to have 
been part of your journey!

Best regards,
The Brasil Legalize Team
```

**Requirements:**
- Highly celebratory tone
- Clear next steps
- Emotional, personal message

---

### AC 2.4.7: Reminder Emails

**Given** client has pending actions for 7+ days
**When** daily reminder job runs
**Then** email is sent:

**Subject:** Reminder: {actionCount} pending action(s) for your application

**Content:**
```
Hi {clientName},

This is a friendly reminder that you have pending actions 
for your application:

{foreach pendingActions}
📄 {documentName}
   Requested: {requestDate}
   {deadline ? "Due: {deadline}" : ""}
{/foreach}

Please complete these as soon as possible to avoid delays:
[Complete Now →]

Need help? Contact your advisor at {advisorEmail}

Best regards,
Brasil Legalize Team
```

**Reminder Schedule:**
- First reminder: 7 days after request
- Second reminder: 14 days (marked urgent)
- Third reminder: 21 days (escalated to admin)

---

### AC 2.4.8: Urgent Document Request Email

**Given** authorities request additional documents
**When** status changes to `additional_docs`
**Then** email is sent:

**Subject:** ⚠️ URGENT: Additional Documents Required

**Content:**
```
Hi {clientName},

URGENT: The authorities have requested additional documents 
for your application.

This is time-sensitive. Please submit the following as soon 
as possible:

{foreach requiredDocs}
📄 {documentName}
   {instructions}
{/foreach}

Deadline: {deadline}

[Upload Documents Now →]

If you have questions, contact your advisor immediately:
📧 {advisorEmail}
💬 WhatsApp: {advisorPhone}

Best regards,
Brasil Legalize Team
```

**Requirements:**
- Marked as urgent
- Clear deadline
- Multiple contact options
- Sent immediately

---

### AC 2.4.9: Email Template System

**Given** emails need to be sent
**When** rendering templates
**Then**:

1. **Template Structure:**
   ```
   api/templates/email/
     ├── welcome_token_link.{locale}.html
     ├── welcome_token_link.{locale}.txt
     ├── documents_request.{locale}.html
     ├── documents_request.{locale}.txt
     ├── document_approved.{locale}.html
     ├── ...
   ```

2. **Locales:**
   - `en` - English
   - `pt-br` - Portuguese (Brazil)
   - `es` - Spanish
   - `ar` - Arabic (RTL)

3. **Template Variables:**
   - `{clientName}` - Client's name
   - `{applicationId}` - Application number
   - `{trackerUrl}` - Token-based tracker URL
   - `{documentName}` - Document label
   - `{advisorName}` - Assigned advisor
   - `{advisorEmail}` - Advisor email
   - `{deadline}` - Due date (if any)

---

### AC 2.4.10: Email Styling

**Given** an email is rendered
**When** it displays in client's inbox
**Then**:

1. **Header:**
   - Brasil Legalize logo
   - Brand colors (#004956, #00A19D, #F4C542)

2. **Body:**
   - Clean, readable layout
   - Mobile-responsive
   - Inline CSS (email compatibility)
   - Clear CTA buttons

3. **Footer:**
   - Company contact info
   - Unsubscribe link (if applicable)
   - Privacy policy link

4. **RTL for Arabic:**
   - `dir="rtl"` on HTML
   - Right-aligned text
   - Mirrored layout

---

### AC 2.4.11: Resend Integration

**Given** an email needs to be sent
**When** the email service is called
**Then**:

1. **API Call:**
   ```php
   $resend->emails->send([
       'from' => 'Brasil Legalize <noreply@brasillegalize.com>',
       'to' => $clientEmail,
       'reply_to' => 'contact@brasillegalize.com',
       'subject' => $subject,
       'html' => $htmlContent,
       'text' => $textContent,
       'tags' => [
           ['name' => 'type', 'value' => $emailType],
           ['name' => 'application', 'value' => $applicationId],
       ],
   ]);
   ```

2. **Response Handling:**
   - Store Resend message ID
   - Log success/failure
   - Retry on temporary failure

3. **Tracking:**
   - Store send status
   - Track delivery (via webhooks if available)
   - Track opens (optional)

---

### AC 2.4.12: Email Logging

**Given** any email is sent
**When** the send completes
**Then** log entry created:

```sql
CREATE TABLE client_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    
    resend_message_id VARCHAR(100),
    status ENUM('queued', 'sent', 'delivered', 'opened', 'failed') DEFAULT 'queued',
    
    sent_at DATETIME,
    delivered_at DATETIME,
    opened_at DATETIME,
    failed_at DATETIME,
    error_message TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_application (application_id),
    INDEX idx_type (email_type),
    INDEX idx_status (status),
    FOREIGN KEY (application_id) REFERENCES applications(id)
);
```

---

### AC 2.4.13: Email Preferences (Future)

**Given** client wants to manage notifications
**When** future feature implemented
**Then**:
- Unsubscribe from non-essential emails
- Cannot unsubscribe from required action emails
- Preference stored in lead/application record

**Note:** For MVP, all emails are sent. Preferences can be added later.

---

### AC 2.4.14: Admin View of Sent Emails

**Given** admin views application detail
**When** they click Communications tab
**Then** they see:

```
┌─────────────────────────────────────────────────────┐
│  📧 EMAILS SENT                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Jan 30, 2:30 PM                                    │
│  Subject: Action Required: Birth Certificate        │
│  Status: ✅ Delivered                               │
│  [View Content]                                     │
│                                                     │
│  Jan 25, 10:00 AM                                   │
│  Subject: Welcome to Brasil Legalize                │
│  Status: ✅ Opened                                  │
│  [View Content]                                     │
│                                                     │
│  [Resend Last Email]  [Send Custom Email]           │
└─────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Files to Create

| File | Description |
|------|-------------|
| `api/lib/EmailNotificationService.php` | Main notification service |
| `api/lib/ResendService.php` | Resend API wrapper |
| `api/lib/EmailTemplateRenderer.php` | Template rendering |
| `api/templates/email/*.html` | HTML templates |
| `api/templates/email/*.txt` | Plain text templates |
| `api/cron/send-reminders.php` | Daily reminder job |

---

### Email Notification Service

```php
<?php
// api/lib/EmailNotificationService.php

namespace BrasilLegalize\Api;

class EmailNotificationService
{
    private ResendService $resend;
    private EmailTemplateRenderer $renderer;
    private PDO $db;
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->resend = new ResendService();
        $this->renderer = new EmailTemplateRenderer();
    }
    
    /**
     * Send notification based on application event
     */
    public function notifyOnStatusChange(
        int $applicationId,
        string $newStatus,
        array $context = []
    ): ?array {
        $app = $this->getApplicationData($applicationId);
        $template = $this->getTemplateForStatus($newStatus);
        
        if (!$template) {
            return null; // No email for this status
        }
        
        $emailData = $this->renderer->render(
            $template,
            $app['preferred_locale'],
            array_merge($app, $context)
        );
        
        return $this->send(
            $applicationId,
            $newStatus,
            $app['email'],
            $emailData
        );
    }
    
    /**
     * Send document-related notification
     */
    public function notifyDocumentStatus(
        int $applicationId,
        string $documentName,
        string $status,
        ?string $rejectionReason = null
    ): ?array {
        $template = $status === 'approved' 
            ? 'document_approved' 
            : 'document_rejected';
            
        $app = $this->getApplicationData($applicationId);
        
        $emailData = $this->renderer->render(
            $template,
            $app['preferred_locale'],
            [
                ...$app,
                'documentName' => $documentName,
                'rejectionReason' => $rejectionReason,
            ]
        );
        
        return $this->send(
            $applicationId,
            $template,
            $app['email'],
            $emailData
        );
    }
    
    /**
     * Send reminder for pending actions
     */
    public function sendReminder(int $applicationId, array $pendingActions): ?array
    {
        $app = $this->getApplicationData($applicationId);
        
        $emailData = $this->renderer->render(
            'reminder_pending',
            $app['preferred_locale'],
            [
                ...$app,
                'pendingActions' => $pendingActions,
                'actionCount' => count($pendingActions),
            ]
        );
        
        return $this->send(
            $applicationId,
            'reminder',
            $app['email'],
            $emailData
        );
    }
    
    private function send(
        int $applicationId,
        string $emailType,
        string $recipientEmail,
        array $emailData
    ): array {
        $result = $this->resend->send([
            'to' => $recipientEmail,
            'subject' => $emailData['subject'],
            'html' => $emailData['html'],
            'text' => $emailData['text'],
            'tags' => [
                ['name' => 'type', 'value' => $emailType],
                ['name' => 'application', 'value' => (string) $applicationId],
            ],
        ]);
        
        // Log email
        $this->logEmail($applicationId, $emailType, $recipientEmail, $result);
        
        return $result;
    }
    
    private function getTemplateForStatus(string $status): ?string
    {
        $mapping = [
            'payment_received' => 'welcome_token_link',
            'onboarding' => 'onboarding_start',
            'documents_pending' => 'documents_request',
            'documents_approved' => 'document_approved',
            'submitted' => 'application_submitted',
            'additional_docs' => 'additional_docs_urgent',
            'approved' => 'application_approved',
            'rejected' => 'application_rejected',
            'completed' => 'completion',
            'on_hold' => 'on_hold',
        ];
        
        return $mapping[$status] ?? null;
    }
    
    private function logEmail(
        int $applicationId,
        string $emailType,
        string $recipientEmail,
        array $result
    ): void {
        $stmt = $this->db->prepare('
            INSERT INTO client_emails 
                (application_id, email_type, recipient_email, subject,
                 resend_message_id, status, sent_at)
            VALUES 
                (?, ?, ?, ?, ?, ?, NOW())
        ');
        
        $stmt->execute([
            $applicationId,
            $emailType,
            $recipientEmail,
            $result['subject'] ?? '',
            $result['id'] ?? null,
            $result['success'] ? 'sent' : 'failed',
        ]);
    }
}
```

---

### Daily Reminder Cron

```php
<?php
// api/cron/send-reminders.php
// Run daily via cron: 0 9 * * * php /path/to/send-reminders.php

require_once __DIR__ . '/../lib/bootstrap.php';

use BrasilLegalize\Api\EmailNotificationService;

$notificationService = new EmailNotificationService($db);

// Find applications with pending documents for 7+ days
$stmt = $db->query('
    SELECT 
        a.id as application_id,
        dr.id as request_id,
        dr.label as document_name,
        dr.created_at as request_date,
        dr.deadline
    FROM applications a
    JOIN document_requests dr ON dr.application_id = a.id
    LEFT JOIN documents d ON d.request_id = dr.id AND d.status = "approved"
    WHERE d.id IS NULL
    AND dr.created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
    AND a.status IN ("documents_pending", "onboarding")
');

$pendingByApplication = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $appId = $row['application_id'];
    if (!isset($pendingByApplication[$appId])) {
        $pendingByApplication[$appId] = [];
    }
    $pendingByApplication[$appId][] = [
        'documentName' => $row['document_name'],
        'requestDate' => $row['request_date'],
        'deadline' => $row['deadline'],
    ];
}

// Send reminders
foreach ($pendingByApplication as $appId => $pendingActions) {
    echo "Sending reminder for application {$appId}...\n";
    $notificationService->sendReminder($appId, $pendingActions);
}

echo "Done. Sent " . count($pendingByApplication) . " reminders.\n";
```

---

## Testing Requirements

### Unit Tests

| Test | Expected |
|------|----------|
| `template-render-en` | English template renders |
| `template-render-ar` | Arabic RTL template renders |
| `status-to-template` | Correct template selected |
| `email-logging` | Log entry created |

### Integration Tests

| Test | Expected |
|------|----------|
| `resend-send` | Email sent via API |
| `status-change-email` | Email triggered on change |
| `reminder-cron` | Reminders sent correctly |

---

## Definition of Done

- [ ] All email templates created (4 locales)
- [ ] Resend integration working
- [ ] Status change emails trigger
- [ ] Document status emails trigger
- [ ] Reminder cron job works
- [ ] Email logging complete
- [ ] Admin can view sent emails
- [ ] RTL Arabic templates work
- [ ] All tests pass

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story |
| 2026-01-31 | Updated | Changed from messaging to email notifications, aligned with tracker approach |
