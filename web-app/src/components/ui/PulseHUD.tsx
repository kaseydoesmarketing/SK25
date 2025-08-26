'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================
   PULSE HUD COMPONENT - CROWN JEWEL
   ============================================ */

export interface PulseHUDProps {
  /** Size variant of the HUD */
  size?: 'small' | 'medium' | 'large';
  /** Current state of the voice interaction */
  state?: 'idle' | 'listening' | 'processing' | 'inserting' | 'success' | 'error';
  /** Voice amplitude for reactive animations (0-1) */
  amplitude?: number;
  /** Whether to show voice ripple effects */
  showRipples?: boolean;
  /** Callback when HUD is clicked */
  onClick?: () => void;
  /** Accessibility label */
  ariaLabel?: string;
  /** Custom className for additional styling */
  className?: string;
  /** Whether to auto-cycle through demo states */
  demoMode?: boolean;
}

export interface VoiceRippleProps {
  amplitude: number;
  state: PulseHUDProps['state'];
  size: PulseHUDProps['size'];
}

/** Voice-reactive ripple effects */
const VoiceRipples = ({ amplitude, state, size }: VoiceRippleProps) => {
  const isActive = state === 'listening' || state === 'processing';
  const rippleSize = {
    small: 80,
    medium: 120,
    large: 180
  }[size || 'medium'];

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Primary Ripple */}
          <motion.div
            className="absolute inset-0 border-2 rounded-full pointer-events-none"
            style={{
              borderColor: state === 'listening' 
                ? 'rgba(255, 61, 148, 0.4)' 
                : 'rgba(181, 227, 208, 0.4)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.8, 0.8],
              opacity: [0, 0.8 * amplitude, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          
          {/* Secondary Ripple */}
          <motion.div
            className="absolute inset-0 border-2 rounded-full pointer-events-none"
            style={{
              borderColor: state === 'listening' 
                ? 'rgba(106, 42, 152, 0.3)' 
                : 'rgba(181, 227, 208, 0.3)'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: [0.9, 1.5, 0.9],
              opacity: [0, 0.6 * amplitude, 0],
            }}
            transition={{
              duration: 1.8,
              delay: 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Amplitude-reactive inner glow */}
          <motion.div
            className="absolute inset-2 rounded-full pointer-events-none"
            style={{
              background: state === 'listening' 
                ? 'radial-gradient(circle, rgba(255, 61, 148, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(181, 227, 208, 0.3) 0%, transparent 70%)'
            }}
            animate={{
              opacity: [0.2, amplitude * 0.8, 0.2],
              scale: [0.9, 0.9 + (amplitude * 0.2), 0.9],
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
};

/** Main Pulse HUD Component */
export const PulseHUD = ({
  size = 'medium',
  state = 'idle',
  amplitude = 0.5,
  showRipples = true,
  onClick,
  ariaLabel,
  className = '',
  demoMode = false,
}: PulseHUDProps) => {
  const [currentState, setCurrentState] = useState<PulseHUDProps['state']>(state);
  const [currentAmplitude, setCurrentAmplitude] = useState(amplitude);

  // Size configurations
  const sizeConfig = {
    small: { width: 60, height: 60, containerSize: 120 },
    medium: { width: 80, height: 80, containerSize: 160 },
    large: { width: 120, height: 120, containerSize: 240 },
  };

  const config = sizeConfig[size];

  // Demo mode cycling
  useEffect(() => {
    if (!demoMode) {
      setCurrentState(state);
      setCurrentAmplitude(amplitude);
      return;
    }

    const demoSequence = async () => {
      // Idle state
      setCurrentState('idle');
      setCurrentAmplitude(0.3);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Listening state with rising amplitude
      setCurrentState('listening');
      for (let amp = 0.1; amp <= 0.9; amp += 0.1) {
        setCurrentAmplitude(amp);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Processing state
      setCurrentState('processing');
      setCurrentAmplitude(0.6);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success state
      setCurrentState('success');
      setCurrentAmplitude(0.8);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return to idle
      setCurrentState('idle');
      setCurrentAmplitude(0.3);
      await new Promise(resolve => setTimeout(resolve, 2000));
    };

    const interval = setInterval(demoSequence, 8500);
    demoSequence(); // Start immediately

    return () => clearInterval(interval);
  }, [demoMode, state, amplitude]);

  // State-specific styling
  const getStateStyles = useCallback(() => {
    const baseClasses = `
      relative rounded-full cursor-pointer transition-all duration-300 ease-out
      will-change-transform focus-visible:outline-none focus-visible:ring-4 
      focus-visible:ring-sktch-hot-pink/30 focus-visible:ring-offset-2 
      focus-visible:ring-offset-transparent
    `.trim();

    switch (currentState) {
      case 'listening':
        return `${baseClasses} bg-sktch-primary-radial shadow-sktch-glow-lg animate-sktch-listening`;
      
      case 'processing':
        return `${baseClasses} bg-sktch-primary-radial shadow-sktch-glow relative`;
      
      case 'inserting':
        return `${baseClasses} bg-sktch-mint shadow-sktch-glow-sm`;
      
      case 'success':
        return `${baseClasses} bg-sktch-mint shadow-[0_0_40px_rgba(181,227,208,0.6)]`;
      
      case 'error':
        return `${baseClasses} bg-sktch-coral shadow-[0_0_40px_rgba(236,117,103,0.6)]`;
      
      default: // idle
        return `${baseClasses} bg-sktch-pulse shadow-sktch-glow animate-sktch-breathe`;
    }
  }, [currentState]);

  // Click handler with haptic feedback (if supported)
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      
      // Haptic feedback for supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }, [onClick]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ 
        width: config.containerSize, 
        height: config.containerSize 
      }}
    >
      {/* Voice Ripples */}
      {showRipples && (
        <VoiceRipples 
          amplitude={currentAmplitude} 
          state={currentState} 
          size={size} 
        />
      )}

      {/* Main HUD Core */}
      <motion.button
        className={getStateStyles()}
        style={{ 
          width: config.width, 
          height: config.height 
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || `Voice control ${currentState}`}
        aria-pressed={currentState === 'listening'}
        role="button"
        tabIndex={0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: currentState === 'listening' 
            ? [
                '0 0 20px rgba(255, 61, 148, 0.4)',
                `0 0 ${40 + (currentAmplitude * 20)}px rgba(255, 61, 148, ${0.6 + (currentAmplitude * 0.2)})`,
                '0 0 20px rgba(255, 61, 148, 0.4)'
              ]
            : undefined,
          filter: currentState === 'listening'
            ? `brightness(${1 + (currentAmplitude * 0.1)})`
            : 'brightness(1)'
        }}
        transition={{
          boxShadow: { duration: 0.3, ease: "easeOut" },
          filter: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Inner Glow Effect */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            background: currentState === 'listening' || currentState === 'processing'
              ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)'
          }}
          animate={{
            opacity: currentState === 'listening' ? [0.3, 0.6, 0.3] : 0.3
          }}
          transition={{
            duration: 1.5,
            repeat: currentState === 'listening' ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Processing Spinner */}
        <AnimatePresence>
          {currentState === 'processing' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-sktch-hot-pink"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ 
                rotate: 360, 
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.2 }
              }}
            />
          )}
        </AnimatePresence>

        {/* Success Checkmark */}
        <AnimatePresence>
          {currentState === 'success' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <svg 
                width={config.width * 0.4} 
                height={config.width * 0.4} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <motion.path 
                  d="m9 12 2 2 4-4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error X */}
        <AnimatePresence>
          {currentState === 'error' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <svg 
                width={config.width * 0.4} 
                height={config.width * 0.4} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <motion.path 
                  d="m18 6-12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <motion.path 
                  d="m6 6 12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone Icon (Default) */}
        <AnimatePresence>
          {(currentState === 'idle' || currentState === 'listening') && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ 
                scale: currentState === 'listening' ? [1, 1.1, 1] : 1,
                opacity: 1 
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                scale: { duration: 1.2, repeat: currentState === 'listening' ? Infinity : 0, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }}
            >
              <svg 
                width={config.width * 0.4} 
                height={config.width * 0.4} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
                <line x1="8" x2="16" y1="22" y2="22" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* State Indicator Dot */}
      <motion.div
        className="absolute top-2 right-2 w-3 h-3 rounded-full"
        style={{
          backgroundColor: {
            idle: '#769bc1',
            listening: '#ff3d94',
            processing: '#f4b961',
            inserting: '#b5e3d0',
            success: '#b5e3d0',
            error: '#ec7567'
          }[currentState]
        }}
        animate={{
          scale: currentState === 'listening' ? [1, 1.2, 1] : 1,
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Accessibility Status Text (Screen Reader Only) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentState === 'idle' && 'Voice control ready'}
        {currentState === 'listening' && 'Listening for voice input'}
        {currentState === 'processing' && 'Processing voice input'}
        {currentState === 'inserting' && 'Inserting content'}
        {currentState === 'success' && 'Voice input successfully processed'}
        {currentState === 'error' && 'Error processing voice input'}
      </div>
    </div>
  );
};

// Export additional types for external use
export type PulseHUDState = PulseHUDProps['state'];
export type PulseHUDSize = PulseHUDProps['size'];

// Default export
export default PulseHUD;