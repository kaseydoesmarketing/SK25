'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   PREMIUM CARD SYSTEM
   ============================================ */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: 'glass' | 'premium' | 'gradient-border' | 'solid';
  /** Card size padding */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether card is hoverable */
  hoverable?: boolean;
  /** Whether card is clickable */
  clickable?: boolean;
  /** Additional className */
  className?: string;
  /** Children content */
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'glass',
    size = 'md',
    hoverable = false,
    clickable = false,
    className,
    children,
    ...props
  }, ref) => {
    
    // Size configurations
    const sizeStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };

    // Variant configurations
    const variantStyles = {
      glass: cn(
        'bg-sktch-glass border border-sktch-glass-medium',
        'backdrop-blur-glass shadow-sktch-glass',
        'relative overflow-hidden',
        // Glass highlight effect
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-px',
        'before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent'
      ),
      premium: cn(
        'bg-sktch-glass-strong border border-sktch-glass-strong',
        'backdrop-blur-glass-strong shadow-sktch-elevated',
        'relative overflow-hidden',
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-px',
        'before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent'
      ),
      'gradient-border': cn(
        'relative bg-sktch-glass',
        'before:absolute before:inset-0 before:p-0.5 before:bg-sktch-primary before:rounded-2xl before:-z-10',
        'before:mask-composite-xor before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
      ),
      solid: cn(
        'bg-white/10 border border-white/20',
        'shadow-sktch-soft'
      )
    };

    const baseStyles = cn(
      'rounded-2xl transition-all duration-300 ease-out',
      'will-change-transform',
      hoverable && 'hover:-translate-y-1 hover:shadow-sktch-elevated',
      clickable && 'cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sktch-hot-pink/30',
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    const MotionCard = clickable ? motion.div : 'div';
    const motionProps = clickable ? {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.98, y: 0 },
      transition: { duration: 0.2, ease: "easeOut" }
    } : {};

    return (
      <div
        ref={ref}
        className={baseStyles}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? 'button' : undefined}
        {...props as any}
      >
        {children}
        
        {/* Shimmer effect for premium variant */}
        {variant === 'premium' && hoverable && (
          <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* ============================================
   CARD HEADER COMPONENT
   ============================================ */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Icon for the header */
  icon?: ReactNode;
  /** Actions for the header */
  actions?: ReactNode;
  /** Additional className */
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, icon, actions, className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('flex items-start justify-between mb-6', className)}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-white leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/70 mt-1">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        
        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/* ============================================
   CARD CONTENT COMPONENT
   ============================================ */

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Additional className */
  className?: string;
  /** Children content */
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('text-white/90 leading-relaxed', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/* ============================================
   CARD FOOTER COMPONENT
   ============================================ */

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Additional className */
  className?: string;
  /** Children content */
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('mt-6 pt-4 border-t border-white/10', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/* ============================================
   CARD GRID COMPONENT
   ============================================ */

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Grid columns configuration */
  columns?: 1 | 2 | 3 | 4 | 'auto';
  /** Gap between cards */
  gap?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Children cards */
  children: ReactNode;
}

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ columns = 'auto', gap = 'md', className, children, ...props }, ref) => {
    
    const columnStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'
    };

    const gapStyles = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };

    return (
      <div 
        ref={ref}
        className={cn(
          'grid',
          columnStyles[columns],
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGrid.displayName = 'CardGrid';

/* ============================================
   SPECIALIZED CARD VARIANTS
   ============================================ */

/** Feature Card with Icon */
export interface FeatureCardProps extends Omit<CardProps, 'children'> {
  /** Feature icon */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional action button */
  action?: ReactNode;
  /** Badge text */
  badge?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  action,
  badge,
  ...cardProps
}: FeatureCardProps) => {
  return (
    <Card hoverable {...cardProps}>
      <CardHeader
        icon={
          <div className="w-12 h-12 rounded-xl bg-sktch-primary flex items-center justify-center">
            {icon}
          </div>
        }
        title={title}
        actions={
          badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sktch-mint/20 text-sktch-mint">
              {badge}
            </span>
          )
        }
      />
      
      <CardContent>
        <p className="text-white/80 mb-4">
          {description}
        </p>
      </CardContent>
      
      {action && (
        <CardFooter>
          {action}
        </CardFooter>
      )}
    </Card>
  );
};

/** Stats Card */
export interface StatsCardProps extends Omit<CardProps, 'children'> {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Change indicator */
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  /** Icon for the stat */
  icon?: ReactNode;
}

export const StatsCard = ({
  label,
  value,
  change,
  icon,
  ...cardProps
}: StatsCardProps) => {
  const trendColors = {
    up: 'text-sktch-mint',
    down: 'text-sktch-coral',
    neutral: 'text-white/60'
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6" />
      </svg>
    )
  };

  return (
    <Card variant="premium" hoverable {...cardProps}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          
          {change && (
            <div className={cn('flex items-center gap-1 text-sm', trendColors[change.trend])}>
              {trendIcons[change.trend]}
              <span>{change.value}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-sktch-glass-strong flex items-center justify-center text-white/80">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// Export types
export type CardVariant = CardProps['variant'];
export type CardSize = CardProps['size'];

export default Card;