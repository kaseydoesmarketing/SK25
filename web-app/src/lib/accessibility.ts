/**
 * SKTCH Design System - Accessibility Validation Suite
 * Ensures WCAG AAA compliance and mathematical precision
 */

export interface ColorContrastResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  grade: 'Fail' | 'Pass AA' | 'Pass AAA';
}

export interface AccessibilityAuditResult {
  score: number;
  issues: AccessibilityIssue[];
  recommendations: string[];
  timestamp: Date;
}

export interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  description: string;
  element?: string;
  suggestion: string;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): ColorContrastResult {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return {
      ratio: 0,
      wcagAA: false,
      wcagAAA: false,
      grade: 'Fail'
    };
  }

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    grade: ratio >= 7 ? 'Pass AAA' : ratio >= 4.5 ? 'Pass AA' : 'Fail'
  };
}

/**
 * SKTCH Design System Color Palette with Accessibility Data
 */
export const SKTCH_COLORS = {
  'deep-purple': '#210b4b',
  'electric-purple': '#6a2a98',
  'hot-pink': '#d81b60',
  'cool-blue': '#769bc1',
  'sun-gold': '#f4b961',
  'mint': '#b5e3d0',
  'coral': '#ec7567',
  'peach': '#f7d5bb',
  'soft-white': '#ffffff',
} as const;

/**
 * Validate all SKTCH color combinations
 */
export function validateSKTCHColorPalette(): Record<string, ColorContrastResult> {
  const results: Record<string, ColorContrastResult> = {};
  const colors = Object.entries(SKTCH_COLORS);

  // Test each color against white (primary text scenario)
  colors.forEach(([name, hex]) => {
    const key = `${name}-on-white`;
    results[key] = calculateContrastRatio(hex, '#ffffff');
  });

  // Test light colors on dark backgrounds
  const lightColors = ['mint', 'peach', 'sun-gold', 'cool-blue'];
  const darkColors = ['deep-purple', 'electric-purple'];

  lightColors.forEach(lightColor => {
    darkColors.forEach(darkColor => {
      const key = `${lightColor}-on-${darkColor}`;
      results[key] = calculateContrastRatio(
        SKTCH_COLORS[lightColor as keyof typeof SKTCH_COLORS],
        SKTCH_COLORS[darkColor as keyof typeof SKTCH_COLORS]
      );
    });
  });

  return results;
}

/**
 * Check if element meets touch target size requirements
 */
export function validateTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // 44px minimum for touch targets
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Validate focus indicators
 */
export function validateFocusIndicators(element: HTMLElement): boolean {
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  
  let hasValidFocus = true;
  
  focusableElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el as Element);
    const outline = computedStyle.outline;
    const boxShadow = computedStyle.boxShadow;
    
    // Check if element has visible focus indicator
    if (outline === 'none' && boxShadow === 'none') {
      hasValidFocus = false;
    }
  });
  
  return hasValidFocus;
}

/**
 * Check for proper heading hierarchy
 */
export function validateHeadingHierarchy(container: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  if (headings.length === 0) return issues;
  
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && currentLevel !== 1) {
      issues.push({
        severity: 'warning',
        rule: 'heading-hierarchy',
        description: 'First heading should be h1',
        element: heading.tagName.toLowerCase(),
        suggestion: 'Use h1 for the main page heading'
      });
    }
    
    if (currentLevel > previousLevel + 1) {
      issues.push({
        severity: 'error',
        rule: 'heading-hierarchy',
        description: `Heading levels should not skip. Found h${currentLevel} after h${previousLevel}`,
        element: heading.tagName.toLowerCase(),
        suggestion: `Use h${previousLevel + 1} instead of h${currentLevel}`
      });
    }
    
    previousLevel = currentLevel;
  });
  
  return issues;
}

/**
 * Check for alt text on images
 */
export function validateImageAltText(container: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const images = Array.from(container.querySelectorAll('img'));
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const role = img.getAttribute('role');
    
    if (!alt && !ariaLabel && role !== 'presentation') {
      issues.push({
        severity: 'error',
        rule: 'img-alt',
        description: 'Image missing alt text',
        element: 'img',
        suggestion: 'Add descriptive alt text or role="presentation" for decorative images'
      });
    }
  });
  
  return issues;
}

/**
 * Check for proper form labels
 */
export function validateFormLabels(container: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const formControls = Array.from(container.querySelectorAll('input, select, textarea'));
  
  formControls.forEach(control => {
    const id = control.getAttribute('id');
    const ariaLabel = control.getAttribute('aria-label');
    const ariaLabelledby = control.getAttribute('aria-labelledby');
    const type = control.getAttribute('type');
    
    // Skip hidden inputs and buttons
    if (type === 'hidden' || type === 'submit' || type === 'button') return;
    
    let hasLabel = false;
    
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      if (label) hasLabel = true;
    }
    
    if (ariaLabel || ariaLabelledby) hasLabel = true;
    
    if (!hasLabel) {
      issues.push({
        severity: 'error',
        rule: 'form-label',
        description: 'Form control missing label',
        element: control.tagName.toLowerCase(),
        suggestion: 'Add a <label> element or aria-label attribute'
      });
    }
  });
  
  return issues;
}

/**
 * Check for sufficient color contrast in computed styles
 */
