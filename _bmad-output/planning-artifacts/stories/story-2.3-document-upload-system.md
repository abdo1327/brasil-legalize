---
storyId: "2.3"
epicId: "2"
title: "Document Upload System (Client Tracker)"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-31"
completedAt: null
tags:
  - documents
  - upload
  - file-management
  - security
  - client-tracker
functionalRequirements:
  - FR11
nonFunctionalRequirements:
  - NFR1
  - NFR3
  - NFR6
dependencies:
  - "2.1"
  - "2.2"
blockedBy:
  - "2.2"
blocks: []
---

# Story 2.3: Document Upload System (Client Tracker)

## User Story

**As a** client using the application tracker,
**I want** to securely upload required documents when requested,
**So that** I can submit my paperwork digitally without visiting an office.

---

## Story Description

This story implements the document upload functionality within the **Client Tracker** (Story 2.2). This is NOT a full document management system - it's a simple, focused upload experience.

### Client Capabilities (Tracker):
- ✅ View list of required documents
- ✅ See which documents are pending/uploaded/approved/rejected
- ✅ Upload documents when requested
- ✅ View uploaded documents
- ✅ Re-upload rejected documents
- ✅ Re-upload Download their own documents 

### Client CANNOT:

- ❌ Delete uploaded documents
- ❌ Upload unsolicited documents
- ❌ Access documents from advisor

**Security is critical** - files must be validated, virus-scanned, and stored securely.

---

## Document Flow

```
Admin requests document → Client notified (email)
    ↓
Client uploads in tracker → File validated → Stored securely
    ↓
Admin reviews document
    ↓
Approved → Client notified    OR    Rejected → Client notified with reasons
                                        ↓
                                    Client re-uploads
```

---

## Acceptance Criteria

### AC 2.3.1: Document Requirements Display (in Tracker)

**Given** the client views their tracker
**When** the pending actions section loads
**Then** required documents display as:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ ACTION REQUIRED                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📄 Birth Certificate                               │
│     Please upload a certified copy or original      │
│     Accepted formats: PDF, JPG, PNG (max 10MB)      │
│     [Choose File]                                   │
│                                                     │
│  📄 Proof of Address                                │
│     Utility bill or bank statement (last 3 months)  │
│     Accepted formats: PDF, JPG, PNG (max 10MB)      │
│     [Choose File]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### AC 2.3.2: Uploaded Documents Display (in Tracker)

**Given** the client has uploaded documents
**When** the documents section loads
**Then** they see:

```
┌─────────────────────────────────────────────────────┐
│  📁 YOUR DOCUMENTS                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✅ Passport Copy                                   │
│     Uploaded: Jan 20, 2026                          │
│     Status: Approved                                │
│     [View]                                          │
│                                                     │
│  ✅ ID Document                                     │
│     Uploaded: Jan 20, 2026                          │
│     Status: Approved                                │
│     [View]                                          │
│                                                     │
│  ⏳ Birth Certificate                               │
│     Uploaded: Jan 28, 2026                          │
│     Status: Under Review                            │
│     [View]                                          │
│                                                     │
│  ❌ Employment Letter                               │
│     Uploaded: Jan 25, 2026                          │
│     Status: Rejected                                │
│     Reason: Document not in English or translated   │
│     [Upload Replacement]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Status Colors:**
- ✅ Blue - Approved
- ⏳ Yellow - Under Review / Pending
- ❌ Gray with yellow action - Rejected (needs resubmission)

---

### AC 2.3.3: Upload Flow

**Given** client clicks upload button
**When** the upload process runs
**Then**:

1. **File Selection:**
   - Native file picker opens
   - Accept: PDF, JPG, JPEG, PNG, WEBP
   - Max size: 10MB

2. **Client-Side Validation:**
   - File type validated by extension AND MIME
   - File size checked
   - Show error immediately if invalid

3. **Upload Process:**
   - Show selected filename
   - "Upload" button appears
   - Progress bar during upload
   - Button disabled during upload

4. **Success:**
   - Success checkmark animation
   - "Document uploaded successfully"
   - Document appears in "Your Documents"
   - Status: "Under Review"

5. **Failure:**
   - Error message displayed
   - Retry option available

---

### AC 2.3.4: File Validation - Client Side

**Given** a file is selected
**When** validation runs
**Then** check:

| Check | Criteria | Error Message |
|-------|----------|---------------|
| Type | PDF, JPG, JPEG, PNG, WEBP | "File type not supported" |
| Size | Max 10MB | "File is too large (max 10MB)" |
| Name | Max 100 chars | "Filename is too long" |

---

### AC 2.3.5: File Validation - Server Side

**Given** a file is uploaded
**When** server validation runs
**Then**:

1. **MIME Verification:**
   - Check actual file bytes, not just extension
   - Reject disguised executables
   - Reject corrupted files

2. **Virus Scan (optional):**
   - Scan with ClamAV if available
   - Quarantine suspicious files
   - Log all scan results

3. **Content Check:**
   - Verify PDF/image structure is valid
   - Reject malformed files

**Response:**
```json
// Success
{
  "success": true,
  "document": {
    "id": 123,
    "name": "birth_certificate.pdf",
    "type": "birth_certificate",
    "uploaded_at": "2026-01-30T14:00:00Z",
    "status": "pending_review"
  }
}

