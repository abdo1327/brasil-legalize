---
storyId: "1.4"
epicId: "1"
title: "Privacy, Consent Pages & Cookie Banner"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - privacy
  - consent
  - lgpd
  - cookies
  - compliance
functionalRequirements:
  - FR15
nonFunctionalRequirements:
  - NFR8
dependencies:
  - "1.1"
blockedBy:
  - "1.1"
blocks: []
---

# Story 1.4: Privacy, Consent Pages & Cookie Banner

## User Story

**As a** visitor,
**I want** to understand data practices and control my consent,
**So that** I feel secure sharing my information and comply with LGPD requirements.

---

## Story Description

This story implements LGPD-compliant privacy infrastructure including a comprehensive privacy policy page, cookie consent banner, and consent management system. Visitors must be able to understand how their data is used, provide or deny consent with equal ease, and revoke consent at any time.

The implementation must follow Brazil's Lei Geral de Proteção de Dados (LGPD) requirements, which are similar to GDPR but with specific Brazilian legal requirements. All consent actions must be auditable and timestamped.

---

## Acceptance Criteria

### AC 1.4.1: Cookie Banner Display

**Given** a visitor accesses any page for the first time
**When** the page loads
**Then** a cookie consent banner appears at the bottom of the screen
**And** the banner contains:
  - Clear explanation: "We use cookies to improve your experience"
  - "Accept" button (primary style)
  - "Reject" button (equal prominence, not hidden)
  - "Learn More" link to privacy policy
**And** the banner does not block critical content
**And** the banner is styled consistently with brand guidelines

**Given** a visitor has previously made a consent choice
**When** they return to the site
**Then** the cookie banner does NOT appear
**And** their previous choice is respected

---

### AC 1.4.2: Cookie Banner - Accept Flow

**Given** the cookie banner is displayed
**When** the visitor clicks "Accept"
**Then** the banner dismisses smoothly
**And** consent is recorded with:
  - Status: "accepted"
  - Timestamp: current UTC time
  - Version: current policy version
**And** analytics scripts may be loaded (if implemented)
**And** consent is stored in localStorage
**And** the cookie `consent_status=accepted` is set

---

### AC 1.4.3: Cookie Banner - Reject Flow

**Given** the cookie banner is displayed
**When** the visitor clicks "Reject"
**Then** the banner dismisses smoothly
**And** consent is recorded with:
  - Status: "rejected"
  - Timestamp: current UTC time
  - Version: current policy version
**And** NO analytics scripts are loaded
**And** NO non-essential cookies are set
**And** consent is stored in localStorage
**And** the cookie `consent_status=rejected` is set
**And** the visitor can still use all site features

---

### AC 1.4.4: Cookie Banner - Localization

**Given** the cookie banner is displayed
**When** viewed in any supported locale
**Then** all text is translated:
  - Banner message
  - Accept button text
  - Reject button text
  - Learn More link text

**Arabic (ar):**
```
نستخدم ملفات تعريف الارتباط لتحسين تجربتك
[قبول] [رفض] [معرفة المزيد]
```

**Spanish (es):**
```
Usamos cookies para mejorar tu experiencia
[Aceptar] [Rechazar] [Saber más]
```

**Portuguese (pt-br):**
```
Usamos cookies para melhorar sua experiência
[Aceitar] [Rejeitar] [Saiba mais]
```

---

### AC 1.4.5: Cookie Banner - RTL Support

**Given** the cookie banner is viewed in Arabic locale
**When** the banner renders
**Then** the layout is mirrored (RTL)
**And** buttons are in correct order for RTL reading
**And** the banner appears correctly positioned

---

### AC 1.4.6: Privacy Policy Page Structure

**Given** a visitor navigates to `/[locale]/privacy`
**When** the page loads
**Then** they see a comprehensive privacy policy containing:

1. **Introduction**
   - Company name and contact information
   - Effective date of policy
   - Summary of data practices

2. **Data Controller Information**
   - Legal entity name
   - Address
   - Contact email for privacy inquiries

3. **What Data We Collect**
   - Personal identification (name, email, phone)
   - Contact information
   - Service inquiry details
   - Document uploads (when applicable)
   - Usage data and analytics
   - Device and browser information

4. **How We Use Your Data**
   - Provide and improve services
   - Respond to inquiries
   - Process applications
   - Send relevant communications
   - Legal compliance

