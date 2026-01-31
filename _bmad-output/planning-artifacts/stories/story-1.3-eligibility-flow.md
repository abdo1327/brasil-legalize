---
storyId: "1.3"
epicId: "1"
title: "Eligibility Pre-Check Flow with Conditional Logic"
status: "ready"
priority: "high"
estimatedEffort: "large"
assignee: null
sprintId: null
createdAt: "2026-01-30"
updatedAt: "2026-01-30"
completedAt: null
tags:
  - eligibility
  - form
  - conditional-logic
  - lead-capture
  - conversion
functionalRequirements:
  - FR3
  - FR4
nonFunctionalRequirements:
  - NFR4
  - NFR5
  - NFR8
dependencies:
  - "1.1"
blockedBy:
  - "1.1"
blocks: []
---

# Story 1.3: Eligibility Pre-Check Flow with Conditional Logic

## User Story

**As a** visitor,
**I want** to complete an eligibility questionnaire with conditional questions,
**So that** I can determine if I qualify for services before investing time in a consultation.

---

## Story Description

This story implements a multi-step eligibility pre-check flow that helps visitors determine if they qualify for immigration services. The questionnaire uses conditional logic to show relevant questions based on previous answers, creating a personalized assessment experience.

The flow must be mobile-first, save progress client-side, capture qualified leads with proper consent, and provide clear eligibility results with appropriate next-step CTAs.

---

## Acceptance Criteria

### AC 1.3.1: Eligibility Flow Entry Point

**Given** a visitor is on the Home page or any marketing page
**When** they click "Check Eligibility" CTA
**Then** they are navigated to `/[locale]/eligibility`
**And** the eligibility flow begins at Step 1
**And** a progress indicator shows current step and total steps

---

### AC 1.3.2: Flow Structure and Steps

**Given** the eligibility flow loads
**When** the visitor views the questionnaire
**Then** the flow has the following structure:

**Step 1: Service Interest**
- Question: "What type of service are you interested in?"
- Options: Visa, Residency, Citizenship, Documents, Not Sure
- Single select required

**Step 2: Current Status** (conditional based on Step 1)
- If Visa: "What is your current visa status?"
  - Options: Tourist, Business, No Visa, Other
- If Residency: "Do you currently have any residency in Brazil?"
  - Options: Yes - Temporary, Yes - Permanent, No
- If Citizenship: "What is your current citizenship status?"
  - Options: Brazilian by descent, Married to Brazilian, Resident for 4+ years, None
- If Documents: "What document service do you need?"
  - Options: Legalization, Translation, Apostille, Other
- If Not Sure: Skip to Step 3

**Step 3: Timeline**
- Question: "When do you need this completed?"
- Options: Urgent (within 1 month), Soon (1-3 months), Flexible (3+ months), Not sure

**Step 4: Location**
- Question: "Where are you currently located?"
- Input: Country dropdown + City text input (optional)
- Note: Helps determine jurisdiction and process

**Step 5: Contact Information**
- Fields: Name, Email, Phone/WhatsApp (optional)
- Consent checkbox with link to privacy policy
- Submit button

**Step 6: Result**
- Eligibility assessment result (Likely Eligible, May Need Review, Contact for Assessment)
- Recommended next steps
- CTAs: Book Consultation, WhatsApp Us, Download Guide (if applicable)

---

### AC 1.3.3: Conditional Question Display

**Given** the visitor answers Step 1 (Service Interest)
**When** they proceed to Step 2
**Then** the question shown matches their Step 1 selection
**And** irrelevant questions are not displayed
**And** the total step count adjusts if steps are skipped

**Given** the visitor selects "Citizenship" and then "Married to Brazilian"
**When** they see the result
**Then** eligibility assessment considers marriage-based citizenship criteria
**And** result reflects this specific pathway

**Given** the visitor changes their Step 1 answer
**When** they navigate back and select a different option
**Then** Step 2 updates to show the appropriate question
**And** previous Step 2 answer is cleared

---

### AC 1.3.4: Navigation and Progress

**Given** the visitor is on any step
**When** they view the progress indicator
**Then** they see: current step number, total steps, visual progress bar
**And** completed steps are visually marked

**Given** the visitor has completed Step 2
**When** they click "Back"
**Then** they return to Step 1
**And** their previous answer is preserved

