---
title: 'Brasil Legalize – Marketing + Lead Intake + Token-Link Case Flow'
slug: 'brasil-legalize-marketing-lead-intake-token-link-case-flow'
created: '2026-01-30'
status: 'Implementation Complete - Reviewed'
stepsCompleted: [1, 2, 3, 4, 5]
adversarial_review_resolved: true
tech_stack:
  - Next.js
  - PHP (Hostinger backend APIs)
  - Hostinger shared hosting
  - Resend (email)
  - Calendly (booking)
  - Stripe Sandbox (payments demo)
files_to_modify:
  - app/
  - app/(public)/
  - app/eligibility/
  - app/book/
  - app/upload/[token]/
  - app/status/[token]/
  - app/admin/
  - api/ (PHP endpoints)
  - storage/cases/
code_patterns:
  - Next.js App Router with route groups for public/admin
  - Locale-based routing with RTL support for Arabic
  - Token-link access using long random tokens + expiry
  - PHP REST-style endpoints for auth, uploads, status, admin actions
  - Filesystem storage per caseId
test_patterns:
  - Manual E2E flow validation (RTL/LTR)
  - API smoke tests for token expiry, upload validation
---

# Tech-Spec: Brasil Legalize – Marketing + Lead Intake + Token-Link Case Flow

**Created:** 2026-01-30

## Overview

### Problem Statement

Need a multilingual, trust-first marketing site plus a no-login intake + document + status flow with team-only admin to convert visitors into qualified consultations and manage cases via token links.

### Solution

Build a single Next.js app (public + /admin) with PHP APIs on Hostinger. Use token-link flows for eligibility, document upload, and status pages. Email notifications via Resend, booking via Calendly, and payment demo via Stripe Sandbox.

### Scope

**In Scope:**
- Public SEO site (Home, Services, Process, Pricing, About/Trust, FAQ/Resources, Contact)
- Pricing page includes a package builder similar to provided reference component
- Eligibility pre-check (conditional, mobile-first)
- Lead capture + consent tracking
- Calendly booking + Stripe sandbox payment flow demo
- Document upload via expiring invite links
- Case status via private token link
- Admin console with password-based team accounts, pipeline, case record, templates, audit log
- Multilingual: Arabic (full RTL), English, Spanish, Brazilian Portuguese
- UI: clean minimal (Apple-like), light mode only, no emojis (icons only), Brazil-flag inspired palette (green/blue + hint of yellow)
- Token links valid 180 days, admin can extend
- Hostinger filesystem storage with per-case folders

**Out of Scope:**
- Client login portal
- Client self-service case editing
- Full legal case management replacement
- Third-party CRM integration (basic in-app tracking only)

## Context for Development

### Codebase Patterns

Confirmed Clean Slate (no existing app code found). Single app with public routes and admin routes. PHP backend provides API endpoints for admin auth, token-link flows, file upload, and case status.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| app/ | Next.js routes (public + admin) |
| app/eligibility/ | Multi-step eligibility flow |
| app/upload/[token]/ | Secure upload link page |
| app/status/[token]/ | Case status token page |
| app/admin/ | Admin console (auth, pipeline, cases) |
| api/ (PHP endpoints) | Auth, upload, token, admin APIs |
| storage/cases/ | Case document storage (filesystem) |

### Technical Decisions

- Single app deployment on Hostinger
- PHP APIs for backend actions (auth, uploads, token links, admin ops)
- Storage on Hostinger filesystem under per-case folders
- Resend for email notifications
- Calendly for booking + Stripe Sandbox for payment demo
- Multilingual UI with RTL support for Arabic
- Upload caps: default 25MB/file, 500MB/case (adjustable by config)

## Implementation Plan

### Tasks

- [x] Task 1: Define app structure, routing, and i18n/RTL foundation
  - File: app/layout.tsx
  - Action: Set global layout, include font setup, base metadata, light theme defaults
  - Notes: Ensure RTL support for Arabic with dir handling
- [x] Task 2: Add locale routing and language switcher
  - File: app/[locale]/layout.tsx
  - Action: Implement locale param, set dir/language per locale
  - Notes: Locales: ar, en, es, pt-br
- [x] Task 3: Build marketing page routes and shared UI
  - File: app/(public)/page.tsx
  - Action: Home page with CTA for Eligibility, Book, WhatsApp
  - Notes: Use light theme, icon-only accents, Brazil palette
- [x] Task 4: Add SEO service pages and resource content
  - File: app/(public)/services/[slug]/page.tsx
  - Action: Service templates: who it’s for, timeline, docs
  - Notes: Data-driven content structure per locale
- [x] Task 5: Implement Eligibility pre-check flow
  - File: app/eligibility/page.tsx
  - Action: Multi-step questionnaire with conditional logic
  - Notes: Save answers client-side, POST lead at end
