---
storyId: "2.2"
epicId: "2"
title: "Client Application Tracker"
status: "ready"
priority: "critical"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-31"
completedAt: null
tags:
  - client-tracker
  - progress
  - documents
  - frontend
  - token-auth
functionalRequirements:
  - FR8
  - FR12
nonFunctionalRequirements:
  - NFR1
  - NFR3
  - NFR5
dependencies:
  - "2.1"
blockedBy:
  - "2.1"
blocks:
  - "2.3"
---

# Story 2.2: Client Application Tracker

## User Story

**As a** client with valid access (token link + password),
**I want** to view my application progress and pending actions,
**So that** I stay informed about my immigration journey and know what's needed from me.

---

## Story Description

This story implements a **simplified tracker interface** for clients - NOT a full-featured portal. Clients access this tracker using their token link + password combination.

### What the Tracker IS:
- ✅ Progress visualization
- ✅ Pending actions list
- ✅ Document upload for required items
- ✅ View uploaded documents
- ✅ Contact information
- ✅ Notifications/updates display

### What the Tracker is NOT:
- ❌ No messaging system
- ❌ No appointment scheduling
- ❌ No payment functionality
- ❌ No profile editing
- ❌ No complex navigation

The interface must be simple, reassuring, and support all four locales including RTL for Arabic.

---

## Acceptance Criteria

### AC 2.2.1: Token + Password Authentication

**Given** a client clicks their tracker link (`/[locale]/track/{token}`)
**When** the page loads
**Then**:

1. **Token Validation:**
   - If invalid token: Show "Invalid Link" page
   - If expired token: Show "Link Expired" page with contact info
   - If revoked token: Same as invalid
   - If valid: Show password entry

2. **Password Entry:**
   - Clean, centered form
   - Password field with show/hide toggle
   - "Access My Application" button
   - "Forgot password? Contact your advisor" link

3. **Password Validation:**
   - If correct: Create session, show tracker
   - If incorrect: Show error with attempts remaining
   - If locked out: Show lockout message with timer

**UI Flow:**
```
Token Link → [Validating...] → Password Entry → [Verifying...] → Tracker
                ↓                    ↓
           [Invalid/Expired]    [Wrong Password]
```

---

### AC 2.2.2: Session Management

**Given** a client successfully authenticates
**When** they use the tracker
**Then**:
  - Session stored in sessionStorage
  - Session expires after 4 hours of inactivity
  - Page refresh maintains session
  - Closing browser clears session
  - Activity resets timeout

**Session Data:**
```typescript
interface TrackerSession {
  applicationId: number;
  applicationNumber: string;
  clientName: string;
  locale: string;
  authenticatedAt: string;
  expiresAt: string;
}
```

---

### AC 2.2.3: Tracker Layout

