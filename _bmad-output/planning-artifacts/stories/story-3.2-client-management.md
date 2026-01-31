---
storyId: "3.2"
epicId: "3"
title: "Client Management System"
status: "ready"
priority: "high"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - admin
  - clients
  - crm
  - management
  - search
  - filtering
functionalRequirements:
  - FR9
  - FR10
nonFunctionalRequirements:
  - NFR1
  - NFR3
  - NFR6
dependencies:
  - "3.1"
blockedBy:
  - "3.1"
blocks:
  - "3.3"
---

# Story 3.2: Client Management System

## User Story

**As an** administrator,
**I want** to view, search, and manage all clients in the system,
**So that** I can efficiently handle client relationships and support their cases.

---

## Story Description

The Client Management System is the central hub for all client-related operations in the admin console. Administrators need to quickly find clients, view their complete profiles, update information, and take actions like regenerating token links or changing status.

This story covers the client list view, search and filtering, individual client profiles, and client management actions. It integrates with cases, documents, and messages to provide a 360-degree view of each client.

---

## Acceptance Criteria

### AC 3.2.1: Client List View

**Given** an admin navigates to `/admin/clients`
**When** the page loads
**Then** they see:

1. **Page Header:**
   - "Clients" title
   - "Add Client" button (manual entry)
   - Export button (CSV/Excel)

2. **Search & Filters Bar:**
   - Search input (name, email, phone)
   - Status filter dropdown
   - Date range filter
   - Language filter
   - Clear filters button

3. **Client Table:**
   - Columns: Name, Email, Phone, Status, Created, Last Activity, Actions
   - Sortable columns (click header)
   - Row click → client detail page

4. **Pagination:**
   - Page size selector (10, 25, 50, 100)
   - Page navigation
   - Total count display

---

### AC 3.2.2: Client Table Data

**Given** the client list loads
**When** displaying client rows
**Then** each row shows:

| Column | Content | Notes |
|--------|---------|-------|
| Name | Full name | Link to profile |
| Email | Email address | With copy button |
| Phone | Phone number | WhatsApp format |
| Status | Badge (active/inactive/pending) | Color-coded |
| Created | Registration date | Relative time if < 7 days |
| Last Activity | Last portal access | Relative time |
| Actions | Quick actions dropdown | Edit, View, Token |

**Status Badges:**
- `active` - Green badge
- `pending` - Yellow badge (awaiting first access)
- `inactive` - Gray badge
- `blocked` - Red badge

---

### AC 3.2.3: Search Functionality

**Given** an admin types in the search box
**When** searching for clients
**Then**:
  - Live search with 300ms debounce
  - Searches: name, email, phone, case ID
  - Results update in real-time
  - Highlights matching terms
  - Empty state if no results
  - Clear button resets search

**Search Examples:**
```
"João" → Matches João Silva, Maria João
"joao@" → Matches joao@email.com
"+55" → Matches phone numbers starting with +55
"2024-001" → Matches case number
```

---

### AC 3.2.4: Advanced Filters

**Given** an admin clicks the filters area
**When** filter panel expands
**Then** options include:

| Filter | Type | Options |
|--------|------|---------|
| Status | Multi-select | Active, Pending, Inactive, Blocked |
| Registration Date | Date range | From/To pickers |
| Last Activity | Preset | Today, This Week, This Month, 90+ days ago |
| Language | Multi-select | EN, AR, ES, PT-BR |
| Has Case | Boolean | Yes/No |
| Has Documents | Boolean | Yes/No |
| Eligibility Status | Select | Eligible, Not Eligible, Unknown |

**And**:
  - Filters combine with AND logic
  - Active filter count shown
  - Filter state persists in URL
  - Clear all filters button

---

### AC 3.2.5: Sorting

**Given** an admin clicks a column header
**When** sorting is applied
**Then**:
  - First click: ascending (↑)
  - Second click: descending (↓)
  - Third click: remove sort
  - Only one sort column at a time
  - Default sort: Created (newest first)

**Sortable Columns:**
- Name (alphabetical)
- Email (alphabetical)
- Status (grouped)
- Created (date)
- Last Activity (date)

---

### AC 3.2.6: Client Detail Page

