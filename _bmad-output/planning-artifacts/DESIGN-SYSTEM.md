# Brasil Legalize - Design System & Component Library

> **REFERENCE THIS FILE IN EVERY STORY** for consistent UI/UX across the application.
> 
> After completing the questionnaire at the end, update the `[SELECTED]` markers.

---

## Brand Foundation

### Brand Colors
```
Primary:    #004956 (Deep Teal)
Secondary:  #00A19D (Bright Teal)
Accent:     #F4C542 (Golden Yellow)
```

---

## 1. TYPOGRAPHY

### Font Family Options

| ID | Option | Font Stack | Use Case |
|----|--------|------------|----------|
| TYP-F1 | **Modern Sans** | `Inter, system-ui, sans-serif` | Clean, professional |
| TYP-F2 | **Humanist** | `Open Sans, Helvetica, sans-serif` | Friendly, approachable |
| TYP-F3 | **Geometric** | `Poppins, Arial, sans-serif` | Modern, bold |
| TYP-F4 | **Classic** | `Lato, Verdana, sans-serif` | Trustworthy, traditional |
| TYP-F5 | **Premium** | `Montserrat, Geneva, sans-serif` | Elegant, upscale |

**[SELECTED]: ___________**

### Heading Scale Options

| ID | Option | Scale Ratio | H1/H2/H3/H4/H5/H6 |
|----|--------|-------------|-------------------|
| TYP-S1 | **Compact** | 1.2 | 2rem / 1.67rem / 1.39rem / 1.16rem / 1rem / 0.83rem |
| TYP-S2 | **Moderate** | 1.25 | 2.44rem / 1.95rem / 1.56rem / 1.25rem / 1rem / 0.8rem |
| TYP-S3 | **Major Third** | 1.333 | 3.16rem / 2.37rem / 1.78rem / 1.33rem / 1rem / 0.75rem |
| TYP-S4 | **Perfect Fourth** | 1.414 | 4rem / 2.83rem / 2rem / 1.41rem / 1rem / 0.71rem |
| TYP-S5 | **Golden Ratio** | 1.618 | 6.85rem / 4.24rem / 2.62rem / 1.62rem / 1rem / 0.62rem |

**[SELECTED]: ___________**

### Body Text Options

| ID | Option | Size | Line Height | Letter Spacing |
|----|--------|------|-------------|----------------|
| TYP-B1 | **Compact** | 14px | 1.4 | 0 |
| TYP-B2 | **Standard** | 16px | 1.5 | 0 |
| TYP-B3 | **Readable** | 16px | 1.6 | 0.01em |
| TYP-B4 | **Spacious** | 18px | 1.7 | 0.02em |
| TYP-B5 | **Large** | 18px | 1.8 | 0.02em |

**[SELECTED]: ___________**

---

## 2. BUTTONS

### Primary Button Styles

| ID | Option | Style | Hover Effect |
|----|--------|-------|--------------|
| BTN-P1 | **Solid Flat** | `bg-primary text-white` | Darken 10% |
| BTN-P2 | **Solid Rounded** | `bg-primary text-white rounded-full` | Scale 1.02 + shadow |
| BTN-P3 | **Gradient** | `bg-gradient-to-r from-primary to-secondary` | Shift gradient |
| BTN-P4 | **3D Effect** | `bg-primary shadow-lg border-b-4 border-primary-dark` | Press down |
| BTN-P5 | **Glow** | `bg-primary shadow-primary/50` | Increase glow |

**[SELECTED]: ___________**

### Secondary Button Styles

| ID | Option | Style | Hover Effect |
|----|--------|-------|--------------|
| BTN-S1 | **Outline** | `border-2 border-primary text-primary` | Fill primary |
| BTN-S2 | **Ghost** | `text-primary bg-transparent` | Light bg |
| BTN-S3 | **Soft** | `bg-primary/10 text-primary` | bg-primary/20 |
| BTN-S4 | **Underline** | `text-primary border-b-2` | Border color change |
| BTN-S5 | **Pill Outline** | `border-2 border-primary rounded-full` | Fill + scale |

