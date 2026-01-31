---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/implementation-artifacts/tech-spec-brasil-legalize-marketing-lead-intake-token-link-case-flow.md
---

# Ahmed Felifal's Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Ahmed Felifal's Website, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Provide public SEO marketing pages (Home, Services, Process, Pricing, About/Trust, FAQ/Resources, Contact).
FR2: Provide a pricing page with an interactive package builder and price summary.
FR3: Provide an eligibility pre-check flow with conditional logic.
FR4: Capture leads with consent tracking (timestamp, version).
FR5: Provide booking page with Calendly embed.
FR6: Provide Stripe sandbox payment demo prior to booking.
FR7: Provide secure token-link document upload flow (no login).
FR8: Provide token-link case status view (read-only milestones).
FR9: Provide admin console with password-based team access.
FR10: Provide admin pipeline board and case list with defined statuses.
FR11: Provide token generation and 180-day expiry management (extendable by admin).
FR12: Validate uploads (type and size) and store under per-case folders.
FR13: Send notification emails on lead creation and upload completion (Resend).
FR14: Provide audit log for admin actions and file events.
FR15: Provide privacy and consent pages plus cookie banner with accept/reject parity and revocation.
FR16: Support multilingual UI (ar, en, es, pt-br) with RTL for Arabic.
FR17: Provide security headers and rate limiting on API endpoints.
FR18: Provide admin templates and checklists per service type.
FR19: Provide WhatsApp contact CTA from public pages.

### NonFunctional Requirements

NFR1: Must run on Hostinger shared hosting with PHP APIs.
NFR2: Token links must expire after 180 days unless extended.
NFR3: Upload limits: 25MB per file and 500MB per case (configurable).
NFR4: Arabic locale must render RTL consistently across all pages.
NFR5: UI must be light mode only, no emojis (icons only).
NFR6: UI palette must be Brazil‑flag inspired (green/blue + hint of yellow).
NFR7: Status pages must be noindex/robots excluded.
NFR8: Consent must be LGPD‑aware and revocable.
NFR9: API endpoints must enforce security headers (HSTS, CSP, etc.).
NFR10: API endpoints must enforce rate limiting (120 requests/min per IP).

### Additional Requirements

- Single Next.js app (public + admin routes) with PHP REST‑style endpoints.
- Files stored under storage/cases/{caseId}/ with data JSON under storage/data/.
- Use Resend for notifications, Calendly for booking, Stripe sandbox for demo payments.
- Token generation must use long random tokens.
- Multilingual routing with locale prefix and RTL handling.

### FR Coverage Map

FR1: Epic 1 - Public marketing pages
FR2: Epic 1 - Pricing + package builder
FR3: Epic 1 - Eligibility flow
FR4: Epic 1 - Lead capture + consent
FR5: Epic 1 - Calendly booking
FR6: Epic 1 - Stripe sandbox demo
FR7: Epic 2 - Token-link upload
FR8: Epic 2 - Token-link status
FR9: Epic 3 - Admin auth
FR10: Epic 3 - Pipeline + case list
FR11: Epic 2 - Token generation + expiry
FR12: Epic 2 - Upload validation + storage
FR13: Epic 2 - Notifications
FR14: Epic 3 - Audit log
FR15: Epic 1 - Privacy + cookie consent
FR16: Epic 1 - Multilingual + RTL
FR17: Epic 3 - Security headers + rate limit
FR18: Epic 3 - Templates + checklists
FR19: Epic 1 - WhatsApp CTA

## Epic List

### Epic 1: Public Marketing & Lead Capture
Visitors can discover services, understand pricing, and submit qualified leads in their language.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR15, FR16, FR19

### Epic 2: Token‑Link Client Case Flow
Clients can securely upload documents and check status via token links with notifications.
**FRs covered:** FR7, FR8, FR11, FR12, FR13

