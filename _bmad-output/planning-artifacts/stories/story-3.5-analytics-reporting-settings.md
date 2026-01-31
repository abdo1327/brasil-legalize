---
storyId: "3.5"
epicId: "3"
title: "Analytics, Reporting & Admin Settings"
status: "ready"
priority: "medium"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - admin
  - analytics
  - reports
  - settings
  - dashboard
  - export
functionalRequirements:
  - FR17
  - FR18
nonFunctionalRequirements:
  - NFR3
  - NFR6
dependencies:
  - "3.1"
  - "3.2"
  - "3.3"
  - "3.4"
blockedBy:
  - "3.4"
blocks: []
---

# Story 3.5: Analytics, Reporting & Admin Settings

## User Story

**As an** administrator,
**I want** to view analytics dashboards, generate reports, and configure system settings,
**So that** I can monitor business performance, make data-driven decisions, and customize the platform.

---

## Story Description

This story completes the admin console by providing analytics dashboards for business insights, customizable reports for data export, and system settings for platform configuration.

The analytics provide real-time visibility into client acquisition, case processing, revenue (demo), and operational efficiency. Reports allow admins to export data for external analysis or compliance. Settings enable super admins to configure system behavior.

---

## Acceptance Criteria

### AC 3.5.1: Analytics Dashboard Page

**Given** an admin navigates to `/admin/reports` or clicks "Reports" in sidebar
**When** the page loads
**Then** they see:

1. **Date Range Selector:**
   - Presets: Today, This Week, This Month, Last 30 Days, This Year
   - Custom date range picker
   - Compare to previous period toggle

2. **Key Metrics Row:**
   - Total Leads (with trend %)
   - New Clients (with trend %)
   - Active Cases (with trend %)
   - Documents Processed (with trend %)
   - Estimated Revenue (demo, with trend %)

3. **Quick Filters:**
   - All data
   - By language/market
   - By package type

---

### AC 3.5.2: Lead & Client Metrics

**Given** the analytics dashboard loads
**When** viewing lead/client metrics
**Then** sections include:

1. **Lead Funnel Visualization:**
   - Site Visits (from analytics integration if available)
   - Eligibility Started
   - Eligibility Completed
   - Booking Scheduled
   - Consultation Completed
   - Conversion rate at each step

2. **Client Acquisition Chart:**
   - Line/bar chart over time
   - New registrations per day/week/month
   - Grouped by language/source

3. **Client Status Distribution:**
   - Pie chart: Active, Pending, Inactive, Blocked
   - Click segment → filtered client list

---

### AC 3.5.3: Case Processing Metrics

**Given** viewing case analytics
**When** the section loads
**Then** displays:

1. **Cases Overview:**
   - Total open cases
   - Cases by status (horizontal bar)
   - New cases this period
   - Closed cases this period

2. **Processing Time Metrics:**
   - Average days per status
   - Average total case duration
   - Cases exceeding SLA
   - Comparison to previous period

3. **Case Velocity Chart:**
   - Cases opened vs closed over time
   - Trend line for net case growth

4. **Admin Workload:**
   - Cases per admin (bar chart)
   - Unassigned cases count

---

### AC 3.5.4: Document Processing Metrics

**Given** viewing document analytics
**When** the section loads
**Then** displays:

1. **Document Volume:**
   - Total uploaded this period
   - By category breakdown
   - Trend over time

2. **Review Metrics:**
   - Documents pending review
   - Approved vs rejected ratio
   - Average review time
   - Documents by status (pie)

3. **Review Efficiency:**
   - Reviews per admin
   - Average turnaround time
   - Rejection rate by reason

---

### AC 3.5.5: Revenue Metrics (Demo)

**Given** viewing revenue analytics
**When** the section loads (if super_admin/finance role)
**Then** displays:

1. **Revenue Summary:**
   - Total estimated revenue (sum of package prices)
   - Revenue this period
   - Revenue by package type
   - MRR/ARR projections (if applicable)

2. **Revenue Chart:**
   - Revenue over time (line chart)
   - Grouped by package