**[SELECTED]: ___________**

### Button Sizes

| ID | Option | Padding | Font Size | Min Width |
|----|--------|---------|-----------|-----------|
| BTN-Z1 | **Extra Small** | `px-2 py-1` | 12px | 60px |
| BTN-Z2 | **Small** | `px-3 py-1.5` | 14px | 80px |
| BTN-Z3 | **Medium** | `px-4 py-2` | 16px | 100px |
| BTN-Z4 | **Large** | `px-6 py-3` | 18px | 120px |
| BTN-Z5 | **Extra Large** | `px-8 py-4` | 20px | 150px |

**[SELECTED]: ___________**

### Button Border Radius

| ID | Option | Radius | Preview |
|----|--------|--------|---------|
| BTN-R1 | **None** | `rounded-none` | ▢ |
| BTN-R2 | **Subtle** | `rounded-sm` (2px) | ▢ slightly rounded |
| BTN-R3 | **Standard** | `rounded-md` (6px) | Common web |
| BTN-R4 | **Rounded** | `rounded-lg` (8px) | Modern feel |
| BTN-R5 | **Pill** | `rounded-full` | ⬭ Pill shape |

**[SELECTED]: ___________**

---

## 3. INPUT FIELDS

### Text Input Styles

| ID | Option | Style Description |
|----|--------|-------------------|
| INP-1 | **Underline Only** | No border, bottom line only, minimal |
| INP-2 | **Bordered** | Full border `border border-gray-300 rounded-md` |
| INP-3 | **Filled** | `bg-gray-100` background, no border |
| INP-4 | **Floating Label** | Label moves up on focus |
| INP-5 | **Pill** | Rounded full with padding `rounded-full` |

**[SELECTED]: ___________**

### Input Focus States

| ID | Option | Focus Effect |
|----|--------|--------------|
| INP-F1 | **Border Color** | `focus:border-primary` |
| INP-F2 | **Ring** | `focus:ring-2 focus:ring-primary/50` |
| INP-F3 | **Glow** | `focus:shadow-lg focus:shadow-primary/30` |
| INP-F4 | **Border + Ring** | Border primary + ring |
| INP-F5 | **Underline Grow** | Animated underline expands |

**[SELECTED]: ___________**

### Input Sizes

| ID | Option | Height | Padding | Font |
|----|--------|--------|---------|------|
| INP-Z1 | **Compact** | 32px | `px-2 py-1` | 14px |
| INP-Z2 | **Small** | 36px | `px-3 py-1.5` | 14px |
| INP-Z3 | **Medium** | 40px | `px-3 py-2` | 16px |
| INP-Z4 | **Large** | 48px | `px-4 py-3` | 16px |
| INP-Z5 | **Touch** | 56px | `px-4 py-4` | 18px |

**[SELECTED]: ___________**

---

## 4. CARDS

### Card Styles

| ID | Option | Style Description |
|----|--------|-------------------|
| CRD-1 | **Flat** | `bg-white` no shadow |
| CRD-2 | **Elevated** | `bg-white shadow-md` |
| CRD-3 | **Bordered** | `bg-white border border-gray-200` |
| CRD-4 | **Elevated + Border** | Shadow + subtle border |
| CRD-5 | **Glassmorphism** | `bg-white/80 backdrop-blur-lg` |

**[SELECTED]: ___________**

### Card Border Radius

| ID | Option | Radius |
|----|--------|--------|
| CRD-R1 | **None** | `rounded-none` |
| CRD-R2 | **Subtle** | `rounded-sm` |
| CRD-R3 | **Standard** | `rounded-lg` |
| CRD-R4 | **Large** | `rounded-xl` |
| CRD-R5 | **Extra Large** | `rounded-2xl` |

**[SELECTED]: ___________**

### Card Hover Effects