**Given** an admin clicks a client row or name
**When** navigating to `/admin/clients/[id]`
**Then** the page displays:

1. **Header Section:**
   - Client name (large)
   - Email with copy button
   - Phone with WhatsApp link
   - Status badge
   - Quick actions (Edit, Generate Token, Block/Unblock)

2. **Tabs:**
   - Overview
   - Cases
   - Documents
   - Messages
   - Activity Log

---

### AC 3.2.7: Client Overview Tab

**Given** the Overview tab is active
**When** viewing client details
**Then** sections include:

1. **Personal Information:**
   - Full name
   - Email (with verification status)
   - Phone (with WhatsApp indicator)
   - Preferred language
   - Registration date
   - Last activity

2. **Eligibility Information:**
   - Eligibility status
   - Questionnaire responses (collapsed by default)
   - Selected package (if any)

3. **Token Links:**
   - Current active token
   - Token created date
   - Token expiry date
   - Token usage count
   - Regenerate token button

4. **Account Security:**
   - Password set: Yes/No
   - Last login
   - Active sessions count
   - "Revoke All Sessions" button

---

### AC 3.2.8: Client Cases Tab

**Given** the Cases tab is selected
**When** viewing client cases
**Then**:
  - List of all cases for this client
  - Case ID, Status, Created, Last Update
  - Click case → case detail page
  - "Create Case" button
  - Empty state if no cases

---

### AC 3.2.9: Client Documents Tab

**Given** the Documents tab is selected
**When** viewing client documents
**Then**:
  - Grid or list of uploaded documents
  - Document name, type, uploaded date
  - Preview button (images, PDFs)
  - Download button
  - Status (pending review, approved, rejected)
  - Admin can update document status

---

### AC 3.2.10: Client Messages Tab

**Given** the Messages tab is selected
**When** viewing message history
**Then**:
  - Chronological message thread
  - Messages from client and admin clearly distinguished
  - Timestamps with timezone
  - Compose new message inline
  - "Mark as Resolved" option
  - File attachments visible

---

### AC 3.2.11: Client Activity Log Tab

**Given** the Activity Log tab is selected
**When** viewing activity
**Then**:
  - Chronological list of all client activities
  - Login events
  - Document uploads
  - Message sent/received
  - Status changes
  - Filterable by activity type
  - Date range filter

---

### AC 3.2.12: Edit Client Information

**Given** an admin clicks "Edit" on client profile
**When** the edit modal opens
**Then** editable fields:

| Field | Validation | Notes |
|-------|------------|-------|
| Full Name | Required, 2-100 chars | |
| Email | Valid email format | Cannot change if case active |
| Phone | Valid intl format | |
| Preferred Language | Select | EN, AR, ES, PT-BR |
| Status | Select | Active, Inactive, Blocked |
| Notes | Textarea | Internal admin notes |

**And**:
  - Cancel button closes modal
  - Save validates and updates
  - Success notification shown
  - Changes logged in activity

---

### AC 3.2.13: Regenerate Token Link

**Given** an admin clicks "Regenerate Token"
**When** confirming the action
**Then**:
  - Warning: "Previous token will be invalidated"
  - Confirmation required
  - New 48-char token generated
  - Old token immediately invalid
  - Option to email new link to client
  - Success notification shown

---

### AC 3.2.14: Block/Unblock Client

**Given** an admin clicks "Block Client"
**When** confirming the action
**Then**:
  - Reason required (dropdown + notes)
  - Client status → Blocked
  - All active sessions invalidated
  - Token links disabled
  - Client cannot log in
  - Admin notification sent
  - Audit logged

**Given** an admin clicks "Unblock Client"
**Then**:
  - Confirmation required
  - Status → Active
  - Token links re-enabled
  - New token can be generated
  - Audit logged

---

### AC 3.2.15: Add Client Manually

**Given** an admin clicks "Add Client"
**When** the form opens
**Then** required fields:

| Field | Validation |
|-------|------------|
| Full Name | Required |
| Email | Required, unique |
| Phone | Optional |
| Preferred Language | Required |
| Send Welcome Email | Checkbox |

**And**:
  - Email uniqueness checked before submit
  - Token generated automatically
  - Welcome email sent if checked
  - Redirect to new client profile

---