3. **Note:** This is demo/estimated data since Stripe is in test mode

---

### AC 3.5.6: Export Reports

**Given** an admin clicks "Generate Report" or "Export"
**When** configuring the export
**Then** options include:

1. **Report Type:**
   - Client List Report
   - Case Status Report
   - Document Inventory Report
   - Activity Log Report
   - Revenue Report (finance role)

2. **Date Range:**
   - Same as dashboard selector
   - Or "All Time"

3. **Filters:**
   - Same filters as respective list pages
   - Additional grouping options

4. **Format:**
   - CSV
   - Excel (XLSX)
   - PDF (summary reports)

5. **Delivery:**
   - Immediate download
   - Email when ready (large reports)

---

### AC 3.5.7: Scheduled Reports

**Given** an admin wants recurring reports
**When** configuring scheduled reports
**Then**:
  - Select report type
  - Select frequency (daily, weekly, monthly)
  - Select delivery email(s)
  - Schedule preview shows next run
  - List of scheduled reports with edit/delete

---

### AC 3.5.8: Audit Log Report

**Given** super_admin views audit logs
**When** navigating to `/admin/settings/audit`
**Then**:

1. **Audit Log Table:**
   - Timestamp
   - Admin name
   - Action
   - Resource type
   - Resource ID (link)
   - IP Address
   - Details (expandable)

2. **Filters:**
   - Admin filter
   - Action type filter
   - Date range
   - Resource type

3. **Export:**
   - Export filtered logs to CSV

---

### AC 3.5.9: System Settings Page

**Given** a super_admin navigates to `/admin/settings`
**When** the page loads
**Then** settings categories include:

1. **General Settings:**
   - Site name
   - Contact email
   - Support phone
   - Business hours
   - Default language

2. **Email Settings:**
   - From name
   - From email
   - Reply-to email
   - Email templates (view/edit)

3. **Notification Settings:**
   - Client notification preferences (defaults)
   - Admin notification rules
   - Which events trigger notifications

4. **Security Settings:**
   - Password policy (min length, etc.)
   - Session timeout duration
   - MFA enforcement
   - Allowed IP ranges (optional)

5. **Integration Settings:**
   - Calendly URL
   - Stripe API keys (masked)
   - Resend API key (masked)
   - WhatsApp number

---

### AC 3.5.10: Email Template Management

**Given** super_admin accesses email templates
**When** viewing templates
**Then**:

1. **Template List:**
   - Welcome Email
   - Token Link Email
   - Password Reset
   - Document Approved
   - Document Rejected
   - Case Status Update
   - Appointment Reminder
   - Custom templates

2. **Template Editor:**
   - Template name
   - Subject line (with variables)
   - Body (HTML with preview)
   - Available variables list
   - Locale selector (EN, AR, ES, PT-BR)
   - Test send option

3. **Variables:**
   - {{client_name}}
   - {{client_email}}
   - {{case_id}}
   - {{status}}
   - {{link}}
   - etc.

---

### AC 3.5.11: Admin User Management

**Given** super_admin accesses admin management
**When** navigating to `/admin/settings/admins`
**Then**:

1. **Admin List:**
   - Name
   - Email
   - Role
   - Status (active/inactive)
   - Last Login
   - Actions (edit, deactivate)

2. **Create Admin:**
   - Name
   - Email
   - Role selection
   - Send welcome email checkbox
   - Generate temporary password

3. **Edit Admin:**
   - Update name, role
   - Reset password
   - Force MFA setup
   - Deactivate account

4. **Deactivate (not delete):**
   - Soft deactivation
   - Sessions revoked
   - Cannot log in
   - Data retained

---

### AC 3.5.12: Package/Service Management

**Given** super_admin accesses package settings
**When** viewing packages
**Then**:

1. **Package List:**
   - Package name
   - Price
   - Description
   - Required documents
   - Active/Inactive status

2. **Edit Package:**
   - Name (each locale)
   - Description (each locale)
   - Price
   - Currency
   - Features list
   - Required document categories
   - Is active toggle

3. **Note:** Changes affect new leads, not existing cases