| ID | Option | Hover Effect |
|----|--------|--------------|
| CRD-H1 | **None** | Static |
| CRD-H2 | **Lift** | `hover:-translate-y-1 hover:shadow-lg` |
| CRD-H3 | **Border Highlight** | `hover:border-primary` |
| CRD-H4 | **Scale** | `hover:scale-[1.02]` |
| CRD-H5 | **Glow** | `hover:shadow-xl hover:shadow-primary/20` |

**[SELECTED]: ___________**

---

## 5. NAVIGATION

### Header Style

| ID | Option | Description |
|----|--------|-------------|
| NAV-H1 | **Fixed Solid** | Fixed top, solid bg |
| NAV-H2 | **Sticky Solid** | Sticky, solid bg |
| NAV-H3 | **Transparent → Solid** | Transparent, solid on scroll |
| NAV-H4 | **Blur Background** | `backdrop-blur-md bg-white/90` |
| NAV-H5 | **Floating** | Floating bar with margin |

**[SELECTED]: ___________**

### Mobile Menu Style

| ID | Option | Description |
|----|--------|-------------|
| NAV-M1 | **Hamburger → Slide Right** | Slides from right |
| NAV-M2 | **Hamburger → Slide Left** | Slides from left |
| NAV-M3 | **Hamburger → Full Screen** | Full screen overlay |
| NAV-M4 | **Bottom Sheet** | Slides up from bottom |
| NAV-M5 | **Dropdown** | Drops down below header |

**[SELECTED]: ___________**

### Sidebar Style (Admin/Portal)

| ID | Option | Description |
|----|--------|-------------|
| NAV-S1 | **Fixed Full** | Always visible, full width |
| NAV-S2 | **Collapsible** | Icons-only when collapsed |
| NAV-S3 | **Mini + Expand** | Mini icons, expand on hover |
| NAV-S4 | **Off-Canvas** | Hidden, toggle to show |
| NAV-S5 | **Floating** | Floating with rounded corners |

**[SELECTED]: ___________**

---

## 6. MODALS & DIALOGS

### Modal Style

| ID | Option | Description |
|----|--------|-------------|
| MOD-1 | **Centered Card** | Centered, rounded card |
| MOD-2 | **Slide from Right** | Panel slides from right |
| MOD-3 | **Slide from Bottom** | Sheet slides from bottom |
| MOD-4 | **Full Screen** | Full screen modal |
| MOD-5 | **Zoom In** | Scale animation from center |

**[SELECTED]: ___________**

### Modal Backdrop

| ID | Option | Backdrop Style |
|----|--------|----------------|
| MOD-B1 | **Dark** | `bg-black/50` |
| MOD-B2 | **Light** | `bg-black/25` |
| MOD-B3 | **Blur** | `backdrop-blur-sm bg-black/30` |
| MOD-B4 | **Heavy Blur** | `backdrop-blur-md bg-black/40` |
| MOD-B5 | **Gradient** | Gradient overlay |

**[SELECTED]: ___________**

### Modal Width

| ID | Option | Max Width |
|----|--------|-----------|
| MOD-W1 | **Narrow** | 400px |
| MOD-W2 | **Standard** | 500px |
| MOD-W3 | **Medium** | 600px |
| MOD-W4 | **Wide** | 800px |
| MOD-W5 | **Extra Wide** | 1000px |

**[SELECTED]: ___________**

---

## 7. TABLES

### Table Style

| ID | Option | Description |
|----|--------|-------------|
| TBL-1 | **Simple** | No borders, subtle row dividers |
| TBL-2 | **Bordered** | Full cell borders |
| TBL-3 | **Striped** | Alternating row colors |
| TBL-4 | **Hoverable** | Row highlight on hover |
| TBL-5 | **Card Rows** | Each row as separate card |

**[SELECTED]: ___________**

### Table Header Style

