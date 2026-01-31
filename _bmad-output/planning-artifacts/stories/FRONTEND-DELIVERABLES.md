# Frontend Deliverables by Story

## Epic 1: Public Marketing & Lead Capture

### Story 1.1 - Localized Marketing Pages
1. `app/[locale]/page.tsx` - Hero, features, testimonials, CTA
2. `app/[locale]/about/page.tsx` - About us page
3. `app/[locale]/services/page.tsx` - Services listing
4. `app/[locale]/contact/page.tsx` - Contact form
5. `components/Header.tsx` - Nav with language switcher
6. `components/Footer.tsx` - Localized footer
7. `components/LanguageSwitcher.tsx` - Dropdown 4 locales
8. `middleware.ts` - Locale detection/routing
9. `lib/i18n.ts` - Translation utility
10. `locales/*.json` - EN, AR, ES, PT-BR strings
11. RTL stylesheet support for Arabic
12. SEO meta tags per locale

---

### Story 1.2 - Pricing Package Builder
1. `app/[locale]/pricing/page.tsx` - Pricing page
2. `components/PackageCard.tsx` - Individual package display
3. `components/PackageComparison.tsx` - Side-by-side table
4. `components/PriceCalculator.tsx` - Interactive calculator
5. `components/PackageSelector.tsx` - Selection UI
6. Currency display (BRL)
7. "Most Popular" badge component
8. Mobile-responsive pricing grid
9. CTA buttons per package

---

### Story 1.3 - Eligibility Flow
1. `app/[locale]/eligibility/page.tsx` - Multi-step form
2. `components/EligibilityWizard.tsx` - Step container
3. `components/eligibility/StepIndicator.tsx` - Progress bar
4. `components/eligibility/QuestionCard.tsx` - Question UI
5. `components/eligibility/ResultScreen.tsx` - Eligible/Not result
6. `hooks/useEligibility.ts` - State management
7. Form validation per step
8. Back/Next navigation
9. Session persistence (localStorage)
10. Animated transitions between steps

---

### Story 1.4 - Privacy, Consent & Cookies
1. `components/CookieBanner.tsx` - Bottom banner
2. `components/CookiePreferences.tsx` - Preference modal
3. `components/ConsentCheckbox.tsx` - Form checkbox
4. `app/[locale]/privacy/page.tsx` - Privacy policy
5. `app/[locale]/terms/page.tsx` - Terms of service
6. `lib/consent.ts` - Consent management
7. Cookie preference persistence
8. LGPD-compliant UI text

---

### Story 1.5 - Booking, Payment, WhatsApp
1. `components/CalendlyEmbed.tsx` - Calendly iframe
2. `components/StripeDemoForm.tsx` - Demo payment form
3. `components/WhatsAppButton.tsx` - Floating FAB
4. `app/[locale]/book/page.tsx` - Booking page
5. Mobile-responsive Calendly container
6. WhatsApp deep link with pre-filled message
7. Payment form validation UI

---

## Epic 2: Token-Link Client Case Flow

### Story 2.1 - Token-Link Generation
1. `app/[locale]/case/[token]/page.tsx` - Token entry point
2. `components/portal/TokenValidation.tsx` - Loading/error states
3. Token expired error page
4. Token invalid error page
5. Redirect logic to dashboard

---

### Story 2.2 - Client Case Portal
1. `app/[locale]/case/[token]/dashboard/page.tsx` - Dashboard
2. `components/portal/DashboardLayout.tsx` - Portal shell
3. `components/portal/CaseStatusCard.tsx` - Status display
4. `components/portal/ProgressTracker.tsx` - Visual progress
5. `components/portal/QuickActions.tsx` - Action buttons
6. `components/portal/PortalHeader.tsx` - Header with logout
7. `components/portal/PortalSidebar.tsx` - Navigation
8. Mobile-responsive portal layout
9. Session timeout warning modal

---

### Story 2.3 - Document Upload Management
1. `app/[locale]/case/[token]/documents/page.tsx` - Documents page
2. `components/portal/DocumentUpload.tsx` - Drag/drop uploader
3. `components/portal/DocumentList.tsx` - Uploaded docs grid
4. `components/portal/DocumentCard.tsx` - Single doc display
5. `components/portal/UploadProgress.tsx` - Progress bar
6. `components/portal/DocumentPreview.tsx` - Preview modal
7. File type icons
8. Status badges (pending/approved/rejected)
9. Error handling UI for failed uploads

---

### Story 2.4 - Messaging & Notifications
1. `app/[locale]/case/[token]/messages/page.tsx` - Messages page
2. `components/portal/MessageThread.tsx` - Conversation view
3. `components/portal/MessageComposer.tsx` - Input with attachments
4. `components/portal/MessageBubble.tsx` - Single message
5. `components/portal/NotificationBell.tsx` - Bell icon + dropdown
6. `components/portal/NotificationCenter.tsx` - Full notifications
7. Unread count badge
8. Real-time message updates
9. Typing indicator (optional)

