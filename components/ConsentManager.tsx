"use client";

import { useState, useEffect } from "react";
import {
  getConsentDisplayInfo,
  acceptConsent,
  withdrawConsent,
  downloadConsentData,
  type ConsentStatus,
} from "@/lib/consent";
import { type Locale, getDictionary, isRTL } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ConsentManagerProps {
  locale: Locale;
}

export function ConsentManager({ locale }: ConsentManagerProps) {
  const [consentInfo, setConsentInfo] = useState<{
    status: ConsentStatus;
    statusText: string;
    lastActionDate: string | null;
    statusColor: "green" | "gray" | "yellow";
  } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  useEffect(() => {
    setMounted(true);
    setConsentInfo(
      getConsentDisplayInfo(locale, {
        accepted: dict.privacy.consentStatus.accepted,
        rejected: dict.privacy.consentStatus.rejected,
        pending: dict.privacy.consentStatus.pending,
      })
    );
  }, [locale, dict]);

  const refreshConsentInfo = () => {
    setConsentInfo(
      getConsentDisplayInfo(locale, {
        accepted: dict.privacy.consentStatus.accepted,
        rejected: dict.privacy.consentStatus.rejected,
        pending: dict.privacy.consentStatus.pending,
      })
    );
  };

  const handleAccept = () => {
    acceptConsent();
    refreshConsentInfo();
  };

  const handleWithdraw = () => {
    setShowConfirmation(true);
  };

  const confirmWithdraw = () => {
    withdrawConsent();
    refreshConsentInfo();
    setShowConfirmation(false);
  };

  const handleExport = () => {
    downloadConsentData();
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !consentInfo) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-100 rounded-full w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
    );
  }

  const statusColors = {
    green: "bg-green-100 text-green-800 border-green-200",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
    yellow: "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-6"
      dir={rtl ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-900">
        {dict.privacy.manageConsent}
      </h3>

      {/* Current Status */}
      <div
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border",
          statusColors[consentInfo.statusColor]
        )}
      >
        {consentInfo.status === "accepted" && (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {consentInfo.status === "rejected" && (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {consentInfo.status === "pending" && (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {consentInfo.statusText}
      </div>

      {/* Last Action Date */}
      {consentInfo.lastActionDate && (
        <p className="text-sm text-slate-500 mt-2">
          {dict.privacy.lastUpdated}: {consentInfo.lastActionDate}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {consentInfo.status === "accepted" && (
          <button
            onClick={handleWithdraw}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "border border-red-300 text-red-700 bg-white",
              "hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            )}
          >
            {dict.privacy.withdrawConsent}
          </button>
        )}

        {consentInfo.status === "rejected" && (
          <button
            onClick={handleAccept}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "border border-primary text-primary bg-white",
              "hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            )}
          >
            {dict.privacy.acceptCookies}
          </button>
        )}

        {consentInfo.status === "pending" && (
          <>
            <button
              onClick={handleAccept}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                "text-white bg-primary hover:bg-primary/90",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              )}
            >
              {dict.cookies.accept}
            </button>
            <button
              onClick={() => {
                withdrawConsent();
                refreshConsentInfo();
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                "border border-slate-300 text-slate-700 bg-white",
                "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              )}
            >
              {dict.cookies.reject}
            </button>
          </>
        )}

        <button
          onClick={handleExport}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            "border border-slate-300 text-slate-700 bg-white",
            "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          )}
        >
          {dict.privacy.exportData}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdraw-dialog-title"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl"
            dir={rtl ? "rtl" : "ltr"}
          >
            <h4
              id="withdraw-dialog-title"
              className="text-lg font-semibold mb-2 text-slate-900"
            >
              {dict.privacy.confirmWithdraw}
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              {dict.privacy.confirmWithdrawText}
            </p>
            <div className={cn("flex gap-3 justify-end", rtl && "flex-row-reverse")}>
              <button
                onClick={() => setShowConfirmation(false)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  "border border-slate-300 text-slate-700 bg-white",
                  "hover:bg-slate-50"
                )}
              >
                {dict.common.close}
              </button>
              <button
                onClick={confirmWithdraw}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-white bg-red-600 hover:bg-red-700"
                )}
              >
                {dict.privacy.confirmWithdrawButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