**Given** the visitor has not answered the current question
**When** they click "Next"
**Then** validation error appears: "Please select an option"
**And** they cannot proceed until answering

**Given** the visitor has answered all required fields
**When** they click "Next"
**Then** they proceed to the next step
**And** progress bar updates

---

### AC 1.3.5: Client-Side Progress Persistence

**Given** the visitor is partway through the eligibility flow
**When** they accidentally close the tab or refresh
**Then** their progress is preserved in localStorage
**And** when they return to `/[locale]/eligibility`
**Then** they see option to: "Resume from where you left off" or "Start over"

**Given** the visitor chooses to resume
**When** the flow loads
**Then** they return to the last incomplete step
**And** all previous answers are restored

**Given** 24 hours have passed since starting
**When** the visitor returns
**Then** the saved progress is cleared
**And** they start fresh

---

### AC 1.3.6: Contact Information and Consent

**Given** the visitor reaches Step 5 (Contact Information)
**When** the form renders
**Then** they see:
  - Name field (required)
  - Email field (required)
  - Phone/WhatsApp field (optional, with format hint)
  - Consent checkbox (required) with text:
    "I agree to the Privacy Policy and consent to being contacted about my eligibility inquiry."
  - Link to Privacy Policy opens in new tab

**Given** the visitor fills all required fields and checks consent
**When** they click "Check My Eligibility"
**Then** form submits
**And** they proceed to Step 6 (Result)

**Given** the consent checkbox is not checked
**When** they try to submit
**Then** error appears: "You must agree to the privacy policy to continue"
**And** form does not submit

---

### AC 1.3.7: Lead Creation on Submit

**Given** the visitor submits Step 5
**When** the API call is made to `/api/leads.php`
**Then** the lead record includes:
```json
{
  "name": "Visitor Name",
  "contact": "email@example.com",
  "phone": "+55 11 99999-9999",
  "country": "Saudi Arabia",
  "city": "Riyadh",
  "serviceType": "Citizenship",
  "answers": {
    "serviceInterest": "citizenship",
    "citizenshipStatus": "married-to-brazilian",
    "timeline": "soon",
    "location": { "country": "Saudi Arabia", "city": "Riyadh" }
  },
  "eligibilityResult": "likely-eligible",
  "consent": true,
  "consentVersion": "v1",
  "consentTimestamp": "2026-01-30T12:00:00Z"
}
```

**And** the lead is stored successfully
**And** an audit log entry is created

---

### AC 1.3.8: Eligibility Result Display

**Given** the lead is created successfully
**When** the Result step (Step 6) loads
**Then** the visitor sees one of three results:

**Likely Eligible:**
- Green checkmark icon
- Heading: "Good News! You Likely Qualify"
- Explanation based on their answers
- CTA: "Book Your Consultation" (primary)
- CTA: "WhatsApp Us" (secondary)

**May Need Review:**
- Yellow info icon
- Heading: "Your Case Needs Review"
- Explanation of what factors need verification
- CTA: "Schedule a Free Assessment" (primary)
- CTA: "Contact Us" (secondary)

**Contact for Assessment:**
- Blue info icon
- Heading: "Let's Discuss Your Options"
- Explanation that their situation is unique
- CTA: "Book a Consultation" (primary)
- CTA: "Call Us" / "WhatsApp" (secondary)

**And** all content is localized
**And** result is not re-calculable (one attempt per session)

---

### AC 1.3.9: Eligibility Logic Rules

**Given** the system processes the visitor's answers
**When** determining eligibility result
**Then** the following rules apply:

**LIKELY ELIGIBLE:**
- Citizenship + Married to Brazilian + Any timeline
- Citizenship + Brazilian by descent + Any timeline
- Residency + Currently has temporary + Soon/Flexible timeline
- Visa + Tourist + Renewal timeline matches

**MAY NEED REVIEW:**
- Citizenship + Resident 4+ years + Any timeline
- Residency + No current residency + Any timeline
- Documents + Legalization/Apostille

**CONTACT FOR ASSESSMENT:**
- Any service + "Not Sure" status options
- Urgent timeline + Complex service type
- Citizenship + None status
- Custom combinations not covered above

---

### AC 1.3.10: Mobile-First Design

