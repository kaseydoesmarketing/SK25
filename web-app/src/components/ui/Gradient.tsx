'use client';

import { forwardRef, HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   GRADIENT SYSTEM UTILITIES
   ============================================ */

export type GradientDirection = 
  | 'to-r' | 'to-l' | 'to-t' | 'to-b'
  | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl'
  | 'radial' | 'conic';

export type SKTCHGradientType = 
  | 'primary'
  | 'pulse' 
  | 'cool-blue'
  | 'sun-gold'
  | 'mint'
  | 'coral'
  | 'glass'
  | 'glass-strong'
  | 'custom';

export interface GradientProps extends HTMLAttributes<HTMLDivElement> {
  /** SKTCH gradient preset */
  variant?: SKTCHGradientType;
  /** Gradient direction */
  direction?: GradientDirection;
  /** Custom gradient colors (for variant="custom") */
  colors?: string[];
  /** Custom gradient stops */
  stops?: number[];
  /** Whether gradient should animate */
  animate?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Additional className */
  className?: string;
  /** Children content */
  children?: ReactNode;
}

/** Predefined SKTCH gradient configurations */
const SKTCH_GRADIENTS: Record<Exclude<SKTCHGradientType, 'custom'>, string[]> = {
  primary: ['#210b4b', '#6a2a98', '#ff3d94'],
  pulse: ['#ff3d94', '#6a2a98', '#210b4b'],
  'cool-blue': ['#769bc1', '#5a7a9a'],
  'sun-gold': ['#f4b961', '#e6a54a'],
  mint: ['#b5e3d0', '#9dd6c4'],
  coral: ['#ec7567', '#d65a4a'],
  glass: ['rgba(255, 255, 255, 0.1)', 'rgba(33, 11, 75, 0.2)'],
  'glass-strong': ['rgba(255, 255, 255, 0.2)', 'rgba(33, 11, 75, 0.3)']
};

/** Convert direction to CSS gradient direction */
const getGradientDirection = (direction: GradientDirection): string => {
  const directions: Record<GradientDirection, string> = {
    'to-r': '90deg',
    'to-l': '270deg', 
    'to-t': '0deg',
    'to-b': '180deg',
    'to-tr': '45deg',
    'to-tl': '315deg',
    'to-br': '135deg',
    'to-bl': '225deg',
    'radial': 'circle',
    'conic': 'from 0deg'
  };
  return directions[direction];
};

/** Generate gradient CSS */
const generateGradientCSS = (
  variant: SKTCHGradientType,
  direction: GradientDirection,
  customColors?: string[],
  customStops?: number[]
): string => {
  let colors: string[];
  
  if (variant === 'custom' && customColors) {
    colors = customColors;
  } else {
    colors = SKTCH_GRADIENTS[variant as keyof typeof SKTCH_GRADIENTS];
  }

  const colorStops = colors.map((color, index) => {
    const stop = customStops?.[index] ?? (index * (100 / (colors.length - 1)));
    return `${color} ${stop}%`;
  }).join(', ');

  const dir = getGradientDirection(direction);

  if (direction === 'radial') {
    return `radial-gradient(${dir}, ${colorStops})`;
  } else if (direction === 'conic') {
    return `conic-gradient(${dir}, ${colorStops})`;
  } else {
    return `linear-gradient(${dir}, ${colorStops})`;
  }
};

export const Gradient = forwardRef<HTMLDivElement, GradientProps>(
  ({
    variant = 'primary',
    direction = 'to-br',
    colors,
    stops,
    animate = false,
    animationDuration = 3,
    className,
    children,
    style,
    ...props
  }, ref) => {
    
    const gradientCSS = generateGradientCSS(variant, direction, colors, stops);
    
    const gradientStyle: CSSProperties = {
      background: gradientCSS,
      ...style
    };

    // Animated gradient for special effects
    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn('relative overflow-hidden', className)}
          style={{
            ...gradientStyle,
            backgroundSize: direction.startsWith('to-') ? '400% 400%' : '100% 100%'
          }}
          animate={{
            backgroundPosition: direction === 'to-r' || direction === 'to-l' 
              ? ['0% 50%', '100% 50%', '0% 50%']
              : ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear"
          }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        style={gradientStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Gradient.displayName = 'Gradient';

/* ============================================
   GRADIENT TEXT COMPONENT
   ============================================ */

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** SKTCH gradient preset */
  variant?: SKTCHGradientType;
  /** Gradient direction */
  direction?: GradientDirection;
  /** Custom gradient colors */
  colors?: string[];
  /** Whether text should animate */
  animate?: boolean;
  /** Additional className */
  className?: string;
  /** Children text content */
  children: ReactNode;
}

export const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  ({
    variant = 'primary',
    direction = 'to-r',
    colors,
    animate = false,
    className,
    children,
    style,
    ...props
  }, ref) => {
    
    const gradientCSS = generateGradientCSS(variant, direction, colors);
    
    const textStyle: CSSProperties = {
      background: gradientCSS,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      ...style
    };

    if (animate) {
      return (
        <motion.span
          ref={ref}
          className={cn('font-semibold', className)}
          style={{
            ...textStyle,
            backgroundSize: '400% 400%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          {...props}
        >
          {children}
        </motion.span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn('font-semibold', className)}
        style={textStyle}
        {...props}
      >
        {children}
      </span>
    );
  }
);

GradientText.displayName = 'GradientText';

/* ============================================
   GRADIENT BORDER COMPONENT
   ============================================ */

export interface GradientBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** SKTCH gradient preset */
  variant?: SKTCHGradientType;
  /** Gradient direction */
  direction?: GradientDirection;
  /** Border width */
  borderWidth?: number;
  /** Border radius */
  borderRadius?: string;
  /** Custom gradient colors */
  colors?: string[];
  /** Background color/gradient for content */
  contentBackground?: string;
  /** Additional className */
  className?: string;
  /** Children content */
  children: ReactNode;
}

export const GradientBorder = forwardRef<HTMLDivElement, GradientBorderProps>(
  ({
    variant = 'primary',
    direction = 'to-r',
    borderWidth = 2,
    borderRadius = '1rem',
    colors,
    contentBackground = 'var(--sktch-glass-gradient)',
    className,
    children,
    style,
    ...props
  }, ref) => {
    
    const gradientCSS = generateGradientCSS(variant, direction, colors);
    
    const containerStyle: CSSProperties = {
      background: gradientCSS,
      padding: `${borderWidth}px`,
      borderRadius,
      ...style
    };

    const contentStyle: CSSProperties = {
      background: contentBackground,
      borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
      width: '100%',
      height: '100%'
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        {...props}
      >
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    );
  }
);

GradientBorder.displayName = 'GradientBorder';

/* ============================================
   MESH GRADIENT COMPONENT (Advanced)
   ============================================ */

export interface MeshGradientProps extends HTMLAttributes<HTMLDivElement> {
  /** Color points for the mesh */
  colors?: string[];
  /** Animation speed (0-10) */
  speed?: number;
  /** Mesh complexity (2-6) */
  complexity?: number;
  /** Additional className */
  className?: string;
  /** Children content */
  children?: ReactNode;
}

export const MeshGradient = forwardRef<HTMLDivElement, MeshGradientProps>(
  ({
    colors = ['#210b4b', '#6a2a98', '#ff3d94', '#769bc1'],
    speed = 3,
    complexity = 4,
    className,
    children,
    style,
    ...props
  }, ref) => {
    
    // Generate multiple radial gradients for mesh effect
    const meshGradients = colors.slice(0, complexity).map((color, index) => {
      const angle = (index * 360) / complexity;
      const x = 50 + 30 * Math.cos((angle * Math.PI) / 180);
      const y = 50 + 30 * Math.sin((angle * Math.PI) / 180);
      
      return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent 70%)`;
    });

    const meshStyle: CSSProperties = {
      background: [
        'var(--sktch-deep-purple)',
        ...meshGradients
      ].join(', '),
      ...style
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={meshStyle}
        animate={{
          filter: [
            'hue-rotate(0deg)',
            `hue-rotate(${360 * speed / 10}deg)`,
            'hue-rotate(0deg)'
          ]
        }}
        transition={{
          duration: 10 / speed,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MeshGradient.displayName = 'MeshGradient';

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/** Generate random gradient */
export function generateRandomGradient(): { colors: string[]; direction: GradientDirection } {
  const allColors = Object.values(SKTCH_GRADIENTS).flat();
  const shuffled = [...allColors].sort(() => Math.random() - 0.5);
  const colors = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
  
  const directions: GradientDirection[] = ['to-r', 'to-br', 'to-b', 'to-bl', 'to-l', 'to-tl', 'to-t', 'to-tr'];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  return { colors, direction };
}

/** Create CSS custom properties for gradients */
export function generateGradientCSSVariables(): string {
  let css = ':root {\n';
  
  Object.entries(SKTCH_GRADIENTS).forEach(([name, colors]) => {
    const gradientCSS = `linear-gradient(135deg, ${colors.join(', ')})`;
    css += `  --sktch-gradient-${name}: ${gradientCSS};\n`;
  });
  
  css += '}\n';
  return css;
}

/** Export gradient presets */
export const gradientPresets = SKTCH_GRADIENTS;

export default Gradient;