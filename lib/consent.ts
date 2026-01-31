/**
 * Consent Management Library
 * Brasil Legalize - LGPD Compliance
 *
 * Handles cookie consent, localStorage storage, and audit logging.
 * Implements LGPD (Lei Geral de Proteção de Dados) requirements.
 *
 * Key features:
 * - Client-side consent storage (localStorage + cookies)
 * - Server-side audit logging (via API)
 * - Consent history tracking
 * - Analytics conditional loading
 *
 * @see database/schema.sql for consent_log table
 */

export type ConsentStatus = "accepted" | "rejected" | "pending";

export interface ConsentAction {
  action: "accepted" | "rejected" | "withdrawn";
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

// Constants
const STORAGE_KEY = "brasil_legalize_consent";
const COOKIE_NAME = "consent_status";
export const CURRENT_POLICY_VERSION = "1.0";

// ============================================================================
// CORE CONSENT FUNCTIONS
// ============================================================================

/**
 * Get default consent record for new visitors
 */
function getDefaultRecord(): ConsentRecord {
  return {
    status: "pending",
    timestamp: null,
    policyVersion: CURRENT_POLICY_VERSION,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    actions: [],
  };
}

/**
 * Get current consent record from localStorage
 */
export function getConsentRecord(): ConsentRecord {
  if (typeof window === "undefined") return getDefaultRecord();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultRecord();

    const record = JSON.parse(stored) as ConsentRecord;
    return record;
  } catch {
    return getDefaultRecord();
  }
}

/**
 * Get current consent status
 */
export function getConsentStatus(): ConsentStatus {
  return getConsentRecord().status;
}

/**
 * Check if user has made a consent choice
 */
export function hasConsentChoice(): boolean {
  return getConsentStatus() !== "pending";
}

/**
 * Accept cookies - sets consent to accepted
 */
export function acceptConsent(): void {
  updateConsent("accepted");
}

/**
 * Reject cookies - sets consent to rejected
 */
export function rejectConsent(): void {
  updateConsent("rejected");
}

/**
 * Withdraw consent - change from accepted to rejected
 * Only works if current status is accepted
 */
export function withdrawConsent(): void {
  const record = getConsentRecord();
  if (record.status !== "accepted") {
    // If not accepted, treat as reject
    if (record.status === "pending") {
      rejectConsent();
    }
    return;
  }

  const timestamp = new Date().toISOString();

  const newRecord: ConsentRecord = {
    ...record,
    status: "rejected",
    timestamp,
    actions: [
      ...record.actions,
      {
        action: "withdrawn",
        timestamp,
        policyVersion: CURRENT_POLICY_VERSION,
      },
    ],
  };

  saveConsentRecord(newRecord);
  setCookie(COOKIE_NAME, "rejected", 365);
  clearAnalyticsCookies();
  disableAnalytics();

  // Log withdrawal to server
  logConsentToServer("withdrawn", "rejected");
}

/**
 * Update consent status (internal)
 */
function updateConsent(status: "accepted" | "rejected"): void {
  const record = getConsentRecord();
  const timestamp = new Date().toISOString();

  const newRecord: ConsentRecord = {
    ...record,
    status,
    timestamp,
    policyVersion: CURRENT_POLICY_VERSION,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
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

  if (status === "accepted") {
    enableAnalytics();
  } else {
    clearAnalyticsCookies();
    disableAnalytics();
  }

  // Log to server for LGPD audit trail
  logConsentToServer(status, status);
}

/**
 * Save consent record to localStorage
 */
function saveConsentRecord(record: ConsentRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.warn("Failed to save consent record:", e);
  }
}

// ============================================================================
// COOKIE HELPERS
// ============================================================================

/**
 * Set a cookie
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Clear analytics cookies
 */
