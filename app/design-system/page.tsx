'use client';

import { useState } from 'react';

// Brazilian Flag Inspired Color Palette (Professional Hues)
const colorPalette = {
  primary: {
    name: 'Brazilian Green',
    description: 'Professional teal-green inspired by Brazilian flag verde',
    shades: {
      50:  { hex: '#e6f7f2', name: 'Lightest' },
      100: { hex: '#b3e8d9', name: 'Lighter' },
      200: { hex: '#80d9c0', name: 'Light' },
      300: { hex: '#4dcaa7', name: 'Soft' },
      400: { hex: '#26be93', name: 'Medium Light' },
      500: { hex: '#00b27f', name: 'Base (Main)' },
      600: { hex: '#009a6e', name: 'Medium Dark' },
      700: { hex: '#00825d', name: 'Dark' },
      800: { hex: '#006a4c', name: 'Darker' },
      900: { hex: '#00523b', name: 'Darkest' },
      950: { hex: '#003326', name: 'Deep' },
    }
  },
  secondary: {
    name: 'Brazilian Blue',
    description: 'Professional navy-blue inspired by Brazilian flag azul',
    shades: {
      50:  { hex: '#e8eef8', name: 'Lightest' },
      100: { hex: '#c5d4ed', name: 'Lighter' },
      200: { hex: '#9eb7e1', name: 'Light' },
      300: { hex: '#779ad5', name: 'Soft' },
      400: { hex: '#5a84cc', name: 'Medium Light' },
      500: { hex: '#3d6ec3', name: 'Base (Main)' },
      600: { hex: '#345eb0', name: 'Medium Dark' },
      700: { hex: '#2a4d99', name: 'Dark' },
      800: { hex: '#213d82', name: 'Darker' },
      900: { hex: '#182d6b', name: 'Darkest' },
      950: { hex: '#0f1d4a', name: 'Deep' },
    }
  },
  accent: {
    name: 'Brazilian Gold',
    description: 'Professional gold-yellow inspired by Brazilian flag amarelo',
    shades: {
      50:  { hex: '#fefce8', name: 'Lightest' },
      100: { hex: '#fef9c3', name: 'Lighter' },
      200: { hex: '#fef08a', name: 'Light' },
      300: { hex: '#fde047', name: 'Soft' },
      400: { hex: '#facc15', name: 'Medium Light' },
      500: { hex: '#eab308', name: 'Base (Main)' },
      600: { hex: '#ca8a04', name: 'Medium Dark' },
      700: { hex: '#a16207', name: 'Dark' },
      800: { hex: '#854d0e', name: 'Darker' },
      900: { hex: '#713f12', name: 'Darkest' },
      950: { hex: '#422006', name: 'Deep' },
    }
  },
  neutral: {
    name: 'Warm Gray',
    description: 'Complementary neutral palette',
    shades: {
      50:  { hex: '#fafaf9', name: 'Lightest' },
      100: { hex: '#f5f5f4', name: 'Lighter' },
      200: { hex: '#e7e5e4', name: 'Light' },
      300: { hex: '#d6d3d1', name: 'Soft' },
      400: { hex: '#a8a29e', name: 'Medium' },
      500: { hex: '#78716c', name: 'Base' },
      600: { hex: '#57534e', name: 'Medium Dark' },
      700: { hex: '#44403c', name: 'Dark' },
      800: { hex: '#292524', name: 'Darker' },
      900: { hex: '#1c1917', name: 'Darkest' },
      950: { hex: '#0c0a09', name: 'Deep' },
    }
  },
};

const semanticColors = {
  success: { light: '#d1fae5', main: '#10b981', dark: '#047857' },
  warning: { light: '#fef3c7', main: '#f59e0b', dark: '#b45309' },
  error: { light: '#fee2e2', main: '#ef4444', dark: '#b91c1c' },
  info: { light: '#dbeafe', main: '#3b82f6', dark: '#1d4ed8' },
};