**Given** the eligibility flow is viewed on mobile
**When** the UI renders
**Then**:
  - Full-width questions and options
  - Large touch targets (min 44x44px)
  - Single column layout
  - Bottom-fixed navigation buttons (Back/Next)
  - Progress bar at top
  - Keyboard-friendly inputs
  - No horizontal scrolling

**Given** the flow is viewed on desktop
**When** the UI renders
**Then**:
  - Centered content with max-width
  - More spacious layout
  - Side-by-side options where appropriate
  - Inline navigation buttons

---

### AC 1.3.11: RTL Support

**Given** the eligibility flow is viewed in Arabic locale
**When** the UI renders
**Then**:
  - All text is right-aligned
  - Progress bar fills from right to left
  - Back button is on the right
  - Next button is on the left
  - Radio/checkbox labels are on the right side
  - Form input text aligns to right

---

### AC 1.3.12: Error Handling

**Given** the API call to create lead fails
**When** the error is caught
**Then** the visitor sees: "Something went wrong. Please try again."
**And** a retry button is shown
**And** their answers are preserved
**And** the error is logged

**Given** network connectivity is lost mid-flow
**When** the visitor tries to proceed
**Then** an offline message appears
**And** they can continue when online

---

### AC 1.3.13: Analytics and Tracking

**Given** the visitor progresses through the flow
**When** each step is completed
**Then** analytics events are fired:
  - `eligibility_started` - Flow initiated
  - `eligibility_step_completed` - Each step completed with step number
  - `eligibility_submitted` - Form submitted
  - `eligibility_result_shown` - Result displayed with result type
  - `eligibility_cta_clicked` - CTA clicked with CTA type

**And** events include locale, device type, and session ID
**And** PII is not included in analytics

---

## Technical Implementation

### Files to Create/Modify

| File Path | Action | Description |
|-----------|--------|-------------|
| `app/[locale]/eligibility/page.tsx` | Create | Main eligibility page |
| `components/EligibilityFlow.tsx` | Create | Multi-step flow container |
| `components/eligibility/StepServiceInterest.tsx` | Create | Step 1 component |
| `components/eligibility/StepCurrentStatus.tsx` | Create | Step 2 component |
| `components/eligibility/StepTimeline.tsx` | Create | Step 3 component |
| `components/eligibility/StepLocation.tsx` | Create | Step 4 component |
| `components/eligibility/StepContact.tsx` | Create | Step 5 component |
| `components/eligibility/StepResult.tsx` | Create | Step 6 component |
| `components/eligibility/ProgressBar.tsx` | Create | Progress indicator |
| `components/eligibility/QuestionCard.tsx` | Create | Reusable question wrapper |
| `components/eligibility/OptionButton.tsx` | Create | Selection button component |
| `lib/eligibility-logic.ts` | Create | Eligibility calculation rules |
| `lib/eligibility-storage.ts` | Create | LocalStorage persistence |
| `lib/i18n.ts` | Modify | Add eligibility translations |

---

### State Management Structure

```typescript
// lib/eligibility-storage.ts

export interface EligibilityAnswers {
  serviceInterest?: 'visa' | 'residency' | 'citizenship' | 'documents' | 'not-sure';
  currentStatus?: string; // Varies based on serviceInterest
  timeline?: 'urgent' | 'soon' | 'flexible' | 'not-sure';
  location?: {
    country: string;
    city?: string;
  };
  contact?: {
    name: string;
    email: string;
    phone?: string;
  };
  consent?: boolean;
}

export interface EligibilityState {
  currentStep: number;
  answers: EligibilityAnswers;
  startedAt: string;
  locale: string;
}

const STORAGE_KEY = 'eligibility_progress';
const EXPIRY_HOURS = 24;

export function saveProgress(state: EligibilityState): void {
  const data = {
    ...state,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProgress(locale: string): EligibilityState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check expiry
    const savedAt = new Date(data.savedAt);
    const now = new Date();
    const hoursPassed = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursPassed > EXPIRY_HOURS) {
      clearProgress();
      return null;
    }
    
    // Check locale match
    if (data.locale !== locale) {
      return null; // Don't restore if locale changed
    }
    
    return data;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

### Eligibility Logic Engine

```typescript
// lib/eligibility-logic.ts

import { EligibilityAnswers } from './eligibility-storage';

