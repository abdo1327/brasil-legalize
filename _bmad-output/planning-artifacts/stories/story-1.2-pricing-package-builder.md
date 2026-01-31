---
storyId: "1.2"
epicId: "1"
title: "Pricing Page with Interactive Package Builder"
status: "ready"
priority: "high"
estimatedEffort: "medium"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - pricing
  - package-builder
  - lead-capture
  - interactive
  - conversion
functionalRequirements:
  - FR2
  - FR4
nonFunctionalRequirements:
  - NFR5
  - NFR6
dependencies:
  - "1.1"
blockedBy:
  - "1.1"
blocks: []
---

# Story 1.2: Pricing Page with Interactive Package Builder

## User Story

**As a** visitor,
**I want** to build a custom service package and see real-time pricing,
**So that** I can estimate my costs before contacting the firm and feel confident about the investment.

---

## Story Description

This story implements the Pricing page featuring an interactive package builder component. Visitors can select services from different categories, see their selections in a "cart-like" interface, and get real-time price calculations. The builder captures emails from interested visitors for lead generation while providing transparency in pricing.

The package builder must be intuitive, responsive, and aligned with brand guidelines. It should encourage visitors to explore services while making it easy to submit their interest for follow-up.

---

## Acceptance Criteria

### AC 1.2.1: Pricing Page Structure

**Given** a visitor navigates to the Pricing page (`/[locale]/pricing`)
**When** the page loads
**Then** they see:
  - Page title: "Pricing" / "الأسعار" / "Precios" / "Preços"
  - Introduction text explaining the package builder concept
  - Package Builder component (main feature)
  - Pricing transparency statement
  - FAQ section about pricing
  - CTA section for custom quotes or consultation booking

**And** all content is localized to the current locale
**And** the page follows brand guidelines (light theme, Brazil palette, no emojis)

---

### AC 1.2.2: Package Builder - Category Display

**Given** the package builder component loads
**When** the visitor views the service selection area
**Then** they see service categories organized as:
  - **Visa Services** (e.g., Tourist Visa, Work Visa, Student Visa)
  - **Residency Services** (e.g., Temporary Residency, Permanent Residency)
  - **Citizenship Services** (e.g., Naturalization, Citizenship by Marriage)
  - **Document Services** (e.g., Document Legalization, Translation)
  - **Add-ons** (e.g., Express Processing, Document Courier)

**And** each category has a localized title
**And** categories are visually distinct (cards, sections, or tabs)
**And** each service item displays:
  - Service name
  - Brief description (optional)
  - Monthly price (if applicable)
  - Setup/one-time cost (if applicable)
  - Add button (+) or toggle

---

### AC 1.2.3: Package Builder - Service Selection

**Given** a visitor views the package builder
**When** they click the add button (+) on a service
**Then** the service is added to their package
**And** the button changes to indicate selection (checkmark, highlighted state)
**And** the service appears in the "Your Package" summary panel
**And** prices update in real-time

**Given** a service is already selected
**When** the visitor clicks the remove button (×) in the summary
**Then** the service is removed from the package
**And** the selection button reverts to unselected state
**And** prices update in real-time

**Given** a visitor selects multiple services
**When** viewing the summary panel
**Then** all selected services are listed
**And** individual prices are shown per service
**And** total is calculated correctly

---

### AC 1.2.4: Package Builder - Price Calculation

**Given** services are selected in the package builder
**When** the price summary updates
**Then** the following are displayed:
  - **Monthly Price:** Sum of all monthly fees
  - **Setup Cost:** Sum of all one-time setup fees
  - **Total (Monthly):** Monthly subtotal (may equal monthly price)

**And** prices are displayed in SAR (Saudi Riyal) or configured currency
**And** prices are formatted with proper thousand separators
**And** "0 SAR" is shown if no monthly/setup cost applies

**Given** no services are selected
**When** viewing the price summary
**Then** all values show "0 SAR"
**And** a placeholder message appears: "Select services to build your package"

---

### AC 1.2.5: Package Builder - Email Capture Form

