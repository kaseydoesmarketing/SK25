'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   GLASS INPUT SYSTEM
   ============================================ */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error state and message */
  error?: string;
  /** Success state and message */
  success?: string;
  /** Icon to display before input */
  icon?: ReactNode;
  /** Icon to display after input */
  iconRight?: ReactNode;
  /** Label for the input */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Whether input is in glass morphism style */
  variant?: 'glass' | 'solid';
  /** Additional className */
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    size = 'md',
    error,
    success,
    icon,
    iconRight,
    label,
    helperText,
    variant = 'glass',
    disabled,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Size configurations
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-sm min-h-[44px]',
      lg: 'px-5 py-4 text-base min-h-[52px]'
    };

    // Variant configurations
    const variantStyles = {
      glass: cn(
        'bg-sktch-glass border border-sktch-glass-medium',
        'backdrop-blur-glass placeholder:text-white/60',
        'focus:border-sktch-hot-pink focus:bg-sktch-glass-strong',
        'focus:shadow-[0_0_0_3px_rgba(255,61,148,0.2)]'
      ),
      solid: cn(
        'bg-white/10 border border-white/20',
        'placeholder:text-white/60',
        'focus:border-sktch-hot-pink focus:bg-white/15',
        'focus:shadow-[0_0_0_3px_rgba(255,61,148,0.2)]'
      )
    };

    const baseStyles = cn(
      'w-full rounded-lg text-white transition-all duration-300 ease-out',
      'outline-none font-medium will-change-transform',
      error && 'border-sktch-coral focus:border-sktch-coral focus:shadow-[0_0_0_3px_rgba(236,117,103,0.2)]',
      success && 'border-sktch-mint focus:border-sktch-mint focus:shadow-[0_0_0_3px_rgba(181,227,208,0.2)]',
      disabled && 'opacity-50 cursor-not-allowed',
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <motion.label
            className="block text-sm font-medium text-white/90"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none',
              iconSize[size]
            )}>
              {icon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            className={cn(
              baseStyles,
              icon && 'pl-10',
              iconRight && 'pr-10'
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            {...props}
          />

          {/* Right Icon */}
          {iconRight && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none',
              iconSize[size]
            )}>
              {iconRight}
            </div>
          )}

          {/* Focus Ring Enhancement */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 61, 148, 0.1) 0%, rgba(106, 42, 152, 0.1) 100%)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error / Success */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className="text-sm text-sktch-coral flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.p>
          )}
          
          {success && (
            <motion.p
              key="success"
              className="text-sm text-sktch-mint flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </motion.p>
          )}
          
          {!error && !success && helperText && (
            <motion.p
              key="helper"
              className="text-sm text-white/60"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Textarea size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error state and message */
  error?: string;
  /** Success state and message */
  success?: string;
  /** Label for the textarea */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Whether textarea is in glass morphism style */
  variant?: 'glass' | 'solid';
  /** Minimum height */
  minHeight?: string;
  /** Additional className */
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    size = 'md',
    error,
    success,
    label,
    helperText,
    variant = 'glass',
    minHeight = '120px',
    disabled,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Size configurations
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base'
    };

    // Variant configurations
    const variantStyles = {
      glass: cn(
        'bg-sktch-glass border border-sktch-glass-medium',
        'backdrop-blur-glass placeholder:text-white/60',
        'focus:border-sktch-hot-pink focus:bg-sktch-glass-strong',
        'focus:shadow-[0_0_0_3px_rgba(255,61,148,0.2)]'
      ),
      solid: cn(
        'bg-white/10 border border-white/20',
        'placeholder:text-white/60',
        'focus:border-sktch-hot-pink focus:bg-white/15',
        'focus:shadow-[0_0_0_3px_rgba(255,61,148,0.2)]'
      )
    };

    const baseStyles = cn(
      'w-full rounded-lg text-white transition-all duration-300 ease-out',
      'outline-none font-medium resize-vertical will-change-transform',
      error && 'border-sktch-coral focus:border-sktch-coral focus:shadow-[0_0_0_3px_rgba(236,117,103,0.2)]',
      success && 'border-sktch-mint focus:border-sktch-mint focus:shadow-[0_0_0_3px_rgba(181,227,208,0.2)]',
      disabled && 'opacity-50 cursor-not-allowed resize-none',
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <motion.label
            className="block text-sm font-medium text-white/90"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <motion.textarea
            ref={ref}
            className={baseStyles}
            style={{ minHeight }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled}
            whileFocus={{ scale: 1.005 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            {...props}
          />

          {/* Focus Ring Enhancement */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 61, 148, 0.1) 0%, rgba(106, 42, 152, 0.1) 100%)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error / Success */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className="text-sm text-sktch-coral flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.p>
          )}
          
          {success && (
            <motion.p
              key="success"
              className="text-sm text-sktch-mint flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </motion.p>
          )}
          
          {!error && !success && helperText && (
            <motion.p
              key="helper"
              className="text-sm text-white/60"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Export types
export type InputVariant = InputProps['variant'];
export type InputSize = InputProps['size'];
export type TextareaVariant = TextareaProps['variant'];
export type TextareaSize = TextareaProps['size'];

export { Input as default };