export function validateComputedContrast(element: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const textElements = Array.from(element.querySelectorAll('*')).filter(el => {
    const text = el.textContent?.trim();
    return text && text.length > 0;
  });
  
  textElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    // Skip if we can't determine colors
    if (!color || !backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)') return;
    
    // Convert RGB/RGBA to hex for contrast calculation
    const colorHex = rgbToHex(color);
    const bgHex = rgbToHex(backgroundColor);
    
    if (colorHex && bgHex) {
      const contrast = calculateContrastRatio(colorHex, bgHex);
      
      if (!contrast.wcagAA) {
        issues.push({
          severity: 'error',
          rule: 'color-contrast',
          description: `Text has insufficient contrast ratio: ${contrast.ratio}:1`,
          element: el.tagName.toLowerCase(),
          suggestion: 'Ensure text has a contrast ratio of at least 4.5:1'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Convert RGB string to hex
 */
function rgbToHex(rgb: string): string | null {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return null;
  
  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Run complete accessibility audit on element
 */
export function runAccessibilityAudit(element: HTMLElement): AccessibilityAuditResult {
  const issues: AccessibilityIssue[] = [];
  const recommendations: string[] = [];
  
  // Run all validation checks
  issues.push(...validateHeadingHierarchy(element));
  issues.push(...validateImageAltText(element));
  issues.push(...validateFormLabels(element));
  issues.push(...validateComputedContrast(element));
  
  // Check focus indicators
  if (!validateFocusIndicators(element)) {
    issues.push({
      severity: 'error',
      rule: 'focus-visible',
      description: 'Some interactive elements lack visible focus indicators',
      suggestion: 'Ensure all focusable elements have clear focus indicators'
    });
  }
  
  // Generate recommendations
  const errorCount = issues.filter(issue => issue.severity === 'error').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;
  
  if (errorCount === 0 && warningCount === 0) {
    recommendations.push('Excellent accessibility! No issues found.');
  } else {
    if (errorCount > 0) {
      recommendations.push(`Fix ${errorCount} critical accessibility error${errorCount > 1 ? 's' : ''}`);
    }
    if (warningCount > 0) {
      recommendations.push(`Address ${warningCount} accessibility warning${warningCount > 1 ? 's' : ''}`);
    }
  }
  
  // Calculate score (0-100)
  const totalIssues = issues.length;
  const score = totalIssues === 0 ? 100 : Math.max(0, 100 - (errorCount * 15 + warningCount * 5));
  
  return {
    score,
    issues,
    recommendations,
    timestamp: new Date()
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

/**
 * Apply accessibility preferences to design system
 */
export function applyAccessibilityPreferences(): void {
  const root = document.documentElement;
  
  // Handle reduced motion
  if (prefersReducedMotion()) {
    root.style.setProperty('--sktch-duration-fast', '0.01ms');
    root.style.setProperty('--sktch-duration-normal', '0.01ms');
    root.style.setProperty('--sktch-duration-slow', '0.01ms');
    root.style.setProperty('--sktch-duration-slower', '0.01ms');
  }
  
  // Handle high contrast
  if (prefersHighContrast()) {
    root.style.setProperty('--sktch-deep-purple', '#000000');
    root.style.setProperty('--sktch-hot-pink', '#ff0066');
    root.style.setProperty('--sktch-soft-white', '#ffffff');
    root.style.setProperty('--sktch-glass-white', 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--sktch-glass-medium', 'rgba(255, 255, 255, 0.8)');
  }
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(auditResult: AccessibilityAuditResult): string {
  const { score, issues, recommendations, timestamp } = auditResult;
  
  let report = `
# SKTCH Design System - Accessibility Audit Report
**Generated:** ${timestamp.toISOString()}
**Score:** ${score}/100

## Summary
`;

  if (score >= 95) {
    report += '✅ **Excellent** - Your design system meets the highest accessibility standards.\n\n';
  } else if (score >= 80) {
    report += '✅ **Good** - Your design system is accessible with minor improvements needed.\n\n';
  } else if (score >= 60) {
    report += '⚠️ **Needs Improvement** - Several accessibility issues require attention.\n\n';
  } else {
    report += '❌ **Critical** - Significant accessibility barriers present.\n\n';
  }

  if (recommendations.length > 0) {
    report += '## Recommendations\n';
    recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += '\n';
  }

  if (issues.length > 0) {
    report += '## Issues Found\n\n';
    
    const errors = issues.filter(issue => issue.severity === 'error');
    const warnings = issues.filter(issue => issue.severity === 'warning');
    
    if (errors.length > 0) {
      report += '### ❌ Errors (Critical)\n';
      errors.forEach(issue => {
        report += `- **${issue.rule}**: ${issue.description}\n`;
        report += `  *Suggestion*: ${issue.suggestion}\n\n`;
      });
    }
    
    if (warnings.length > 0) {
      report += '### ⚠️ Warnings\n';
      warnings.forEach(issue => {
        report += `- **${issue.rule}**: ${issue.description}\n`;
        report += `  *Suggestion*: ${issue.suggestion}\n\n`;
      });
    }
  } else {
    report += '## 🎉 No Issues Found\n\nYour design system passes all accessibility checks!\n\n';
  }

  report += '---\n*Report generated by SKTCH Design System Accessibility Suite*';
  
  return report;
}

// Export validation functions for individual use
export const accessibilityValidators = {
  colorContrast: calculateContrastRatio,
  touchTargetSize: validateTouchTargetSize,
  focusIndicators: validateFocusIndicators,
  headingHierarchy: validateHeadingHierarchy,
  imageAltText: validateImageAltText,
  formLabels: validateFormLabels,
  computedContrast: validateComputedContrast,
};

// Export color palette validation
export const colorPaletteValidation = validateSKTCHColorPalette();