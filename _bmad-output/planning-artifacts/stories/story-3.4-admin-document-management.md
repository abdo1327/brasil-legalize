---
storyId: "3.4"
epicId: "3"
title: "Admin Document Management"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - admin
  - documents
  - file-management
  - review
  - approval
functionalRequirements:
  - FR10
  - FR11
nonFunctionalRequirements:
  - NFR1
  - NFR4
  - NFR7
dependencies:
  - "3.1"
  - "3.3"
  - "2.3"
blockedBy:
  - "3.3"
blocks:
  - "3.5"
---

# Story 3.4: Admin Document Management

## User Story

**As an** administrator,
**I want** to review, approve, and manage all client documents centrally,
**So that** I can ensure document quality, completeness, and proper organization for case processing.

---

## Story Description

Document Management is critical for immigration case processing. Clients upload documents (passports, birth certificates, marriage certificates, etc.) through their portal, and administrators need tools to review, approve, reject, request resubmission, and organize these documents.

This story covers the admin-side document management: viewing all documents across clients, detailed document review with annotations, approval workflows, document templates, and integration with case management.

---

## Acceptance Criteria

### AC 3.4.1: Documents Overview Page

**Given** an admin navigates to `/admin/documents`
**When** the page loads
**Then** they see:

1. **Page Header:**
   - "Documents" title
   - "Upload Document" button (admin upload for client)
   - Filter quick toggles: Pending Review | All

2. **Stats Cards:**
   - Total Documents
   - Pending Review (requiring action)
   - Approved Today
   - Rejected Today

3. **Document Table:**
   - Thumbnail (if image/PDF)
   - Document Name
   - Category/Type
   - Client Name (link)
   - Case ID (link)
   - Status (badge)
   - Uploaded Date
   - Reviewed By
   - Actions

4. **Filters & Search:**
   - Search (filename, client)
   - Status filter
   - Category filter
   - Date range
   - Client filter

---

### AC 3.4.2: Document Statuses

**Given** the document system
**When** defining document statuses
**Then** these statuses exist:

| Status | Description | Color | Admin Action |
|--------|-------------|-------|--------------|
| `pending` | Awaiting admin review | Yellow | Review needed |
| `approved` | Verified and accepted | Green | No action |
| `rejected` | Not acceptable | Red | Client must resubmit |
| `expired` | Document past validity | Orange | Client must resubmit |
| `archived` | No longer needed | Gray | Reference only |

---

### AC 3.4.3: Document Categories

**Given** documents are uploaded
**When** categorizing documents
**Then** these categories exist:

| Category | Description | Required Per Case |
|----------|-------------|-------------------|
| `passport` | Valid passport | Yes |
| `birth_certificate` | Birth certificate | Yes |
| `marriage_certificate` | Marriage certificate | If married |
| `divorce_decree` | Divorce documentation | If divorced |
| `proof_of_residence` | Address proof | Yes |
| `criminal_record` | Police clearance | Yes |
| `employment_letter` | Employment verification | Depends on package |
| `bank_statement` | Financial documents | Depends on package |
| `photos` | Passport photos | Yes |
| `other` | Miscellaneous | No |

---

### AC 3.4.4: Document Detail Modal

**Given** an admin clicks a document
**When** the detail modal opens
**Then** they see:

1. **Document Preview:**
   - Large preview (images, PDFs)
   - Download button
   - Zoom controls
   - Page navigation (for multi-page)
   - Full-screen option

2. **Document Info:**
   - File name
   - File size
   - Format (MIME type)
   - Uploaded date/time
   - Uploaded by (client/admin)
   - Current status
   - Review history

3. **Client/Case Context:**
   - Client name (link)
   - Case ID (link)
   - Document category

4. **Review Actions:**
   - "Approve" button (green)
   - "Reject" button (red)
   - "Request Clarification" button
   - Category change dropdown

---

### AC 3.4.5: Approve Document

**Given** an admin clicks "Approve"
**When** approving a document
**Then**:
  - Status → `approved`
  - Reviewed_by set to admin
  - Reviewed_at timestamp set
  - Timeline entry created on case
  - Client notified (if configured)
  - Success toast shown

---

### AC 3.4.6: Reject Document

**Given** an admin clicks "Reject"
**When** the rejection modal opens
**Then**:

1. **Rejection Form:**
   - Reason dropdown (required):
     - Poor quality (blurry, cut off)
     - Wrong document type
     - Expired document
     - Missing information
     - Document not legible
     - Other (specify)
   - Additional notes (textarea)
   - "Confirm Rejection" button