---

### AC 3.5.13: Dashboard Widgets Configuration

**Given** an admin wants to customize dashboard
**When** clicking "Customize Dashboard"
**Then**:
  - List of available widgets
  - Toggle visibility
  - Drag to reorder
  - Widget size options (if applicable)
  - Save layout
  - Reset to default

---

### AC 3.5.14: System Health Status

**Given** super_admin views system status
**When** navigating to `/admin/settings/status`
**Then**:

1. **Service Status:**
   - Database: Connected/Error
   - Email (Resend): Connected/Error
   - Storage: Connected/Error
   - Calendly: Connected/Error
   - Last check timestamp

2. **Storage Usage:**
   - Documents storage used
   - Storage limit (if applicable)
   - Cleanup recommendations

3. **Queue Status:**
   - Pending emails
   - Failed jobs (if any)
   - Retry options

---

### AC 3.5.15: Export All Data (GDPR)

**Given** a client requests data export
**When** super_admin processes request
**Then**:
  - Select client
  - Generate complete data export
  - Includes: profile, cases, documents, messages
  - Password-protected ZIP
  - Download link (time-limited)
  - Audit logged

---

### AC 3.5.16: Permission Enforcement

**Given** different admin roles
**When** accessing reports/settings
**Then**:

| Feature | super_admin | admin | support | finance |
|---------|-------------|-------|---------|---------|
| View Analytics | ✓ | ✓ | ✓ | ✓ |
| Export Reports | ✓ | ✓ | ✗ | ✓ |
| Revenue Analytics | ✓ | ✗ | ✗ | ✓ |
| Audit Logs | ✓ | ✗ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ | ✗ |
| Admin Management | ✓ | ✗ | ✗ | ✗ |
| Email Templates | ✓ | ✗ | ✗ | ✗ |

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/admin/reports/page.tsx` | Create | Analytics dashboard |
| `app/admin/settings/page.tsx` | Create | Settings overview |
| `app/admin/settings/general/page.tsx` | Create | General settings |
| `app/admin/settings/email/page.tsx` | Create | Email settings |
| `app/admin/settings/admins/page.tsx` | Create | Admin management |
| `app/admin/settings/packages/page.tsx` | Create | Package settings |
| `app/admin/settings/audit/page.tsx` | Create | Audit log viewer |
| `app/admin/settings/status/page.tsx` | Create | System status |
| `components/admin/analytics/MetricCard.tsx` | Create | Metric display |
| `components/admin/analytics/LineChart.tsx` | Create | Time series chart |
| `components/admin/analytics/PieChart.tsx` | Create | Distribution chart |
| `components/admin/analytics/BarChart.tsx` | Create | Bar chart |
| `components/admin/analytics/FunnelChart.tsx` | Create | Funnel visual |
| `components/admin/analytics/DateRangeSelector.tsx` | Create | Date picker |
| `components/admin/settings/SettingsForm.tsx` | Create | Form component |
| `components/admin/settings/EmailTemplateEditor.tsx` | Create | Template editor |
| `components/admin/settings/AdminTable.tsx` | Create | Admin list |
| `lib/admin/analytics.ts` | Create | Analytics utilities |
| `api/admin/analytics/overview.php` | Create | Overview data |
| `api/admin/analytics/clients.php` | Create | Client metrics |
| `api/admin/analytics/cases.php` | Create | Case metrics |
| `api/admin/analytics/documents.php` | Create | Document metrics |
| `api/admin/reports/export.php` | Create | Report export |
| `api/admin/settings/index.php` | Create | Settings CRUD |
| `api/admin/settings/templates.php` | Create | Email templates |
| `api/admin/settings/admins.php` | Create | Admin CRUD |

---

### Database Schema Additions

```sql
-- System settings (key-value store)
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description VARCHAR(255),
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    INDEX idx_key (setting_key),
    FOREIGN KEY (updated_by) REFERENCES admins(id)
);

-- Email templates
CREATE TABLE email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables JSON, -- List of available variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_template_locale (template_key, locale),
    INDEX idx_template_key (template_key),
    FOREIGN KEY (updated_by) REFERENCES admins(id)
);