- [x] Task 6: Lead capture + consent storage
  - File: api/leads.php
  - Action: Store lead, consent timestamp, policy version
  - Notes: Include country/city, service type, WhatsApp
- [x] Task 7: Booking + payment demo integration
  - File: app/book/page.tsx
  - Action: Embed Calendly; add Stripe sandbox product demo
  - Notes: Payment optional before booking
- [x] Task 7.1: Pricing page package builder
  - File: app/(public)/pricing/page.tsx
  - Action: Implement interactive package builder UI (drag/click add/remove) with price summary and email capture
  - Notes: Match provided component behavior and styling; no emojis (icons only)
- [x] Task 8: Admin auth and team console shell
  - File: app/admin/login/page.tsx
  - Action: Login form with PHP API auth
  - Notes: Password-based team accounts only
- [x] Task 9: Admin pipeline board and case detail view
  - File: app/admin/cases/page.tsx
  - Action: Pipeline statuses + basic case list
  - Notes: Statuses: New → Qualified → Docs pending → In review → Submitted → Completed
- [x] Task 10: Token-link invite + expiry management
  - File: api/tokens.php
  - Action: Generate long random tokens, set expiry 180 days
  - Notes: Admin can extend expiry
- [x] Task 11: Secure upload page + backend upload
  - File: app/upload/[token]/page.tsx
  - Action: Upload UI with progress, multi-file, camera capture
  - Notes: Enforce 25MB/file, 500MB/case
- [x] Task 12: Upload handling + storage
  - File: api/upload.php
  - Action: Validate token, save to /storage/cases/{caseId}/
  - Notes: Log file events for audit
- [x] Task 13: Status page via token link
  - File: app/status/[token]/page.tsx
  - Action: Read-only milestones + next actions
  - Notes: No indexing, robots noindex
- [x] Task 14: Notifications via Resend
  - File: api/notify.php
  - Action: Send confirmation + missing docs follow-up
  - Notes: Trigger on lead + upload completion
- [x] Task 15: Audit log for admin actions and file events
  - File: api/audit.php
  - Action: Record view/download/change events
  - Notes: Minimum admin actions + file events
- [x] Task 16: Privacy + consent pages and cookie banner
  - File: app/(public)/privacy/page.tsx
  - Action: LGPD-aware privacy, consent proof, withdrawal UI
  - Notes: Accept/Reject equal and revocable
- [x] Task 17: Security headers + rate limiting configuration
  - File: api/security.php
  - Action: Set HSTS, CSP, rate limits, WAF hooks
  - Notes: Apply to PHP endpoints
- [x] Task 18: Admin settings for templates and checklists
  - File: app/admin/templates/page.tsx
  - Action: CRUD templates for email/WhatsApp + checklist
  - Notes: Per service type

### Acceptance Criteria

- [ ] AC 1: Given a visitor on Home, when they click “Check Eligibility”, then they reach the eligibility flow in their selected language.
- [ ] AC 2: Given Arabic locale, when any page renders, then the UI is RTL and content is in Arabic.
- [ ] AC 3: Given a completed eligibility flow, when user submits, then the lead is saved with consent timestamp and policy version.
- [ ] AC 4: Given Calendly is available, when user opens booking page, then booking widget loads and timezone is correct.
- [ ] AC 5: Given Stripe sandbox is enabled, when user starts payment, then they can complete a sandbox checkout without errors.
- [ ] AC 6: Given an admin creates an upload link, when a client uses it, then only valid tokens allow upload and expired tokens are rejected.
- [ ] AC 7: Given files are uploaded, when upload completes, then files are stored under the case folder and a confirmation email is sent.
- [ ] AC 8: Given a status token link, when a client opens it, then they see milestones and required actions only (read-only).
- [ ] AC 9: Given a token link is older than 180 days, when accessed, then it is rejected unless admin extended it.
- [ ] AC 10: Given a user rejects cookies, when they browse, then analytics are not loaded and they can later change consent.
- [ ] AC 11: Given an admin action or file event, when it occurs, then an audit log entry is created.
- [ ] AC 12: Given upload limits, when a file exceeds 25MB or case exceeds 500MB, then upload is blocked with a clear error.

## Additional Context

### Dependencies

- Hostinger account with PHP support
- Resend API key
- Calendly integration setup
- Stripe sandbox keys
- PHP mailer or HTTP client for Resend API
- Environment config for locales and limits

### Testing Strategy

- Manual flow tests per language (RTL/LTR)
- Token link expiry and extension checks
- Upload size and type validation checks
- Admin auth/session checks
- Basic API smoke tests for tokens and uploads

### Notes

- Upload caps set to 25MB/file, 500MB/case (configurable).
- Future: swap storage to Supabase Storage if size/traffic grows.
