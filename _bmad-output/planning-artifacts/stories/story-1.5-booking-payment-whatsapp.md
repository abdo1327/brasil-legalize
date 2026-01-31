---
storyId: "1.5"
epicId: "1"
title: "Booking Integration, Stripe Demo & WhatsApp CTA"
status: "ready"
priority: "high"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - booking
  - calendly
  - stripe
  - whatsapp
  - payments
  - cta
functionalRequirements:
  - FR5
  - FR6
  - FR16
  - FR19
nonFunctionalRequirements:
  - NFR3
  - NFR5
dependencies:
  - "1.1"
  - "1.2"
  - "1.3"
blockedBy:
  - "1.3"
blocks: []
---

# Story 1.5: Booking Integration, Stripe Demo & WhatsApp CTA

## User Story

**As a** potential client,
**I want** to easily book consultations, see a demo of the payment system, and connect via WhatsApp,
**So that** I can start my process conveniently through my preferred channel.

---

## Story Description

This story implements three critical conversion points for the Brasil Legalize marketing site:

1. **Calendly Integration:** Embedded booking widget allowing visitors to schedule free consultations directly on the website, reducing friction in the conversion funnel.

2. **Stripe Sandbox Demo:** A demonstration payment experience showing how future payments work, building trust and familiarity before actual payment is required.

3. **WhatsApp CTA:** Persistent click-to-chat button and contextual CTAs throughout the site, enabling immediate connection with the team via Brazil's most popular messaging platform.

These features work together to maximize conversion by meeting users where they are comfortable and providing multiple engagement pathways.

---

## Acceptance Criteria

### AC 1.5.1: Calendly Embed - Booking Page

**Given** a visitor navigates to `/[locale]/book`
**When** the page loads
**Then** they see:
  - Page heading with booking instructions
  - Embedded Calendly widget
  - Alternative contact options below the widget
  - Page metadata optimized for SEO

**And** the Calendly widget:
  - Takes 80% of viewport width (max 900px)
  - Centers on the page
  - Has minimum height of 650px
  - Loads with locale-appropriate language

---

### AC 1.5.2: Calendly Embed - Language Matching

**Given** the booking page is loaded
**When** the current locale is:
  - `en` → Calendly displays in English
  - `es` → Calendly displays in Spanish
  - `pt-br` → Calendly displays in Portuguese (Brazil)
  - `ar` → Calendly displays in English (fallback, Arabic not supported)

**Then** the Calendly widget URL includes the `locale` parameter

**Implementation:**
```typescript
const calendlyLocaleMap: Record<string, string> = {
  en: 'en',
  es: 'es',
  'pt-br': 'pt-BR',
  ar: 'en', // Fallback
};
```

---

### AC 1.5.3: Calendly Embed - Pre-fill Parameters

**Given** a visitor comes from the eligibility or pricing flow
**When** they arrive at the booking page
**Then** Calendly pre-fills available fields:
  - `name` if previously collected
  - `email` if previously collected
  - `customAnswers[a1]` = selected package name
  - `customAnswers[a2]` = eligibility result

**And** these values come from localStorage/sessionStorage

---

### AC 1.5.4: Calendly Embed - Success Tracking

**Given** a visitor completes a booking
**When** Calendly fires the `calendly.event_scheduled` postMessage
**Then**:
  - A success message displays below the widget
  - The event is tracked (if consent given)
  - Lead data is stored for follow-up
  - Success page content shows next steps

---

### AC 1.5.5: Calendly Embed - Error Handling

**Given** the Calendly widget fails to load
**When** the page displays
**Then**:
  - A fallback message appears with direct Calendly link
  - Alternative contact methods are prominently shown
  - Error is logged for debugging

---

### AC 1.5.6: Stripe Demo - Demo Page

**Given** a visitor navigates to `/[locale]/payment-demo`
**When** the page loads
**Then** they see:
  - Clear "DEMO MODE" indicator
  - Explanation that no real charges will be made
  - Package summary (if selected)
  - Demo payment form
  - Test card information displayed