function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;

  const analyticsCookies = ["_ga", "_gid", "_gat", "_ga_*"];

  // Get all cookies and filter analytics ones
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (
      analyticsCookies.some(
        (pattern) =>
          pattern === name || (pattern.endsWith("*") && name.startsWith(pattern.slice(0, -1)))
      )
    ) {
      // Delete cookie for current domain and parent domains
      const domains = [
        "",
        `.${window.location.hostname}`,
        window.location.hostname,
      ];
      domains.forEach((domain) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;${domain ? `domain=${domain};` : ""}`;
      });
    }
  });
}

// ============================================================================
// ANALYTICS CONTROL
// ============================================================================

/**
 * Enable analytics (Google Analytics)
 * Call this when consent is accepted
 */
function enableAnalytics(): void {
  if (typeof window === "undefined") return;

  // Google Analytics consent mode
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }

  // Trigger custom event for other analytics
  window.dispatchEvent(new CustomEvent("consentAccepted"));
}

/**
 * Disable analytics
 * Call this when consent is rejected or withdrawn
 */
function disableAnalytics(): void {
  if (typeof window === "undefined") return;

  // Google Analytics consent mode
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }

  // Trigger custom event
  window.dispatchEvent(new CustomEvent("consentRejected"));
}

/**
 * Check if analytics should be loaded
 */
export function shouldLoadAnalytics(): boolean {
  return getConsentStatus() === "accepted";
}

// ============================================================================
// SERVER-SIDE AUDIT LOGGING
// ============================================================================

/**
 * Log consent action to server for LGPD audit trail
 * This is non-blocking and failures are silently logged
 */
async function logConsentToServer(
  action: ConsentAction["action"],
  status: ConsentStatus
): Promise<void> {
  try {
    // Get locale from URL or default
    const locale =
      typeof window !== "undefined"
        ? window.location.pathname.split("/")[1] || "ar"
        : "ar";

    await fetch("/api/consent.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        status,
        policyVersion: CURRENT_POLICY_VERSION,
        locale,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      }),
    });
  } catch (error) {
    // Silent fail - consent still works client-side
    console.warn("Failed to log consent to server:", error);
  }
}

// ============================================================================
// USER DATA EXPORT (LGPD Compliance)
// ============================================================================

/**
 * Export consent data for user (LGPD right to access)
 */
export function exportConsentData(): string {
  const record = getConsentRecord();
  return JSON.stringify(record, null, 2);
}

/**
 * Download consent data as JSON file
 */
export function downloadConsentData(): void {
  const data = exportConsentData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `consent-data-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export interface ConsentDisplayInfo {
  status: ConsentStatus;
  statusText: string;
  lastActionDate: string | null;
  statusColor: "green" | "gray" | "yellow";
}

/**
 * Get formatted consent info for display
 */
export function getConsentDisplayInfo(
  locale: string,
  translations: {
    accepted: string;
    rejected: string;
    pending: string;
  }
): ConsentDisplayInfo {
  const record = getConsentRecord();

  const statusColors: Record<ConsentStatus, "green" | "gray" | "yellow"> = {
    accepted: "green",
    rejected: "gray",
    pending: "yellow",
  };

  return {
    status: record.status,
    statusText: translations[record.status],
    lastActionDate: record.timestamp
      ? new Date(record.timestamp).toLocaleDateString(
          locale === "pt-br" ? "pt-BR" : locale,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : null,
    statusColor: statusColors[record.status],
  };
}

// ============================================================================
// POLICY VERSION CHECK
// ============================================================================

/**
 * Check if user needs to re-consent due to policy update
 */
export function needsReconsent(): boolean {
  const record = getConsentRecord();
  return (
    record.status !== "pending" &&
    record.policyVersion !== CURRENT_POLICY_VERSION
  );
}

/**
 * Get list of cookies used by the site
 */
export function getCookieList() {
  return [
    {
      name: "consent_status",
      purpose: "Stores your cookie consent preference",
      type: "functional" as const,
      duration: "1 year",
    },
    {
      name: "locale",
      purpose: "Remembers your language preference",
      type: "functional" as const,
      duration: "1 year",
    },
    {
      name: "_ga",
      purpose: "Google Analytics - distinguishes users",
      type: "analytics" as const,
      duration: "2 years",
      requiresConsent: true,
    },
    {
      name: "_gid",
      purpose: "Google Analytics - distinguishes users",
      type: "analytics" as const,
      duration: "24 hours",
      requiresConsent: true,
    },
    {
      name: "_gat",
      purpose: "Google Analytics - throttles requests",
      type: "analytics" as const,
      duration: "1 minute",
      requiresConsent: true,
    },
  ];
}