const selections = {
  fontFamily: { id: 'TYP-F1', name: 'Inter (Modern Sans)' },
  headingScale: { id: 'TYP-S2', name: 'Moderate (1.25)' },
  bodyText: { id: 'TYP-B2', name: 'Standard (16px, 1.5)' },
  primaryButton: { id: 'BTN-P2', name: 'Solid Rounded' },
  secondaryButton: { id: 'BTN-S5', name: 'Pill Outline' },
  buttonSize: { id: 'BTN-Z3', name: 'Medium' },
  buttonRadius: { id: 'BTN-R4', name: 'Rounded' },
  inputStyle: { id: 'INP-3', name: 'Filled' },
  inputFocus: { id: 'INP-F2', name: 'Ring' },
  inputSize: { id: 'INP-Z3', name: 'Medium (40px)' },
  cardStyle: { id: 'CRD-5', name: 'Glassmorphism' },
  cardRadius: { id: 'CRD-R3', name: 'Standard (lg)' },
  cardHover: { id: 'CRD-H4', name: 'Scale' },
  headerStyle: { id: 'NAV-H3', name: 'Transparent → Solid' },
  mobileMenu: { id: 'NAV-M2', name: 'Slide from Left' },
  sidebarStyle: { id: 'NAV-S2', name: 'Collapsible' },
  modalStyle: { id: 'MOD-1', name: 'Centered Card' },
  modalBackdrop: { id: 'MOD-B2', name: 'Light' },
  modalWidth: { id: 'MOD-W2', name: 'Standard (500px)' },
  tableStyle: { id: 'TBL-1', name: 'Simple' },
  tableHeader: { id: 'TBL-H5', name: 'Borderless' },
  badgeStyle: { id: 'BDG-2', name: 'Soft' },
  alertStyle: { id: 'ALT-2', name: 'Card' },
  toastPosition: { id: 'TST-2', name: 'Top Center' },
  spinnerStyle: { id: 'LDG-1', name: 'Circle Spin' },
  pageLoading: { id: 'LDG-P1', name: 'Full Screen Spinner' },
  iconLibrary: { id: 'ICO-5', name: 'Remix Icons' },
  iconStyle: { id: 'ICO-S1', name: 'Outline' },
  spacingScale: { id: 'SPC-3', name: 'Tailwind Default' },
  containerWidth: { id: 'CNT-2', name: 'Standard (1152px)' },
  formValidation: { id: 'FRM-V2', name: 'Tooltip' },
  pageTransitions: { id: 'ANI-1', name: 'Fade' },
  microInteractions: { id: 'ANI-M2', name: 'Subtle (200ms)' },
  progressTracker: { id: 'PRG-MIX', name: 'Mixed (Adaptive)' },
  fileUpload: { id: 'UPL-1', name: 'Drop Zone' },
  chartLibrary: { id: 'VIZ-4', name: 'Nivo' },
};