### Epic 3: Admin Console & Operations
Admins can securely manage cases, templates, audit logs, and platform governance.
**FRs covered:** FR9, FR10, FR14, FR17, FR18

---

## Epic 1: Public Marketing & Lead Capture

Visitors can discover services, understand pricing, and submit qualified leads in their language.

### Story 1.1: Localized Marketing Pages with RTL Support

As a visitor,
I want to browse marketing pages (Home, Services, Process, About, FAQ, Contact) in my preferred language,
So that I can understand the services offered clearly.

**Acceptance Criteria:**

**Given** a visitor selects a locale (en, ar, es, pt-br)
**When** they navigate to any public marketing page
**Then** the page content renders in the selected language
**And** Arabic locale renders with RTL direction on all elements
**And** the UI uses light theme with Brazil-flag palette (green/blue/yellow accent)
**And** no emojis appear; only icons are used for visual accents
**And** SEO meta tags are localized per page

**Technical Notes:**
- Implement locale routing via middleware with /[locale]/ prefix
- Store translations in lib/i18n.ts dictionary
- Set `dir="rtl"` and `lang="ar"` for Arabic locale in layout
- Pages: Home, Services (index + /[slug]), Process, About, FAQ, Contact

**FRs:** FR1, FR16

---

### Story 1.2: Pricing Page with Interactive Package Builder

As a visitor,
I want to build a custom service package and see real-time pricing,
So that I can estimate my costs before contacting the firm.

**Acceptance Criteria:**

**Given** I am on the Pricing page
**When** I add or remove services using the package builder UI
**Then** the price summary (monthly + setup + total) updates in real-time
**And** I can enter my email to receive package details
**And** submitting email creates a lead with serviceType "Package Builder"
**And** the UI matches the light theme with no emojis

**Given** I submit the package builder form without email
**When** validation runs
**Then** I see a clear error message requiring a valid email

**Given** I am a bot filling the honeypot field
**When** I submit the form
**Then** submission is silently accepted but not stored

**Technical Notes:**
- PackageBuilder component with category/item selection
- Price calculation logic in component state
- POST to /api/leads.php with honeypot spam protection
- Rate limit: max 3 submissions per contact per hour

**FRs:** FR2, FR4

---

### Story 1.3: Eligibility Pre-Check Flow with Conditional Logic

As a visitor,
I want to complete an eligibility questionnaire with conditional questions,
So that I can determine if I qualify for services before booking.

**Acceptance Criteria:**

**Given** I start the eligibility flow
**When** I answer each question
**Then** the next question adapts based on my previous answers (conditional logic)
**And** I can navigate back to change answers
**And** progress is saved client-side during the session

**Given** I complete all eligibility questions
**When** I submit the form
**Then** a lead is created with my answers, consent, and eligibility result
**And** I see a result page indicating eligibility status
**And** if eligible, I see CTAs to Book or contact via WhatsApp

**Given** I do not check the consent checkbox
**When** I try to submit
**Then** submission is blocked with a clear consent-required message

**Technical Notes:**
- Multi-step form with client-side state management
- Conditional question rendering based on previous answers
- Final submission POST to /api/leads.php with all answers
- Store consent timestamp and policy version

**FRs:** FR3, FR4

---

### Story 1.4: Privacy, Consent Pages & Cookie Banner

As a visitor,
I want to understand data practices and control my consent,
So that I feel secure sharing my information (LGPD compliance).

**Acceptance Criteria:**

**Given** I visit any page for the first time
**When** the page loads
**Then** a cookie banner appears with Accept and Reject options of equal prominence
**And** I can dismiss by choosing either option

**Given** I click Reject on the cookie banner
**When** analytics would normally load
**Then** no analytics scripts are loaded
**And** my preference is stored locally

**Given** I want to change my consent later
**When** I visit the Privacy page
**Then** I can view current consent status and revoke/update it

**Given** I visit the Privacy page
**When** the page renders
**Then** I see LGPD-aware privacy policy content
**And** consent proof mechanism is explained
**And** content is localized to my selected language