export type EligibilityResult = 'likely-eligible' | 'may-need-review' | 'contact-for-assessment';

interface EligibilityRule {
  conditions: Partial<EligibilityAnswers>;
  result: EligibilityResult;
  priority: number; // Higher priority rules checked first
}

const rules: EligibilityRule[] = [
  // LIKELY ELIGIBLE rules
  {
    conditions: {
      serviceInterest: 'citizenship',
      currentStatus: 'married-to-brazilian',
    },
    result: 'likely-eligible',
    priority: 100,
  },
  {
    conditions: {
      serviceInterest: 'citizenship',
      currentStatus: 'brazilian-by-descent',
    },
    result: 'likely-eligible',
    priority: 100,
  },
  {
    conditions: {
      serviceInterest: 'residency',
      currentStatus: 'yes-temporary',
      timeline: 'soon',
    },
    result: 'likely-eligible',
    priority: 90,
  },
  {
    conditions: {
      serviceInterest: 'residency',
      currentStatus: 'yes-temporary',
      timeline: 'flexible',
    },
    result: 'likely-eligible',
    priority: 90,
  },
  {
    conditions: {
      serviceInterest: 'visa',
      currentStatus: 'tourist',
    },
    result: 'likely-eligible',
    priority: 80,
  },
  
  // MAY NEED REVIEW rules
  {
    conditions: {
      serviceInterest: 'citizenship',
      currentStatus: 'resident-4-years',
    },
    result: 'may-need-review',
    priority: 70,
  },
  {
    conditions: {
      serviceInterest: 'residency',
      currentStatus: 'no',
    },
    result: 'may-need-review',
    priority: 70,
  },
  {
    conditions: {
      serviceInterest: 'documents',
      currentStatus: 'legalization',
    },
    result: 'may-need-review',
    priority: 60,
  },
  {
    conditions: {
      serviceInterest: 'documents',
      currentStatus: 'apostille',
    },
    result: 'may-need-review',
    priority: 60,
  },
  
  // CONTACT FOR ASSESSMENT (catch-all and specific cases)
  {
    conditions: {
      serviceInterest: 'not-sure',
    },
    result: 'contact-for-assessment',
    priority: 50,
  },
  {
    conditions: {
      timeline: 'urgent',
      serviceInterest: 'citizenship',
    },
    result: 'contact-for-assessment',
    priority: 50,
  },
  {
    conditions: {
      serviceInterest: 'citizenship',
      currentStatus: 'none',
    },
    result: 'contact-for-assessment',
    priority: 50,
  },
];

export function calculateEligibility(answers: EligibilityAnswers): EligibilityResult {
  // Sort rules by priority (highest first)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    if (matchesConditions(answers, rule.conditions)) {
      return rule.result;
    }
  }
  
  // Default fallback
  return 'contact-for-assessment';
}

function matchesConditions(
  answers: EligibilityAnswers,
  conditions: Partial<EligibilityAnswers>
): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    const answerValue = answers[key as keyof EligibilityAnswers];
    if (answerValue !== value) {
      return false;
    }
  }
  return true;
}