---

### AC 1.5.7: Stripe Demo - Test Environment

**Given** the payment demo form is displayed
**When** viewing the form
**Then**:
  - Stripe Elements loads in test mode
  - Test mode banner is visible
  - Demo card numbers are displayed:
    - `4242 4242 4242 4242` - Success
    - `4000 0000 0000 0002` - Decline
    - `4000 0025 0000 3155` - 3D Secure
  - No real API keys are exposed

**Configuration:**
```typescript
// SANDBOX ONLY - Test publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PK_TEST;
// pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

### AC 1.5.8: Stripe Demo - Demo Transaction Flow

**Given** a visitor enters test card `4242 4242 4242 4242`
**When** they click "Try Payment"
**Then**:
  - Loading indicator shows
  - Stripe test API processes the demo
  - Success screen displays with confetti effect
  - Clear message: "This was a demo - no charge was made"
  - CTA to book a real consultation

**Given** a visitor enters decline card `4000 0000 0000 0002`
**When** they click "Try Payment"
**Then**:
  - Loading indicator shows
  - Stripe returns decline error
  - Friendly error message displays
  - Retry option available
  - No alarming language

---

### AC 1.5.9: Stripe Demo - Elements Styling

**Given** the Stripe Elements form renders
**When** the form is visible
**Then** it matches the brand styling:

```typescript
const stripeElementsStyle = {
  base: {
    fontFamily: '"Inter", -apple-system, sans-serif',
    fontSize: '16px',
    color: '#1a202c',
    '::placeholder': {
      color: '#a0aec0',
    },
    padding: '12px',
  },
  invalid: {
    color: '#e53e3e',
    iconColor: '#e53e3e',
  },
};
```

**And** the form has:
  - Card number field
  - Expiry date field
  - CVC field
  - Postal code (optional based on locale)

---

### AC 1.5.10: Stripe Demo - Amount Display

**Given** a visitor comes from the pricing page
**When** they view the payment demo
**Then** they see their selected package:
  - Package name
  - Line items breakdown
  - Total in BRL (R$)
  - "This is a demo amount"

**Given** no package was selected
**When** viewing the demo
**Then** a sample amount displays (e.g., R$ 1,500.00)

---

### AC 1.5.11: WhatsApp CTA - Floating Button

**Given** a visitor is on any page
**When** the page loads (after 3 seconds)
**Then** a WhatsApp floating button appears:
  - Position: bottom-right corner (RTL: bottom-left)
  - Size: 56px diameter
  - Icon: WhatsApp logo
  - Color: WhatsApp green (#25D366)
  - Shadow for visibility
  - Animation: subtle pulse every 30 seconds

**And** the button has ARIA label: "Chat on WhatsApp"

---

### AC 1.5.12: WhatsApp CTA - Click Behavior

**Given** a visitor clicks the WhatsApp button
**When** the click is processed
**Then**:
  - Opens `wa.me/5511999999999` (configured number)
  - Pre-fills message based on current page:
    - Home: "Hi, I'm interested in your immigration services"
    - Pricing: "Hi, I'm interested in [package name if selected]"
    - Eligibility: "Hi, I just completed the eligibility check"
    - General: "Hi, I'd like to learn more about your services"
  - Message is localized to current locale
  - Opens in new tab on desktop
  - Opens WhatsApp app on mobile

---

### AC 1.5.13: WhatsApp CTA - Pre-filled Messages

**Given** the WhatsApp link is generated
**When** on different pages
**Then** the pre-filled message (URL encoded) is:

**English (en):**
```
Home: "Hello! I'm interested in Brasil Legalize immigration services."
Pricing: "Hello! I'm interested in the {package} package."
Eligibility (passed): "Hello! I just completed the eligibility check and qualified!"
Eligibility (failed): "Hello! I have questions about my eligibility."
```

**Portuguese (pt-br):**
```
Home: "Olá! Estou interessado nos serviços de imigração da Brasil Legalize."
Pricing: "Olá! Estou interessado no pacote {package}."
Eligibility (passed): "Olá! Acabei de fazer a verificação de elegibilidade e me qualifiquei!"
Eligibility (failed): "Olá! Tenho dúvidas sobre minha elegibilidade."
```

**Spanish (es):**
```
Home: "¡Hola! Estoy interesado en los servicios de inmigración de Brasil Legalize."
Pricing: "¡Hola! Estoy interesado en el paquete {package}."
```

**Arabic (ar):**
```
Home: "مرحبًا! أنا مهتم بخدمات الهجرة من براسيل ليغالايز."
```

---

### AC 1.5.14: WhatsApp CTA - Button Positioning

**Given** the WhatsApp button is rendered
**When** the viewport is:
  - Desktop (>1024px): 24px from right, 24px from bottom
  - Tablet (768-1024px): 20px from right, 20px from bottom
  - Mobile (<768px): 16px from right, 16px from bottom

**And** in RTL locales (Arabic):
  - Desktop: 24px from left, 24px from bottom
  - And so on...

**And** the button:
  - Doesn't overlap cookie banner
  - Doesn't overlap main navigation
  - Has sufficient contrast with page content

---

### AC 1.5.15: WhatsApp CTA - Tooltip/Prompt

**Given** the WhatsApp button is visible
**When** the user has been on the page for 20 seconds without scrolling
**Then** a tooltip appears:
  - Position: above/left of button
  - Text: "Need help? Chat with us!"
  - Dismiss on click elsewhere
  - Don't show again for 24 hours (stored in localStorage)

---

### AC 1.5.16: Contact Page Integration

**Given** a visitor navigates to `/[locale]/contact`
**When** the page loads
**Then** they see:
  - WhatsApp as primary contact method
  - Calendly booking embed (smaller)
  - Email contact form (fallback)
  - Business hours (São Paulo timezone)
  - Physical address (if applicable)

---

### AC 1.5.17: Mobile Responsiveness

**Given** the booking page is viewed on mobile
**When** the page renders
**Then**:
  - Calendly widget is full-width
  - Scrolling within widget works properly
  - Alternative contact options are easily accessible

**Given** the payment demo is viewed on mobile
**When** the page renders
**Then**:
  - Stripe Elements are touch-friendly
  - Amount display is readable
  - Submit button is prominent

---

### AC 1.5.18: Localization

**Given** any page with booking/payment/WhatsApp features
**When** viewed in different locales
**Then** all text is properly translated:
  - Page headings
  - Instructions
  - Button text
  - Error messages
  - Success messages
  - WhatsApp pre-fill text

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/[locale]/book/page.tsx` | Create | Booking page with Calendly |
| `app/[locale]/payment-demo/page.tsx` | Create | Stripe demo page |
| `app/[locale]/contact/page.tsx` | Create | Contact page |
| `components/CalendlyEmbed.tsx` | Create | Calendly widget wrapper |
| `components/StripeDemoForm.tsx` | Create | Stripe demo form |
| `components/WhatsAppButton.tsx` | Create | Floating WhatsApp button |
| `components/WhatsAppTooltip.tsx` | Create | Tooltip component |
| `lib/calendly.ts` | Create | Calendly utilities |
| `lib/stripe-demo.ts` | Create | Stripe demo utilities |
| `lib/whatsapp.ts` | Create | WhatsApp URL generator |
| `app/[locale]/layout.tsx` | Modify | Add WhatsApp button |