### AC 3.2.16: Export Clients

**Given** an admin clicks "Export"
**When** selecting export format
**Then** options:
  - CSV format
  - Excel (XLSX) format

**Export includes:**
  - All filtered clients (or all if no filter)
  - Columns: Name, Email, Phone, Status, Language, Created, Last Activity
  - Sensitive data excluded (tokens, passwords)
  - Download starts immediately
  - Max 10,000 rows per export

---

### AC 3.2.17: Bulk Actions

**Given** an admin selects multiple clients (checkboxes)
**When** clicking "Bulk Actions"
**Then** available actions:
  - Change Status (to selected status)
  - Export Selected
  - Send Bulk Email (template)

**And**:
  - Confirmation required for status changes
  - Progress indicator for large selections
  - Audit logged for each client

---

### AC 3.2.18: Permission Enforcement

**Given** different admin roles
**When** accessing client management
**Then**:

| Role | View | Edit | Delete | Block | Export |
|------|------|------|--------|-------|--------|
| super_admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✗ | ✓ | ✓ |
| support | ✓ | ✗ | ✗ | ✗ | ✗ |
| finance | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/admin/clients/page.tsx` | Create | Client list page |
| `app/admin/clients/[id]/page.tsx` | Create | Client detail page |
| `app/admin/clients/new/page.tsx` | Create | Add client page |
| `components/admin/clients/ClientTable.tsx` | Create | Data table |
| `components/admin/clients/ClientFilters.tsx` | Create | Filter panel |
| `components/admin/clients/ClientSearch.tsx` | Create | Search component |
| `components/admin/clients/ClientProfile.tsx` | Create | Profile header |
| `components/admin/clients/ClientTabs.tsx` | Create | Tab navigation |
| `components/admin/clients/EditClientModal.tsx` | Create | Edit form modal |
| `components/admin/clients/RegenerateTokenModal.tsx` | Create | Token regeneration |
| `components/admin/clients/BlockClientModal.tsx` | Create | Block confirmation |
| `components/admin/common/DataTable.tsx` | Create | Reusable table |
| `components/admin/common/Pagination.tsx` | Create | Pagination |
| `components/admin/common/StatusBadge.tsx` | Create | Status badges |
| `hooks/useClients.ts` | Create | Client data hook |
| `hooks/useDebounce.ts` | Create | Debounce utility |
| `api/admin/clients/index.php` | Create | List clients API |
| `api/admin/clients/[id].php` | Create | Single client API |
| `api/admin/clients/search.php` | Create | Search API |
| `api/admin/clients/export.php` | Create | Export API |

---

### Database Queries

```sql
-- Get clients with pagination and filters
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.status,
    c.preferred_language,
    c.created_at,
    c.eligibility_status,
    (SELECT MAX(created_at) FROM client_sessions WHERE client_id = c.id) as last_activity,
    (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as case_count,
    (SELECT COUNT(*) FROM documents WHERE client_id = c.id) as document_count
FROM clients c
WHERE 1=1
    AND (:search IS NULL OR (
        c.name LIKE CONCAT('%', :search, '%') OR
        c.email LIKE CONCAT('%', :search, '%') OR
        c.phone LIKE CONCAT('%', :search, '%')
    ))
    AND (:status IS NULL OR c.status = :status)
    AND (:language IS NULL OR c.preferred_language = :language)
    AND (:date_from IS NULL OR c.created_at >= :date_from)
    AND (:date_to IS NULL OR c.created_at <= :date_to)
ORDER BY c.created_at DESC
LIMIT :limit OFFSET :offset;

-- Count total for pagination
SELECT COUNT(*) as total FROM clients c WHERE ... (same conditions);

-- Get single client with all details
SELECT 
    c.*,
    t.token as current_token,
    t.created_at as token_created,
    t.expires_at as token_expires,
    (SELECT COUNT(*) FROM token_usages WHERE token_id = t.id) as token_usage_count,
    (SELECT COUNT(*) FROM client_sessions WHERE client_id = c.id AND expires_at > NOW() AND revoked_at IS NULL) as active_sessions
FROM clients c
LEFT JOIN client_tokens t ON t.client_id = c.id AND t.is_active = TRUE
WHERE c.id = :id;
```

---

### Client List Component

```typescript
// components/admin/clients/ClientTable.tsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { StatusBadge } from '../common/StatusBadge';
import { Pagination } from '../common/Pagination';
import { formatRelativeTime, formatDate } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive' | 'blocked';
  preferred_language: string;
  created_at: string;
  last_activity: string | null;
  case_count: number;
  document_count: number;
}