**Given** a client accesses their tracker
**When** the page renders
**Then** they see a **single-page layout**:

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]     Your Application Tracker      [🌐 EN ▾] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  APPLICATION #APP-2026-00042                        │    │
│  │  Service: Brazilian Citizenship                     │    │
│  │                                                     │    │
│  │  Current Status: Documents Under Review             │    │
│  │  ═══════════════════════════●═══════════════════    │    │
│  │                                                     │    │
│  │  Last Updated: Jan 30, 2026 at 2:30 PM             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📋 PROGRESS                                        │    │
│  │                                                     │    │
│  │  ✅ Payment Confirmed          Jan 15              │    │
│  │  ✅ Onboarding Complete        Jan 18              │    │
│  │  ✅ Documents Submitted        Jan 25              │    │
│  │  ⏳ Documents Under Review ← CURRENT               │    │
│  │  ○  Application Preparation                        │    │
│  │  ○  Submitted to Authorities                       │    │
│  │  ○  Processing                                     │    │
│  │  ○  Approved                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ⚠️ ACTION REQUIRED (2 items)                       │    │
│  │                                                     │    │
│  │  📄 Upload Birth Certificate                        │    │
│  │     Please upload a certified copy                  │    │
│  │     [Choose File]                                   │    │
│  │                                                     │    │
│  │  📄 Upload Proof of Address                         │    │
│  │     Utility bill or bank statement (last 3 months) │    │
│  │     [Choose File]                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📁 YOUR DOCUMENTS                                  │    │
│  │                                                     │    │
│  │  ✅ Passport Copy           Jan 20    [View]       │    │
│  │  ✅ ID Document             Jan 20    [View]       │    │
│  │  ⏳ Birth Certificate       Pending                │    │
│  │  ⏳ Proof of Address        Pending                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📞 NEED HELP?                                      │    │
│  │                                                     │    │
│  │  Your Advisor: Maria Santos                         │    │
│  │  📧 maria@brasillegalize.com                        │    │
│  │  💬 WhatsApp: +55 11 99999-9999                    │    │
│  │                                                     │    │
│  │  Office Hours: Mon-Fri 9:00 AM - 6:00 PM (BRT)     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Brasil Legalize  |  Privacy Policy  |  Terms       │
└─────────────────────────────────────────────────────────────┘
```

---

### AC 2.2.4: Application Status Card

**Given** the tracker loads
**When** the status card renders
**Then** it displays:

1. **Application ID** (large, prominent)
2. **Service Type** (what they're applying for)
3. **Current Status** with visual indicator:
   - 🔵 Blue: Active/In Progress
   - 🟡 Yellow: Needs Attention
   - ⚫ Gray: Waiting/On Hold
4. **Progress Bar** showing overall completion
5. **Last Updated** timestamp

**Status Display Mapping:**
```typescript
const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: string }> = {
  payment_received: { label: 'Payment Confirmed', color: 'blue', icon: '✅' },
  onboarding: { label: 'Setting Up', color: 'blue', icon: '🔵' },
  documents_pending: { label: 'Documents Needed', color: 'yellow', icon: '📄' },
  documents_received: { label: 'Documents Received', color: 'blue', icon: '📥' },
  documents_review: { label: 'Under Review', color: 'blue', icon: '🔍' },
  documents_rejected: { label: 'Resubmission Needed', color: 'yellow', icon: '⚠️' },
  documents_approved: { label: 'Documents Approved', color: 'blue', icon: '✅' },
  application_prep: { label: 'Preparing Application', color: 'blue', icon: '📝' },
  under_review: { label: 'Internal Review', color: 'blue', icon: '🔍' },
  submitted: { label: 'Submitted!', color: 'blue', icon: '🚀' },
  processing: { label: 'Processing', color: 'yellow', icon: '⏳' },
  additional_docs: { label: 'More Documents Needed', color: 'yellow', icon: '⚠️' },
  approved: { label: 'Approved!', color: 'blue', icon: '🎉' },
  completed: { label: 'Complete!', color: 'blue', icon: '✨' },
  on_hold: { label: 'On Hold', color: 'gray', icon: '⏸️' },
};
```

---

### AC 2.2.5: Progress Timeline

**Given** the tracker shows progress
**When** the timeline renders
**Then**:

1. **Completed Steps:**
   - ✅ Green checkmark
   - Date completed
   - Slightly muted color

2. **Current Step:**
   - ⏳ or 🔵 indicator
   - "← CURRENT" label
   - Highlighted/emphasized

3. **Future Steps:**
   - ○ Empty circle
   - Grayed out
   - No dates

**Progress Steps (ordered):**
```typescript
const PROGRESS_STEPS = [
  { key: 'payment', label: 'Payment Confirmed' },
  { key: 'onboarding', label: 'Onboarding Complete' },
  { key: 'documents', label: 'Documents Submitted' },
  { key: 'review', label: 'Documents Reviewed' },
  { key: 'preparation', label: 'Application Preparation' },
  { key: 'submitted', label: 'Submitted to Authorities' },
  { key: 'processing', label: 'Processing' },
  { key: 'approved', label: 'Approved' },
];
```

---

### AC 2.2.6: Pending Actions Section

**Given** the client has pending actions
**When** the section renders
**Then**:

1. **Header:**
   - "⚠️ ACTION REQUIRED" with count
   - Yellow background highlight

2. **Action Items:**
   - Document icon
   - Document name
   - Instructions/description
   - Upload button or link

3. **Upload Inline:**
   - "Choose File" button
   - Shows selected filename
   - Upload progress bar
   - Success confirmation

4. **Empty State:**
   - "🎉 No actions required!"
   - "We'll notify you when we need anything"

---

### AC 2.2.7: Document Upload Functionality

**Given** client needs to upload a document
**When** they click the upload button
**Then**:

1. **File Selection:**
   - Native file picker
   - Allowed: PDF, JPG, JPEG, PNG, WEBP
   - Max size: 10MB

2. **Validation (Client-Side):**
   - File type check
   - File size check
   - Shows error if invalid

3. **Upload Process:**
   - Progress bar during upload
   - Disable button during upload
   - Success message on complete

4. **Post-Upload:**
   - Document moves to "Your Documents" section
   - Status shows "⏳ Pending Review"
   - Admin notified

**Upload API:**
```typescript
// POST /api/client/documents/upload
// Form data with file
{
  document_type: 'birth_certificate',
  file: File,
}