---

### Story 2.5 - Password & Account Security
1. `app/[locale]/login/page.tsx` - Client login page
2. `app/[locale]/forgot-password/page.tsx` - Reset request
3. `app/[locale]/reset-password/[token]/page.tsx` - Reset form
4. `components/portal/SetPasswordPrompt.tsx` - Optional prompt
5. `components/portal/SetPasswordForm.tsx` - Password form
6. `components/portal/PasswordStrength.tsx` - Strength meter
7. `components/portal/ActiveSessions.tsx` - Session list
8. Password requirements checklist UI
9. Show/hide password toggle

---

## Epic 3: Admin Console & Operations

### Story 3.1 - Admin Authentication & Dashboard
1. `app/admin/login/page.tsx` - Admin login
2. `app/admin/dashboard/page.tsx` - Dashboard home
3. `app/admin/dashboard/layout.tsx` - Admin layout
4. `components/admin/Sidebar.tsx` - Navigation sidebar
5. `components/admin/Header.tsx` - Top header bar
6. `components/admin/GlobalSearch.tsx` - Search component
7. `components/admin/NotificationBell.tsx` - Notifications
8. `components/admin/ProfileDropdown.tsx` - Profile menu
9. `components/admin/StatsCard.tsx` - Metric cards
10. `components/admin/ActivityFeed.tsx` - Recent activity
11. MFA code entry screen
12. Responsive sidebar (collapsible)

---

### Story 3.2 - Client Management
1. `app/admin/clients/page.tsx` - Client list
2. `app/admin/clients/[id]/page.tsx` - Client detail
3. `components/admin/clients/ClientTable.tsx` - Data table
4. `components/admin/clients/ClientFilters.tsx` - Filter panel
5. `components/admin/clients/ClientSearch.tsx` - Search input
6. `components/admin/clients/ClientProfile.tsx` - Profile header
7. `components/admin/clients/ClientTabs.tsx` - Tab navigation
8. `components/admin/clients/EditClientModal.tsx` - Edit form
9. `components/admin/clients/RegenerateTokenModal.tsx` - Token modal
10. `components/admin/common/Pagination.tsx` - Pagination
11. `components/admin/common/StatusBadge.tsx` - Status badges
12. Bulk selection checkboxes

---

### Story 3.3 - Case Management & Workflow
1. `app/admin/cases/page.tsx` - Case list
2. `app/admin/cases/[id]/page.tsx` - Case detail
3. `components/admin/cases/CaseTable.tsx` - List view
4. `components/admin/cases/CaseKanban.tsx` - Kanban board
5. `components/admin/cases/CaseCard.tsx` - Draggable card
6. `components/admin/cases/KanbanColumn.tsx` - Column container
7. `components/admin/cases/ChangeStatusModal.tsx` - Status change
8. `components/admin/cases/CaseTimeline.tsx` - Event timeline
9. `components/admin/cases/CaseNotes.tsx` - Internal notes
10. `components/admin/cases/AssignmentDropdown.tsx` - Assign admin
11. Drag-and-drop functionality
12. Status color coding

---

### Story 3.4 - Admin Document Management
1. `app/admin/documents/page.tsx` - Documents list
2. `components/admin/documents/DocumentTable.tsx` - Data table
3. `components/admin/documents/DocumentPreview.tsx` - Preview modal
4. `components/admin/documents/DocumentReviewActions.tsx` - Actions
5. `components/admin/documents/RejectDocumentModal.tsx` - Rejection form
6. `components/admin/documents/UploadForClientModal.tsx` - Admin upload
7. `components/admin/documents/DocumentChecklist.tsx` - Requirements
8. `components/admin/documents/BatchActions.tsx` - Bulk actions
9. Zoom/rotate controls for preview
10. PDF page navigation

---

### Story 3.5 - Analytics, Reporting & Settings
1. `app/admin/reports/page.tsx` - Analytics dashboard
2. `app/admin/settings/page.tsx` - Settings overview
3. `app/admin/settings/admins/page.tsx` - Admin management
4. `components/admin/analytics/MetricCard.tsx` - Stat card
5. `components/admin/analytics/LineChart.tsx` - Time series
6. `components/admin/analytics/PieChart.tsx` - Distribution
7. `components/admin/analytics/BarChart.tsx` - Bar chart
8. `components/admin/analytics/FunnelChart.tsx` - Funnel
9. `components/admin/analytics/DateRangeSelector.tsx` - Date picker
10. `components/admin/settings/SettingsForm.tsx` - Settings form
11. `components/admin/settings/EmailTemplateEditor.tsx` - Template editor
12. Export report buttons (CSV/Excel/PDF)

---

## Summary Totals

| Epic | Stories | Frontend Files |
|------|---------|----------------|
| Epic 1 | 5 | ~40 components/pages |
| Epic 2 | 5 | ~45 components/pages |
| Epic 3 | 5 | ~55 components/pages |
| **Total** | **15** | **~140 files** |
