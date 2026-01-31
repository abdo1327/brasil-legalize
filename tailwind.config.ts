import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 * Brasil Legalize - Brazilian Flag Inspired Colors
 *
 * Primary: #00b27f (Green)
 * Secondary: #3d6ec3 (Blue)
 * Accent: #facc15 (Gold)
 *
 * DEFAULT LOCALE: Arabic (RTL)
 */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brazilian Color Palette
        primary: {
          50: "#f0fdf9",
          100: "#ccfbeb",
          200: "#99f6d7",
          300: "#5cebbf",
          400: "#2ad9a3",
          500: "#00b27f", // Main green
          600: "#009166",
          700: "#007452",
          800: "#005c43",
          900: "#004c38",
          950: "#002b20",
          DEFAULT: "#00b27f",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#f0f5ff",
          100: "#e0ebff",
          200: "#c7d9fe",
          300: "#a0bdfc",
          400: "#7196f8",
          500: "#3d6ec3", // Main blue
          600: "#3158a8",
          700: "#294789",
          800: "#263c6e",
          900: "#24355c",
          950: "#19223d",
          DEFAULT: "#3d6ec3",
          foreground: "#ffffff",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15", // Main gold
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
          DEFAULT: "#facc15",
          foreground: "#1a1a1a",
        },
        // Semantic colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Status colors
        success: {
          DEFAULT: "#00b27f",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#facc15",
          foreground: "#1a1a1a",
        },
        error: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3d6ec3",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-noto-arabic)", "Noto Sans Arabic", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