**Given** services are selected in the package builder
**When** the visitor views the email capture section
**Then** they see:
  - Form title: "Get Package Details" or equivalent
  - Email input field with placeholder text
  - Submit button
  - Privacy note about how email will be used

**Given** the visitor enters a valid email and clicks Submit
**When** the form is submitted
**Then** a lead is created via POST to `/api/leads.php`
**And** the lead includes:
  - `name`: "Package Builder User"
  - `contact`: the email entered
  - `serviceType`: "Package Builder"
  - `consent`: true
  - `consentVersion`: "v1"
  - `selectedItems`: array of selected service IDs
**And** a success message displays
**And** the form resets or shows confirmation state

**Given** the visitor enters an invalid email
**When** they click Submit
**Then** validation error appears: "Please enter a valid email"
**And** the form is not submitted

**Given** no services are selected
**When** the visitor tries to submit the form
**Then** the submit button is disabled
**Or** an error message appears: "Please select at least one service"

---

### AC 1.2.6: Package Builder - Spam Protection

**Given** the email capture form is rendered
**When** a human user submits the form
**Then** the honeypot field is empty (hidden from view)
**And** the submission is processed normally

**Given** a bot fills in the honeypot field
**When** the form is submitted
**Then** the API accepts the request (returns 200)
**But** no lead is actually stored
**And** a fake success response is returned

**Given** the same email submits more than 3 times per hour
**When** the 4th submission is attempted
**Then** a 429 response is returned
**And** the user sees: "Too many submissions. Please try again later."

---

### AC 1.2.7: Package Builder - Responsive Design

**Given** the package builder is viewed on desktop (>1024px)
**When** the layout renders
**Then** categories and summary display side-by-side
**And** categories take ~60-70% width
**And** summary panel takes ~30-40% width
**And** summary panel is sticky on scroll

**Given** the package builder is viewed on tablet (768-1024px)
**When** the layout renders
**Then** layout may be side-by-side or stacked
**And** all functionality remains accessible

**Given** the package builder is viewed on mobile (<768px)
**When** the layout renders
**Then** categories stack vertically
**And** summary panel is at the bottom (fixed or scrollable)
**Or** summary is accessible via a floating button
**And** touch targets are at least 44x44px
**And** scrolling is smooth

---

### AC 1.2.8: Package Builder - RTL Support

**Given** the package builder is viewed in Arabic locale
**When** the layout renders
**Then** the entire component mirrors horizontally
**And** summary panel appears on the left (instead of right)
**And** add/remove buttons appear on the correct side
**And** price formatting follows Arabic conventions
**And** all text is right-aligned
**And** icons that indicate direction are flipped

---

### AC 1.2.9: Package Builder - Localization

**Given** the package builder is viewed in any supported locale
**When** the component renders
**Then** all UI text is translated:
  - Category names
  - Service names and descriptions
  - Button labels ("Add", "Remove", "Submit")
  - Price labels ("Monthly Price", "Setup Cost", "Total")
  - Form labels and placeholders
  - Success/error messages
  - Pricing transparency statement

**And** currency symbol and formatting match locale expectations

---

### AC 1.2.10: Pricing FAQ Section

**Given** a visitor scrolls past the package builder
**When** they view the FAQ section
**Then** they see common pricing questions:
  - "How is pricing calculated?"
  - "Are there any hidden fees?"
  - "Can I customize my package?"
  - "What payment methods do you accept?"
  - "Is there a money-back guarantee?"
  - "Do you offer payment plans?"

**And** each question expands to show the answer
**And** content is localized to the current locale

---

### AC 1.2.11: Custom Quote CTA

**Given** a visitor wants a personalized quote
**When** they view the bottom CTA section
**Then** they see options to:
  - "Contact for Custom Quote" → links to Contact page
  - "Book a Consultation" → links to Book page
  - "WhatsApp Us" → opens WhatsApp

