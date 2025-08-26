'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   PREMIUM BUTTON SYSTEM
   ============================================ */

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether button is in loading state */
  loading?: boolean;
  /** Icon to display before text */
  icon?: ReactNode;
  /** Icon to display after text */
  iconRight?: ReactNode;
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Additional className */
  className?: string;
  /** Children content */
  children?: ReactNode;
}

/** Loading spinner component */
const LoadingSpinner = ({ size = 'md' }: { size: string }) => {
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <motion.div
      className={cn('border-2 border-white/30 border-t-white rounded-full', sizeMap[size as keyof typeof sizeMap])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    disabled,
    className,
    children,
    ...props
  }, ref) => {
    
    // Size configurations
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm min-h-[36px] gap-2',
      md: 'px-4 py-3 text-sm min-h-[44px] gap-2',
      lg: 'px-6 py-4 text-base min-h-[52px] gap-3',
      xl: 'px-8 py-5 text-lg min-h-[60px] gap-3'
    };

    // Variant configurations
    const variantStyles = {
      primary: cn(
        'bg-sktch-primary border-none text-white font-semibold',
        'shadow-sktch-soft hover:shadow-sktch-elevated',
        'hover:brightness-105 hover:-translate-y-0.5',
        'active:translate-y-0 active:shadow-sktch-active',
        'focus-visible:ring-4 focus-visible:ring-sktch-hot-pink/30',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sktch-soft'
      ),
      secondary: cn(
        'bg-sktch-glass border-2 border-transparent text-white font-medium',
        'backdrop-blur-glass relative overflow-hidden',
        'before:absolute before:inset-0 before:p-0.5 before:bg-sktch-primary before:rounded-lg before:-z-10',
        'before:mask-composite-xor before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
        'hover:bg-sktch-glass-strong hover:-translate-y-0.5',
        'focus-visible:ring-4 focus-visible:ring-sktch-hot-pink/30',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
      ),
      ghost: cn(
        'bg-transparent border border-sktch-glass-medium text-white font-medium',
        'hover:bg-sktch-glass hover:border-sktch-glass-strong',
        'focus-visible:ring-4 focus-visible:ring-sktch-hot-pink/30',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      ),
      destructive: cn(
        'bg-sktch-coral border-none text-white font-semibold',
        'shadow-sktch-soft-sm hover:shadow-sktch-soft',
        'hover:brightness-105 hover:-translate-y-0.5',
        'active:translate-y-0',
        'focus-visible:ring-4 focus-visible:ring-sktch-coral/30',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
      )
    };

    const baseStyles = cn(
      'relative inline-flex items-center justify-center',
      'rounded-lg font-medium transition-all duration-300 ease-out',
      'cursor-pointer outline-none select-none',
      'will-change-transform focus-visible:outline-none',
      fullWidth && 'w-full',
      sizeStyles[size],
      variantStyles[variant],
      (disabled || loading) && 'pointer-events-none',
      className
    );

    return (
      <button
        ref={ref}
        className={baseStyles}
        disabled={disabled || loading}
        {...props as any}
      >
        {/* Loading State */}
        {loading && <LoadingSpinner size={size} />}
        
        {/* Left Icon */}
        {!loading && icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* Button Text */}
        {children && (
          <span className={cn(loading && 'opacity-70')}>
            {children}
          </span>
        )}
        
        {/* Right Icon */}
        {!loading && iconRight && (
          <span className="flex-shrink-0">
            {iconRight}
          </span>
        )}

        {/* Shimmer Effect for Primary Variant */}
        {variant === 'primary' && !disabled && !loading && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "linear"
            }}
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/* ============================================
   BUTTON GROUP COMPONENT
   ============================================ */

export interface ButtonGroupProps {
  /** Button group orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional className */
  className?: string;
  /** Children buttons */
  children: ReactNode;
}

export const ButtonGroup = ({ 
  orientation = 'horizontal', 
  className,
  children 
}: ButtonGroupProps) => {
  const orientationStyles = {
    horizontal: 'flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0',
    vertical: 'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0'
  };

  return (
    <div 
      className={cn(
        'inline-flex',
        orientationStyles[orientation],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

// Export types
export type ButtonVariant = ButtonProps['variant'];
export type ButtonSize = ButtonProps['size'];

export default Button;