**Technical Notes:**
- CookieBanner component with localStorage preference
- Privacy page at /[locale]/privacy
- Consent state: accepted, rejected, or pending
- No analytics loaded if rejected or pending

**FRs:** FR15

---

### Story 1.5: Booking Page with Calendly + Stripe Demo + WhatsApp CTA

As a visitor,
I want to book a consultation and optionally view payment options,
So that I can schedule time and understand payment process.

**Acceptance Criteria:**

**Given** I visit the booking page
**When** the Calendly widget loads
**Then** I can select an available time slot in my timezone
**And** the widget is responsive and styled consistently

**Given** Stripe sandbox is enabled
**When** I view the payment demo section
**Then** I can see a Stripe checkout demo without real charges
**And** demo completion shows a success message

**Given** I am on any public page
**When** I look for contact options
**Then** I see a WhatsApp CTA (icon + link) that opens WhatsApp with pre-filled message
**And** the CTA is visible in header/footer or floating button

**Given** I am on the booking page in Arabic locale
**When** the page renders
**Then** the layout is RTL and content is in Arabic

**Technical Notes:**
- Embed Calendly inline or popup widget
- Stripe sandbox checkout with test keys (no real payments)
- WhatsApp link: https://wa.me/{number}?text={encoded_message}
- WhatsApp CTA in SiteHeader or SiteFooter component

**FRs:** FR5, FR6, FR19

---

## Epic 2: Token-Link Client Case Flow

Clients can securely upload documents and check case status via token links without logging in.

### Story 2.1: Token Generation and Expiry Management

As an admin,
I want to generate secure upload tokens for clients,
So that clients can upload documents without creating accounts.

**Acceptance Criteria:**

**Given** I am an authenticated admin
**When** I generate a token for a case
**Then** a 48-character hex token is created
**And** the token is linked to the caseId
**And** expiry is set to 180 days from creation
**And** the token record is stored in tokens.json

**Given** a token exists
**When** I view token details
**Then** I see token, caseId, createdAt, and expiresAt

**Given** a token is near expiry or expired
**When** I extend the token as admin
**Then** the expiresAt is updated to a new date
**And** an audit log entry is created

**Technical Notes:**
- POST /api/tokens.php to generate token
- Token: bin2hex(random_bytes(24)) = 48 chars
- Store in storage/data/tokens.json
- Admin can extend via PATCH or separate endpoint

**FRs:** FR11

---

### Story 2.2: Secure Document Upload Page

As a client with a valid token,
I want to upload required documents securely,
So that my case can proceed without visiting an office.

**Acceptance Criteria:**

**Given** I have a valid, non-expired token link
**When** I visit /upload/{token}
**Then** I see an upload UI with drag-drop, file picker, and camera capture options
**And** the page shows which documents are requested

**Given** I select files to upload
**When** I submit
**Then** files are uploaded with progress indication
**And** successful uploads show confirmation per file
**And** files are stored under storage/cases/{caseId}/

**Given** my token is expired
**When** I visit /upload/{token}
**Then** I see a clear "Token expired" message
**And** upload is blocked

**Given** I try to upload an invalid file type
**When** validation runs
**Then** I see an error specifying allowed types (pdf, jpg, jpeg, png)

**Technical Notes:**
- Page: app/upload/[token]/page.tsx
- POST to /api/upload.php with multipart form data
- Validate token before showing upload UI
- robots noindex meta tag

**FRs:** FR7, FR12

---

### Story 2.3: Upload Validation and Storage

As the system,
I want to validate uploaded files and store them securely,
So that only valid documents are accepted and organized by case.

**Acceptance Criteria:**

**Given** a file is uploaded via /api/upload.php
**When** the file is processed
**Then** token validity is checked (exists + not expired)
**And** file extension is validated (pdf, jpg, jpeg, png only)
**And** MIME type is validated against extension
**And** file size is checked (max 25MB per file)

