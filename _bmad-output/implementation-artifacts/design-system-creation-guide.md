# Design System & Component Creation Guide

**Template for Creating a Comprehensive Design System**  
*Reusable prompt for future projects*

---

## 🎨 Design System Setup Instructions

Use this template when starting a new project that needs a complete design system with colors, components, and theming.

---

## Part 1: Color Palette Definition

### Step 1: Identify Brand Colors

**Prompt Template:**
```
Create a color palette for [PROJECT_NAME] based on [INSPIRATION_SOURCE].

Requirements:
- Primary color: [HEX_VALUE] - [DESCRIPTION/PURPOSE]
- Secondary color: [HEX_VALUE] - [DESCRIPTION/PURPOSE]  
- Accent color: [HEX_VALUE] - [DESCRIPTION/PURPOSE]
- Generate 10 shades for each (50, 100, 200...900)
- Provide HSL values for Tailwind CSS custom properties

Additional semantic colors needed:
- Success (green tones)
- Warning (yellow/orange tones)
- Error/Destructive (red tones)
- Muted/Gray scale

Format: CSS custom properties in HSL format for Tailwind
```

**Example from Brasil Legalize:**
```
Primary: #00b27f (Brazilian green) - Trust, growth, legal success
Secondary: #3d6ec3 (Brazilian blue) - Professionalism, stability  
Accent: #facc15 (Brazilian gold) - Energy, optimism, premium service
```

---

## Part 2: CSS Custom Properties (globals.css)

### Step 2: Create Design Token System

**Prompt Template:**
```css
Create a comprehensive CSS design token system in app/globals.css with:

1. COLOR TOKENS (HSL format for Tailwind):
   --color-primary-[50-900]: [HSL values for 10 shades]
   --color-secondary-[50-900]: [HSL values for 10 shades]
   --color-accent-[50-900]: [HSL values for 10 shades]

2. SEMANTIC TOKENS:
   --background: [light/dark values]
   --foreground: [text color]
   --primary: [maps to primary-500]
   --primary-foreground: [text on primary]
   --secondary: [maps to secondary-500]
   --secondary-foreground: [text on secondary]
   --muted: [subdued backgrounds]
   --muted-foreground: [subdued text]
   --accent: [accent-500]
   --accent-foreground: [text on accent]
   --destructive: [error states]
   --border: [default border color]
   --input: [form input borders]
   --ring: [focus ring color]
   --success: [success states]
   --warning: [warning states]
   --error: [error states]

3. SPACING/SIZING:
   --radius: [border radius default]

4. UTILITY CLASSES:
   .container - Max width container with responsive padding
   .card - Base card styling with borders/shadows
   .glass-card - Glassmorphism effect
   .btn - Base button styles
   .btn-primary, .btn-secondary, .btn-accent, .btn-outline, .btn-ghost
   .input - Form input styling
   .input-bordered - Input with borders
   .badge - Small pill-shaped labels
   .section - Page section spacing
   .section-title - Section heading styles (h1-h4)

5. RTL/LTR SUPPORT:
   [dir="rtl"] { text-align: right; }
   [dir="ltr"] { text-align: left; }

Theme: LIGHT ONLY (no dark mode)
Framework: Tailwind CSS
```

**Key Patterns:**
- Use HSL for colors (easier manipulation)
- Semantic naming over literal colors
- Component-based utility classes
- Direction-aware styles for RTL support

---

## Part 3: Tailwind Configuration

### Step 3: Extend Tailwind Config

**Prompt Template:**
```javascript
Update tailwind.config.ts to:

1. Extend colors to use CSS custom properties:
   colors: {
     primary: {
       50: 'hsl(var(--color-primary-50))',
       100: 'hsl(var(--color-primary-100))',
       // ... through 900
       DEFAULT: 'hsl(var(--color-primary-500))',
       foreground: 'hsl(var(--primary-foreground))',
     },
     // Repeat for secondary, accent
     background: 'hsl(var(--background))',
     foreground: 'hsl(var(--foreground))',
     // ... all semantic colors
   }

2. Add custom utilities:
   - Container max-widths
   - Custom animations
   - Typography scales

3. Configure font families:
   - Sans-serif for body
   - Optional: Arabic font support (if RTL needed)

4. Responsive breakpoints (if custom needed)
```

---

## Part 4: Component Architecture

