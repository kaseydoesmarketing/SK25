'use client';

import { 
  forwardRef, 
  ReactNode, 
  useEffect, 
  useRef,
  useState,
  HTMLAttributes,
  MouseEvent,
  KeyboardEvent
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

/* ============================================
   PREMIUM MODAL SYSTEM
   ============================================ */

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Function to close modal */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to close on overlay click */
  closeOnOverlay?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Additional className for modal container */
  className?: string;
  /** Modal content */
  children: ReactNode;
  /** Custom z-index */
  zIndex?: number;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  children,
  zIndex = 1000,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === overlayRef.current && closeOnOverlay) {
      onClose();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-sktch-deep-purple/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            className={cn(
              'relative w-full bg-sktch-glass-strong border border-sktch-glass-strong',
              'backdrop-blur-glass-strong rounded-2xl shadow-sktch-floating',
              'overflow-hidden',
              sizeStyles[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass highlight effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <motion.h2
                        className="text-xl font-semibold text-white leading-tight"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {title}
                      </motion.h2>
                    )}
                    {description && (
                      <motion.p
                        className="mt-2 text-sm text-white/70"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>

                  {showCloseButton && (
                    <motion.button
                      className={cn(
                        'ml-4 p-2 text-white/60 hover:text-white hover:bg-white/10',
                        'rounded-lg transition-colors duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sktch-hot-pink/40'
                      )}
                      onClick={onClose}
                      aria-label="Close modal"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <motion.div
              className="px-6 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render in portal
  return createPortal(modalContent, document.body);
};

/* ============================================
   MODAL FOOTER COMPONENT
   ============================================ */

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Additional className */
  className?: string;
  /** Children content */
  children: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'px-6 py-4 border-t border-white/10',
          'flex items-center justify-end gap-3',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

/* ============================================
   CONFIRMATION MODAL COMPONENT
   ============================================ */

export interface ConfirmationModalProps extends Omit<ModalProps, 'children'> {
  /** Confirmation message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'destructive';
  /** Function called on confirm */
  onConfirm: () => void;
  /** Loading state */
  loading?: boolean;
}

export const ConfirmationModal = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onClose,
  loading = false,
  ...modalProps
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} size="sm" {...modalProps}>
      <div className="text-center">
        <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-sktch-glass-strong flex items-center justify-center">
          <svg className="w-6 h-6 text-sktch-sun-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <p className="text-white/90 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <motion.button
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            onClick={onClose}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {cancelText}
          </motion.button>
          
          <motion.button
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200',
              confirmVariant === 'primary' && 'bg-sktch-primary hover:brightness-105',
              confirmVariant === 'destructive' && 'bg-sktch-coral hover:brightness-105',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onClick={handleConfirm}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading && (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2 inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            {confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

/* ============================================
   MODAL HOOKS
   ============================================ */

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useModal = (defaultOpen = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

// Export types
export type ModalSize = ModalProps['size'];

export default Modal;