---

### Calendly Embed Component

```typescript
// components/CalendlyEmbed.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Locale, getTranslation } from '@/lib/i18n';

interface CalendlyEmbedProps {
  locale: Locale;
  prefillData?: {
    name?: string;
    email?: string;
    packageName?: string;
    eligibilityResult?: string;
  };
}

const CALENDLY_URL = 'https://calendly.com/brasil-legalize/consultation';

const calendlyLocaleMap: Record<string, string> = {
  en: 'en',
  es: 'es',
  'pt-br': 'pt-BR',
  ar: 'en', // Fallback - Calendly doesn't support Arabic
};

export function CalendlyEmbed({ locale, prefillData }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const t = (key: string) => getTranslation(locale, key);
  
  useEffect(() => {
    // Set timeout for error fallback
    const errorTimeout = setTimeout(() => {
      if (!isLoaded) {
        setError(true);
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(errorTimeout);
  }, [isLoaded]);
  
  useEffect(() => {
    // Listen for Calendly events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin.includes('calendly.com')) {
        if (event.data.event === 'calendly.event_scheduled') {
          // Handle successful booking
          handleBookingSuccess(event.data.payload);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  const handleBookingSuccess = (payload: any) => {
    // Store booking data
    localStorage.setItem('brasil_legalize_booking', JSON.stringify({
      scheduledAt: new Date().toISOString(),
      event: payload,
    }));
    
    // Track event (if consent given)
    if (localStorage.getItem('brasil_legalize_consent')?.includes('accepted')) {
      // Analytics tracking here
    }
  };
  
  const handleScriptLoad = () => {
    setIsLoaded(true);
    
    // Initialize Calendly inline widget
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      const prefill: Record<string, string> = {};
      const customAnswers: Record<string, string> = {};
      
      if (prefillData?.name) prefill.name = prefillData.name;
      if (prefillData?.email) prefill.email = prefillData.email;
      if (prefillData?.packageName) customAnswers.a1 = prefillData.packageName;
      if (prefillData?.eligibilityResult) customAnswers.a2 = prefillData.eligibilityResult;
      
      (window as any).Calendly.initInlineWidget({
        url: `${CALENDLY_URL}?hide_gdpr_banner=1&hide_landing_page_details=1`,
        parentElement: containerRef.current,
        prefill,
        utm: {
          utmSource: 'website',
          utmCampaign: 'booking-page',
        },
      });
    }
  };
  
  const getCalendlyUrl = () => {
    const url = new URL(CALENDLY_URL);
    url.searchParams.set('locale', calendlyLocaleMap[locale] || 'en');
    url.searchParams.set('hide_gdpr_banner', '1');
    return url.toString();
  };
  
  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-800 mb-4">
          {t('booking.loadError')}
        </p>
        <a
          href={getCalendlyUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
        >
          {t('booking.openCalendly')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  }
  
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onLoad={handleScriptLoad}
        onError={() => setError(true)}
      />
      
      {!isLoaded && (
        <div className="flex items-center justify-center h-[650px] bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        </div>
      )}
      
      <div
        ref={containerRef}
        className={`calendly-inline-widget ${isLoaded ? '' : 'hidden'}`}
        style={{ minWidth: '320px', height: '650px' }}
        data-url={getCalendlyUrl()}
      />
    </>
  );
}
```