### Step 4: Create Reusable Components

**Component Checklist:**

#### Navigation Components
```
1. SiteHeader.tsx
   - Logo
   - Main navigation links
   - Language switcher (if i18n)
   - Mobile hamburger menu
   - CTA button
   - RTL-aware layout
   - Sticky positioning with backdrop blur

2. SiteFooter.tsx
   - Brand info & description
   - Quick links (sitemap)
   - Legal links (privacy, terms)
   - Social media icons
   - Newsletter signup (optional)
   - Copyright notice
   - Multi-column responsive grid
```

#### Layout Components
```
3. Section.tsx
   - Wrapper with consistent spacing
   - Optional background variants
   - Container constraint
   - Props: title, subtitle, children, variant

4. Container.tsx (optional)
   - Max-width constraint
   - Responsive padding
```

#### UI Components
```
5. Button variations (can be CSS classes or components)
   - Primary, Secondary, Accent
   - Outline, Ghost
   - Sizes: sm, md, lg
   - Loading states
   - Disabled states

6. Card.tsx
   - Base card styling
   - Hover effects
   - Optional: Glass effect variant

7. Badge.tsx
   - Small labels/tags
   - Color variants

8. Input components (if needed)
   - Text inputs
   - Textareas
   - Selects
   - Checkboxes/Radios
```

#### Icon Components
```
9. Icon system approach:
   OPTION A: Inline SVG components
   - Create IconComponent.tsx for each icon
   - Accepts className prop
   - Stroke/fill configurable
   
   OPTION B: Icon library
   - Use lucide-react, heroicons, or similar
   - Tree-shakable imports

   Brasil Legalize used: Inline SVG components
```

---

## Part 5: Component Creation Pattern

### Step 5: Component Template

**Prompt Template for Each Component:**
```tsx
Create [COMPONENT_NAME] component for [PROJECT_NAME]:

Requirements:
- TypeScript with proper types
- Accepts locale prop (if i18n)
- RTL-aware styling (if needed)
- Responsive (mobile-first)
- Accessibility (ARIA labels, keyboard nav)
- Uses design tokens from globals.css
- Clean, documented code

Structure:
1. Imports
2. Type definitions
3. Icon components (if needed, inline SVG)
4. Main component
5. Export

Styling approach:
- Tailwind utility classes
- Use cn() helper for conditional classes
- Use design system colors (primary, secondary, etc.)
- Consistent spacing scale

Example structure:
```typescript
/**
 * [Component Name]
 * [Project Name]
 * 
 * [Brief description of component purpose]
 * 
 * @see lib/design-tokens.ts
 */

import { ... } from 'react';
import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  // Props with JSDoc comments
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  return (
    <element className={cn(
      "base-classes",
      "responsive-classes",
      conditionalClasses
    )}>
      {children}
    </element>
  );
}
```

---

## Part 6: Utility Functions

### Step 6: Essential Helpers

**Create lib/utils.ts:**
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Required packages:**
```bash
npm install clsx tailwind-merge
```

---

## Part 7: Typography System

### Step 7: Define Text Hierarchy

**Prompt Template:**
```css
Create typography scale in globals.css:

Headings:
- h1: [size] md:[size] lg:[size] - Hero titles
- h2: [size] md:[size] - Section titles  
- h3: [size] md:[size] - Subsection titles
- h4: [size] md:[size] - Card titles

Body text:
- Base: [size] [line-height]
- Small: [size]
- Large: [size]

Utilities:
- .text-balance - Balanced text wrapping
- .section-title - Consistent section heading
- .section-subtitle - Consistent section description

Font weights:
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

Include RTL font support if needed:
- .font-arabic for Arabic locales
```

---

## Part 8: Responsive Design Patterns

### Step 8: Mobile-First Approach

**Guidelines:**
```css
Breakpoints (Tailwind defaults):
- sm: 640px   (Small tablets)
- md: 768px   (Tablets)  
- lg: 1024px  (Small laptops)
- xl: 1280px  (Desktops)
- 2xl: 1536px (Large screens)

Pattern for each component:
1. Design for mobile FIRST (base classes)
2. Add tablet styles (md:)
3. Add desktop styles (lg:, xl:)

Example:
<div className="
  grid gap-4           /* mobile: stack */
  md:grid-cols-2       /* tablet: 2 columns */
  lg:grid-cols-3       /* desktop: 3 columns */
  xl:gap-8             /* desktop: larger gaps */