5. **Legal Basis for Processing (LGPD)**
   - Consent
   - Contract performance
   - Legal obligations
   - Legitimate interests

6. **Data Sharing**
   - Third-party service providers
   - Government authorities (when required)
   - No sale of personal data

7. **Data Retention**
   - How long data is kept
   - Criteria for retention periods
   - Deletion procedures

8. **Your Rights Under LGPD**
   - Right to access
   - Right to correction
   - Right to deletion
   - Right to data portability
   - Right to object
   - Right to withdraw consent
   - How to exercise rights

9. **Cookies and Tracking**
   - Types of cookies used
   - Purpose of each cookie type
   - How to manage cookies

10. **Security Measures**
    - How data is protected
    - Encryption and access controls

11. **International Transfers**
    - If data leaves Brazil
    - Safeguards in place

12. **Children's Privacy**
    - Age restrictions
    - Parental consent requirements

13. **Changes to This Policy**
    - How changes are communicated
    - Version history

14. **Contact Us**
    - How to reach the privacy team
    - Response timeframes

**And** all content is localized
**And** the page has proper heading hierarchy
**And** sections are linkable via anchor tags

---

### AC 1.4.7: Consent Management Section

**Given** a visitor is on the Privacy page
**When** they scroll to the "Your Rights" or "Manage Consent" section
**Then** they see:
  - Current consent status (Accepted/Rejected/Not Set)
  - Date of last consent action
  - Button to change consent preference
  - Link to download their data (or request form)
  - Link to request data deletion (or request form)

**Given** the visitor clicks "Change My Consent"
**When** the action completes
**Then** their consent status is updated
**And** the change is logged
**And** if changed to "Rejected", analytics are immediately disabled

---

### AC 1.4.8: Consent Status Display

**Given** a visitor views the consent management section
**When** their consent status is "Accepted"
**Then** they see:
  - Green indicator: "You have accepted cookies"
  - Date accepted
  - "Withdraw Consent" button

**Given** their consent status is "Rejected"
**When** viewing the section
**Then** they see:
  - Gray indicator: "You have rejected cookies"
  - Date rejected
  - "Accept Cookies" button (to change mind)

**Given** they have never made a choice
**When** viewing the section
**Then** they see:
  - Yellow indicator: "You haven't made a choice yet"
  - "Accept" and "Reject" buttons

---

### AC 1.4.9: Consent Withdrawal

**Given** a visitor has accepted cookies
**When** they click "Withdraw Consent" on the Privacy page
**Then** a confirmation dialog appears: "Are you sure you want to withdraw consent?"
**And** if confirmed:
  - Consent status changes to "rejected"
  - Analytics are disabled immediately
  - Non-essential cookies are cleared
  - A confirmation message displays
  - The action is logged with timestamp

**And** the visitor can continue using the site normally

---

### AC 1.4.10: Consent Proof Storage

**Given** any consent action occurs (accept/reject/withdraw)
**When** the action is processed
**Then** the following is stored in localStorage:
```json
{
  "consent": {
    "status": "accepted" | "rejected",
    "timestamp": "2026-01-30T12:00:00Z",
    "policyVersion": "1.0",
    "userAgent": "Mozilla/5.0...",
    "actions": [
      {
        "action": "accepted",
        "timestamp": "2026-01-30T12:00:00Z",
        "policyVersion": "1.0"
      },
      {
        "action": "withdrawn",
        "timestamp": "2026-01-30T15:00:00Z",
        "policyVersion": "1.0"
      }
    ]
  }
}
```

**And** this data can be exported by the visitor

---

### AC 1.4.11: Analytics Conditional Loading

**Given** the visitor has accepted cookies
**When** analytics would load
**Then** analytics scripts are injected
**And** tracking begins

**Given** the visitor has rejected cookies OR not made a choice
**When** analytics would load
**Then** NO analytics scripts are injected
**And** NO tracking occurs

**Given** the visitor withdraws consent during a session
**When** the withdrawal is processed
**Then** analytics are immediately stopped
**And** any analytics cookies are cleared

---

### AC 1.4.12: Cookie Policy Details

**Given** the privacy policy lists cookies
**When** the visitor reads the cookie section
**Then** they see a table of cookies:

| Cookie Name | Purpose | Type | Duration |
|-------------|---------|------|----------|
| `consent_status` | Stores consent preference | Functional | 1 year |
| `locale` | Stores language preference | Functional | 1 year |
| `session_id` | Session identification | Functional | Session |
| `_ga` | Google Analytics (if accepted) | Analytics | 2 years |
| `_gid` | Google Analytics (if accepted) | Analytics | 24 hours |

**And** each cookie's purpose is clearly explained
**And** the distinction between essential and optional cookies is clear

---

### AC 1.4.13: Mobile Responsiveness

**Given** the cookie banner is viewed on mobile
**When** the banner renders
**Then**:
  - Banner takes full width
  - Text is readable without scrolling
  - Buttons are large enough to tap (min 44px height)
  - Banner doesn't cover critical navigation
  - Can be dismissed with swipe gesture (optional enhancement)

**Given** the privacy page is viewed on mobile
**When** the page renders
**Then**:
  - Content is readable
  - Table of contents is accessible (collapsible)
  - Consent management section is easily accessible
  - Forms are touch-friendly

---

### AC 1.4.14: Terms of Service Page (Bonus)

**Given** a visitor navigates to `/[locale]/terms`
**When** the page loads
**Then** they see Terms of Service containing:
  - Acceptance of terms
  - Description of services
  - User responsibilities
  - Intellectual property
  - Limitation of liability
  - Dispute resolution
  - Governing law (Brazilian law)
  - Changes to terms
  - Contact information

**And** the page links to Privacy Policy
**And** all content is localized

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/[locale]/privacy/page.tsx` | Create | Privacy policy page |
| `app/[locale]/terms/page.tsx` | Create | Terms of service page |
| `components/CookieBanner.tsx` | Create | Cookie consent banner |
| `components/ConsentManager.tsx` | Create | Consent management UI |
| `lib/consent.ts` | Create | Consent storage and logic |
| `lib/analytics.ts` | Create | Conditional analytics loading |
| `lib/i18n.ts` | Modify | Add privacy/consent translations |
| `app/[locale]/layout.tsx` | Modify | Include CookieBanner |

---

### Consent Management Library

```typescript
// lib/consent.ts

export type ConsentStatus = 'accepted' | 'rejected' | 'pending';

export interface ConsentAction {
  action: 'accepted' | 'rejected' | 'withdrawn';
  timestamp: string;
  policyVersion: string;
}

export interface ConsentRecord {
  status: ConsentStatus;
  timestamp: string | null;
  policyVersion: string;
  userAgent: string;
  actions: ConsentAction[];
}

const STORAGE_KEY = 'brasil_legalize_consent';
const COOKIE_NAME = 'consent_status';
const CURRENT_POLICY_VERSION = '1.0';

// Initialize default consent record
function getDefaultRecord(): ConsentRecord {
  return {
    status: 'pending',
    timestamp: null,
    policyVersion: CURRENT_POLICY_VERSION,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    actions: [],
  };
}

// Get current consent record from localStorage
export function getConsentRecord(): ConsentRecord {
  if (typeof window === 'undefined') return getDefaultRecord();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultRecord();
    
    const record = JSON.parse(stored) as ConsentRecord;
    return record;
  } catch {
    return getDefaultRecord();
  }
}

// Get current consent status
export function getConsentStatus(): ConsentStatus {
  return getConsentRecord().status;
}

// Check if user has made a consent choice
export function hasConsentChoice(): boolean {
  return getConsentStatus() !== 'pending';
}

// Accept cookies
export function acceptConsent(): void {
  updateConsent('accepted');
}

// Reject cookies
export function rejectConsent(): void {
  updateConsent('rejected');
}

// Withdraw consent (change from accepted to rejected)
export function withdrawConsent(): void {
  const record = getConsentRecord();
  if (record.status !== 'accepted') return;
  
  const timestamp = new Date().toISOString();
  
  const newRecord: ConsentRecord = {
    ...record,
    status: 'rejected',
    timestamp,
    actions: [
      ...record.actions,
      {
        action: 'withdrawn',
        timestamp,
        policyVersion: CURRENT_POLICY_VERSION,
      },
    ],
  };
  
  saveConsentRecord(newRecord);
  setCookie(COOKIE_NAME, 'rejected', 365);
  clearAnalyticsCookies();
  disableAnalytics();
}