2. **Post-Rejection:**
   - Status → `rejected`
   - Rejection reason stored
   - Client notified with reason
   - Case timeline entry
   - Document remains for reference

---

### AC 3.4.7: Request Clarification

**Given** an admin clicks "Request Clarification"
**When** the modal opens
**Then**:
  - Message textarea (to client)
  - Pre-filled templates available
  - "Send Request" button
  - Creates message in client portal
  - Document status unchanged
  - Flagged for follow-up

---

### AC 3.4.8: Admin Upload for Client

**Given** an admin clicks "Upload Document"
**When** uploading on behalf of client
**Then**:

1. **Upload Form:**
   - Select client (search)
   - Select case (if applicable)
   - Document category
   - File upload (drag/drop or browse)
   - Notes (optional)
   - "Auto-approve" checkbox

2. **Validation:**
   - Same as client upload (Story 2.3)
   - Virus scan
   - MIME validation
   - Size limits

3. **Post-Upload:**
   - Document associated with client
   - Status: pending or approved (if auto-approve)
   - Timeline entry on case
   - Admin noted as uploader

---

### AC 3.4.9: Batch Document Review

**Given** multiple documents selected
**When** admin clicks "Batch Action"
**Then** options include:
  - Approve All
  - Reject All (with shared reason)
  - Change Category
  - Download All (ZIP)

**And**:
  - Progress indicator
  - Summary of results
  - Individual failures noted

---

### AC 3.4.10: Document Requirements Checklist

**Given** viewing a case's documents
**When** displaying requirements
**Then**:

1. **Checklist Display:**
   - Required documents per package
   - ✓ if approved document exists
   - ⏳ if pending document exists
   - ✗ if missing

2. **Visual Summary:**
   - Progress bar (X of Y complete)
   - "Request Missing Documents" button

3. **Request Missing:**
   - Auto-generates message to client
   - Lists required documents
   - Sends via portal and email

---

### AC 3.4.11: Document Version History

**Given** a client uploads multiple versions
**When** viewing document history
**Then**:
  - All versions listed chronologically
  - Current version highlighted
  - Can view any previous version
  - Reason for each rejection (if applicable)
  - Can revert to previous version (admin)

---

### AC 3.4.12: Document Preview Enhancements

**Given** viewing document preview
**When** interacting with the preview
**Then** features include:

1. **Images:**
   - Zoom in/out
   - Rotate (90° increments)
   - Full-screen mode

2. **PDFs:**
   - Page navigation
   - Thumbnail sidebar
   - Search within PDF
   - Zoom controls

3. **Annotations (future):**
   - Highlight areas
   - Add text notes
   - Draw circles/arrows
   - Export annotated version

---

### AC 3.4.13: Document Expiry Tracking

**Given** documents have expiry dates
**When** checking document validity
**Then**:
  - Admin can set expiry date on approval
  - System alerts when documents expire
  - Dashboard shows "Expiring Soon" (30 days)
  - Auto-notification to client
  - Status → `expired` when past date

---

### AC 3.4.14: Document Templates

**Given** standard documents are needed
**When** accessing templates
**Then**:
  - Admin can manage document templates
  - Templates downloadable by clients
  - Categories: forms, checklists, guides
  - Localized versions (EN, AR, ES, PT-BR)

---

### AC 3.4.15: Secure Document Handling

**Given** documents contain sensitive data
**When** handling documents
**Then**:
  - All access logged in audit
  - Download logged with reason option
  - Watermark on previews (optional)
  - Time-limited download URLs
  - Files stored encrypted at rest

---

### AC 3.4.16: Search Within Documents

**Given** documents need to be found
**When** using document search
**Then**:
  - Search by filename
  - Search by client name
  - Search by case ID
  - Search by category
  - Search by date range
  - Results highlight matches

---

### AC 3.4.17: Permission Enforcement

**Given** different admin roles
**When** accessing documents
**Then**:

| Role | View | Download | Approve/Reject | Upload | Delete |
|------|------|----------|----------------|--------|--------|
| super_admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✓ | ✗ |
| support | ✓ | ✗ | ✗ | ✗ | ✗ |
| finance | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/admin/documents/page.tsx` | Create | Documents list page |
| `components/admin/documents/DocumentTable.tsx` | Create | Data table |
| `components/admin/documents/DocumentFilters.tsx` | Create | Filters |
| `components/admin/documents/DocumentPreview.tsx` | Create | Preview modal |
| `components/admin/documents/DocumentReviewActions.tsx` | Create | Action buttons |
| `components/admin/documents/RejectDocumentModal.tsx` | Create | Rejection form |
| `components/admin/documents/UploadForClientModal.tsx` | Create | Admin upload |
| `components/admin/documents/DocumentChecklist.tsx` | Create | Requirements |
| `components/admin/documents/BatchActions.tsx` | Create | Bulk actions |
| `lib/admin/documentService.ts` | Create | Document utils |
| `api/admin/documents/index.php` | Create | List API |
| `api/admin/documents/[id].php` | Create | Detail API |
| `api/admin/documents/review.php` | Create | Review API |
| `api/admin/documents/upload.php` | Create | Upload API |
| `api/admin/documents/batch.php` | Create | Batch API |

---

### Database Schema Additions

```sql
-- Document review history
CREATE TABLE document_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    admin_id INT NOT NULL,
    action ENUM('approved', 'rejected', 'clarification_requested') NOT NULL,
    reason VARCHAR(100),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_document_id (document_id),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Document templates
CREATE TABLE document_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_category (category),
    INDEX idx_locale (locale),
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- Add expiry and version to documents table
ALTER TABLE documents ADD COLUMN expires_at DATE DEFAULT NULL;
ALTER TABLE documents ADD COLUMN version INT DEFAULT 1;
ALTER TABLE documents ADD COLUMN parent_document_id INT DEFAULT NULL;
ALTER TABLE documents ADD CONSTRAINT fk_parent_document FOREIGN KEY (parent_document_id) REFERENCES documents(id);
```

---

### Document Preview Component

```typescript
// components/admin/documents/DocumentPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface DocumentPreviewProps {
  document: {
    id: number;
    name: string;
    url: string;
    mimeType: string;
    pageCount?: number;
  };
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  canReview: boolean;
}