---

### Stripe Demo Form Component

```typescript
// components/StripeDemoForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Locale, getTranslation } from '@/lib/i18n';
import confetti from 'canvas-confetti';

// Test publishable key - SANDBOX ONLY
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PK_TEST || 'pk_test_demo'
);

interface SelectedPackage {
  name: string;
  price: number;
  items: string[];
}

interface StripeDemoFormProps {
  locale: Locale;
  selectedPackage?: SelectedPackage;
}

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '16px',
      color: '#1a202c',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#e53e3e',
      iconColor: '#e53e3e',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ locale, selectedPackage }: StripeDemoFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const t = (key: string) => getTranslation(locale, key);
  
  const amount = selectedPackage?.price || 150000; // Default R$ 1,500.00 in centavos
  const displayAmount = (amount / 100).toLocaleString(locale, {
    style: 'currency',
    currency: 'BRL',
  });
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setProcessing(false);
      return;
    }
    
    // Create payment method (demo - won't actually charge)
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (stripeError) {
      setError(stripeError.message || t('payment.genericError'));
      setProcessing(false);
      return;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for test decline card
    if (paymentMethod?.card?.last4 === '0002') {
      setError(t('payment.declined'));
      setProcessing(false);
      return;
    }
    
    // Success!
    setSuccess(true);
    setProcessing(false);
    
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };
  
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('payment.demoSuccess')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('payment.demoSuccessMessage')}
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ {t('payment.noChargeMade')}
          </p>
        </div>
        <a
          href={`/${locale}/book`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
        >
          {t('payment.bookConsultation')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Mode Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">
              {t('payment.demoMode')}
            </p>
            <p className="text-sm text-blue-700">
              {t('payment.demoModeDescription')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Package Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">
          {selectedPackage?.name || t('payment.samplePackage')}
        </h4>
        <p className="text-2xl font-bold text-brand-primary">
          {displayAmount}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {t('payment.demoAmount')}
        </p>
      </div>
      
      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.cardDetails')}
        </label>
        <div className="border border-gray-300 rounded-lg p-4 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary">
          <CardElement options={STRIPE_ELEMENT_OPTIONS} />
        </div>
      </div>
      
      {/* Test Cards Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <p className="font-medium text-gray-700 mb-2">
          {t('payment.testCards')}
        </p>
        <ul className="space-y-1 text-gray-600">
          <li>
            <code className="bg-white px-2 py-0.5 rounded">4242 4242 4242 4242</code>
            {' → '}{t('payment.testSuccess')}
          </li>
          <li>
            <code className="bg-white px-2 py-0.5 rounded">4000 0000 0000 0002</code>
            {' → '}{t('payment.testDecline')}
          </li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          {t('payment.testCardsNote')}
        </p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 px-6 bg-brand-primary text-white rounded-lg font-medium
                   hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('common.processing')}
          </>
        ) : (
          <>
            {t('payment.tryPayment')}
          </>
        )}
      </button>
    </form>
  );
}

export function StripeDemoForm(props: StripeDemoFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
```