**Given** validation passes
**When** the file is saved
**Then** it is stored at storage/cases/{caseId}/{timestamp}_{sanitized_filename}
**And** an audit log entry is created with caseId and filename

**Given** validation fails (type, size, or MIME mismatch)
**When** the API responds
**Then** a 400 error with clear message is returned
**And** partial uploads are rejected

**Given** total case size exceeds 500MB
**When** a new upload is attempted
**Then** the upload is blocked with a clear error

**Technical Notes:**
- Use finfo_file() for MIME validation
- Sanitize filename: remove special chars, add timestamp prefix
- Check cumulative case folder size before accepting

**FRs:** FR12

---

### Story 2.4: Case Status Page via Token Link

As a client with a valid token,
I want to check my case status and see next steps,
So that I stay informed without contacting the firm.

**Acceptance Criteria:**

**Given** I have a valid status token
**When** I visit /status/{token}
**Then** I see case milestones (New → Qualified → Docs pending → In review → Submitted → Completed)
**And** current status is highlighted
**And** I see any required actions (e.g., "Upload missing documents")

**Given** my token is expired
**When** I visit /status/{token}
**Then** I see a "Token expired" message
**And** no case details are shown

**Given** I visit the status page
**When** the page renders
**Then** robots noindex meta tag is present
**And** the page is read-only (no edits allowed)

**Technical Notes:**
- Page: app/status/[token]/page.tsx
- GET /api/status.php?token={token} to fetch case data
- Display milestone timeline UI
- Localized content based on URL locale

**FRs:** FR8

---

### Story 2.5: Email Notifications on Lead and Upload

As a client,
I want to receive email confirmations for my submissions,
So that I have a record and know my documents were received.

**Acceptance Criteria:**

**Given** I submit a lead form (eligibility or package builder)
**When** the lead is successfully created
**Then** a confirmation email is sent to my contact email via Resend
**And** the email includes a summary of my submission

**Given** I complete a document upload
**When** files are successfully stored
**Then** a confirmation email is sent listing uploaded files
**And** the email includes a link to check status (if applicable)

**Given** documents are missing or follow-up is needed
**When** admin triggers a reminder
**Then** a follow-up email is sent to the client

**Given** email sending fails
**When** the API processes the request
**Then** the failure is logged but the main action (lead/upload) still succeeds
**And** admin can see failed emails in audit log

**Technical Notes:**
- POST to Resend API from /api/notify.php
- Templates stored in admin templates or hardcoded initially
- Log email events to audit.json

**FRs:** FR13

---

## Epic 3: Admin Console & Operations

Admins can securely authenticate, manage cases, configure templates, and monitor system activity.

### Story 3.1: Admin Authentication with Session Management

As an admin,
I want to log in securely with my credentials,
So that I can access the admin console.

**Acceptance Criteria:**

**Given** I visit /admin/login
**When** I enter valid email and password
**Then** I am authenticated and redirected to /admin/cases
**And** a session token is created with 2-hour expiry
**And** an audit log entry records the login

**Given** I enter invalid credentials
**When** I submit the login form
**Then** I see "Invalid credentials" error
**And** the failed attempt is logged

**Given** my session expires (2 hours)
**When** I try to access an admin page
**Then** I am redirected to /admin/login
**And** I see "Session expired" message

**Given** admin credentials are not configured
**When** I try to log in
**Then** I see "Server configuration error"
**And** the issue is logged

**Technical Notes:**
- POST /api/auth.php with email + password
- Credentials from ADMIN_EMAIL and ADMIN_PASSWORD_HASH env vars
- Use password_verify() with Argon2ID hash
- PHP session-based auth with session_start()

**FRs:** FR9, FR17

---

### Story 3.2: Admin Pipeline Board and Case List

As an admin,
I want to view all cases in a pipeline board,
So that I can prioritize work and track progress.