**And** CTAs are prominent and accessible
**And** text is localized

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/[locale]/pricing/page.tsx` | Create | Pricing page with package builder |
| `components/PackageBuilder.tsx` | Create | Interactive package builder component |
| `components/ServiceCategoryCard.tsx` | Create | Category display component |
| `components/ServiceItem.tsx` | Create | Individual service selection item |
| `components/PackageSummary.tsx` | Create | Selected items and pricing summary |
| `components/PricingFAQ.tsx` | Create | FAQ accordion for pricing |
| `lib/services-pricing.ts` | Create | Service data with pricing |
| `lib/i18n.ts` | Modify | Add pricing-related translations |

---

### Service Pricing Data Structure

```typescript
// lib/services-pricing.ts

export interface ServicePricingItem {
  id: string;
  categoryId: string;
  monthlyPrice: number;
  setupPrice: number;
  translations: {
    [locale: string]: {
      name: string;
      description?: string;
    };
  };
}

export interface ServiceCategory {
  id: string;
  icon: string;
  translations: {
    [locale: string]: {
      name: string;
    };
  };
  items: ServicePricingItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'visa',
    icon: 'passport',
    translations: {
      en: { name: 'Visa Services' },
      ar: { name: 'خدمات التأشيرات' },
      es: { name: 'Servicios de Visa' },
      'pt-br': { name: 'Serviços de Visto' },
    },
    items: [
      {
        id: 'tourist-visa',
        categoryId: 'visa',
        monthlyPrice: 0,
        setupPrice: 500,
        translations: {
          en: { 
            name: 'Tourist Visa',
            description: 'Extension and renewal assistance'
          },
          ar: { 
            name: 'تأشيرة سياحية',
            description: 'مساعدة في التمديد والتجديد'
          },
          es: { 
            name: 'Visa de Turista',
            description: 'Asistencia en extensión y renovación'
          },
          'pt-br': { 
            name: 'Visto de Turista',
            description: 'Assistência em extensão e renovação'
          },
        },
      },
      {
        id: 'work-visa',
        categoryId: 'visa',
        monthlyPrice: 200,
        setupPrice: 1500,
        translations: {
          en: { 
            name: 'Work Visa',
            description: 'Full work authorization support'
          },
          ar: { 
            name: 'تأشيرة عمل',
            description: 'دعم كامل لتصريح العمل'
          },
          es: { 
            name: 'Visa de Trabajo',
            description: 'Soporte completo de autorización de trabajo'
          },
          'pt-br': { 
            name: 'Visto de Trabalho',
            description: 'Suporte completo de autorização de trabalho'
          },
        },
      },
      {
        id: 'student-visa',
        categoryId: 'visa',
        monthlyPrice: 100,
        setupPrice: 800,
        translations: {
          en: { 
            name: 'Student Visa',
            description: 'Academic visa processing'
          },
          ar: { 
            name: 'تأشيرة طالب',
            description: 'معالجة التأشيرة الأكاديمية'
          },
          es: { 
            name: 'Visa de Estudiante',
            description: 'Procesamiento de visa académica'
          },
          'pt-br': { 
            name: 'Visto de Estudante',
            description: 'Processamento de visto acadêmico'
          },
        },
      },
    ],
  },
  {
    id: 'residency',
    icon: 'home',
    translations: {
      en: { name: 'Residency Services' },
      ar: { name: 'خدمات الإقامة' },
      es: { name: 'Servicios de Residencia' },
      'pt-br': { name: 'Serviços de Residência' },
    },
    items: [
      {
        id: 'temp-residency',
        categoryId: 'residency',
        monthlyPrice: 150,
        setupPrice: 2000,
        translations: {
          en: { 
            name: 'Temporary Residency',
            description: 'Initial residency application'
          },
          ar: { 
            name: 'إقامة مؤقتة',
            description: 'طلب الإقامة الأولي'
          },
          es: { 
            name: 'Residencia Temporal',
            description: 'Solicitud de residencia inicial'
          },
          'pt-br': { 
            name: 'Residência Temporária',
            description: 'Solicitação de residência inicial'
          },
        },
      },
      {
        id: 'perm-residency',
        categoryId: 'residency',
        monthlyPrice: 200,
        setupPrice: 3500,
        translations: {
          en: { 
            name: 'Permanent Residency',
            description: 'Permanent status application'
          },
          ar: { 
            name: 'إقامة دائمة',
            description: 'طلب الوضع الدائم'
          },
          es: { 
            name: 'Residencia Permanente',
            description: 'Solicitud de estatus permanente'
          },
          'pt-br': { 
            name: 'Residência Permanente',
            description: 'Solicitação de status permanente'
          },
        },
      },
    ],
  },
  {
    id: 'citizenship',
    icon: 'flag',
    translations: {
      en: { name: 'Citizenship Services' },
      ar: { name: 'خدمات الجنسية' },
      es: { name: 'Servicios de Ciudadanía' },
      'pt-br': { name: 'Serviços de Cidadania' },
    },
    items: [
      {
        id: 'naturalization',
        categoryId: 'citizenship',
        monthlyPrice: 300,
        setupPrice: 5000,
        translations: {
          en: { 
            name: 'Naturalization',
            description: 'Full citizenship application process'
          },
          ar: { 
            name: 'التجنس',
            description: 'عملية طلب الجنسية الكاملة'
          },
          es: { 
            name: 'Naturalización',
            description: 'Proceso completo de solicitud de ciudadanía'
          },
          'pt-br': { 
            name: 'Naturalização',
            description: 'Processo completo de solicitação de cidadania'
          },
        },
      },
    ],
  },
  {
    id: 'documents',
    icon: 'document',
    translations: {
      en: { name: 'Document Services' },
      ar: { name: 'خدمات الوثائق' },
      es: { name: 'Servicios de Documentos' },
      'pt-br': { name: 'Serviços de Documentos' },
    },
    items: [
      {
        id: 'doc-legalization',
        categoryId: 'documents',
        monthlyPrice: 0,
        setupPrice: 300,
        translations: {
          en: { 
            name: 'Document Legalization',
            description: 'Official authentication'
          },
          ar: { 
            name: 'تصديق الوثائق',
            description: 'المصادقة الرسمية'
          },
          es: { 
            name: 'Legalización de Documentos',
            description: 'Autenticación oficial'
          },
          'pt-br': { 
            name: 'Legalização de Documentos',
            description: 'Autenticação oficial'
          },
        },
      },
      {
        id: 'translation',
        categoryId: 'documents',
        monthlyPrice: 0,
        setupPrice: 150,
        translations: {
          en: { 
            name: 'Certified Translation',
            description: 'Per document'
          },
          ar: { 
            name: 'ترجمة معتمدة',
            description: 'لكل وثيقة'
          },
          es: { 
            name: 'Traducción Certificada',
            description: 'Por documento'
          },
          'pt-br': { 
            name: 'Tradução Certificada',
            description: 'Por documento'
          },
        },
      },
    ],
  },
  {
    id: 'addons',
    icon: 'plus-circle',
    translations: {
      en: { name: 'Add-ons' },
      ar: { name: 'إضافات' },
      es: { name: 'Complementos' },
      'pt-br': { name: 'Complementos' },
    },
    items: [
      {
        id: 'express',
        categoryId: 'addons',
        monthlyPrice: 0,
        setupPrice: 500,
        translations: {
          en: { 
            name: 'Express Processing',
            description: 'Priority handling'
          },
          ar: { 
            name: 'معالجة سريعة',
            description: 'معالجة ذات أولوية'
          },
          es: { 
            name: 'Procesamiento Express',
            description: 'Manejo prioritario'
          },
          'pt-br': { 
            name: 'Processamento Express',
            description: 'Tratamento prioritário'
          },
        },
      },
      {
        id: 'courier',
        categoryId: 'addons',
        monthlyPrice: 0,
        setupPrice: 200,
        translations: {
          en: { 
            name: 'Document Courier',
            description: 'Secure delivery service'
          },
          ar: { 
            name: 'توصيل الوثائق',
            description: 'خدمة توصيل آمنة'
          },
          es: { 
            name: 'Mensajería de Documentos',
            description: 'Servicio de entrega segura'
          },
          'pt-br': { 
            name: 'Correio de Documentos',
            description: 'Serviço de entrega segura'
          },
        },
      },
    ],
  },
];