---

### WhatsApp Button Component

```typescript
// components/WhatsAppButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Locale, getTranslation } from '@/lib/i18n';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  locale: Locale;
  phoneNumber: string;
}

export function WhatsAppButton({ locale, phoneNumber }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  
  const t = (key: string) => getTranslation(locale, key);
  const isRTL = locale === 'ar';
  
  // Delay appearance for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show tooltip after 20 seconds of inactivity
  useEffect(() => {
    const tooltipShownKey = 'whatsapp_tooltip_shown';
    const lastShown = localStorage.getItem(tooltipShownKey);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (lastShown && Date.now() - parseInt(lastShown) < twentyFourHours) {
      return;
    }
    
    let scrolled = false;
    const handleScroll = () => {
      scrolled = true;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const tooltipTimer = setTimeout(() => {
      if (!scrolled) {
        setShowTooltip(true);
        localStorage.setItem(tooltipShownKey, Date.now().toString());
      }
    }, 20000);
    
    return () => {
      clearTimeout(tooltipTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleClick = () => {
    const url = generateWhatsAppUrl(phoneNumber, pathname, locale);
    window.open(url, '_blank');
  };
  
  const dismissTooltip = () => {
    setShowTooltip(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`
            fixed z-40 bg-white rounded-lg shadow-lg p-3 max-w-[200px]
            ${isRTL ? 'left-20 bottom-20' : 'right-20 bottom-20'}
            animate-fade-in
          `}
          onClick={dismissTooltip}
        >
          <button
            onClick={dismissTooltip}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
          <p className="text-sm text-gray-700">
            {t('whatsapp.tooltip')}
          </p>
          <div className={`
            absolute w-3 h-3 bg-white transform rotate-45
            ${isRTL ? '-left-1.5 bottom-4' : '-right-1.5 bottom-4'}
          `} />
        </div>
      )}
      
      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        className={`
          fixed z-50 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          bg-[#25D366] hover:bg-[#20BD5C] transition-all
          hover:scale-110 active:scale-95
          ${isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'}
          bottom-4 md:bottom-6
        `}
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '30s',
        }}
        aria-label={t('whatsapp.ariaLabel')}
        title={t('whatsapp.title')}
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </>
  );
}
```

---

### WhatsApp URL Generator

```typescript
// lib/whatsapp.ts

import { Locale } from './i18n';

const WHATSAPP_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    home: "Hello! I'm interested in Brasil Legalize immigration services.",
    pricing: "Hello! I'm interested in the {package} package.",
    'eligibility-pass': "Hello! I just completed the eligibility check and qualified!",
    'eligibility-fail': "Hello! I have questions about my eligibility.",
    default: "Hello! I'd like to learn more about your services.",
  },
  'pt-br': {
    home: "Olá! Estou interessado nos serviços de imigração da Brasil Legalize.",
    pricing: "Olá! Estou interessado no pacote {package}.",
    'eligibility-pass': "Olá! Acabei de fazer a verificação de elegibilidade e me qualifiquei!",
    'eligibility-fail': "Olá! Tenho dúvidas sobre minha elegibilidade.",
    default: "Olá! Gostaria de saber mais sobre os serviços.",
  },
  es: {
    home: "¡Hola! Estoy interesado en los servicios de inmigración de Brasil Legalize.",
    pricing: "¡Hola! Estoy interesado en el paquete {package}.",
    'eligibility-pass': "¡Hola! Acabo de completar la verificación de elegibilidad y califiqué!",
    'eligibility-fail': "¡Hola! Tengo preguntas sobre mi elegibilidad.",
    default: "¡Hola! Me gustaría saber más sobre sus servicios.",
  },
  ar: {
    home: "مرحبًا! أنا مهتم بخدمات الهجرة من براسيل ليغالايز.",
    pricing: "مرحبًا! أنا مهتم بالباقة {package}.",
    'eligibility-pass': "مرحبًا! لقد أكملت للتو فحص الأهلية وتأهلت!",
    'eligibility-fail': "مرحبًا! لدي أسئلة حول أهليتي.",
    default: "مرحبًا! أود معرفة المزيد عن خدماتكم.",
  },
};

export function generateWhatsAppUrl(
  phoneNumber: string,
  pathname: string,
  locale: Locale
): string {
  const messages = WHATSAPP_MESSAGES[locale] || WHATSAPP_MESSAGES.en;
  
  // Determine page context
  let messageKey = 'default';
  const storedData = getStoredUserData();
  
  if (pathname.includes('/book') || pathname.includes('/contact') || pathname === `/${locale}` || pathname === `/${locale}/`) {
    messageKey = 'home';
  } else if (pathname.includes('/pricing')) {
    messageKey = 'pricing';
  } else if (pathname.includes('/eligibility') || pathname.includes('/result')) {
    messageKey = storedData.eligibilityPassed ? 'eligibility-pass' : 'eligibility-fail';
  }
  
  let message = messages[messageKey] || messages.default;
  
  // Replace placeholders
  if (storedData.selectedPackage && message.includes('{package}')) {
    message = message.replace('{package}', storedData.selectedPackage);
  } else {
    message = message.replace('{package}', '');
  }
  
  // Clean phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Encode message
  const encodedMessage = encodeURIComponent(message.trim());
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

function getStoredUserData(): {
  selectedPackage?: string;
  eligibilityPassed?: boolean;
} {
  if (typeof window === 'undefined') return {};
  
  try {
    const pricingData = localStorage.getItem('brasil_legalize_pricing');
    const eligibilityData = localStorage.getItem('brasil_legalize_eligibility');
    
    return {
      selectedPackage: pricingData ? JSON.parse(pricingData).packageName : undefined,
      eligibilityPassed: eligibilityData ? JSON.parse(eligibilityData).passed : undefined,
    };
  } catch {
    return {};
  }
}
```

---

### Booking Page

```typescript
// app/[locale]/book/page.tsx
import { Metadata } from 'next';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';
import { Locale, getTranslation } from '@/lib/i18n';

interface BookingPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const t = (key: string) => getTranslation(params.locale, key);
  
  return {
    title: t('booking.metaTitle'),
    description: t('booking.metaDescription'),
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { locale } = params;
  const t = (key: string) => getTranslation(locale, key);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('booking.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('booking.subtitle')}
          </p>
        </div>
        
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-brand-primary/5 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">🆓</span>
            <p className="text-sm font-medium">{t('booking.benefit1')}</p>
          </div>
          <div className="bg-brand-primary/5 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">⏱️</span>
            <p className="text-sm font-medium">{t('booking.benefit2')}</p>
          </div>
          <div className="bg-brand-primary/5 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">🌐</span>
            <p className="text-sm font-medium">{t('booking.benefit3')}</p>
          </div>
        </div>
        
        {/* Calendly Embed */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <CalendlyEmbed locale={locale} />
        </div>
        
        {/* Alternative Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {t('booking.alternativeContact')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t('booking.emailUs')}
            </a>
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

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `calendly-locale-map` | Map locales to Calendly | Correct mappings |
| `whatsapp-url-home` | Generate URL for home page | Correct message |
| `whatsapp-url-pricing` | Generate URL with package | Package in message |
| `stripe-demo-success` | Process test card | Success state |
| `stripe-demo-decline` | Process decline card | Error state |
| `stripe-amount-format` | Format BRL amount | Correct format |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `calendly-load` | Calendly widget loads | Widget visible |
| `calendly-prefill` | Prefill from localStorage | Data populated |
| `stripe-elements-load` | Stripe Elements load | Form visible |
| `whatsapp-button-render` | Button appears after delay | Button visible |
| `whatsapp-click` | Click opens wa.me link | Correct URL |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-booking-flow` | Navigate to book, see Calendly | Widget functional |
| `payment-demo-success` | Enter test card, submit | Confetti and success |
| `payment-demo-decline` | Enter decline card | Error message |
| `whatsapp-mobile` | Click on mobile | Opens WhatsApp app |
| `rtl-positioning` | View in Arabic | Button on left |

---

## Edge Cases and Error Handling

### Edge Case 1: Calendly Blocked
- **Scenario:** User has ad blocker blocking Calendly
- **Handling:** Show direct link fallback after timeout
- **User Impact:** Can still book via external link

### Edge Case 2: Stripe.js Fails to Load
- **Scenario:** Network issues or blocked scripts
- **Handling:** Show informative error, alternative payment info
- **User Impact:** Informed about demo limitation

### Edge Case 3: WhatsApp Not Installed
- **Scenario:** Desktop user without WhatsApp
- **Handling:** wa.me opens web version
- **User Impact:** Can still send message

### Edge Case 4: Pre-fill Data Missing
- **Scenario:** User clears localStorage
- **Handling:** Form works without pre-fill
- **User Impact:** Must enter data manually

---

## Dependencies

### External Services
- Calendly Business account (for embed)
- Stripe test API keys
- WhatsApp Business number

### NPM Packages
```json
{
  "@stripe/stripe-js": "^2.0.0",
  "@stripe/react-stripe-js": "^2.0.0",
  "canvas-confetti": "^1.9.0"
}
```

---

## Environment Variables

```env
# Stripe Test Keys (SANDBOX ONLY)
NEXT_PUBLIC_STRIPE_PK_TEST=pk_test_xxxxxxxxxxxxxxxx

# WhatsApp Business Number
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/brasil-legalize/consultation
```

---

## Definition of Done

- [ ] Calendly widget embeds and functions
- [ ] Calendly respects locale parameter
- [ ] Calendly pre-fills from localStorage
- [ ] Stripe demo form renders correctly
- [ ] Test card success flow works
- [ ] Test card decline flow shows error
- [ ] Confetti effect on success
- [ ] WhatsApp button appears after delay
- [ ] WhatsApp button positioned correctly (RTL aware)
- [ ] WhatsApp pre-fill messages work
- [ ] Tooltip appears after inactivity
- [ ] All pages are mobile responsive
- [ ] All text is localized
- [ ] Error states handled gracefully
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