// Update consent status
function updateConsent(status: 'accepted' | 'rejected'): void {
  const record = getConsentRecord();
  const timestamp = new Date().toISOString();
  
  const newRecord: ConsentRecord = {
    ...record,
    status,
    timestamp,
    policyVersion: CURRENT_POLICY_VERSION,
    userAgent: navigator.userAgent,
    actions: [
      ...record.actions,
      {
        action: status,
        timestamp,
        policyVersion: CURRENT_POLICY_VERSION,
      },
    ],
  };
  
  saveConsentRecord(newRecord);
  setCookie(COOKIE_NAME, status, 365);
  
  if (status === 'accepted') {
    enableAnalytics();
  } else {
    clearAnalyticsCookies();
    disableAnalytics();
  }
}

// Save consent record to localStorage
function saveConsentRecord(record: ConsentRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.warn('Failed to save consent record:', e);
  }
}

// Set cookie helper
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Clear analytics cookies
function clearAnalyticsCookies(): void {
  const analyticsCookies = ['_ga', '_gid', '_gat'];
  
  analyticsCookies.forEach(name => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
  });
}

// Export consent data for user
export function exportConsentData(): string {
  const record = getConsentRecord();
  return JSON.stringify(record, null, 2);
}

// Get formatted consent info for display
export function getConsentDisplayInfo(locale: string): {
  status: ConsentStatus;
  statusText: string;
  lastActionDate: string | null;
} {
  const record = getConsentRecord();
  
  const statusTexts: Record<string, Record<ConsentStatus, string>> = {
    en: {
      accepted: 'You have accepted cookies',
      rejected: 'You have rejected cookies',
      pending: 'You haven\'t made a choice yet',
    },
    ar: {
      accepted: 'لقد قبلت ملفات تعريف الارتباط',
      rejected: 'لقد رفضت ملفات تعريف الارتباط',
      pending: 'لم تتخذ قرارًا بعد',
    },
    es: {
      accepted: 'Has aceptado las cookies',
      rejected: 'Has rechazado las cookies',
      pending: 'Aún no has tomado una decisión',
    },
    'pt-br': {
      accepted: 'Você aceitou os cookies',
      rejected: 'Você rejeitou os cookies',
      pending: 'Você ainda não fez uma escolha',
    },
  };
  
  const texts = statusTexts[locale] || statusTexts.en;
  
  return {
    status: record.status,
    statusText: texts[record.status],
    lastActionDate: record.timestamp 
      ? new Date(record.timestamp).toLocaleDateString(locale)
      : null,
  };
}

// Analytics control (placeholder - implement based on analytics provider)
function enableAnalytics(): void {
  // Load Google Analytics or other analytics
  // window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
}

function disableAnalytics(): void {
  // Disable analytics
  // window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
}
```

---

### CookieBanner Component

```typescript
// components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  hasConsentChoice, 
  acceptConsent, 
  rejectConsent 
} from '@/lib/consent';
import { getTranslation, Locale } from '@/lib/i18n';

interface CookieBannerProps {
  locale: Locale;
}