-- Scheduled reports
CREATE TABLE scheduled_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_config JSON, -- Filters, date range, etc.
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    delivery_emails VARCHAR(512) NOT NULL, -- Comma-separated
    next_run_at DATETIME NOT NULL,
    last_run_at DATETIME,
    last_run_status ENUM('success', 'failure'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_next_run (next_run_at),
    INDEX idx_admin_id (admin_id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Dashboard widget preferences
CREATE TABLE admin_dashboard_prefs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL UNIQUE,
    widget_config JSON, -- Widget visibility, order, sizes
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Brasil Legalize', 'string', 'Website name'),
('contact_email', 'contact@brasillegalize.com', 'string', 'Main contact email'),
('support_phone', '+55 11 99999-9999', 'string', 'Support phone number'),
('default_language', 'en', 'string', 'Default site language'),
('session_timeout_hours', '4', 'number', 'Admin session timeout in hours'),
('mfa_required', 'false', 'boolean', 'Require MFA for all admins'),
('password_min_length', '8', 'number', 'Minimum password length'),
('calendly_url', 'https://calendly.com/brasillegalize', 'string', 'Calendly booking URL'),
('whatsapp_number', '+5511999999999', 'string', 'WhatsApp contact number');

-- Insert default email templates
INSERT INTO email_templates (template_key, locale, subject, body, variables) VALUES
('welcome', 'en', 'Welcome to Brasil Legalize', '<h1>Welcome {{client_name}}!</h1><p>Thank you for registering...</p>', '["client_name", "client_email", "portal_link"]'),
('welcome', 'pt-br', 'Bem-vindo ao Brasil Legalize', '<h1>Bem-vindo {{client_name}}!</h1><p>Obrigado por se registrar...</p>', '["client_name", "client_email", "portal_link"]'),
('token_link', 'en', 'Your Secure Portal Access', '<p>Click here to access your portal: <a href="{{link}}">Access Portal</a></p>', '["client_name", "link", "expires_at"]'),
('document_approved', 'en', 'Document Approved', '<p>Your document "{{document_name}}" has been approved.</p>', '["client_name", "document_name", "case_id"]'),
('document_rejected', 'en', 'Document Needs Resubmission', '<p>Your document "{{document_name}}" was not accepted.</p><p>Reason: {{reason}}</p>', '["client_name", "document_name", "reason", "notes"]');
```

---

### Analytics Dashboard Component

```typescript
// app/admin/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DateRangeSelector, DateRange } from '@/components/admin/analytics/DateRangeSelector';
import { MetricCard } from '@/components/admin/analytics/MetricCard';
import { LineChart } from '@/components/admin/analytics/LineChart';
import { PieChart } from '@/components/admin/analytics/PieChart';
import { BarChart } from '@/components/admin/analytics/BarChart';
import { FunnelChart } from '@/components/admin/analytics/FunnelChart';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  UsersIcon,
  BriefcaseIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: 'last_30_days',
  });
  const [comparePrevious, setComparePrevious] = useState(true);
  
  const { data, loading, error } = useAnalytics(dateRange);
  
  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-600">Error loading analytics: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={comparePrevious}
              onChange={(e) => setComparePrevious(e.target.checked)}
              className="rounded"
            />
            Compare to previous period
          </label>
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
        </div>
      </div>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Leads"
          value={data.metrics.totalLeads}
          trend={comparePrevious ? data.metrics.leadsTrend : undefined}
          icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
        />
        <MetricCard
          title="New Clients"
          value={data.metrics.newClients}
          trend={comparePrevious ? data.metrics.clientsTrend : undefined}
          icon={<UsersIcon className="w-6 h-6" />}
        />
        <MetricCard
          title="Active Cases"
          value={data.metrics.activeCases}
          trend={comparePrevious ? data.metrics.casesTrend : undefined}
          icon={<BriefcaseIcon className="w-6 h-6" />}
        />
        <MetricCard
          title="Documents Processed"
          value={data.metrics.documentsProcessed}
          trend={comparePrevious ? data.metrics.documentsTrend : undefined}
          icon={<DocumentIcon className="w-6 h-6" />}
        />
        <MetricCard
          title="Est. Revenue"
          value={`R$ ${data.metrics.estimatedRevenue.toLocaleString()}`}
          trend={comparePrevious ? data.metrics.revenueTrend : undefined}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          note="Demo data"
        />
      </div>
      
      {/* Lead Funnel & Client Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lead Funnel</h2>
          <FunnelChart data={data.funnel} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Client Acquisition</h2>
          <LineChart
            data={data.clientAcquisition}
            xKey="date"
            yKey="count"
            color="#004956"
          />
        </div>
      </div>
      
      {/* Case & Document Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Cases by Status</h2>
          <BarChart
            data={data.casesByStatus}
            xKey="status"
            yKey="count"
            horizontal
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Document Status</h2>
          <PieChart
            data={data.documentStatus}
            nameKey="status"
            valueKey="count"
          />
        </div>
      </div>
      
      {/* Processing Time & Admin Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Average Processing Time</h2>
          <div className="space-y-4">
            {data.processingTimes.map((item: any) => (
              <div key={item.status} className="flex justify-between items-center">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.avgDays} days</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Workload</h2>
          <BarChart
            data={data.adminWorkload}
            xKey="name"
            yKey="cases"
          />
        </div>
      </div>
      
      {/* Export Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            Export Client Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            Export Case Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            Export Document Report
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Schedule Reports
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Metric Card Component

```typescript
// components/admin/analytics/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number; // Percentage change
  icon: React.ReactNode;
  note?: string;
}

export function MetricCard({ title, value, trend, icon, note }: MetricCardProps) {
  const trendIsPositive = trend !== undefined && trend >= 0;
  const trendIsNegative = trend !== undefined && trend < 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`
            flex items-center text-sm font-medium
            ${trendIsPositive ? 'text-green-600' : 'text-red-600'}
          `}>
            {trendIsPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
}
```

---

### Settings Form Component

```typescript
// components/admin/settings/SettingsForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Setting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  label: string;
  description?: string;
  sensitive?: boolean;
}

interface SettingsFormProps {
  settings: Setting[];
  onSave: (values: Record<string, any>) => Promise<void>;
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}),
  });
  
  const onSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    setSuccess(false);
    try {
      await onSave(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  const renderField = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register(setting.key)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{setting.label}</span>
          </label>
        );
      
      case 'number':
        return (
          <input
            type="number"
            {...register(setting.key, { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        );
      
      default:
        return (
          <input
            type={setting.sensitive ? 'password' : 'text'}
            {...register(setting.key)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder={setting.sensitive ? '••••••••' : ''}
          />
        );
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {settings.map((setting) => (
        <div key={setting.key}>
          {setting.type !== 'boolean' && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {setting.label}
            </label>
          )}
          {renderField(setting)}
          {setting.description && (
            <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
          )}
        </div>
      ))}
      
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading || !isDirty}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        {success && (
          <span className="text-green-600 text-sm">Settings saved successfully!</span>
        )}
      </div>
    </form>
  );
}
```

---

### PHP Analytics API

```php
<?php
// api/admin/analytics/overview.php

require_once __DIR__ . '/../../lib/AdminAuthService.php';
require_once __DIR__ . '/../../lib/Database.php';

use BrasilLegalize\Api\Lib\AdminAuthService;
use BrasilLegalize\Api\Lib\Database;

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

if (!$session) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// Parse date range
$from = $_GET['from'] ?? date('Y-m-d', strtotime('-30 days'));
$to = $_GET['to'] ?? date('Y-m-d');

// Previous period for comparison
$periodDays = (strtotime($to) - strtotime($from)) / 86400;
$prevFrom = date('Y-m-d', strtotime($from) - $periodDays * 86400);
$prevTo = date('Y-m-d', strtotime($from) - 86400);

// Fetch metrics
function getMetric(PDO $db, string $query, array $params): int {
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    return (int) $stmt->fetch(PDO::FETCH_ASSOC)['count'];
}

// Current period metrics
$totalLeads = getMetric($db, 
    'SELECT COUNT(*) as count FROM clients WHERE created_at BETWEEN :from AND :to',
    ['from' => $from, 'to' => $to . ' 23:59:59']
);

$newClients = getMetric($db,
    'SELECT COUNT(*) as count FROM clients WHERE status = :status AND created_at BETWEEN :from AND :to',
    ['status' => 'active', 'from' => $from, 'to' => $to . ' 23:59:59']
);

$activeCases = getMetric($db,
    'SELECT COUNT(*) as count FROM cases WHERE status NOT IN (:completed, :closed)',
    ['completed' => 'completed', 'closed' => 'closed']
);

$documentsProcessed = getMetric($db,
    'SELECT COUNT(*) as count FROM documents WHERE reviewed_at BETWEEN :from AND :to',
    ['from' => $from, 'to' => $to . ' 23:59:59']
);

// Estimated revenue (sum of package prices for completed cases)
$stmt = $db->prepare('
    SELECT COALESCE(SUM(p.price), 0) as total
    FROM cases c
    JOIN packages p ON p.id = c.package_id
    WHERE c.status = :status AND c.actual_completion BETWEEN :from AND :to
');
$stmt->execute(['status' => 'completed', 'from' => $from, 'to' => $to . ' 23:59:59']);
$estimatedRevenue = (float) $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Previous period metrics (for trends)
$prevLeads = getMetric($db,
    'SELECT COUNT(*) as count FROM clients WHERE created_at BETWEEN :from AND :to',
    ['from' => $prevFrom, 'to' => $prevTo . ' 23:59:59']
);

$prevClients = getMetric($db,
    'SELECT COUNT(*) as count FROM clients WHERE status = :status AND created_at BETWEEN :from AND :to',
    ['status' => 'active', 'from' => $prevFrom, 'to' => $prevTo . ' 23:59:59']
);

// Calculate trends
function calcTrend(int $current, int $previous): ?float {
    if ($previous === 0) return $current > 0 ? 100 : 0;
    return round(($current - $previous) / $previous * 100, 1);
}

// Funnel data
$funnelData = [
    ['stage' => 'Eligibility Started', 'count' => getMetric($db,
        'SELECT COUNT(*) as count FROM eligibility_responses WHERE created_at BETWEEN :from AND :to',
        ['from' => $from, 'to' => $to . ' 23:59:59']
    )],
    ['stage' => 'Eligibility Completed', 'count' => getMetric($db,
        'SELECT COUNT(*) as count FROM eligibility_responses WHERE is_complete = 1 AND created_at BETWEEN :from AND :to',
        ['from' => $from, 'to' => $to . ' 23:59:59']
    )],
    ['stage' => 'Booking Scheduled', 'count' => getMetric($db,
        'SELECT COUNT(*) as count FROM appointments WHERE created_at BETWEEN :from AND :to',
        ['from' => $from, 'to' => $to . ' 23:59:59']
    )],
    ['stage' => 'Consultation Completed', 'count' => getMetric($db,
        'SELECT COUNT(*) as count FROM cases WHERE status NOT IN (:new, :assigned) AND created_at BETWEEN :from AND :to',
        ['new' => 'new', 'assigned' => 'assigned', 'from' => $from, 'to' => $to . ' 23:59:59']
    )],
];

// Client acquisition over time
$stmt = $db->prepare('
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM clients
    WHERE created_at BETWEEN :from AND :to
    GROUP BY DATE(created_at)
    ORDER BY date
');
$stmt->execute(['from' => $from, 'to' => $to . ' 23:59:59']);
$clientAcquisition = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Cases by status
$stmt = $db->prepare('
    SELECT status, COUNT(*) as count
    FROM cases
    GROUP BY status
    ORDER BY count DESC
');
$stmt->execute();
$casesByStatus = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Document status distribution
$stmt = $db->prepare('
    SELECT status, COUNT(*) as count
    FROM documents
    GROUP BY status
');
$stmt->execute();
$documentStatus = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Admin workload
$stmt = $db->prepare('
    SELECT a.name, COUNT(c.id) as cases
    FROM admins a
    LEFT JOIN cases c ON c.assigned_to = a.id AND c.status NOT IN (:completed, :closed)
    WHERE a.is_active = TRUE
    GROUP BY a.id
    ORDER BY cases DESC
');
$stmt->execute(['completed' => 'completed', 'closed' => 'closed']);
$adminWorkload = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Response
echo json_encode([
    'success' => true,
    'dateRange' => ['from' => $from, 'to' => $to],
    'metrics' => [
        'totalLeads' => $totalLeads,
        'leadsTrend' => calcTrend($totalLeads, $prevLeads),
        'newClients' => $newClients,
        'clientsTrend' => calcTrend($newClients, $prevClients),
        'activeCases' => $activeCases,
        'casesTrend' => null, // Not applicable for active count
        'documentsProcessed' => $documentsProcessed,
        'documentsTrend' => null,
        'estimatedRevenue' => $estimatedRevenue,
        'revenueTrend' => null,
    ],
    'funnel' => $funnelData,
    'clientAcquisition' => $clientAcquisition,
    'casesByStatus' => $casesByStatus,
    'documentStatus' => $documentStatus,
    'adminWorkload' => $adminWorkload,
    'processingTimes' => [
        ['status' => 'documents_pending', 'label' => 'Document Collection', 'avgDays' => 5],
        ['status' => 'in_progress', 'label' => 'Processing', 'avgDays' => 10],
        ['status' => 'review', 'label' => 'Review', 'avgDays' => 3],
        ['status' => 'total', 'label' => 'Total Duration', 'avgDays' => 25],
    ],
]);
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `calc-trend-positive` | 100 → 120 | +20% |
| `calc-trend-negative` | 100 → 80 | -20% |
| `calc-trend-zero` | 0 → 50 | +100% |
| `date-range-parse` | Parse date range params | Correct dates |
| `metrics-query` | Run metrics query | Correct counts |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-analytics` | Fetch all analytics | All data returned |
| `export-csv` | Export report as CSV | Valid CSV file |
| `save-settings` | Update settings | Settings saved |
| `email-template` | Update template | Template saved |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `reports-page` | Visit /admin/reports | Charts render |
| `date-range-select` | Change date range | Data updates |
| `export-report` | Click export button | Download starts |
| `settings-page` | Visit /admin/settings | Form renders |
| `save-settings` | Change and save | Success message |

---

## Edge Cases and Error Handling

### Edge Case 1: No Data in Date Range
- **Scenario:** Date range with no activity
- **Handling:** Show zeros, "No data for this period" message
- **User Impact:** Clear that data exists but is empty

### Edge Case 2: Large Date Range Export
- **Scenario:** Export all-time data (years)
- **Handling:** Background job, email when ready
- **User Impact:** Progress indicator, email notification

### Edge Case 3: Settings Validation
- **Scenario:** Invalid email format in settings
- **Handling:** Client and server validation
- **User Impact:** Clear error message

### Edge Case 4: Concurrent Settings Update
- **Scenario:** Two admins update same setting
- **Handling:** Last write wins, timestamp shown
- **User Impact:** Refresh to see current value

---

## Security Considerations

1. **Permission Checks:** Role-based access to all features
2. **Sensitive Data:** API keys masked in UI, stored encrypted
3. **Audit Logging:** All settings changes logged
4. **GDPR Export:** Password-protected, time-limited
5. **Rate Limiting:** On export to prevent abuse

---

## Definition of Done

- [ ] Analytics dashboard renders with charts
- [ ] All metrics calculated correctly
- [ ] Date range selector works
- [ ] Comparison to previous period works
- [ ] Export reports work (CSV, Excel)
- [ ] Scheduled reports configurable
- [ ] Audit log viewable
- [ ] System settings editable
- [ ] Email templates editable
- [ ] Admin management works
- [ ] System health status displays
- [ ] Permissions enforced
- [ ] All tests pass
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

