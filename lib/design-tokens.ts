/**
 * Brasil Legalize - Design System Tokens
 * 
 * Brazilian Flag Inspired Color Palette (Professional Variations)
 * Original: Green #009c3b | Yellow #ffdf00 | Blue #002776
 * 
 * This file is the SINGLE SOURCE OF TRUTH for all design decisions.
 * Update colors here and they reflect across the entire application.
 */

// =============================================================================
// COLOR PALETTE - Brazilian Flag Inspired (Professional Hues)
// =============================================================================

export const colors = {
  // PRIMARY - Brazilian Green (Professional Teal-Green)
  primary: {
    50:  '#e6f7f2',
    100: '#b3e8d9',
    200: '#80d9c0',
    300: '#4dcaa7',
    400: '#26be93',
    500: '#00b27f', // Main primary
    600: '#009a6e',
    700: '#00825d',
    800: '#006a4c',
    900: '#00523b',
    950: '#003326',
  },

  // SECONDARY - Brazilian Blue (Professional Navy-Blue)
  secondary: {
    50:  '#e8eef8',
    100: '#c5d4ed',
    200: '#9eb7e1',
    300: '#779ad5',
    400: '#5a84cc',
    500: '#3d6ec3', // Main secondary
    600: '#345eb0',
    700: '#2a4d99',
    800: '#213d82',
    900: '#182d6b',
    950: '#0f1d4a',
  },

  // ACCENT - Brazilian Yellow (Professional Gold)
  accent: {
    50:  '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#f7dc6f',
    500: '#facc15', // Main accent
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // NEUTRAL - Warm Gray (Complementary)
  neutral: {
    50:  '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // SEMANTIC COLORS
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#047857',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#b45309',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1d4ed8',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // TYP-F1: Inter (Modern Sans)
  fontFamily: {
    heading: ['Inter', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },

  // TYP-S2: Moderate Scale (1.25)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.563rem', // 25px
    '3xl': '1.953rem', // 31px
    '4xl': '2.441rem', // 39px
    '5xl': '3.052rem', // 49px
  },

  // TYP-B2: Standard (16px, 1.5 line height)
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// =============================================================================
// SPACING - SPC-3: Tailwind Default
// =============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',      // BTN-R4: Rounded
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
  // Custom for glassmorphism (CRD-5)
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
} as const;

// =============================================================================
// TRANSITIONS - ANI-M2: Subtle (200ms)
// =============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// =============================================================================
// COMPONENT TOKENS (Based on Selections)
// =============================================================================

export const components = {
  // BTN-P2: Solid Rounded + BTN-S5: Pill Outline
  button: {
    primary: {
      bg: colors.primary[500],
      bgHover: colors.primary[600],
      text: '#ffffff',
      radius: borderRadius.full,
      shadow: 'hover:shadow-lg',
      transform: 'hover:scale-[1.02]',
    },
    secondary: {
      bg: 'transparent',
      border: `2px solid ${colors.primary[500]}`,
      text: colors.primary[500],
      radius: borderRadius.full,
      hoverBg: colors.primary[500],
      hoverText: '#ffffff',
    },
    // BTN-Z3: Medium
    size: {
      sm: { px: '0.75rem', py: '0.375rem', text: '0.875rem' },
      md: { px: '1rem', py: '0.5rem', text: '1rem' },
      lg: { px: '1.5rem', py: '0.75rem', text: '1.125rem' },
    },
  },

  // INP-3: Filled + INP-F2: Ring Focus + INP-Z3: Medium
  input: {
    bg: colors.neutral[100],
    border: 'none',
    radius: borderRadius.md,
    height: '2.5rem', // 40px
    focusRing: `0 0 0 2px ${colors.primary[500]}40`,
    placeholder: colors.neutral[400],
  },

  // CRD-5: Glassmorphism + CRD-R3: Standard + CRD-H4: Scale
  card: {
    bg: 'rgba(255, 255, 255, 0.8)',
    backdrop: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    radius: borderRadius.lg,
    hoverTransform: 'scale(1.02)',
  },

  // NAV-H3: Transparent → Solid
  header: {
    height: '4rem',
    bgInitial: 'transparent',
    bgScrolled: 'rgba(255, 255, 255, 0.95)',
    backdropScrolled: 'blur(12px)',
  },

  // NAV-M2: Slide from Left
  mobileMenu: {
    direction: 'left',
    width: '280px',
    bg: '#ffffff',
  },

  // NAV-S2: Collapsible Sidebar
  sidebar: {
    widthExpanded: '256px',
    widthCollapsed: '64px',
    bg: '#ffffff',
  },

  // MOD-1: Centered Card + MOD-B2: Light Backdrop + MOD-W2: 500px
  modal: {
    width: '500px',
    radius: borderRadius.xl,
    backdrop: 'rgba(0, 0, 0, 0.25)',
    animation: 'fade',
  },

  // TBL-1: Simple + TBL-H5: Borderless Header
  table: {
    headerBg: 'transparent',
    headerBorder: `1px solid ${colors.neutral[200]}`,
    rowDivider: `1px solid ${colors.neutral[100]}`,
  },

  // BDG-2: Soft Badges
  badge: {
    success: { bg: colors.success.light, text: colors.success.dark },
    warning: { bg: colors.warning.light, text: colors.warning.dark },
    error: { bg: colors.error.light, text: colors.error.dark },
    info: { bg: colors.info.light, text: colors.info.dark },
    neutral: { bg: colors.neutral[100], text: colors.neutral[700] },
  },

  // ALT-2: Card Alerts
  alert: {
    radius: borderRadius.lg,
    padding: '1rem',
  },

  // TST-2: Top Center Toast
  toast: {
    position: 'top-center',
  },

  // LDG-1: Circle Spinner + LDG-P1: Full Screen
  loading: {
    spinnerSize: '2rem',
    spinnerColor: colors.primary[500],
  },

  // PRG-MIXED: Adaptive Progress Tracker
  progressTracker: {
    // Simple: Progress Bar for basic flows
    simple: 'bar',
    // Standard: Horizontal steps for multi-step forms
    standard: 'horizontal-steps',
    // Complex: Vertical timeline for detailed processes
    complex: 'vertical-timeline',
  },

  // UPL-1: Drop Zone
  fileUpload: {
    borderStyle: 'dashed',
    borderColor: colors.neutral[300],
    hoverBorderColor: colors.primary[500],
    bg: colors.neutral[50],
  },
} as const;

// =============================================================================
// LAYOUT - CNT-2: Standard (1152px)
// =============================================================================

export const layout = {
  container: {
    maxWidth: '1152px',
    padding: '1rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// =============================================================================
// ICONS - ICO-5: Remix Icons + ICO-S1: Outline
// =============================================================================

export const icons = {
  library: 'remix-icons',
  style: 'outline',
  defaultSize: '1.25rem',
} as const;

// =============================================================================
// INTERNATIONALIZATION - Arabic RTL Default
// =============================================================================

export const i18n = {
  defaultLocale: 'ar',
  locales: ['ar', 'en', 'es', 'pt-br'],
  rtlLocales: ['ar'],
  direction: {
    ar: 'rtl',
    en: 'ltr',
    es: 'ltr',
    'pt-br': 'ltr',
  },
} as const;

// =============================================================================
// CHARTS - VIZ-4: Nivo
// =============================================================================

export const charts = {
  library: 'nivo',
  colors: [
    colors.primary[500],
    colors.secondary[500],
    colors.accent[500],
    colors.primary[300],
    colors.secondary[300],
    colors.accent[300],
  ],
} as const;

// =============================================================================
// FORM VALIDATION - FRM-V2: Tooltip
// =============================================================================

export const formValidation = {
  display: 'tooltip',
  errorColor: colors.error.DEFAULT,
  successColor: colors.success.DEFAULT,
} as const;

// =============================================================================
// PAGE TRANSITIONS - ANI-1: Fade
// =============================================================================

export const pageTransitions = {
  type: 'fade',
  duration: transitions.duration.normal,
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  components,
  layout,
  icons,
  charts,
  formValidation,
  pageTransitions,
} as const;

export default designTokens;
