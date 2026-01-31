/**
 * Utility Functions
 * Brasil Legalize - Immigration Law Services
 *
 * Common utility functions used across the application.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * cn("px-4 py-2", "px-6") // "py-2 px-6"
 * cn("text-red-500", condition && "text-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date according to locale
 *
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: string = "ar",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  const localeMap: Record<string, string> = {
    ar: "ar-SA",
    en: "en-US",
    es: "es-ES",
    "pt-br": "pt-BR",
  };

  return new Intl.DateTimeFormat(localeMap[locale] || locale, options).format(dateObj);
}

/**
 * Format a number according to locale
 *
 * @param value - Number to format
 * @param locale - Locale for formatting
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: string = "ar",
  options: Intl.NumberFormatOptions = {}
): string {
  const localeMap: Record<string, string> = {
    ar: "ar-SA",
    en: "en-US",
    es: "es-ES",
    "pt-br": "pt-BR",
  };

  return new Intl.NumberFormat(localeMap[locale] || locale, options).format(value);
}

/**
 * Format currency value
 *
 * @param value - Value to format
 * @param currency - Currency code (default: BRL)
 * @param locale - Locale for formatting
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "BRL",
  locale: string = "pt-br"
): string {
  return formatNumber(value, locale, {
    style: "currency",
    currency,
  });
}

/**
 * Truncate text to a maximum length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default: "...")
 * @returns Truncated text
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Generate a slug from text
 *
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .trim();
}

/**
 * Debounce function execution
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Check if we're running on the server
 */
export const isServer = typeof window === "undefined";

/**
 * Check if we're running on the client
 */
export const isClient = !isServer;

/**
 * Safe JSON parse with fallback
 *
 * @param value - String to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Sleep/delay utility for async operations
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 *
 * @param length - Length of ID (default: 8)
 * @returns Random alphanumeric ID
 */
export function generateId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