| ID | Option | Description |
|----|--------|-------------|
| TBL-H1 | **Subtle** | Light gray background |
| TBL-H2 | **Bold** | Dark/Primary background |
| TBL-H3 | **Sticky** | Sticky header on scroll |
| TBL-H4 | **Uppercase** | Uppercase, letter-spacing |
| TBL-H5 | **Borderless** | No bg, bottom border only |

**[SELECTED]: ___________**

---

## 8. BADGES & TAGS

### Badge Style

| ID | Option | Description |
|----|--------|-------------|
| BDG-1 | **Solid** | Solid background color |
| BDG-2 | **Soft** | Light bg (color/10) |
| BDG-3 | **Outline** | Border only |
| BDG-4 | **Pill** | Rounded-full solid |
| BDG-5 | **Dot + Text** | Colored dot before text |

**[SELECTED]: ___________**

### Status Badge Colors

| Status | Color Options |
|--------|---------------|
| Success/Approved | `green-500` / `emerald-500` |
| Warning/Pending | `amber-500` / `yellow-500` |
| Error/Rejected | `red-500` / `rose-500` |
| Info/Processing | `blue-500` / `cyan-500` |
| Neutral/Draft | `gray-500` / `slate-500` |

---

## 9. ALERTS & NOTIFICATIONS

### Alert Style

| ID | Option | Description |
|----|--------|-------------|
| ALT-1 | **Banner** | Full-width top banner |
| ALT-2 | **Card** | Rounded card with icon |
| ALT-3 | **Left Border** | Left color border accent |
| ALT-4 | **Minimal** | Icon + text only |
| ALT-5 | **Floating** | Fixed bottom-right toast |

**[SELECTED]: ___________**

### Toast Position

| ID | Option | Position |
|----|--------|----------|
| TST-1 | **Top Right** | `top-4 right-4` |
| TST-2 | **Top Center** | `top-4 left-1/2` |
| TST-3 | **Bottom Right** | `bottom-4 right-4` |
| TST-4 | **Bottom Center** | `bottom-4 left-1/2` |
| TST-5 | **Bottom Left** | `bottom-4 left-4` |

**[SELECTED]: ___________**

---

## 10. FORMS

### Form Layout

| ID | Option | Description |
|----|--------|-------------|
| FRM-1 | **Stacked** | Labels above inputs |
| FRM-2 | **Inline** | Labels beside inputs |
| FRM-3 | **Floating Labels** | Labels inside, float on focus |
| FRM-4 | **Grid 2-Column** | 2-column layout |
| FRM-5 | **Sections** | Grouped with headings |

**[SELECTED]: ___________**

### Form Validation Display

| ID | Option | Description |
|----|--------|-------------|
| FRM-V1 | **Below Input** | Error text below field |
| FRM-V2 | **Tooltip** | Tooltip on hover/focus |
| FRM-V3 | **Icon + Text** | Icon with text |
| FRM-V4 | **Border + Below** | Red border + text |
| FRM-V5 | **Shake Animation** | Shake + red border |

**[SELECTED]: ___________**

---

## 11. LOADING STATES

### Spinner Style

| ID | Option | Description |
|----|--------|-------------|
| LDG-1 | **Circle Spin** | Simple rotating circle |
| LDG-2 | **Dots Pulse** | Three pulsing dots |
| LDG-3 | **Bar Progress** | Horizontal bar |
| LDG-4 | **Skeleton** | Skeleton placeholder |
| LDG-5 | **Logo Pulse** | Brand logo pulsing |

**[SELECTED]: ___________**

### Page Loading

| ID | Option | Description |
|----|--------|-------------|
| LDG-P1 | **Full Screen Spinner** | Center screen spinner |
| LDG-P2 | **Top Bar** | NProgress-style top bar |
| LDG-P3 | **Skeleton Page** | Full skeleton layout |
| LDG-P4 | **Logo + Spinner** | Logo with spinner below |
| LDG-P5 | **Blur Previous** | Blur + spinner overlay |

**[SELECTED]: ___________**

---

## 12. ICONS