// Helper functions
export function getServiceById(id: string): ServicePricingItem | undefined {
  for (const category of serviceCategories) {
    const item = category.items.find(i => i.id === id);
    if (item) return item;
  }
  return undefined;
}

export function calculatePricing(selectedIds: string[]): { monthly: number; setup: number; total: number } {
  let monthly = 0;
  let setup = 0;
  
  for (const id of selectedIds) {
    const service = getServiceById(id);
    if (service) {
      monthly += service.monthlyPrice;
      setup += service.setupPrice;
    }
  }
  
  return {
    monthly,
    setup,
    total: monthly, // Total monthly for display
  };
}
```

---

### PackageBuilder Component

```typescript
// components/PackageBuilder.tsx
'use client';

import { useState } from 'react';
import { serviceCategories, calculatePricing, ServicePricingItem } from '@/lib/services-pricing';
import { getTranslation, Locale } from '@/lib/i18n';

interface PackageBuilderProps {
  locale: Locale;
}

export function PackageBuilder({ locale }: PackageBuilderProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = (key: string) => getTranslation(locale, key);
  const prices = calculatePricing(selected);
  
  const toggleItem = (itemId: string) => {
    setSelected(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const getSelectedItems = (): ServicePricingItem[] => {
    const items: ServicePricingItem[] = [];
    for (const category of serviceCategories) {
      for (const item of category.items) {
        if (selected.includes(item.id)) {
          items.push(item);
        }
      }
    }
    return items;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || selected.length === 0) return;
    
    setIsSubmitting(true);
    setMessage('');
    
    // Get honeypot field
    const form = e.target as HTMLFormElement;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value || '';
    
    try {
      const response = await fetch('/api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Package Builder User',
          contact: email,
          country: '',
          serviceType: 'Package Builder',
          consent: true,
          consentVersion: 'v1',
          selectedItems: selected,
          website: honeypot, // Honeypot field
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(t('pricing.submitSuccess'));
        setEmail('');
        setSelected([]);
      } else {
        setMessage(data.message || t('pricing.submitError'));
      }
    } catch (error) {
      setMessage(t('pricing.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(amount);
  };
  
  const selectedItems = getSelectedItems();
  
  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Service Categories - Takes 3 columns on large screens */}
      <div className="lg:col-span-3 space-y-6">
        {serviceCategories.map((category) => (
          <div key={category.id} className="card p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                {/* Icon placeholder - use actual icon component */}
                <span className="text-brand-primary">●</span>
              </span>
              {category.translations[locale]?.name || category.translations.en.name}
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {category.items.map((item) => {
                const isSelected = selected.includes(item.id);
                const itemName = item.translations[locale]?.name || item.translations.en.name;
                const itemDesc = item.translations[locale]?.description || item.translations.en.description;
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`
                      flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition
                      text-start
                      ${isSelected
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-slate-200 bg-slate-50 hover:border-brand-primary'
                      }
                    `}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{itemName}</div>
                      {itemDesc && (
                        <div className="text-xs text-slate-500 mt-0.5">{itemDesc}</div>
                      )}
                      <div className="text-xs text-brand-primary mt-1">
                        {item.setupPrice > 0 && `${formatPrice(item.setupPrice)} SAR ${t('pricing.setup')}`}
                        {item.setupPrice > 0 && item.monthlyPrice > 0 && ' + '}
                        {item.monthlyPrice > 0 && `${formatPrice(item.monthlyPrice)} SAR/${t('pricing.month')}`}
                      </div>
                    </div>
                    <span className={`
                      inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                      ${isSelected 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-brand-primary/20 text-brand-primary'
                      }
                    `}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Package Summary - Takes 2 columns, sticky on desktop */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-24 space-y-6">
          {/* Selected Items */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold">{t('pricing.yourPackage')}</h3>
            
            <div className="mt-4 min-h-[180px] rounded-xl border border-dashed border-slate-200 p-4">
              {selectedItems.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-8">
                  {t('pricing.selectServices')}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item) => {
                    const itemName = item.translations[locale]?.name || item.translations.en.name;
                    return (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span>{itemName}</span>
                        <button 
                          type="button" 
                          onClick={() => toggleItem(item.id)} 
                          className="text-slate-400 hover:text-red-500 transition"
                          aria-label={`Remove ${itemName}`}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Price Summary */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('pricing.monthlyPrice')}</span>
                <span className="font-semibold">{formatPrice(prices.monthly)} SAR</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">{t('pricing.setupCost')}</span>
                <span className="font-semibold">{formatPrice(prices.setup)} SAR</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-semibold">
                <span>{t('pricing.monthlyTotal')}</span>
                <span className="text-brand-primary">{formatPrice(prices.total)} SAR</span>
              </div>
            </div>
          </div>
          
          {/* Email Capture Form */}
          <div className="card p-6">
            <h4 className="text-sm font-semibold">{t('pricing.getDetails')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              {t('pricing.emailDisclaimer')}
            </p>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              <input
                type="email"
                placeholder={t('pricing.emailPlaceholder')}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-primary transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={selectedItems.length === 0 || isSubmitting}
              >
                {isSubmitting ? t('pricing.submitting') : t('pricing.submit')}
              </button>
              
              {message && (
                <p className={`text-xs ${message.includes('error') || message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
          
          {/* Transparency Note */}
          <div className="text-xs text-slate-500 text-center">
            {t('pricing.transparencyNote')}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Pricing Page Translations

```typescript
// Add to lib/i18n.ts
{
  pricing: {
    title: 'Pricing',
    subtitle: 'Build your custom service package',
    intro: 'Select the services you need and get an instant price estimate. Our transparent pricing means no hidden fees.',
    yourPackage: 'Your Package',
    selectServices: 'Select services to build your package',
    monthlyPrice: 'Monthly Price',
    setupCost: 'Setup Cost',
    monthlyTotal: 'Monthly Total',
    setup: 'setup',
    month: 'mo',
    getDetails: 'Get Package Details',
    emailPlaceholder: 'Enter your email',
    emailDisclaimer: 'We\'ll send you a detailed breakdown of your selected services.',
    submit: 'Get Quote',
    submitting: 'Sending...',
    submitSuccess: 'Thank you! We\'ll be in touch soon.',
    submitError: 'Something went wrong. Please try again.',
    transparencyNote: 'Prices shown are estimates. Final pricing may vary based on your specific situation.',
    customQuote: 'Need a Custom Quote?',
    customQuoteText: 'For complex cases or services not listed, contact us for a personalized quote.',
    contactUs: 'Contact Us',
    bookConsultation: 'Book Consultation',
  },
}
```

---

## API Contract

### POST /api/leads.php (Package Builder Submission)

**Request:**
```json
{
  "name": "Package Builder User",
  "contact": "user@example.com",
  "country": "",
  "serviceType": "Package Builder",
  "consent": true,
  "consentVersion": "v1",
  "selectedItems": ["work-visa", "doc-legalization", "express"],
  "website": ""  // Honeypot - must be empty
}
```

**Response (Success - 200):**
```json
{
  "message": "Lead captured",
  "leadId": "lead_1234567890"
}
```

**Response (Validation Error - 400):**
```json
{
  "message": "Valid contact information is required"
}
```

**Response (Rate Limited - 429):**
```json
{
  "message": "Too many submissions. Please try again later."
}
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `toggle-selection` | Click to select/deselect service | State updates correctly |
| `price-calculation-empty` | No services selected | All prices show 0 |
| `price-calculation-single` | One service selected | Correct price shown |
| `price-calculation-multiple` | Multiple services selected | Sum calculated correctly |
| `format-price-en` | Format price in English | Uses comma separators |
| `format-price-ar` | Format price in Arabic | Uses Arabic-Indic numerals |
| `email-validation` | Invalid email submitted | Shows validation error |
| `honeypot-filled` | Bot fills honeypot | Form accepted, no lead stored |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `form-submit-success` | Valid submission | Lead created, success message |
| `form-submit-no-services` | Submit with no selections | Button disabled or error shown |
| `rate-limit-exceeded` | 4+ submissions same email/hour | 429 error returned |
| `localization-all-locales` | View in each locale | All text translated |
| `rtl-layout` | View in Arabic | Layout mirrors correctly |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-builder-flow` | Select services, enter email, submit | Lead created successfully |
| `mobile-responsive` | Use builder on mobile | All functionality works |
| `sticky-summary` | Scroll on desktop | Summary stays visible |
| `keyboard-navigation` | Tab through builder | All items accessible |

---

## Edge Cases and Error Handling

### Edge Case 1: Same Service Selected Twice
- **Scenario:** User somehow triggers selection twice
- **Handling:** Toggle logic ensures only one add/remove per click
- **User Impact:** No duplicate selections possible

### Edge Case 2: Currency Symbol in Wrong Position
- **Scenario:** RTL locale shows currency incorrectly
- **Handling:** Use Intl.NumberFormat with locale-aware formatting
- **User Impact:** Currency displays correctly for locale

### Edge Case 3: Very Long Service Names
- **Scenario:** Translated name is much longer than English
- **Handling:** Use text truncation with ellipsis, full name on hover
- **User Impact:** Clean UI maintained, full text accessible

### Edge Case 4: Network Error on Submit
- **Scenario:** API unreachable during submission
- **Handling:** Catch error, show retry message, don't clear selections
- **User Impact:** Can retry without re-selecting services

### Edge Case 5: Zero-Priced Services Only
- **Scenario:** User selects only free add-ons
- **Handling:** Show "0 SAR" totals, allow submission
- **User Impact:** Clear that selection has no cost

---

## Performance Optimization

1. **Component Memoization:** Memoize service items to prevent re-renders
2. **Debounced Calculations:** Debounce price recalculation if many rapid selections
3. **Lazy Load Categories:** If many categories, consider accordion or lazy loading
4. **Optimistic UI:** Show selection immediately, validate asynchronously

---

## Accessibility

1. **Keyboard Navigation:** All services selectable via keyboard
2. **ARIA Labels:** Proper labels on buttons and form fields
3. **Focus Management:** Focus moves logically through builder
4. **Screen Reader:** Announce price changes with aria-live region
5. **Color Contrast:** Selected state distinguishable without color alone

---

## Definition of Done

- [ ] Package builder renders correctly in all 4 locales
- [ ] RTL layout works correctly for Arabic
- [ ] Service selection toggles correctly
- [ ] Price calculation is accurate
- [ ] Email validation works
- [ ] Honeypot spam protection functional
- [ ] Rate limiting tested
- [ ] Form submission creates lead
- [ ] Success/error messages display correctly
- [ ] Responsive on all screen sizes
- [ ] Sticky summary works on desktop
- [ ] All translations complete
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Accessibility audit passes
- [ ] Code reviewed and approved

---

## Notes and Decisions

1. **Decision:** Use SAR (Saudi Riyal) as primary currency
   - **Rationale:** Target market is Middle East/Brazil, SAR is common
   - **Trade-off:** May need currency conversion for other markets

2. **Decision:** Store service data in TypeScript file
   - **Rationale:** Type safety, simple, no backend dependency
   - **Trade-off:** Rebuild needed for price changes

3. **Decision:** Include setup and monthly pricing
   - **Rationale:** Matches common legal service pricing models
   - **Trade-off:** More complex UI than single price

4. **Future Enhancement:** Dynamic pricing based on region
5. **Future Enhancement:** Coupon/discount code support
6. **Future Enhancement:** Save package and resume later

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