">
```

**Navigation Pattern:**
```
Mobile: Hamburger menu, full-screen overlay
Tablet+: Horizontal nav, visible links
```

---

## Part 9: Internationalization (i18n) Support

### Step 9: RTL/LTR Setup (if needed)

**Prompt Template:**
```typescript
Setup i18n in lib/i18n.ts:

1. Define locales:
   export const locales = ["ar", "en", "es", "pt-br"] as const;
   export type Locale = (typeof locales)[number];

2. Locale metadata:
   export const localeNames: Record<Locale, string> = { ... };
   export const localeDirections: Record<Locale, "ltr" | "rtl"> = { ... };

3. Helper functions:
   export function isRTL(locale: Locale): boolean
   export function getDirection(locale: Locale): "ltr" | "rtl"
   export function getDictionary(locale: Locale): Dictionary

4. Translation structure:
   interface Dictionary {
     brand: { name, tagline, description }
     nav: { home, about, services, ... }
     cta: { getStarted, learnMore, ... }
     // ... organized by page/section
   }

RTL Layout Requirements:
- Set dir="rtl" on root element for RTL locales
- Mirror horizontal layouts (flex-row-reverse)
- Flip icons that indicate direction
- Right-align text in RTL
- Use logical properties (start/end vs left/right)
```

---

## Part 10: Implementation Checklist

### Complete Setup Checklist

**When creating a new project, complete these steps:**

- [ ] **Colors**
  - [ ] Define brand colors (3-5 main colors)
  - [ ] Generate shade scale (50-900) for each
  - [ ] Create semantic color tokens
  - [ ] Add to globals.css as CSS custom properties
  - [ ] Extend Tailwind config

- [ ] **Typography**
  - [ ] Choose font families
  - [ ] Define heading scale (h1-h4)
  - [ ] Set body text sizes
  - [ ] Create utility classes

- [ ] **Spacing/Layout**
  - [ ] Define container max-width
  - [ ] Set consistent spacing scale
  - [ ] Create section/card components
  - [ ] Set border radius standards

- [ ] **Components**
  - [ ] SiteHeader (navigation)
  - [ ] SiteFooter
  - [ ] Button variations
  - [ ] Card/Container
  - [ ] Form inputs (if needed)
  - [ ] Icons system

- [ ] **Utilities**
  - [ ] Install clsx + tailwind-merge
  - [ ] Create cn() helper
  - [ ] Create component wrapper utilities

- [ ] **Theme**
  - [ ] Light mode styles
  - [ ] Dark mode (if needed)
  - [ ] RTL support (if needed)

- [ ] **Testing**
  - [ ] Test all breakpoints
  - [ ] Test all color combinations (contrast)
  - [ ] Test RTL (if applicable)
  - [ ] Validate accessibility

---

## 🎯 Quick Start Prompt

**Copy-paste prompt for AI assistance:**

```
Create a complete design system for [PROJECT_NAME] with the following:

BRAND IDENTITY:
- Primary color: [HEX] - [purpose]
- Secondary color: [HEX] - [purpose]  
- Accent color: [HEX] - [purpose]
- Style: [modern/classic/minimal/etc]
- Theme: [light only / light+dark]

REQUIREMENTS:
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- [RTL support needed: yes/no]
- [i18n needed: yes/no - languages: ...]

SETUP NEEDED:
1. globals.css with:
   - Color tokens (HSL format, 10 shades each)
   - Semantic colors (background, foreground, muted, etc.)
   - Component utility classes (btn, card, input, badge)
   - Typography scale
   - RTL/LTR direction styles [if needed]

2. tailwind.config.ts extending:
   - Custom colors using CSS variables
   - Typography
   - Container widths

3. Components to create:
   - SiteHeader (logo, nav, mobile menu, CTA)
   - SiteFooter (links, social, newsletter)
   - Section wrapper
   - Button variants (primary, secondary, outline, ghost)
   - Card component
   - [Other components needed: ...]

4. lib/utils.ts with cn() helper

5. [If i18n] lib/i18n.ts with:
   - Locale types and metadata
   - Translation dictionary structure
   - RTL detection helpers