### Icon Library

| ID | Option | Library | Count |
|----|--------|---------|-------|
| ICO-1 | **Heroicons** | Heroicons | 450+ |
| ICO-2 | **Lucide** | Lucide React | 1000+ |
| ICO-3 | **Phosphor** | Phosphor Icons | 6000+ |
| ICO-4 | **Tabler** | Tabler Icons | 3000+ |
| ICO-5 | **Remix** | Remix Icons | 2400+ |

**[SELECTED]: ___________**

### Icon Style

| ID | Option | Style |
|----|--------|-------|
| ICO-S1 | **Outline** | Stroke only |
| ICO-S2 | **Solid** | Filled |
| ICO-S3 | **Duotone** | Two-tone |
| ICO-S4 | **Thin** | Thin stroke |
| ICO-S5 | **Bold** | Thick stroke |

**[SELECTED]: ___________**

---

## 13. SPACING & LAYOUT

### Spacing Scale

| ID | Option | Base | Scale |
|----|--------|------|-------|
| SPC-1 | **Compact** | 4px | 4, 8, 12, 16, 24, 32 |
| SPC-2 | **Standard** | 4px | 4, 8, 16, 24, 32, 48 |
| SPC-3 | **Tailwind Default** | 4px | 4, 8, 12, 16, 20, 24... |
| SPC-4 | **Generous** | 8px | 8, 16, 24, 32, 48, 64 |
| SPC-5 | **Spacious** | 8px | 8, 16, 32, 48, 64, 96 |

**[SELECTED]: ___________**

### Container Width

| ID | Option | Max Width |
|----|--------|-----------|
| CNT-1 | **Narrow** | 960px |
| CNT-2 | **Standard** | 1152px |
| CNT-3 | **Wide** | 1280px |
| CNT-4 | **Extra Wide** | 1440px |
| CNT-5 | **Full** | 100% with padding |

**[SELECTED]: ___________**

---

## 14. ANIMATIONS

### Page Transitions

| ID | Option | Effect |
|----|--------|--------|
| ANI-1 | **Fade** | Fade in/out |
| ANI-2 | **Slide Up** | Slide from bottom |
| ANI-3 | **Slide Right** | Slide from left |
| ANI-4 | **Scale** | Scale from 0.95 |
| ANI-5 | **None** | No animation |

**[SELECTED]: ___________**

### Micro-interactions

| ID | Option | Description |
|----|--------|-------------|
| ANI-M1 | **Minimal** | Only essential (focus, hover) |
| ANI-M2 | **Subtle** | Soft transitions (200ms) |
| ANI-M3 | **Moderate** | Noticeable (300ms) |
| ANI-M4 | **Playful** | Bouncy, spring effects |
| ANI-M5 | **Rich** | Full animations everywhere |

**[SELECTED]: ___________**

---

## 15. SPECIAL COMPONENTS

### Progress Tracker Style

| ID | Option | Description |
|----|--------|-------------|
| PRG-1 | **Horizontal Steps** | Circles connected by line |
| PRG-2 | **Vertical Timeline** | Vertical with content |
| PRG-3 | **Progress Bar** | Simple horizontal bar |
| PRG-4 | **Numbered Pills** | Numbered pill badges |
| PRG-5 | **Breadcrumb Style** | Chevron separators |

**[SELECTED]: ___________**

### File Upload Style

| ID | Option | Description |
|----|--------|-------------|
| UPL-1 | **Drop Zone** | Dashed border, drag area |
| UPL-2 | **Button Only** | Simple file button |
| UPL-3 | **Card + Button** | Card with icon + button |
| UPL-4 | **Inline** | Inline with file list |
| UPL-5 | **Full Zone + Preview** | Large zone with previews |

**[SELECTED]: ___________**

### Data Visualization