export function getResultContent(result: EligibilityResult, locale: string) {
  const content = {
    'likely-eligible': {
      icon: 'check-circle',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      en: {
        heading: 'Good News! You Likely Qualify',
        description: 'Based on your answers, you appear to meet the basic criteria for this service. Book a consultation to discuss the next steps.',
        primaryCta: 'Book Your Consultation',
        secondaryCta: 'WhatsApp Us',
      },
      ar: {
        heading: 'أخبار سارة! من المرجح أنك مؤهل',
        description: 'بناءً على إجاباتك، يبدو أنك تستوفي المعايير الأساسية لهذه الخدمة. احجز استشارة لمناقشة الخطوات التالية.',
        primaryCta: 'احجز استشارتك',
        secondaryCta: 'واتساب',
      },
      es: {
        heading: '¡Buenas Noticias! Probablemente Calificas',
        description: 'Según tus respuestas, pareces cumplir con los criterios básicos para este servicio. Reserva una consulta para discutir los próximos pasos.',
        primaryCta: 'Reservar Consulta',
        secondaryCta: 'WhatsApp',
      },
      'pt-br': {
        heading: 'Boas Notícias! Você Provavelmente Se Qualifica',
        description: 'Com base nas suas respostas, você parece atender aos critérios básicos para este serviço. Agende uma consulta para discutir os próximos passos.',
        primaryCta: 'Agendar Consulta',
        secondaryCta: 'WhatsApp',
      },
    },
    'may-need-review': {
      icon: 'info-circle',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      en: {
        heading: 'Your Case Needs Review',
        description: 'Your situation may require additional documentation or verification. Schedule a free assessment to discuss your options.',
        primaryCta: 'Schedule Free Assessment',
        secondaryCta: 'Contact Us',
      },
      ar: {
        heading: 'حالتك تحتاج مراجعة',
        description: 'قد يتطلب وضعك وثائق إضافية أو تحقق. حدد موعدًا لتقييم مجاني لمناقشة خياراتك.',
        primaryCta: 'حدد موعد تقييم مجاني',
        secondaryCta: 'اتصل بنا',
      },
      es: {
        heading: 'Tu Caso Necesita Revisión',
        description: 'Tu situación puede requerir documentación adicional o verificación. Programa una evaluación gratuita para discutir tus opciones.',
        primaryCta: 'Programar Evaluación Gratuita',
        secondaryCta: 'Contáctanos',
      },
      'pt-br': {
        heading: 'Seu Caso Precisa de Revisão',
        description: 'Sua situação pode exigir documentação adicional ou verificação. Agende uma avaliação gratuita para discutir suas opções.',
        primaryCta: 'Agendar Avaliação Gratuita',
        secondaryCta: 'Entre em Contato',
      },
    },
    'contact-for-assessment': {
      icon: 'chat-bubble',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      en: {
        heading: "Let's Discuss Your Options",
        description: 'Your situation is unique and deserves personalized attention. Let us help you understand your options and create a plan.',
        primaryCta: 'Book a Consultation',
        secondaryCta: 'WhatsApp Us',
      },
      ar: {
        heading: 'دعنا نناقش خياراتك',
        description: 'وضعك فريد ويستحق اهتمامًا شخصيًا. دعنا نساعدك على فهم خياراتك وإنشاء خطة.',
        primaryCta: 'احجز استشارة',
        secondaryCta: 'واتساب',
      },
      es: {
        heading: 'Hablemos de Tus Opciones',
        description: 'Tu situación es única y merece atención personalizada. Permítenos ayudarte a entender tus opciones y crear un plan.',
        primaryCta: 'Reservar Consulta',
        secondaryCta: 'WhatsApp',
      },
      'pt-br': {
        heading: 'Vamos Discutir Suas Opções',
        description: 'Sua situação é única e merece atenção personalizada. Deixe-nos ajudá-lo a entender suas opções e criar um plano.',
        primaryCta: 'Agendar Consulta',
        secondaryCta: 'WhatsApp',
      },
    },
  };
  
  return {
    ...content[result],
    text: content[result][locale as keyof typeof content[typeof result]] || content[result].en,
  };
}
```

---

### EligibilityFlow Component

```typescript
// components/EligibilityFlow.tsx
'use client';

import { useState, useEffect } from 'react';
import { Locale, getTranslation } from '@/lib/i18n';
import { 
  EligibilityState, 
  EligibilityAnswers,
  saveProgress, 
  loadProgress, 
  clearProgress 
} from '@/lib/eligibility-storage';
import { calculateEligibility, EligibilityResult } from '@/lib/eligibility-logic';
import { ProgressBar } from './eligibility/ProgressBar';
import { StepServiceInterest } from './eligibility/StepServiceInterest';
import { StepCurrentStatus } from './eligibility/StepCurrentStatus';
import { StepTimeline } from './eligibility/StepTimeline';
import { StepLocation } from './eligibility/StepLocation';
import { StepContact } from './eligibility/StepContact';
import { StepResult } from './eligibility/StepResult';

interface EligibilityFlowProps {
  locale: Locale;
}