// Response
{
  success: true,
  document: {
    id: 123,
    name: 'birth_certificate.pdf',
    uploaded_at: '2026-01-30T14:00:00Z',
    status: 'pending_review',
  }
}
```

---

### AC 2.2.8: Your Documents Section

**Given** the documents section renders
**When** displaying uploaded documents
**Then**:

1. **Document List:**
   - Document name
   - Upload date
   - Status badge:
     - ✅ Approved (blue)
     - ⏳ Pending Review (yellow)
     - ❌ Rejected (needs action indicator)
   - [View] button

2. **View Document:**
   - Opens in modal/new tab
   - PDF viewer for PDFs
   - Image viewer for images
   - Download option

3. **Rejected Document:**
   - Shows rejection reason
   - "Upload Replacement" button

---

### AC 2.2.9: Notifications Display

**Given** there are updates for the client
**When** they view the tracker
**Then**:

1. **New Update Banner:**
   - Appears at top if new since last visit
   - "Your application was updated on {date}"
   - Dismissible

2. **Status Change Notice:**
   - When status changed since last visit
   - Brief explanation of what it means

---

### AC 2.2.10: Contact Section

**Given** the contact section renders
**Then** it shows:

1. **Assigned Advisor:**
   - Name
   - Email (clickable)
   - WhatsApp (clickable)

2. **Office Hours:**
   - Days and times (localized)

3. **Note:**
   - "For urgent matters, please contact via WhatsApp"

---

### AC 2.2.11: Locale Support

**Given** the tracker is viewed
**When** locale is changed
**Then**:
  - All UI text updates
  - Dates format correctly
  - RTL layout for Arabic
  - Status labels translated

**Locale Selector:**
- Dropdown in header
- Flags optional
- Changes URL locale
- Persists in session

---

### AC 2.2.12: RTL Layout for Arabic

**Given** locale is Arabic (ar)
**When** the tracker renders
**Then**:
  - Layout is mirrored
  - Text is right-to-left
  - Progress timeline reversed
  - Icons positioned correctly

---

### AC 2.2.13: Mobile Responsive Design

**Given** the tracker is viewed on mobile
**When** the page renders
**Then**:
  - Single column layout
  - Touch-friendly buttons (min 44px)
  - Cards stack vertically
  - Upload works from phone camera

---

### AC 2.2.14: Loading & Error States

**Given** data is loading
**Then**:
  - Skeleton loaders for each section
  - Spinner during authentication
  - Smooth transitions

**Given** an error occurs
**Then**:
  - Friendly error message
  - Retry button where applicable
  - Contact info displayed

---

### AC 2.2.15: Session Expiry Handling

**Given** session is about to expire
**When** 10 minutes remain
**Then**:
  - Toast: "Your session expires soon"
  - Option to extend

**Given** session expired
**When** user takes action
**Then**:
  - Modal: "Session expired"
  - Re-enter password button
  - No data loss for uploads in progress

---

## Technical Implementation

### Files to Create

| File | Description |
|------|-------------|
| `app/[locale]/track/[token]/page.tsx` | Main tracker page |
| `app/[locale]/track/[token]/login/page.tsx` | Password entry |
| `components/tracker/TrackerLayout.tsx` | Layout wrapper |
| `components/tracker/StatusCard.tsx` | Status display |
| `components/tracker/ProgressTimeline.tsx` | Progress steps |
| `components/tracker/PendingActions.tsx` | Action items |
| `components/tracker/DocumentList.tsx` | Documents section |
| `components/tracker/DocumentUpload.tsx` | Upload component |
| `components/tracker/ContactSection.tsx` | Contact info |
| `lib/tracker/session.ts` | Session management |
| `lib/tracker/api.ts` | API calls |

---

### API Endpoints

```typescript
// Validate token (before password entry)
GET /api/track/validate?token={token}
→ { valid: true, requiresPassword: true }
→ { valid: false, error: 'expired' | 'invalid' | 'revoked' }