**Acceptance Criteria:**

**Given** I am authenticated as admin
**When** I visit /admin/cases
**Then** I see a list/board of all cases
**And** cases are grouped or filterable by status (New, Qualified, Docs pending, In review, Submitted, Completed)

**Given** I click on a case
**When** the detail view loads
**Then** I see case info: client name, contact, service type, documents, status, notes
**And** I can update case status
**And** I can add internal notes

**Given** I update a case status
**When** I save the change
**Then** the status is updated in cases.json
**And** an audit log entry is created

**Given** I am not authenticated
**When** I try to access /admin/cases
**Then** I am redirected to /admin/login

**Technical Notes:**
- GET /api/cases.php (requires auth) returns case list
- PATCH /api/cases.php to update status/notes
- All admin endpoints call require_admin_auth()

**FRs:** FR10

---

### Story 3.3: Token Link Management from Admin

As an admin,
I want to generate, view, and extend token links for cases,
So that clients can upload documents and check status.

**Acceptance Criteria:**

**Given** I am viewing a case detail
**When** I click "Generate Upload Link"
**Then** a new token is created for that case
**And** I see the full URL to share with the client
**And** I can copy the link to clipboard

**Given** a token exists for a case
**When** I view token details
**Then** I see created date, expiry date, and usage count

**Given** a token is expired or expiring soon
**When** I click "Extend Token"
**Then** I can set a new expiry date (up to 180 days from now)
**And** the extension is logged in audit

**Given** I want to revoke a token
**When** I click "Revoke"
**Then** the token is marked invalid
**And** subsequent access attempts are rejected

**Technical Notes:**
- Integrate token actions into case detail UI
- POST /api/tokens.php for create
- PATCH /api/tokens.php for extend/revoke

**FRs:** FR11

---

### Story 3.4: Email Templates and Checklists Management

As an admin,
I want to manage email templates and document checklists,
So that I can ensure consistent communication and requirements.

**Acceptance Criteria:**

**Given** I visit /admin/templates
**When** the page loads
**Then** I see a list of existing email templates
**And** I see document checklists per service type

**Given** I create or edit an email template
**When** I save
**Then** the template is stored in templates.json
**And** I can use it when sending notifications

**Given** I create or edit a checklist
**When** I save
**Then** the checklist is associated with a service type
**And** it appears on the upload page for that service

**Given** I delete a template or checklist
**When** I confirm deletion
**Then** the item is removed
**And** an audit log entry is created

**Technical Notes:**
- Page: app/admin/templates/page.tsx
- POST/PUT/DELETE /api/templates.php
- Store in storage/data/templates.json
- Checklists can be part of same or separate JSON

**FRs:** FR18

---

### Story 3.5: Audit Log and Security Monitoring

As an admin,
I want to view audit logs and ensure security measures are active,
So that I can monitor activity and investigate issues.

**Acceptance Criteria:**

**Given** I visit the audit log section
**When** the page loads
**Then** I see a chronological list of logged events
**And** each entry shows: event type, timestamp, IP, and details

**Given** events occur (login, case update, file upload, token actions)
**When** logged
**Then** entries appear in audit log with full context

**Given** I want to filter audit logs
**When** I apply filters (date range, event type, user)
**Then** results are filtered accordingly

**Given** API requests are made
**When** security headers are checked
**Then** HSTS, CSP, X-Frame-Options, X-Content-Type-Options are present
**And** rate limiting blocks more than 120 requests/min per IP

**Given** rate limit is exceeded
**When** another request is made
**Then** 429 Too Many Requests is returned

**Technical Notes:**
- GET /api/audit.php returns audit log (requires auth)
- Audit entries in storage/data/audit.json
- Security headers set in /api/security.php
- Rate limit tracking via temp files per IP

**FRs:** FR14, FR17

---

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

<!-- for each AC on this story -->

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}

<!-- End story repeat -->