| ID | Option | Library |
|----|--------|---------|
| VIZ-1 | **Recharts** | React-based, simple |
| VIZ-2 | **Chart.js** | Canvas-based, popular |
| VIZ-3 | **ApexCharts** | Modern, interactive |
| VIZ-4 | **Nivo** | React + D3, beautiful |
| VIZ-5 | **Tremor** | Tailwind-native |

**[SELECTED]: ___________**

---

# QUESTIONNAIRE

> **Answer each question to determine your design system selections.**
> Once completed, update the `[SELECTED]` markers above.

---

## Q1. Brand Personality
What feeling should the site convey?

- [ ] A) **Professional & Trustworthy** - Clean, conservative, inspires confidence
- [ ] B) **Modern & Innovative** - Bold, fresh, cutting-edge
- [ ] C) **Friendly & Approachable** - Warm, inviting, human
- [ ] D) **Premium & Elegant** - Sophisticated, upscale, refined
- [ ] E) **Simple & Minimal** - No frills, content-focused

---

## Q2. Typography Character
What text style fits best?

- [ ] A) **Clean & Neutral** (Inter) - Versatile, professional
- [ ] B) **Friendly & Open** (Open Sans) - Easy to read, welcoming
- [ ] C) **Bold & Geometric** (Poppins) - Modern, strong presence
- [ ] D) **Classic & Reliable** (Lato) - Timeless, stable
- [ ] E) **Elegant & Refined** (Montserrat) - Premium feel

---

## Q3. Button Personality
How should buttons feel?

- [ ] A) **Clean & Flat** - Minimalist, no effects
- [ ] B) **Rounded & Soft** - Friendly, approachable
- [ ] C) **Gradient & Bold** - Eye-catching, modern
- [ ] D) **3D & Tactile** - Physical, clickable feel
- [ ] E) **Glowing & Premium** - Standout, high-end

---

## Q4. Form Input Style
How should form fields look?

- [ ] A) **Minimal Underline** - Clean, Google-style
- [ ] B) **Bordered Box** - Traditional, clear boundaries
- [ ] C) **Filled Background** - Material-style, modern
- [ ] D) **Floating Labels** - Elegant, space-efficient
- [ ] E) **Pill Shaped** - Friendly, unique

---

## Q5. Card Treatment
How should content cards appear?

- [ ] A) **Flat & Clean** - Content-focused, no shadow
- [ ] B) **Elevated** - Clear hierarchy with shadow
- [ ] C) **Bordered** - Defined edges, structured
- [ ] D) **Glass Effect** - Modern, translucent
- [ ] E) **Interactive Lift** - Cards that respond to hover

---

## Q6. Navigation Behavior
How should the header behave?

- [ ] A) **Always Visible Fixed** - Always accessible
- [ ] B) **Sticky Standard** - Scrolls then sticks
- [ ] C) **Transparent Hero** - Blends with hero, solid on scroll
- [ ] D) **Blur Background** - Modern glass effect
- [ ] E) **Floating Bar** - Detached, premium feel

---

## Q7. Mobile Menu Preference
How should mobile navigation work?

- [ ] A) **Slide from Right** - Standard, expected
- [ ] B) **Slide from Left** - Classic drawer
- [ ] C) **Full Screen Overlay** - Immersive, bold
- [ ] D) **Bottom Sheet** - Thumb-friendly, mobile-native
- [ ] E) **Simple Dropdown** - Quick, no overlay

---

## Q8. Modal Presentation
How should modals/dialogs appear?

- [ ] A) **Center Pop** - Classic, centered
- [ ] B) **Slide Right Panel** - More content space
- [ ] C) **Bottom Sheet** - Mobile-friendly
- [ ] D) **Full Screen** - Maximum focus
- [ ] E) **Zoom Animation** - Smooth, modern

---

## Q9. Loading Feedback
How should loading states look?

- [ ] A) **Simple Spinner** - Quick, unobtrusive
- [ ] B) **Dots Animation** - Friendly, playful
- [ ] C) **Progress Bar** - Informative, linear
- [ ] D) **Skeleton Screens** - Content-shaped placeholders
- [ ] E) **Brand Animation** - On-brand, premium