// Failure
{
  "success": false,
  "error": "invalid_file",
  "message": "File appears to be corrupted"
}
```

---

### AC 2.3.6: Document Viewing

**Given** client clicks "View" on a document
**When** the viewer opens
**Then**:

1. **Modal/Lightbox:**
   - Document displayed in modal
   - PDF: Embedded PDF viewer
   - Images: Image viewer with zoom

2. **Controls:**
   - Close button
   - Zoom in/out (images)
   - No download button (security)

3. **Security:**
   - Stream document through API
   - Session validation required
   - No direct file URL exposed

---

### AC 2.3.7: Rejected Document Handling

**Given** a document is rejected
**When** client views the tracker
**Then**:

1. **Visual Indicator:**
   - ❌ icon with yellow highlight
   - "Rejected" status badge

2. **Rejection Reason:**
   - Clear explanation shown
   - Instructions for correction

3. **Re-upload Option:**
   - "Upload Replacement" button
   - Same upload flow as new document
   - Old document kept for audit trail

---

### AC 2.3.8: Document Request Notification

**Given** admin requests a document
**When** request is created
**Then**:

1. **Email Sent (via Resend):**
   - Subject: "Document Required - {Document Name}"
   - Body includes:
     - What document is needed
     - Instructions
     - Link to tracker
     - Deadline (if any)

2. **Tracker Updated:**
   - Document appears in pending actions
   - Notification banner shown

---

### AC 2.3.9: Upload Progress

**Given** a large file is uploading
**When** upload is in progress
**Then**:

1. **Progress Bar:**
   - Shows percentage
   - Estimated time (optional)
   - Cancel button

2. **Network Handling:**
   - Resume on reconnect (optional)
   - Timeout handling
   - Retry on failure

---

### AC 2.3.10: File Storage Security

**Given** a file is uploaded
**When** it is stored
**Then**:

1. **Storage Location:**
   - Outside web root
   - Path: `/storage/documents/{app_id}/{doc_id}/`
   - Original filename NOT used (use UUID)

2. **Access Control:**
   - Only accessible via API
   - Session validation required
   - Rate limited

3. **Naming:**
   - UUID-based filename
   - Original name stored in database
   - Extension preserved for MIME

---

### AC 2.3.11: Mobile Upload

**Given** client uses tracker on mobile
**When** they tap upload
**Then**:

1. **Options:**
   - Take photo (camera)
   - Choose from gallery
   - Browse files

2. **Camera Capture:**
   - Direct camera access
   - Auto-compress if needed
   - Preview before upload

---

## Technical Implementation

### Files to Create

| File | Description |
|------|-------------|
| `components/tracker/DocumentUpload.tsx` | Upload component |
| `components/tracker/DocumentViewer.tsx` | View modal |
| `components/tracker/DocumentList.tsx` | List display |
| `api/track/documents/upload.php` | Upload endpoint |
| `api/track/documents/[id].php` | View endpoint |
| `api/lib/DocumentService.php` | Business logic |
| `api/lib/FileValidator.php` | Validation |

---

### Database Schema

```sql
-- Document requests (what admin asks for)
CREATE TABLE document_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    
    document_type VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    is_required BOOLEAN DEFAULT TRUE,
    deadline DATE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    
    INDEX idx_application (application_id),
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (created_by) REFERENCES admins(id)
);