export default function DesignSystemPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'components' | 'preview'>('colors');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f2] via-white to-[#e8eef8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00b27f] via-[#3d6ec3] to-[#eab308] p-1">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1c1917]">Brasil Legalize Design System</h1>
                <p className="text-[#78716c] mt-1">Brazilian Flag Inspired • Professional Color Palette</p>
              </div>
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-full bg-[#00b27f]" title="Brazilian Green"></span>
                <span className="w-8 h-8 rounded-full bg-[#3d6ec3]" title="Brazilian Blue"></span>
                <span className="w-8 h-8 rounded-full bg-[#eab308]" title="Brazilian Gold"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 border-b border-[#e7e5e4]">
          {(['colors', 'components', 'preview'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'text-[#00b27f] border-b-2 border-[#00b27f]'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* COLORS TAB */}
        {activeTab === 'colors' && (
          <div className="space-y-12">
            {/* Main Color Palettes */}
            {Object.entries(colorPalette).map(([key, palette]) => (
              <div key={key} className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#1c1917]">{palette.name}</h2>
                  <p className="text-sm text-[#78716c]">{palette.description}</p>
                  <p className="text-xs text-[#a8a29e] mt-1">CSS Variable: <code className="bg-[#f5f5f4] px-1 rounded">--color-{key}-*</code></p>
                </div>
                <div className="grid grid-cols-11 gap-2">
                  {Object.entries(palette.shades).map(([shade, { hex, name }]) => (
                    <button
                      key={shade}
                      onClick={() => copyToClipboard(hex)}
                      className="group relative"
                      title={`${name} - ${hex}`}
                    >
                      <div
                        className="h-16 rounded-lg shadow-sm transition-transform hover:scale-110 hover:shadow-md"
                        style={{ backgroundColor: hex }}
                      />
                      <div className="mt-1 text-center">
                        <span className="text-xs font-medium text-[#44403c]">{shade}</span>
                        <span className={`block text-[10px] transition-opacity ${
                          copiedColor === hex ? 'text-[#00b27f]' : 'text-[#a8a29e]'
                        }`}>
                          {copiedColor === hex ? 'Copied!' : hex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Semantic Colors */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Semantic Colors</h2>
              <div className="grid grid-cols-4 gap-6">
                {Object.entries(semanticColors).map(([name, colors]) => (
                  <div key={name} className="space-y-2">
                    <h3 className="font-medium capitalize text-[#44403c]">{name}</h3>
                    <div className="space-y-1">
                      {Object.entries(colors).map(([variant, hex]) => (
                        <button
                          key={variant}
                          onClick={() => copyToClipboard(hex)}
                          className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#f5f5f4] transition"
                        >
                          <span className="w-8 h-8 rounded" style={{ backgroundColor: hex }}></span>
                          <span className="text-sm text-[#57534e] capitalize">{variant}</span>
                          <span className="text-xs text-[#a8a29e] ml-auto">{hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Copy Reference */}
            <div className="bg-[#1c1917] rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Copy - Tailwind Config</h2>
              <pre className="text-sm overflow-x-auto bg-[#0c0a09] p-4 rounded-lg">
{`// tailwind.config.ts
const colors = {
  primary: {
    50: '#e6f7f2',
    100: '#b3e8d9',
    200: '#80d9c0',
    300: '#4dcaa7',
    400: '#26be93',
    500: '#00b27f', // Main
    600: '#009a6e',
    700: '#00825d',
    800: '#006a4c',
    900: '#00523b',
  },
  secondary: {
    50: '#e8eef8',
    100: '#c5d4ed',
    200: '#9eb7e1',
    300: '#779ad5',
    400: '#5a84cc',
    500: '#3d6ec3', // Main
    600: '#345eb0',
    700: '#2a4d99',
    800: '#213d82',
    900: '#182d6b',
  },
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Main
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
}`}
              </pre>
            </div>
          </div>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === 'components' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-6">Selected Component Styles</h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(selections).map(([category, { id, name }]) => (
                  <div key={category} className="bg-[#f5f5f4] rounded-lg p-3">
                    <div className="text-xs text-[#78716c] uppercase tracking-wide">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="font-medium text-[#1c1917]">{name}</div>
                    <div className="text-xs text-[#a8a29e]">{id}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracker Mixed Styles */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Progress Tracker - Adaptive Styles</h2>
              <p className="text-[#78716c] mb-6">Uses different styles based on complexity:</p>
              
              <div className="space-y-8">
                {/* Simple: Progress Bar */}
                <div>
                  <h3 className="font-semibold text-[#44403c] mb-3">Simple (2-3 steps) → Progress Bar</h3>
                  <div className="bg-[#f5f5f4] rounded-lg p-4">
                    <div className="flex justify-between text-sm text-[#57534e] mb-2">
                      <span>Step 1 of 3</span>
                      <span>67%</span>
                    </div>
                    <div className="h-2 bg-[#e7e5e4] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00b27f] to-[#26be93] rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Standard: Horizontal Steps */}
                <div>
                  <h3 className="font-semibold text-[#44403c] mb-3">Standard (4-6 steps) → Horizontal Steps</h3>
                  <div className="bg-[#f5f5f4] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      {['Info', 'Documents', 'Review', 'Payment', 'Complete'].map((step, i) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            i < 2 ? 'bg-[#00b27f] text-white' :
                            i === 2 ? 'bg-[#3d6ec3] text-white' :
                            'bg-[#e7e5e4] text-[#78716c]'
                          }`}>
                            {i < 2 ? '✓' : i + 1}
                          </div>
                          {i < 4 && (
                            <div className={`w-16 h-1 mx-2 rounded ${
                              i < 2 ? 'bg-[#00b27f]' : 'bg-[#e7e5e4]'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {['Info', 'Documents', 'Review', 'Payment', 'Complete'].map((step, i) => (
                        <span key={step} className={`text-xs ${i <= 2 ? 'text-[#1c1917]' : 'text-[#a8a29e]'}`}>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Complex: Vertical Timeline */}
                <div>
                  <h3 className="font-semibold text-[#44403c] mb-3">Complex (7+ steps or detailed) → Vertical Timeline</h3>
                  <div className="bg-[#f5f5f4] rounded-lg p-4">
                    <div className="space-y-4">
                      {[
                        { title: 'Application Submitted', date: 'Jan 15, 2026', status: 'complete', desc: 'Initial application received' },
                        { title: 'Documents Uploaded', date: 'Jan 18, 2026', status: 'complete', desc: 'All required documents verified' },
                        { title: 'Under Review', date: 'Jan 22, 2026', status: 'current', desc: 'Legal team reviewing your case' },
                        { title: 'Payment Processing', date: 'Pending', status: 'pending', desc: 'Awaiting payment confirmation' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full ${
                              item.status === 'complete' ? 'bg-[#00b27f]' :
                              item.status === 'current' ? 'bg-[#3d6ec3] ring-4 ring-[#3d6ec3]/20' :
                              'bg-[#d6d3d1]'
                            }`}></div>
                            {i < 3 && <div className={`w-0.5 h-12 ${
                              item.status === 'complete' ? 'bg-[#00b27f]' : 'bg-[#d6d3d1]'
                            }`}></div>}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex justify-between">
                              <span className={`font-medium ${
                                item.status === 'pending' ? 'text-[#a8a29e]' : 'text-[#1c1917]'
                              }`}>{item.title}</span>
                              <span className="text-xs text-[#78716c]">{item.date}</span>
                            </div>
                            <p className="text-sm text-[#78716c]">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="space-y-8">
            {/* Buttons */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2.5 bg-[#00b27f] text-white font-medium rounded-full hover:bg-[#009a6e] hover:scale-[1.02] hover:shadow-lg transition-all">
                  Primary Button
                </button>
                <button className="px-6 py-2.5 border-2 border-[#00b27f] text-[#00b27f] font-medium rounded-full hover:bg-[#00b27f] hover:text-white hover:scale-[1.02] transition-all">
                  Secondary Button
                </button>
                <button className="px-6 py-2.5 bg-[#3d6ec3] text-white font-medium rounded-full hover:bg-[#345eb0] transition-all">
                  Blue Action
                </button>
                <button className="px-6 py-2.5 bg-[#eab308] text-white font-medium rounded-full hover:bg-[#ca8a04] transition-all">
                  Accent Button
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Inputs (Filled Style)</h2>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="h-10 px-4 bg-[#f5f5f4] rounded-md outline-none focus:ring-2 focus:ring-[#00b27f]/40 transition"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 px-4 bg-[#f5f5f4] rounded-md outline-none focus:ring-2 focus:ring-[#00b27f]/40 transition"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Cards (Glassmorphism + Scale Hover)</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { title: 'Immigration Services', color: '#00b27f', icon: '🌎' },
                  { title: 'Legal Consultation', color: '#3d6ec3', icon: '⚖️' },
                  { title: 'Document Processing', color: '#eab308', icon: '📄' },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-white/80 backdrop-blur-lg rounded-lg border border-white/50 p-6 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <div className="text-4xl mb-3">{card.icon}</div>
                    <h3 className="font-semibold text-[#1c1917]">{card.title}</h3>
                    <p className="text-sm text-[#78716c] mt-1">Professional services for your needs</p>
                    <div className="mt-4">
                      <span className="text-sm font-medium" style={{ color: card.color }}>Learn more →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Badges (Soft Style)</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#d1fae5] text-[#047857] text-sm font-medium rounded-md">Approved</span>
                <span className="px-3 py-1 bg-[#fef3c7] text-[#b45309] text-sm font-medium rounded-md">Pending</span>
                <span className="px-3 py-1 bg-[#fee2e2] text-[#b91c1c] text-sm font-medium rounded-md">Rejected</span>
                <span className="px-3 py-1 bg-[#dbeafe] text-[#1d4ed8] text-sm font-medium rounded-md">In Progress</span>
                <span className="px-3 py-1 bg-[#e6f7f2] text-[#00825d] text-sm font-medium rounded-md">Primary</span>
                <span className="px-3 py-1 bg-[#e8eef8] text-[#2a4d99] text-sm font-medium rounded-md">Secondary</span>
                <span className="px-3 py-1 bg-[#fefce8] text-[#a16207] text-sm font-medium rounded-md">Accent</span>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Alerts (Card Style)</h2>
              <div className="space-y-3">
                <div className="bg-[#d1fae5] border border-[#10b981]/20 text-[#047857] p-4 rounded-lg flex items-start gap-3">
                  <span className="text-xl">✓</span>
                  <div>
                    <div className="font-medium">Success</div>
                    <div className="text-sm opacity-80">Your documents have been submitted successfully.</div>
                  </div>
                </div>
                <div className="bg-[#dbeafe] border border-[#3b82f6]/20 text-[#1d4ed8] p-4 rounded-lg flex items-start gap-3">
                  <span className="text-xl">ℹ</span>
                  <div>
                    <div className="font-medium">Information</div>
                    <div className="text-sm opacity-80">Your case is currently under review.</div>
                  </div>
                </div>
                <div className="bg-[#fef3c7] border border-[#f59e0b]/20 text-[#b45309] p-4 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠</span>
                  <div>
                    <div className="font-medium">Warning</div>
                    <div className="text-sm opacity-80">Some documents are about to expire.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Spinner */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">Loading (Circle Spinner)</h2>
              <div className="flex items-center gap-8">
                <div className="w-8 h-8 border-4 border-[#00b27f]/30 border-t-[#00b27f] rounded-full animate-spin"></div>
                <div className="w-8 h-8 border-4 border-[#3d6ec3]/30 border-t-[#3d6ec3] rounded-full animate-spin"></div>
                <div className="w-8 h-8 border-4 border-[#eab308]/30 border-t-[#eab308] rounded-full animate-spin"></div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-[#1c1917] mb-4">File Upload (Drop Zone)</h2>
              <div className="border-2 border-dashed border-[#d6d3d1] rounded-lg p-8 text-center hover:border-[#00b27f] hover:bg-[#e6f7f2]/30 transition-colors cursor-pointer">
                <div className="text-4xl mb-2">📁</div>
                <div className="font-medium text-[#1c1917]">Drop files here or click to upload</div>
                <div className="text-sm text-[#78716c] mt-1">PDF, JPG, PNG up to 10MB</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#1c1917] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#a8a29e]">Brasil Legalize Design System v1.0</p>
          <p className="text-sm text-[#57534e] mt-1">Brazilian Flag Inspired • Green (#00b27f) • Blue (#3d6ec3) • Gold (#eab308)</p>
        </div>
      </div>
    </div>
  );
}