export function DocumentPreview({
  document,
  onClose,
  onApprove,
  onReject,
  canReview,
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';
  
  const handleZoomIn = () => setZoom(z => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 25, 50));
  const handleRotate = () => setRotation(r => (r + 90) % 360);
  
  const handleDownload = () => {
    window.open(`/api/admin/documents/${document.id}/download`, '_blank');
  };
  
  const handleFullscreen = () => {
    const elem = window.document.getElementById('document-preview-container');
    if (!isFullscreen && elem) {
      elem.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (isFullscreen) {
      window.document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };
  
  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage(p => p - 1);
      if (e.key === 'ArrowRight' && document.pageCount && currentPage < document.pageCount) {
        setCurrentPage(p => p + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, currentPage, document.pageCount]);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-4">
          <h3 className="font-medium">{document.name}</h3>
          {document.pageCount && document.pageCount > 1 && (
            <span className="text-sm text-gray-400">
              Page {currentPage} of {document.pageCount}
            </span>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2">
            <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded">
              <MagnifyingGlassMinusIcon className="w-5 h-5" />
            </button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded">
              <MagnifyingGlassPlusIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Rotation (images only) */}
          {isImage && (
            <button onClick={handleRotate} className="p-2 hover:bg-gray-700 rounded">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          )}
          
          {/* Fullscreen */}
          <button onClick={handleFullscreen} className="p-2 hover:bg-gray-700 rounded">
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
          
          {/* Download */}
          <button onClick={handleDownload} className="p-2 hover:bg-gray-700 rounded">
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          
          {/* Close */}
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded ml-4">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div
        id="document-preview-container"
        className="flex-1 overflow-auto flex items-center justify-center p-8"
      >
        {isImage && (
          <img
            src={document.url}
            alt={document.name}
            className="max-w-full max-h-full object-contain transition-transform"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        )}
        
        {isPdf && (
          <iframe
            src={`${document.url}#page=${currentPage}`}
            className="w-full h-full bg-white"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
            }}
          />
        )}
        
        {!isImage && !isPdf && (
          <div className="text-center text-white">
            <p className="text-lg mb-4">Preview not available for this file type</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-primary rounded hover:bg-primary-dark"
            >
              Download to View
            </button>
          </div>
        )}
      </div>
      
      {/* Page Navigation (multi-page documents) */}
      {document.pageCount && document.pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-900">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <span className="text-white">
            {currentPage} / {document.pageCount}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(document.pageCount!, p + 1))}
            disabled={currentPage === document.pageCount}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
      
      {/* Action Footer */}
      {canReview && (
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 border-t">
          <button
            onClick={onReject}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Document Review Actions Component

```typescript
// components/admin/documents/DocumentReviewActions.tsx
'use client';

import { useState } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { RejectDocumentModal } from './RejectDocumentModal';
import { ClarificationModal } from './ClarificationModal';

interface DocumentReviewActionsProps {
  documentId: number;
  documentName: string;
  currentStatus: string;
  onApprove: () => Promise<void>;
  onReject: (reason: string, notes: string) => Promise<void>;
  onRequestClarification: (message: string) => Promise<void>;
  canReview: boolean;
}

export function DocumentReviewActions({
  documentId,
  documentName,
  currentStatus,
  onApprove,
  onReject,
  onRequestClarification,
  canReview,
}: DocumentReviewActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  
  const handleApprove = async () => {
    if (!canReview || loading) return;
    
    setLoading(true);
    try {
      await onApprove();
    } finally {
      setLoading(false);
    }
  };
  
  const handleReject = async (reason: string, notes: string) => {
    setLoading(true);
    try {
      await onReject(reason, notes);
      setShowRejectModal(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClarification = async (message: string) => {
    setLoading(true);
    try {
      await onRequestClarification(message);
      setShowClarificationModal(false);
    } finally {
      setLoading(false);
    }
  };
  
  if (!canReview) {
    return <span className="text-sm text-gray-400">View only</span>;
  }
  
  if (currentStatus !== 'pending') {
    return (
      <span className="text-sm text-gray-500">
        Already {currentStatus}
      </span>
    );
  }
  
  return (
    <>
      <div className="flex items-center gap-2">
        {/* Approve Button */}
        <button
          onClick={handleApprove}
          disabled={loading}
          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
          title="Approve"
        >
          <CheckIcon className="w-4 h-4" />
        </button>
        
        {/* Reject Button */}
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
          title="Reject"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        
        {/* Request Clarification */}
        <button
          onClick={() => setShowClarificationModal(true)}
          disabled={loading}
          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          title="Request Clarification"
        >
          <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Reject Modal */}
      <RejectDocumentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        documentName={documentName}
        onConfirm={handleReject}
        loading={loading}
      />
      
      {/* Clarification Modal */}
      <ClarificationModal
        isOpen={showClarificationModal}
        onClose={() => setShowClarificationModal(false)}
        documentName={documentName}
        onSend={handleClarification}
        loading={loading}
      />
    </>
  );
}
```

---

### Reject Document Modal

```typescript
// components/admin/documents/RejectDocumentModal.tsx
'use client';

import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  onConfirm: (reason: string, notes: string) => Promise<void>;
  loading: boolean;
}

const REJECTION_REASONS = [
  { value: 'poor_quality', label: 'Poor quality (blurry, cut off)' },
  { value: 'wrong_type', label: 'Wrong document type' },
  { value: 'expired', label: 'Document is expired' },
  { value: 'missing_info', label: 'Missing required information' },
  { value: 'not_legible', label: 'Document not legible' },
  { value: 'incomplete', label: 'Incomplete document' },
  { value: 'other', label: 'Other (specify in notes)' },
];

export function RejectDocumentModal({
  isOpen,
  onClose,
  documentName,
  onConfirm,
  loading,
}: RejectDocumentModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!reason) return;
    onConfirm(reason, notes);
  };
  
  const isValid = reason !== '' && (reason !== 'other' || notes.trim() !== '');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <h3 className="font-semibold">Reject Document</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            You are about to reject <strong>{documentName}</strong>. 
            The client will be notified and asked to resubmit.
          </p>
          
          {/* Reason Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select a reason...</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes {reason === 'other' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide additional details for the client..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be sent to the client
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Rejecting...' : 'Reject Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### PHP Document Review API

```php
<?php
// api/admin/documents/review.php

require_once __DIR__ . '/../../lib/AdminAuthService.php';
require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/NotificationService.php';

use BrasilLegalize\Api\Lib\AdminAuthService;
use BrasilLegalize\Api\Lib\Database;
use BrasilLegalize\Api\Lib\NotificationService;

header('Content-Type: application/json');

// Validate session
$sessionId = $_COOKIE['admin_session'] ?? null;
if (!$sessionId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$db = Database::getInstance();
$authService = new AdminAuthService($db);
$session = $authService->validateSession($sessionId);

if (!$session || !$authService->hasPermission($session['admin']['role'], 'documents.review')) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$documentId = $input['document_id'] ?? null;
$action = $input['action'] ?? null; // 'approve', 'reject', 'clarification'
$reason = $input['reason'] ?? null;
$notes = $input['notes'] ?? null;

if (!$documentId || !$action) {
    http_response_code(400);
    echo json_encode(['error' => 'document_id and action required']);
    exit;
}

// Get document
$stmt = $db->prepare('
    SELECT d.*, c.id as case_id, c.client_id, cl.name as client_name, cl.email as client_email
    FROM documents d
    LEFT JOIN cases c ON c.id = d.case_id
    JOIN clients cl ON cl.id = d.client_id
    WHERE d.id = :id
');
$stmt->execute(['id' => $documentId]);
$document = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$document) {
    http_response_code(404);
    echo json_encode(['error' => 'Document not found']);
    exit;
}

$db->beginTransaction();

try {
    $adminId = $session['admin']['id'];
    $adminName = $session['admin']['name'];
    
    switch ($action) {
        case 'approve':
            // Update document status
            $stmt = $db->prepare('
                UPDATE documents 
                SET status = :status, reviewed_by = :admin, reviewed_at = NOW(), updated_at = NOW()
                WHERE id = :id
            ');
            $stmt->execute(['status' => 'approved', 'admin' => $adminId, 'id' => $documentId]);
            
            // Create review record
            $stmt = $db->prepare('
                INSERT INTO document_reviews (document_id, admin_id, action, notes)
                VALUES (:doc_id, :admin_id, :action, :notes)
            ');
            $stmt->execute([
                'doc_id' => $documentId,
                'admin_id' => $adminId,
                'action' => 'approved',
                'notes' => $notes,
            ]);
            
            // Add to case timeline
            if ($document['case_id']) {
                $stmt = $db->prepare('
                    INSERT INTO case_timeline (case_id, event_type, actor_type, actor_id, description, metadata)
                    VALUES (:case_id, :type, :actor_type, :actor_id, :description, :metadata)
                ');
                $stmt->execute([
                    'case_id' => $document['case_id'],
                    'type' => 'document_approved',
                    'actor_type' => 'admin',
                    'actor_id' => $adminId,
                    'description' => "Document approved: {$document['name']}",
                    'metadata' => json_encode(['document_id' => $documentId]),
                ]);
            }
            
            // Notify client
            $notificationService = new NotificationService($db);
            $notificationService->notifyClient($document['client_id'], [
                'type' => 'document_approved',
                'title' => 'Document Approved',
                'message' => "Your document \"{$document['name']}\" has been approved.",
            ]);
            
            break;
            
        case 'reject':
            if (!$reason) {
                throw new Exception('Rejection reason required');
            }
            
            // Update document status
            $stmt = $db->prepare('
                UPDATE documents 
                SET status = :status, reviewed_by = :admin, reviewed_at = NOW(), 
                    rejection_reason = :reason, updated_at = NOW()
                WHERE id = :id
            ');
            $stmt->execute([
                'status' => 'rejected',
                'admin' => $adminId,
                'reason' => $reason,
                'id' => $documentId,
            ]);
            
            // Create review record
            $stmt = $db->prepare('
                INSERT INTO document_reviews (document_id, admin_id, action, reason, notes)
                VALUES (:doc_id, :admin_id, :action, :reason, :notes)
            ');
            $stmt->execute([
                'doc_id' => $documentId,
                'admin_id' => $adminId,
                'action' => 'rejected',
                'reason' => $reason,
                'notes' => $notes,
            ]);
            
            // Add to case timeline
            if ($document['case_id']) {
                $stmt = $db->prepare('
                    INSERT INTO case_timeline (case_id, event_type, actor_type, actor_id, description, metadata)
                    VALUES (:case_id, :type, :actor_type, :actor_id, :description, :metadata)
                ');
                $stmt->execute([
                    'case_id' => $document['case_id'],
                    'type' => 'document_rejected',
                    'actor_type' => 'admin',
                    'actor_id' => $adminId,
                    'description' => "Document rejected: {$document['name']}",
                    'metadata' => json_encode([
                        'document_id' => $documentId,
                        'reason' => $reason,
                        'notes' => $notes,
                    ]),
                ]);
            }
            
            // Notify client with rejection details
            $notificationService = new NotificationService($db);
            $notificationService->notifyClient($document['client_id'], [
                'type' => 'document_rejected',
                'title' => 'Document Needs Resubmission',
                'message' => "Your document \"{$document['name']}\" was not accepted. Reason: {$reason}. " .
                             ($notes ? "Details: {$notes}" : "") .
                             " Please upload a new version.",
            ]);
            
            break;
            
        case 'clarification':
            if (!$notes) {
                throw new Exception('Clarification message required');
            }
            
            // Create review record
            $stmt = $db->prepare('
                INSERT INTO document_reviews (document_id, admin_id, action, notes)
                VALUES (:doc_id, :admin_id, :action, :notes)
            ');
            $stmt->execute([
                'doc_id' => $documentId,
                'admin_id' => $adminId,
                'action' => 'clarification_requested',
                'notes' => $notes,
            ]);
            
            // Create message to client
            $stmt = $db->prepare('
                INSERT INTO messages (client_id, case_id, sender_type, sender_id, content, is_read)
                VALUES (:client_id, :case_id, :sender_type, :sender_id, :content, FALSE)
            ');
            $stmt->execute([
                'client_id' => $document['client_id'],
                'case_id' => $document['case_id'],
                'sender_type' => 'admin',
                'sender_id' => $adminId,
                'content' => "Regarding document \"{$document['name']}\":\n\n{$notes}",
            ]);
            
            // Notify client
            $notificationService = new NotificationService($db);
            $notificationService->notifyClient($document['client_id'], [
                'type' => 'message_received',
                'title' => 'New Message from Admin',
                'message' => "You have a new message regarding your document.",
            ]);
            
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
    // Log audit
    $authService->logAudit(
        $adminId,
        "document_{$action}",
        'document',
        $documentId,
        $_SERVER['REMOTE_ADDR'] ?? '',
        $_SERVER['HTTP_USER_AGENT'] ?? '',
        ['reason' => $reason, 'notes' => $notes]
    );
    
    $db->commit();
    
    echo json_encode([
        'success' => true,
        'action' => $action,
        'document_id' => $documentId,
    ]);
    
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `approve-document` | Approve pending doc | Status approved |
| `reject-document` | Reject with reason | Status rejected, reason stored |
| `reject-no-reason` | Reject without reason | Error |
| `clarification` | Request clarification | Message created |
| `review-history` | Check review records | All reviews logged |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-approval-flow` | Upload → Review → Approve | Timeline updated, notification sent |
| `full-rejection-flow` | Upload → Review → Reject | Client notified with reason |
| `batch-approve` | Approve 10 documents | All updated, all notified |
| `version-history` | Multiple uploads | Version chain maintained |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `document-list-page` | Visit /admin/documents | Table renders |
| `preview-document` | Click document | Preview modal opens |
| `approve-in-preview` | Click approve | Status updates, modal closes |
| `reject-modal` | Click reject | Rejection modal validates |
| `filter-pending` | Filter by pending | Only pending shown |

---

## Edge Cases and Error Handling

### Edge Case 1: Large File Preview
- **Scenario:** 50MB PDF document
- **Handling:** Stream-based preview, lazy loading pages
- **User Impact:** Progress indicator, usable preview

### Edge Case 2: Corrupt File
- **Scenario:** File appears corrupt
- **Handling:** Show error, offer download to attempt local viewing
- **User Impact:** Clear message, option to reject

### Edge Case 3: Concurrent Reviews
- **Scenario:** Two admins review same document
- **Handling:** Optimistic locking, show "already reviewed" if second
- **User Impact:** Informative message

### Edge Case 4: Missing Case Association
- **Scenario:** Document without case
- **Handling:** Review still works, timeline entry skipped
- **User Impact:** No impact on review process

---

## Security Considerations

1. **Access Control:** Permission checked on every operation
2. **Audit Trail:** All views, downloads, reviews logged
3. **Secure URLs:** Signed, time-limited download URLs
4. **Input Validation:** Reason and notes sanitized
5. **File Integrity:** Hash verification on download

---

## Definition of Done

- [ ] Documents list page implemented
- [ ] Document preview modal works
- [ ] Approve flow works
- [ ] Reject flow with reasons works
- [ ] Request clarification works
- [ ] Admin upload for client works
- [ ] Batch actions work
- [ ] Requirements checklist works
- [ ] Version history visible
- [ ] Permissions enforced
- [ ] Notifications sent correctly
- [ ] All tests pass
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