-- Uploaded documents
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    request_id INT,  -- Links to request if applicable
    
    -- File info
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,  -- UUID
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Document type
    document_type VARCHAR(100) NOT NULL,
    
    -- Status
    status ENUM('pending_review', 'approved', 'rejected') DEFAULT 'pending_review',
    rejection_reason TEXT,
    reviewed_at DATETIME,
    reviewed_by INT,
    
    -- Metadata
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by_type ENUM('client', 'admin') DEFAULT 'client',
    
    -- For replacements
    replaced_by INT,
    replaced_at DATETIME,
    
    INDEX idx_application (application_id),
    INDEX idx_status (status),
    FOREIGN KEY (application_id) REFERENCES applications(id),
    FOREIGN KEY (request_id) REFERENCES document_requests(id),
    FOREIGN KEY (reviewed_by) REFERENCES admins(id),
    FOREIGN KEY (replaced_by) REFERENCES documents(id)
);
```

---

### Upload API Implementation

```php
<?php
// api/track/documents/upload.php

require_once __DIR__ . '/../lib/bootstrap.php';

use BrasilLegalize\Api\DocumentService;
use BrasilLegalize\Api\FileValidator;
use BrasilLegalize\Api\TrackerAuth;

// Verify session
$session = TrackerAuth::verifySession();
if (!$session) {
    http_response_code(401);
    echo json_encode(['error' => 'unauthorized']);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Get uploaded file
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'no_file', 'message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$documentType = $_POST['document_type'] ?? null;

// Validate file
$validator = new FileValidator();
$validation = $validator->validate($file);

if (!$validation['valid']) {
    http_response_code(400);
    echo json_encode([
        'error' => 'invalid_file',
        'message' => $validation['message'],
    ]);
    exit;
}

// Process upload
$documentService = new DocumentService($db);

try {
    $document = $documentService->uploadClientDocument(
        $session['application_id'],
        $file,
        $documentType
    );
    
    // Log to timeline
    $documentService->logUpload($session['application_id'], $document['id']);
    
    // Notify admin
    $documentService->notifyAdminOfUpload($session['application_id'], $document);
    
    echo json_encode([
        'success' => true,
        'document' => $document,
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'upload_failed',
        'message' => 'Failed to save document',
    ]);
}
```

---

### FileValidator Implementation

```php
<?php
// api/lib/FileValidator.php

namespace BrasilLegalize\Api;

class FileValidator
{
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    
    const ALLOWED_TYPES = [
        'application/pdf' => 'pdf',
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    
    const MAGIC_BYTES = [
        'pdf' => '%PDF',
        'jpg' => "\xFF\xD8\xFF",
        'png' => "\x89PNG",
        'webp' => 'RIFF',
    ];
    
    public function validate(array $file): array
    {
        // Check upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['valid' => false, 'message' => 'Upload error'];
        }
        
        // Check size
        if ($file['size'] > self::MAX_SIZE) {
            return ['valid' => false, 'message' => 'File is too large (max 10MB)'];
        }
        
        // Check MIME type
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        
        if (!isset(self::ALLOWED_TYPES[$mimeType])) {
            return ['valid' => false, 'message' => 'File type not supported'];
        }
        
        // Verify magic bytes
        $handle = fopen($file['tmp_name'], 'rb');
        $header = fread($handle, 8);
        fclose($handle);
        
        $expectedType = self::ALLOWED_TYPES[$mimeType];
        $magicBytes = self::MAGIC_BYTES[$expectedType];
        
        if (strpos($header, $magicBytes) !== 0) {
            return ['valid' => false, 'message' => 'File appears to be corrupted'];
        }
        
        // Check filename length
        if (strlen($file['name']) > 100) {
            return ['valid' => false, 'message' => 'Filename is too long'];
        }
        
        return [
            'valid' => true,
            'mime_type' => $mimeType,
            'extension' => self::ALLOWED_TYPES[$mimeType],
        ];
    }
}
```

---

## Testing Requirements

### Unit Tests

| Test | Expected |
|------|----------|
| `validate-pdf` | Valid PDF passes |
| `validate-image` | Valid JPG/PNG passes |
| `reject-exe` | Disguised executable rejected |
| `reject-large` | >10MB rejected |
| `reject-wrong-ext` | Wrong extension rejected |

### Integration Tests

| Test | Expected |
|------|----------|
| `upload-flow` | File uploads and saves |
| `view-document` | Authorized view works |
| `reject-unauthorized` | Wrong session rejected |

---

## Definition of Done

- [ ] Upload component in tracker
- [ ] Server-side validation
- [ ] Secure file storage
- [ ] Document viewing modal
- [ ] Rejection handling
- [ ] Admin notification on upload
- [ ] Mobile camera upload
- [ ] All tests pass

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story |
| 2026-01-31 | Updated | Simplified for tracker (not portal), removed download, aligned with workflow |