---

## Q10. Animation Level
How much animation/motion?

- [ ] A) **Minimal** - Only essential feedback
- [ ] B) **Subtle** - Smooth but not distracting
- [ ] C) **Moderate** - Noticeable, enhances UX
- [ ] D) **Playful** - Bouncy, personality
- [ ] E) **Rich** - Full motion design

---

## Q11. Admin Sidebar Style
How should admin sidebar work?

- [ ] A) **Always Full Width** - All labels visible
- [ ] B) **Collapsible Icons** - Toggle between full/icons
- [ ] C) **Mini + Expand Hover** - Space-efficient
- [ ] D) **Hidden Off-Canvas** - Maximum content area
- [ ] E) **Floating Panel** - Modern, detached

---

## Q12. Table Presentation
How should data tables look?

- [ ] A) **Clean Minimal** - Simple dividers only
- [ ] B) **Full Bordered** - Clear cell boundaries
- [ ] C) **Striped Rows** - Easy row tracking
- [ ] D) **Hover Highlight** - Interactive feedback
- [ ] E) **Card-Based Rows** - Modern, mobile-friendly

---

## Q13. Chart/Visualization Library
Which chart library to use?

- [ ] A) **Recharts** - Simple, React-native
- [ ] B) **Chart.js** - Lightweight, popular
- [ ] C) **ApexCharts** - Feature-rich, interactive
- [ ] D) **Nivo** - Beautiful, D3-powered
- [ ] E) **Tremor** - Tailwind-native, modern

---

## Q14. Icon Library
Which icon set to use?

- [ ] A) **Heroicons** - By Tailwind team, minimal
- [ ] B) **Lucide** - Clean, comprehensive
- [ ] C) **Phosphor** - Flexible, many styles
- [ ] D) **Tabler** - Consistent, large set
- [ ] E) **Remix** - Full-featured, reliable

---

## Q15. Overall Corner Radius Philosophy
How rounded should elements be?

- [ ] A) **Sharp** - No or minimal radius (0-2px)
- [ ] B) **Subtle** - Slight rounding (4px)
- [ ] C) **Standard** - Comfortable (6-8px)
- [ ] D) **Rounded** - Noticeably curved (12px)
- [ ] E) **Fully Rounded** - Pills and circles

---

# SELECTION SUMMARY

After completing the questionnaire, fill in your final selections:

| Category | Selection ID | Choice |
|----------|--------------|--------|
| Font Family | | |
| Heading Scale | | |
| Body Text | | |
| Primary Button | | |
| Secondary Button | | |
| Button Size | | |
| Button Radius | | |
| Input Style | | |
| Input Focus | | |
| Input Size | | |
| Card Style | | |
| Card Radius | | |
| Card Hover | | |
| Header Style | | |
| Mobile Menu | | |
| Sidebar Style | | |
| Modal Style | | |
| Modal Backdrop | | |
| Modal Width | | |
| Table Style | | |
| Table Header | | |
| Badge Style | | |
| Alert Style | | |
| Toast Position | | |
| Form Layout | | |
| Form Validation | | |
| Spinner Style | | |
| Page Loading | | |
| Icon Library | | |
| Icon Style | | |
| Spacing Scale | | |
| Container Width | | |
| Page Transitions | | |
| Micro-interactions | | |
| Progress Tracker | | |
| File Upload | | |
| Chart Library | | |

---

# QUICK REFERENCE (After Selection)

```typescript
// tailwind.config.ts - Add after selections made

const designTokens = {
  fonts: {
    heading: '', // e.g., 'Poppins'
    body: '',    // e.g., 'Inter'
  },
  radius: {
    sm: '',
    md: '',
    lg: '',
    full: '',
  },
  shadows: {
    card: '',
    modal: '',
    button: '',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
};
```

---

> **This document must be referenced in every story's implementation.**
> 
> Keep consistent by always checking selections before building components.