// Authenticate with password
POST /api/track/auth
{ token: string, password: string }
→ { success: true, session: TrackerSession, data: TrackerData }
→ { success: false, error: 'invalid_password', attemptsRemaining: 3 }

// Get tracker data (requires session)
GET /api/track/data
Authorization: Bearer {sessionToken}
→ {
    application: { ... },
    progress: [ ... ],
    pendingActions: [ ... ],
    documents: [ ... ],
    advisor: { ... },
  }

// Upload document
POST /api/track/documents/upload
Authorization: Bearer {sessionToken}
Form data: { document_type, file }
→ { success: true, document: { ... } }

// Get document for viewing
GET /api/track/documents/{id}
Authorization: Bearer {sessionToken}
→ Document file stream
```

---

### Component: Progress Timeline

```typescript
// components/tracker/ProgressTimeline.tsx
'use client';

import { useTranslations } from 'next-intl';

interface ProgressStep {
  key: string;
  label: string;
  completedAt?: string;
  isCurrent: boolean;
}

interface Props {
  steps: ProgressStep[];
  locale: string;
}

export function ProgressTimeline({ steps, locale }: Props) {
  const t = useTranslations('tracker.progress');
  
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        📋 {t('title')}
      </h2>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`flex items-center gap-3 ${
              step.completedAt ? 'text-gray-600' : 
              step.isCurrent ? 'text-blue-700 font-medium' : 
              'text-gray-400'
            }`}
          >
            {/* Icon */}
            <span className="flex-shrink-0 w-6 text-center">
              {step.completedAt ? '✅' : step.isCurrent ? '⏳' : '○'}
            </span>
            
            {/* Label */}
            <span className="flex-1">
              {t(`steps.${step.key}`)}
              {step.isCurrent && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {t('current')}
                </span>
              )}
            </span>
            
            {/* Date */}
            {step.completedAt && (
              <span className="text-sm text-gray-400">
                {formatDate(step.completedAt, locale)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Component: Document Upload

```typescript
// components/tracker/DocumentUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  documentType: string;
  label: string;
  description?: string;
  onUploadComplete: (doc: UploadedDocument) => void;
}

export function DocumentUpload({ documentType, label, description, onUploadComplete }: Props) {
  const t = useTranslations('tracker.upload');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(t('errors.invalidType'));
      return;
    }
    
    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t('errors.tooLarge'));
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/track/documents/upload', {
        method: 'POST',
        body: formData,
        // Progress tracking via XHR if needed
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      onUploadComplete(result.document);
      setFile(null);
    } catch (err) {
      setError(t('errors.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="text-xl">📄</span>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{label}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                {t('chooseFile')}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{file.name}</span>
                {uploading ? (
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {t('upload')}
                  </button>
                )}
              </div>
            )}
            
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Requirements

### Unit Tests

| Test | Expected |
|------|----------|
| `session-storage` | Session persists in sessionStorage |
| `session-expiry` | Session cleared after 4 hours |
| `file-validation` | Invalid files rejected |
| `progress-calculation` | Correct steps highlighted |

### Integration Tests

| Test | Expected |
|------|----------|
| `login-flow` | Token + password grants access |
| `document-upload` | File uploads successfully |
| `session-refresh` | Activity extends session |

### E2E Tests

| Test | Expected |
|------|----------|
| `full-tracker-flow` | Login → View → Upload |
| `mobile-upload` | Works on mobile devices |
| `locale-switch` | UI updates correctly |

---

## Definition of Done

- [ ] Login page with password entry
- [ ] Session management working
- [ ] Status card displays correctly
- [ ] Progress timeline shows steps
- [ ] Pending actions listed
- [ ] Document upload functional
- [ ] Document list displays
- [ ] Contact section shows
- [ ] All 4 locales work
- [ ] RTL for Arabic
- [ ] Mobile responsive
- [ ] Loading/error states
- [ ] All tests pass

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story |
| 2026-01-31 | Updated | Changed from portal to tracker, simplified features, added password authentication |
