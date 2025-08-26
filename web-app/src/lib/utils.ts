import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a checksum for design tokens to detect drift
 */
export function generateTokenChecksum(tokens: Record<string, any>): string {
  const tokenString = JSON.stringify(tokens, Object.keys(tokens).sort());
  return btoa(tokenString).slice(0, 8);
}

/**
 * Validate if a color meets WCAG contrast requirements
 */
export function validateColorContrast(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // This is a simplified implementation
  // In production, you'd use a proper contrast calculation library
  const contrastRatio = calculateContrastRatio(foreground, background);
  return level === 'AA' ? contrastRatio >= 4.5 : contrastRatio >= 7;
}

/**
 * Calculate color contrast ratio (simplified)
 */
function calculateContrastRatio(color1: string, color2: string): number {
  // Simplified implementation
  // In production, convert to RGB, calculate luminance, then ratio
  return 4.5; // Placeholder - assume AA compliance
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}