interface ClientTableProps {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedIds: number[];
  onSelectChange: (ids: number[]) => void;
}

export function ClientTable({
  clients,
  total,
  page,
  pageSize,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  selectedIds,
  onSelectChange,
}: ClientTableProps) {
  const router = useRouter();
  
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'last_activity', label: 'Last Activity', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(clients.map(c => c.id));
    } else {
      onSelectChange([]);
    }
  };
  
  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter(i => i !== id));
    }
  };
  
  const handleRowClick = (id: number) => {
    router.push(`/admin/clients/${id}`);
  };
  
  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 inline ml-1" />
      : <ChevronDownIcon className="w-4 h-4 inline ml-1" />;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === clients.length && clients.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon column={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-gray-500">
                  No clients found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(client.id)}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={(e) => handleSelectOne(client.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  
                  {/* Name */}
                  <td className="px-4 py-4">
                    <Link 
                      href={`/admin/clients/${client.id}`}
                      className="text-primary font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.name}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {client.case_count} cases, {client.document_count} docs
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  </td>
                  
                  {/* Phone */}
                  <td className="px-4 py-4">
                    {client.phone ? (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={client.status} />
                  </td>
                  
                  {/* Created */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDate(client.created_at)}
                  </td>
                  
                  {/* Last Activity */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {client.last_activity 
                      ? formatRelativeTime(client.last_activity)
                      : <span className="text-gray-400">Never</span>
                    }
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <ClientActionsDropdown clientId={client.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200">
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}

function ClientActionsDropdown({ clientId }: { clientId: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1 border">
            <button
              onClick={() => router.push(`/admin/clients/${clientId}`)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              View Profile
            </button>
            <button
              onClick={() => router.push(`/admin/clients/${clientId}?edit=true`)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              Edit Client
            </button>
            <button
              onClick={() => {/* Regenerate token */}}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              Regenerate Token
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {/* Block client */}}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Block Client
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### Client Filters Component

```typescript
// components/admin/clients/ClientFilters.tsx
'use client';

import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DateRangePicker } from '../common/DateRangePicker';

interface Filters {
  status: string[];
  language: string[];
  dateFrom: string | null;
  dateTo: string | null;
  hasCase: boolean | null;
  hasDocuments: boolean | null;
}

interface ClientFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClear: () => void;
}

export function ClientFilters({ filters, onFilterChange, onClear }: ClientFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  
  const activeFilterCount = [
    filters.status.length > 0,
    filters.language.length > 0,
    filters.dateFrom || filters.dateTo,
    filters.hasCase !== null,
    filters.hasDocuments !== null,
  ].filter(Boolean).length;
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'blocked', label: 'Blocked' },
  ];
  
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'es', label: 'Spanish' },
    { value: 'pt-br', label: 'Portuguese (BR)' },
  ];
  
  const toggleStatus = (value: string) => {
    const newStatus = filters.status.includes(value)
      ? filters.status.filter(s => s !== value)
      : [...filters.status, value];
    onFilterChange({ ...filters, status: newStatus });
  };
  
  const toggleLanguage = (value: string) => {
    const newLanguage = filters.language.includes(value)
      ? filters.language.filter(l => l !== value)
      : [...filters.language, value];
    onFilterChange({ ...filters, language: newLanguage });
  };
  
  return (
    <div className="mb-4">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border
          ${activeFilterCount > 0 
            ? 'bg-primary/10 border-primary text-primary' 
            : 'bg-white border-gray-300 text-gray-700'
          }
        `}
      >
        <FunnelIcon className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>
      
      {/* Expanded Filter Panel */}
      {expanded && (
        <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(opt.value)}
                      onChange={() => toggleStatus(opt.value)}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="space-y-2">
                {languageOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.language.includes(opt.value)}
                      onChange={() => toggleLanguage(opt.value)}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Date
              </label>
              <DateRangePicker
                from={filters.dateFrom}
                to={filters.dateTo}
                onChange={(from, to) => onFilterChange({ ...filters, dateFrom: from, dateTo: to })}
              />
            </div>
            
            {/* Boolean Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Filters
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasCase === true}
                    onChange={() => onFilterChange({
                      ...filters,
                      hasCase: filters.hasCase === true ? null : true
                    })}
                    className="rounded border-gray-300 text-primary"
                  />
                  <span className="text-sm">Has Case</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasDocuments === true}
                    onChange={() => onFilterChange({
                      ...filters,
                      hasDocuments: filters.hasDocuments === true ? null : true
                    })}
                    className="rounded border-gray-300 text-primary"
                  />
                  <span className="text-sm">Has Documents</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### PHP Client API

```php
<?php
// api/admin/clients/index.php

require_once __DIR__ . '/../../lib/AdminAuthService.php';
require_once __DIR__ . '/../../lib/Database.php';

use BrasilLegalize\Api\Lib\AdminAuthService;
use BrasilLegalize\Api\Lib\Database;

header('Content-Type: application/json');

// Validate admin session
$sessionId = $_COOKIE['admin_session'] ?? null;
if (!$sessionId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$db = Database::getInstance();
$authService = new AdminAuthService($db);
$session = $authService->validateSession($sessionId);

if (!$session || !$authService->hasPermission($session['admin']['role'], 'clients.view')) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// Parse query parameters
$search = $_GET['search'] ?? null;
$status = isset($_GET['status']) ? explode(',', $_GET['status']) : null;
$language = isset($_GET['language']) ? explode(',', $_GET['language']) : null;
$dateFrom = $_GET['date_from'] ?? null;
$dateTo = $_GET['date_to'] ?? null;
$hasCase = isset($_GET['has_case']) ? filter_var($_GET['has_case'], FILTER_VALIDATE_BOOLEAN) : null;
$sortBy = $_GET['sort_by'] ?? 'created_at';
$sortOrder = $_GET['sort_order'] ?? 'desc';
$page = max(1, intval($_GET['page'] ?? 1));
$pageSize = min(100, max(10, intval($_GET['page_size'] ?? 25)));

// Build query
$whereClauses = ['1=1'];
$params = [];

if ($search) {
    $whereClauses[] = '(c.name LIKE :search OR c.email LIKE :search OR c.phone LIKE :search)';
    $params['search'] = "%{$search}%";
}

if ($status && count($status) > 0) {
    $statusPlaceholders = [];
    foreach ($status as $i => $s) {
        $key = "status_{$i}";
        $statusPlaceholders[] = ":{$key}";
        $params[$key] = $s;
    }
    $whereClauses[] = 'c.status IN (' . implode(',', $statusPlaceholders) . ')';
}

if ($language && count($language) > 0) {
    $langPlaceholders = [];
    foreach ($language as $i => $l) {
        $key = "lang_{$i}";
        $langPlaceholders[] = ":{$key}";
        $params[$key] = $l;
    }
    $whereClauses[] = 'c.preferred_language IN (' . implode(',', $langPlaceholders) . ')';
}

if ($dateFrom) {
    $whereClauses[] = 'c.created_at >= :date_from';
    $params['date_from'] = $dateFrom;
}

if ($dateTo) {
    $whereClauses[] = 'c.created_at <= :date_to';
    $params['date_to'] = $dateTo;
}

if ($hasCase !== null) {
    if ($hasCase) {
        $whereClauses[] = 'EXISTS (SELECT 1 FROM cases WHERE client_id = c.id)';
    } else {
        $whereClauses[] = 'NOT EXISTS (SELECT 1 FROM cases WHERE client_id = c.id)';
    }
}

$whereSQL = implode(' AND ', $whereClauses);

// Validate sort column
$allowedSortColumns = ['name', 'email', 'status', 'created_at', 'last_activity'];
if (!in_array($sortBy, $allowedSortColumns)) {
    $sortBy = 'created_at';
}
$sortOrder = strtoupper($sortOrder) === 'ASC' ? 'ASC' : 'DESC';

// Get total count
$countSQL = "SELECT COUNT(*) as total FROM clients c WHERE {$whereSQL}";
$stmt = $db->prepare($countSQL);
$stmt->execute($params);
$total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get clients
$offset = ($page - 1) * $pageSize;

$dataSQL = "
    SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.status,
        c.preferred_language,
        c.created_at,
        c.eligibility_status,
        (SELECT MAX(created_at) FROM client_sessions WHERE client_id = c.id) as last_activity,
        (SELECT COUNT(*) FROM cases WHERE client_id = c.id) as case_count,
        (SELECT COUNT(*) FROM documents WHERE client_id = c.id) as document_count
    FROM clients c
    WHERE {$whereSQL}
    ORDER BY {$sortBy} {$sortOrder}
    LIMIT {$pageSize} OFFSET {$offset}
";

$stmt = $db->prepare($dataSQL);
$stmt->execute($params);
$clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Log audit
$authService->logAudit(
    $session['admin']['id'],
    'view',
    'clients',
    null,
    $_SERVER['REMOTE_ADDR'] ?? '',
    $_SERVER['HTTP_USER_AGENT'] ?? '',
    ['search' => $search, 'filters' => count($whereClauses) - 1]
);

// Return response
echo json_encode([
    'success' => true,
    'data' => $clients,
    'pagination' => [
        'total' => (int) $total,
        'page' => $page,
        'page_size' => $pageSize,
        'total_pages' => ceil($total / $pageSize),
    ],
]);
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `list-clients` | Fetch client list | Returns paginated data |
| `search-by-name` | Search "João" | Matches João clients |
| `search-by-email` | Search "gmail.com" | Matches emails |
| `filter-by-status` | Filter active only | Only active returned |
| `filter-combined` | Multiple filters | AND logic works |
| `sort-ascending` | Sort name ASC | A to Z order |
| `sort-descending` | Sort created DESC | Newest first |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `permission-admin` | Admin views clients | Full access |
| `permission-support` | Support views clients | Read-only access |
| `permission-finance` | Finance views clients | Access denied |
| `edit-client` | Update client info | Changes saved |
| `regenerate-token` | New token created | Old invalidated |
| `block-client` | Block client | Sessions revoked |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `client-list-page` | Visit /admin/clients | Table renders |
| `search-interaction` | Type in search | Results filter |
| `filter-panel` | Apply filters | URL updates |
| `client-detail` | Click client row | Detail page shows |
| `edit-modal` | Edit client info | Modal opens, saves |
| `pagination` | Click page 2 | New page loads |

---

## Edge Cases and Error Handling

### Edge Case 1: Large Dataset Export
- **Scenario:** 50,000+ clients, export requested
- **Handling:** Max 10,000 rows, apply filters first message
- **User Impact:** Clear guidance on limiting export

### Edge Case 2: Concurrent Edits
- **Scenario:** Two admins edit same client
- **Handling:** Last save wins, show "updated by X at Y" warning
- **User Impact:** Refresh before editing if stale

### Edge Case 3: Search Performance
- **Scenario:** Search with common term like "a"
- **Handling:** Debounce, pagination, encourage more specific search
- **User Impact:** Results still load, just may be many

### Edge Case 4: Delete Client (not implemented)
- **Scenario:** Admin wants to delete client
- **Handling:** Soft delete only, data retained for legal
- **User Impact:** "Archive" option instead of delete

---

## Security Considerations

1. **Permission Checks:** Server-side on every request
2. **Audit Logging:** Every view, edit, export logged
3. **No Email Enumeration:** Search doesn't expose all emails
4. **Export Limits:** Prevent mass data extraction
5. **Rate Limiting:** On search API to prevent scraping
6. **Session Validation:** Per-request session check

---

## Definition of Done

- [ ] Client list page implemented
- [ ] Search works with debounce
- [ ] Filters work correctly
- [ ] Sorting works on all columns
- [ ] Pagination works
- [ ] Client detail page implemented
- [ ] All tabs (Overview, Cases, Documents, Messages, Activity) work
- [ ] Edit client modal works
- [ ] Regenerate token works
- [ ] Block/Unblock works
- [ ] Add client manually works
- [ ] Export functionality works
- [ ] Bulk actions work
- [ ] Permissions enforced
- [ ] Responsive design verified
- [ ] All tests pass
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

