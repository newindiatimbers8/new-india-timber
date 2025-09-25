// Re-export all utility functions and hooks
// This allows for cleaner imports like: import { cn, formatDate } from '@/utils'

// Export types and utilities from animation
export * from './animation';

// Export only specific utilities from ui to avoid conflicts
import { 
  cn, 
  generateId, 
  truncateText, 
  formatCurrency, 
  formatDate, 
  debounce, 
  throttle, 
  scrollToId, 
  copyToClipboard, 
  getRandomColor, 
  isMobileDevice, 
  toggleFullscreen, 
  formatNumberWithCommas, 
  capitalizeFirstLetter, 
  toKebabCase, 
  toCamelCase, 
  toPascalCase 
} from './ui';

export { 
  cn,
  generateId,
  truncateText,
  formatCurrency,
  formatDate,
  debounce,
  throttle,
  scrollToId,
  copyToClipboard,
  getRandomColor,
  isMobileDevice,
  toggleFullscreen,
  formatNumberWithCommas,
  capitalizeFirstLetter,
  toKebabCase,
  toCamelCase,
  toPascalCase
};

// Export types
export type * from './ui';