export function CookieBanner({ locale }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const t = (key: string) => getTranslation(locale, key);
  
  useEffect(() => {
    // Check if user has already made a choice
    if (!hasConsentChoice()) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    setIsAnimating(true);
    acceptConsent();
    setTimeout(() => setIsVisible(false), 300);
  };
  
  const handleReject = () => {
    setIsAnimating(true);
    rejectConsent();
    setTimeout(() => setIsVisible(false), 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-white border-t border-gray-200 shadow-lg
        transform transition-transform duration-300
        ${isAnimating ? 'translate-y-full' : 'translate-y-0'}
      `}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Text Content */}
          <div className="flex-1">
            <p 
              id="cookie-banner-description" 
              className="text-sm text-gray-600"
            >
              {t('cookies.bannerText')}
              {' '}
              <Link 
                href={`/${locale}/privacy`}
                className="text-brand-primary underline hover:no-underline"
              >
                {t('cookies.learnMore')}
              </Link>
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Reject - Equal prominence */}
            <button
              onClick={handleReject}
              className="px-6 py-2.5 text-sm font-medium border border-gray-300 rounded-lg
                         text-gray-700 bg-white hover:bg-gray-50 transition
                         min-w-[120px]"
            >
              {t('cookies.reject')}
            </button>
            
            {/* Accept - Primary */}
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-sm font-medium rounded-lg
                         text-white bg-brand-primary hover:bg-brand-primary/90 transition
                         min-w-[120px]"
            >
              {t('cookies.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### ConsentManager Component

```typescript
// components/ConsentManager.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  getConsentDisplayInfo,
  acceptConsent,
  withdrawConsent,
  exportConsentData,
  ConsentStatus,
} from '@/lib/consent';
import { getTranslation, Locale } from '@/lib/i18n';

interface ConsentManagerProps {
  locale: Locale;
}

export function ConsentManager({ locale }: ConsentManagerProps) {
  const [consentInfo, setConsentInfo] = useState<{
    status: ConsentStatus;
    statusText: string;
    lastActionDate: string | null;
  } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const t = (key: string) => getTranslation(locale, key);
  
  useEffect(() => {
    setConsentInfo(getConsentDisplayInfo(locale));
  }, [locale]);
  
  const handleAccept = () => {
    acceptConsent();
    setConsentInfo(getConsentDisplayInfo(locale));
  };
  
  const handleWithdraw = () => {
    setShowConfirmation(true);
  };
  
  const confirmWithdraw = () => {
    withdrawConsent();
    setConsentInfo(getConsentDisplayInfo(locale));
    setShowConfirmation(false);
  };
  
  const handleExport = () => {
    const data = exportConsentData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consent-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (!consentInfo) return null;
  
  const statusColors: Record<ConsentStatus, string> = {
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('privacy.manageConsent')}
      </h3>
      
      {/* Current Status */}
      <div className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        border ${statusColors[consentInfo.status]}
      `}>
        {consentInfo.status === 'accepted' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {consentInfo.status === 'rejected' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
        {consentInfo.status === 'pending' && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
        {consentInfo.statusText}
      </div>
      
      {/* Last Action Date */}
      {consentInfo.lastActionDate && (
        <p className="text-sm text-gray-500 mt-2">
          {t('privacy.lastUpdated')}: {consentInfo.lastActionDate}
        </p>
      )}
      
      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {consentInfo.status === 'accepted' && (
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 text-sm font-medium border border-red-300 
                       text-red-700 bg-white rounded-lg hover:bg-red-50 transition"
          >
            {t('privacy.withdrawConsent')}
          </button>
        )}
        
        {consentInfo.status === 'rejected' && (
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium border border-brand-primary 
                       text-brand-primary bg-white rounded-lg hover:bg-brand-primary/5 transition"
          >
            {t('privacy.acceptCookies')}
          </button>
        )}
        
        {consentInfo.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium 
                         text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition"
            >
              {t('cookies.accept')}
            </button>
            <button
              onClick={() => {
                withdrawConsent(); // Use withdraw to set rejected
                setConsentInfo(getConsentDisplayInfo(locale));
              }}
              className="px-4 py-2 text-sm font-medium border border-gray-300 
                         text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition"
            >
              {t('cookies.reject')}
            </button>
          </>
        )}
        
        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm font-medium border border-gray-300 
                     text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition"
        >
          {t('privacy.exportData')}
        </button>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl">
            <h4 className="text-lg font-semibold mb-2">
              {t('privacy.confirmWithdraw')}
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              {t('privacy.confirmWithdrawText')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium border border-gray-300 
                           text-gray-700 bg-white rounded-lg hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmWithdraw}
                className="px-4 py-2 text-sm font-medium 
                           text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                {t('privacy.confirmWithdrawButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Privacy Page Structure

```typescript
// app/[locale]/privacy/page.tsx
import { Metadata } from 'next';
import { getTranslation, Locale } from '@/lib/i18n';
import { ConsentManager } from '@/components/ConsentManager';

interface PrivacyPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const t = (key: string) => getTranslation(params.locale, key);
  
  return {
    title: t('privacy.metaTitle'),
    description: t('privacy.metaDescription'),
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;
  const t = (key: string) => getTranslation(locale, key);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-2">{t('privacy.title')}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {t('privacy.lastUpdated')}: January 30, 2026
        </p>
        
        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-4">
            {t('privacy.tableOfContents')}
          </h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#introduction" className="text-brand-primary hover:underline">{t('privacy.toc.introduction')}</a></li>
            <li><a href="#data-controller" className="text-brand-primary hover:underline">{t('privacy.toc.dataController')}</a></li>
            <li><a href="#data-collected" className="text-brand-primary hover:underline">{t('privacy.toc.dataCollected')}</a></li>
            <li><a href="#data-use" className="text-brand-primary hover:underline">{t('privacy.toc.dataUse')}</a></li>
            <li><a href="#legal-basis" className="text-brand-primary hover:underline">{t('privacy.toc.legalBasis')}</a></li>
            <li><a href="#data-sharing" className="text-brand-primary hover:underline">{t('privacy.toc.dataSharing')}</a></li>
            <li><a href="#data-retention" className="text-brand-primary hover:underline">{t('privacy.toc.dataRetention')}</a></li>
            <li><a href="#your-rights" className="text-brand-primary hover:underline">{t('privacy.toc.yourRights')}</a></li>
            <li><a href="#cookies" className="text-brand-primary hover:underline">{t('privacy.toc.cookies')}</a></li>
            <li><a href="#security" className="text-brand-primary hover:underline">{t('privacy.toc.security')}</a></li>
            <li><a href="#contact" className="text-brand-primary hover:underline">{t('privacy.toc.contact')}</a></li>
          </ul>
        </nav>
        
        {/* Consent Manager */}
        <div className="mb-12">
          <ConsentManager locale={locale} />
        </div>
        
        {/* Privacy Policy Content */}
        <div className="prose prose-slate max-w-none">
          {/* Each section would be rendered here with proper localization */}
          {/* This would typically come from a CMS or markdown files */}
          
          <section id="introduction">
            <h2>{t('privacy.sections.introduction.title')}</h2>
            <p>{t('privacy.sections.introduction.content')}</p>
          </section>
          
          {/* ... More sections ... */}
          
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `get-consent-default` | No consent stored | Returns 'pending' |
| `accept-consent` | Accept cookies | Status is 'accepted' |
| `reject-consent` | Reject cookies | Status is 'rejected' |
| `withdraw-consent` | Withdraw after accept | Status is 'rejected' |
| `export-data` | Export consent data | Valid JSON returned |
| `clear-analytics` | Clear analytics cookies | Cookies removed |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `banner-first-visit` | Load page first time | Banner appears |
| `banner-return-visit` | Return after accepting | Banner hidden |
| `accept-flow` | Click accept button | Banner dismissed, consent stored |
| `reject-flow` | Click reject button | Banner dismissed, consent stored |
| `privacy-page-render` | Load privacy page | All sections render |
| `manage-consent` | Change consent on privacy page | Status updates |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-accept-flow` | Accept on banner, verify on privacy page | Consistent status |
| `full-reject-flow` | Reject on banner, verify on privacy page | Consistent status |
| `withdraw-flow` | Accept then withdraw | Status changes correctly |
| `rtl-banner` | View banner in Arabic | RTL layout correct |
| `mobile-banner` | View banner on mobile | Responsive and usable |

---

## Edge Cases and Error Handling

### Edge Case 1: localStorage Disabled
- **Scenario:** User has disabled localStorage
- **Handling:** Use cookie-only fallback, warn in console
- **User Impact:** Consent preferences may not persist across sessions

### Edge Case 2: Cookie Blocked by Browser
- **Scenario:** Aggressive cookie blocking
- **Handling:** Detect and use localStorage only
- **User Impact:** Site still functional

### Edge Case 3: Policy Version Change
- **Scenario:** New policy version deployed
- **Handling:** Compare versions, optionally re-prompt
- **User Impact:** May see banner again if re-consent required

### Edge Case 4: Multiple Tabs
- **Scenario:** User has multiple tabs open
- **Handling:** localStorage syncs across tabs
- **User Impact:** Consent choice applies to all tabs

---

## LGPD Compliance Notes

1. **Explicit Consent:** Users must actively choose; no pre-ticked boxes
2. **Equal Choice:** Reject must be as easy as Accept
3. **Revocable:** Users can withdraw consent at any time
4. **Transparent:** Clear explanation of what data is collected and why
5. **Data Subject Rights:** Access, correction, deletion, portability
6. **Proof of Consent:** Timestamp and version recorded
7. **Data Controller Info:** Clear identification and contact information

---

## Definition of Done

- [ ] Cookie banner displays on first visit
- [ ] Accept and Reject have equal prominence
- [ ] Consent is stored with timestamp
- [ ] Banner doesn't reappear after choice
- [ ] Privacy page renders completely
- [ ] All sections are localized
- [ ] Consent management works on privacy page
- [ ] Withdrawal confirmation dialog works
- [ ] Export data function works
- [ ] Analytics conditional loading works
- [ ] RTL support works for Arabic
- [ ] Mobile responsive
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] LGPD compliance checklist complete
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