export function EligibilityFlow({ locale }: EligibilityFlowProps) {
  const [state, setState] = useState<EligibilityState>({
    currentStep: 1,
    answers: {},
    startedAt: new Date().toISOString(),
    locale,
  });
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedState, setSavedState] = useState<EligibilityState | null>(null);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = (key: string) => getTranslation(locale, key);
  
  // Check for saved progress on mount
  useEffect(() => {
    const saved = loadProgress(locale);
    if (saved && saved.currentStep > 1) {
      setSavedState(saved);
      setShowResumePrompt(true);
    }
  }, [locale]);
  
  // Save progress on state change
  useEffect(() => {
    if (state.currentStep > 1 && state.currentStep < 6) {
      saveProgress(state);
    }
  }, [state]);
  
  const handleResume = () => {
    if (savedState) {
      setState(savedState);
    }
    setShowResumePrompt(false);
  };
  
  const handleStartOver = () => {
    clearProgress();
    setState({
      currentStep: 1,
      answers: {},
      startedAt: new Date().toISOString(),
      locale,
    });
    setShowResumePrompt(false);
  };
  
  const updateAnswer = <K extends keyof EligibilityAnswers>(
    key: K,
    value: EligibilityAnswers[K]
  ) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [key]: value,
      },
    }));
  };
  
  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };
  
  const goNext = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };
  
  const goBack = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const eligibilityResult = calculateEligibility(state.answers);
    
    try {
      const response = await fetch('/api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.answers.contact?.name,
          contact: state.answers.contact?.email,
          phone: state.answers.contact?.phone,
          country: state.answers.location?.country,
          city: state.answers.location?.city,
          serviceType: state.answers.serviceInterest,
          answers: state.answers,
          eligibilityResult,
          consent: state.answers.consent,
          consentVersion: 'v1',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      // Clear saved progress on successful submit
      clearProgress();
      
      // Set result and move to result step
      setResult(eligibilityResult);
      goToStep(6);
      
    } catch (err) {
      setError(t('eligibility.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate total steps (may vary based on answers)
  const getTotalSteps = () => {
    // Step 2 is always shown, but content varies
    return 6;
  };
  
  // Resume prompt modal
  if (showResumePrompt) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h2 className="text-xl font-semibold mb-4">
          {t('eligibility.resumeTitle')}
        </h2>
        <p className="text-slate-600 mb-8">
          {t('eligibility.resumeDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleResume} className="btn-primary">
            {t('eligibility.resumeButton')}
          </button>
          <button onClick={handleStartOver} className="btn-secondary">
            {t('eligibility.startOverButton')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      {state.currentStep < 6 && (
        <ProgressBar 
          currentStep={state.currentStep} 
          totalSteps={getTotalSteps()} 
          locale={locale}
        />
      )}
      
      {/* Step Content */}
      <div className="mt-8">
        {state.currentStep === 1 && (
          <StepServiceInterest
            locale={locale}
            value={state.answers.serviceInterest}
            onChange={(v) => updateAnswer('serviceInterest', v)}
            onNext={goNext}
          />
        )}
        
        {state.currentStep === 2 && (
          <StepCurrentStatus
            locale={locale}
            serviceInterest={state.answers.serviceInterest}
            value={state.answers.currentStatus}
            onChange={(v) => updateAnswer('currentStatus', v)}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 3 && (
          <StepTimeline
            locale={locale}
            value={state.answers.timeline}
            onChange={(v) => updateAnswer('timeline', v)}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 4 && (
          <StepLocation
            locale={locale}
            value={state.answers.location}
            onChange={(v) => updateAnswer('location', v)}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 5 && (
          <StepContact
            locale={locale}
            value={state.answers.contact}
            consent={state.answers.consent}
            onChange={(v) => updateAnswer('contact', v)}
            onConsentChange={(v) => updateAnswer('consent', v)}
            onSubmit={handleSubmit}
            onBack={goBack}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
        
        {state.currentStep === 6 && result && (
          <StepResult
            locale={locale}
            result={result}
            answers={state.answers}
          />
        )}
      </div>
    </div>
  );
}
```

---

### Question Options Data

```typescript
// lib/eligibility-options.ts

export const serviceInterestOptions = [
  { id: 'visa', icon: 'passport' },
  { id: 'residency', icon: 'home' },
  { id: 'citizenship', icon: 'flag' },
  { id: 'documents', icon: 'document' },
  { id: 'not-sure', icon: 'question' },
];

export const statusOptions = {
  visa: [
    { id: 'tourist', icon: 'plane' },
    { id: 'business', icon: 'briefcase' },
    { id: 'no-visa', icon: 'x-circle' },
    { id: 'other', icon: 'dots' },
  ],
  residency: [
    { id: 'yes-temporary', icon: 'clock' },
    { id: 'yes-permanent', icon: 'check-circle' },
    { id: 'no', icon: 'x-circle' },
  ],
  citizenship: [
    { id: 'brazilian-by-descent', icon: 'family' },
    { id: 'married-to-brazilian', icon: 'heart' },
    { id: 'resident-4-years', icon: 'calendar' },
    { id: 'none', icon: 'x-circle' },
  ],
  documents: [
    { id: 'legalization', icon: 'stamp' },
    { id: 'translation', icon: 'language' },
    { id: 'apostille', icon: 'certificate' },
    { id: 'other', icon: 'dots' },
  ],
};

export const timelineOptions = [
  { id: 'urgent', icon: 'bolt' },
  { id: 'soon', icon: 'clock' },
  { id: 'flexible', icon: 'calendar' },
  { id: 'not-sure', icon: 'question' },
];

export const countries = [
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية', es: 'Arabia Saudita', 'pt-br': 'Arábia Saudita' } },
  { code: 'AE', name: { en: 'United Arab Emirates', ar: 'الإمارات', es: 'Emiratos Árabes', 'pt-br': 'Emirados Árabes' } },
  { code: 'BR', name: { en: 'Brazil', ar: 'البرازيل', es: 'Brasil', 'pt-br': 'Brasil' } },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة', es: 'Estados Unidos', 'pt-br': 'Estados Unidos' } },
  // ... more countries
  { code: 'OTHER', name: { en: 'Other', ar: 'أخرى', es: 'Otro', 'pt-br': 'Outro' } },
];
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `calculate-eligibility-likely` | Citizenship + married | Returns 'likely-eligible' |
| `calculate-eligibility-review` | Residency + no current | Returns 'may-need-review' |
| `calculate-eligibility-contact` | Not sure service | Returns 'contact-for-assessment' |
| `save-progress` | State saved to localStorage | Data persists |
| `load-progress` | Load saved state | State restored correctly |
| `load-expired-progress` | Load 25-hour-old state | Returns null |
| `clear-progress` | Clear localStorage | Storage cleared |

### Integration Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `full-flow-likely` | Complete flow with likely path | Result shows correctly |
| `back-navigation` | Go back through steps | Answers preserved |
| `conditional-step-2` | Select visa vs citizenship | Different questions shown |
| `form-submission` | Submit contact form | Lead created |
| `resume-flow` | Refresh and resume | Progress restored |

### E2E Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `mobile-full-flow` | Complete flow on mobile | All steps accessible |
| `rtl-flow` | Complete flow in Arabic | RTL renders correctly |
| `validation-errors` | Skip required fields | Errors display |
| `network-error` | Submit with API down | Error message shown |

---

## Edge Cases and Error Handling

### Edge Case 1: User Changes Step 1 Answer
- **Scenario:** User selects Visa, answers Step 2, goes back, changes to Citizenship
- **Handling:** Clear Step 2 answer, show new Step 2 question
- **User Impact:** Must re-answer Step 2

### Edge Case 2: Browser Storage Disabled
- **Scenario:** User has localStorage disabled
- **Handling:** Catch error, continue without persistence, warn user
- **User Impact:** Progress won't survive page refresh

### Edge Case 3: Multiple Tabs
- **Scenario:** User opens eligibility in two tabs
- **Handling:** Each tab has its own state, last submit wins
- **User Impact:** Could create duplicate leads (acceptable)

### Edge Case 4: Invalid Saved State
- **Scenario:** Saved state is corrupted or schema changed
- **Handling:** Clear progress, start fresh
- **User Impact:** Must restart flow

---

## Definition of Done

- [ ] All 6 steps render correctly
- [ ] Conditional logic works for all service types
- [ ] Progress saves and restores correctly
- [ ] RTL layout works for Arabic
- [ ] All text is localized
- [ ] Lead is created with all data
- [ ] Eligibility result is accurate
- [ ] Mobile-first design works
- [ ] Back/Next navigation works
- [ ] Validation errors display correctly
- [ ] Error handling for API failures
- [ ] Analytics events fire correctly
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Code reviewed and approved

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-30 | PM Agent | Initial story creation |

