import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Handles conditional classes and deduplicates Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID for DOM elements
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncates text to a specified length and adds an ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'INR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string to a readable format
 * @param dateString Date string or Date object
 * @param locale Locale string (default: 'en-IN')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, locale = 'en-IN'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * @param func The function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Scrolls the page to a specific element by ID
 * @param id The ID of the element to scroll to
 * @param options Scroll options (behavior and block)
 */
export function scrollToId(
  id: string,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView(options);
  }
}

/**
 * Copies text to the clipboard
 * @param text The text to copy
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Generates a random color in hexadecimal format
 * @returns A random hex color code
 */
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Checks if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Toggles fullscreen mode
 * @param element The element to make fullscreen (defaults to document.documentElement)
 */
export async function toggleFullscreen(element: HTMLElement = document.documentElement): Promise<void> {
  if (!document.fullscreenElement) {
    await element.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  }
}

/**
 * Formats a number with commas as thousand separators
 * @param num The number to format
 * @returns Formatted number string
 */
export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Capitalizes the first letter of a string
 * @param str The input string
 * @returns String with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to kebab-case
 * @param str The input string
 * @returns kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to camelCase
 * @param str The input string
 * @returns camelCased string
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:\w)(\w*)/g, (_, c) => c ? c.toLowerCase() : '')
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Converts a string to PascalCase
 * @param str The input string
 * @returns PascalCased string
 */
export function toPascalCase(str: string): string {
  return (str.match(/[a-zA-Z0-9]+/g) || [])
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