DESIGN PRINCIPLES:
- Mobile-first responsive
- Consistent spacing (4/8/12/16/24/32/48/64px scale)
- Accessible (WCAG AA)
- Clean, modern aesthetic
- [Additional principles...]

Please create each file with complete implementation, proper TypeScript types, and inline documentation.
```

---

## 📋 File Structure Reference

**Typical design system structure:**

```
project/
├── app/
│   ├── globals.css              ← Design tokens + utilities
│   └── layout.tsx               ← Root layout with fonts
├── components/
│   ├── SiteHeader.tsx           ← Main navigation
│   ├── SiteFooter.tsx           ← Footer
│   ├── Section.tsx              ← Page sections
│   ├── ui/                      ← Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   └── icons/                   ← Icon components (if inline)
│       ├── IconArrow.tsx
│       ├── IconCheck.tsx
│       └── ...
├── lib/
│   ├── utils.ts                 ← cn() helper
│   ├── i18n.ts                  ← Translations (if i18n)
│   └── design-tokens.ts         ← Type definitions (optional)
├── tailwind.config.ts           ← Tailwind customization
└── package.json
```

---

## 🎨 Color Palette Examples

**Different project types:**

### SaaS Product
```
Primary: #6366f1 (Indigo) - Action, technology
Secondary: #8b5cf6 (Purple) - Premium, creativity
Accent: #10b981 (Green) - Success, growth
```

### E-commerce
```
Primary: #059669 (Emerald) - Trust, purchase
Secondary: #0891b2 (Cyan) - Fresh, modern
Accent: #f59e0b (Amber) - Urgency, deals
```

### Healthcare
```
Primary: #0ea5e9 (Sky Blue) - Care, trust
Secondary: #6366f1 (Indigo) - Professional
Accent: #10b981 (Green) - Health, wellness
```

### Legal/Finance
```
Primary: #1e40af (Navy) - Trust, authority
Secondary: #0369a1 (Blue) - Professional
Accent: #b45309 (Gold) - Premium, value
```

---

## 🔧 Advanced Patterns

### Glassmorphism Cards
```css
.glass-card {
  @apply rounded-xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm;
  @apply transition-all duration-300 hover:shadow-xl;
}
```

### Gradient Backgrounds
```css
.gradient-primary {
  @apply bg-gradient-to-br from-primary to-primary-600;
}

.gradient-radial {
  background: radial-gradient(circle at top right, 
    hsl(var(--color-primary-200)), 
    hsl(var(--background))
  );
}
```

### Animated Hover States
```css
.card-hover {
  @apply transition-all duration-300;
  @apply hover:scale-105 hover:shadow-xl;
}
```

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}
```

---

## 📚 Resources & References

**Tools:**
- [Tailwind Color Generator](https://uicolors.app/create)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [HSL Color Picker](https://hslpicker.com/)

**Inspiration:**
- [Tailwind UI](https://tailwindui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel Design](https://vercel.com/design)

**Documentation:**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Styling](https://nextjs.org/docs/app/building-your-application/styling)

---

## ✅ Success Criteria

Your design system is complete when:
- ✅ All colors defined with full shade scales
- ✅ CSS custom properties in globals.css
- ✅ Tailwind config extended
- ✅ Core components created (Header, Footer, Button, Card)
- ✅ Typography scale established
- ✅ Responsive on all screen sizes
- ✅ RTL support (if needed)
- ✅ Accessible (keyboard nav, focus states, ARIA)
- ✅ Consistent spacing throughout
- ✅ No hardcoded colors in components
- ✅ Documented and maintainable

---

## 💡 Pro Tips

1. **Start with colors first** - Everything else flows from the palette
2. **Use semantic naming** - `primary` not `green`, `destructive` not `red`
3. **Mobile-first always** - Design for smallest screen, enhance upward
4. **Test accessibility early** - Check contrast ratios as you define colors
5. **Keep it simple initially** - Start with 3 colors, expand if needed
6. **Document as you go** - Future you will thank you
7. **Use the cn() helper** - Makes conditional classes clean
8. **Consistent spacing scale** - Pick 4/8/12/16/24/32/48 and stick to it
9. **Test RTL early** - If supporting it, test from day one
10. **Reuse, don't repeat** - Create components for repeated patterns

---

**Last Updated:** January 30, 2026  
**Version:** 1.0  
**Based on:** Brasil Legalize Design System Implementation
