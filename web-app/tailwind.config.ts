import type { Config } from "tailwindcss";

// Mathematical Design Token System
const spacing = {
  '0.5': '0.125rem', // 2px
  '1': '0.25rem',    // 4px
  '1.5': '0.375rem', // 6px
  '2': '0.5rem',     // 8px
  '2.5': '0.625rem', // 10px
  '3': '0.75rem',    // 12px
  '3.5': '0.875rem', // 14px
  '4': '1rem',       // 16px
  '5': '1.25rem',    // 20px
  '6': '1.5rem',     // 24px
  '7': '1.75rem',    // 28px
  '8': '2rem',       // 32px
  '9': '2.25rem',    // 36px
  '10': '2.5rem',    // 40px
  '12': '3rem',      // 48px
  '14': '3.5rem',    // 56px
  '16': '4rem',      // 64px
  '20': '5rem',      // 80px
  '24': '6rem',      // 96px
  '32': '8rem',      // 128px
};

const radii = {
  'none': '0',
  'xs': '0.125rem',   // 2px
  'sm': '0.25rem',    // 4px
  'DEFAULT': '0.375rem', // 6px
  'md': '0.5rem',     // 8px
  'lg': '0.75rem',    // 12px
  'xl': '1rem',       // 16px
  '2xl': '1.5rem',    // 24px
  '3xl': '2rem',      // 32px
  'full': '9999px',
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Mathematical Spacing System
      spacing,
      borderRadius: radii,
      
      // SKTCH Color System with Semantic Tokens
      colors: {
        sktch: {
          // Primary Gradient Colors
          'deep-purple': '#210b4b',
          'electric-purple': '#6a2a98', 
          'hot-pink': '#ff3d94',
          
          // Accent Colors
          'cool-blue': '#769bc1',
          'sun-gold': '#f4b961',
          'mint': '#b5e3d0',
          'coral': '#ec7567',
          'peach': '#f7d5bb',
          
          // Glass/UI Colors
          'soft-white': '#ffffff',
          'glass-white': 'rgba(255, 255, 255, 0.1)',
          'glass-medium': 'rgba(255, 255, 255, 0.2)',
          'glass-strong': 'rgba(255, 255, 255, 0.3)',
          'glass-dark': 'rgba(33, 11, 75, 0.2)',
          'glass-darker': 'rgba(33, 11, 75, 0.4)',
          
          // Semantic State Colors
          'success': '#b5e3d0',     // mint for success
          'warning': '#f4b961',     // sun-gold for warnings
          'error': '#ec7567',       // coral for errors
          'info': '#769bc1',        // cool-blue for info
          'active': '#b5e3d0',      // mint for active/recording
        }
      },
      
      // Gradient System
      backgroundImage: {
        // Primary Brand Gradients
        'sktch-primary': 'linear-gradient(135deg, #210b4b 0%, #6a2a98 50%, #ff3d94 100%)',
        'sktch-primary-vertical': 'linear-gradient(180deg, #210b4b 0%, #6a2a98 50%, #ff3d94 100%)',
        'sktch-primary-radial': 'radial-gradient(circle at center, #ff3d94 0%, #6a2a98 50%, #210b4b 100%)',
        
        // Pulse Animations
        'sktch-pulse': 'radial-gradient(circle, #ff3d94 0%, #6a2a98 60%, #210b4b 100%)',
        'sktch-pulse-soft': 'radial-gradient(circle, rgba(255, 61, 148, 0.8) 0%, rgba(106, 42, 152, 0.6) 60%, rgba(33, 11, 75, 0.4) 100%)',
        
        // Glass Morphism
        'sktch-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(33, 11, 75, 0.2) 100%)',
        'sktch-glass-strong': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(33, 11, 75, 0.3) 100%)',
        
        // Button Gradients  
        'sktch-btn-primary': 'linear-gradient(135deg, #210b4b 0%, #6a2a98 50%, #ff3d94 100%)',
        'sktch-btn-secondary': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        
        // Accent Gradients
        'sktch-cool-blue': 'linear-gradient(135deg, #769bc1 0%, #5a7a9a 100%)',
        'sktch-sun-gold': 'linear-gradient(135deg, #f4b961 0%, #e6a54a 100%)',
        'sktch-mint': 'linear-gradient(135deg, #b5e3d0 0%, #9dd6c4 100%)',
        'sktch-coral': 'linear-gradient(135deg, #ec7567 0%, #d65a4a 100%)',
        
        // Utility Gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      // Shadow System (Multi-layered for depth)
      boxShadow: {
        // Soft Shadows
        'sktch-soft': '0 8px 32px rgba(33, 11, 75, 0.3)',
        'sktch-soft-sm': '0 4px 16px rgba(33, 11, 75, 0.2)',
        'sktch-soft-lg': '0 16px 48px rgba(33, 11, 75, 0.4)',
        
        // Glow Effects
        'sktch-glow': '0 0 40px rgba(255, 61, 148, 0.4)',
        'sktch-glow-sm': '0 0 20px rgba(255, 61, 148, 0.3)',
        'sktch-glow-lg': '0 0 60px rgba(255, 61, 148, 0.5)',
        
        // Elevated Components
        'sktch-elevated': '0 16px 64px rgba(33, 11, 75, 0.4), 0 8px 24px rgba(33, 11, 75, 0.3)',
        'sktch-floating': '0 24px 80px rgba(33, 11, 75, 0.5), 0 12px 32px rgba(33, 11, 75, 0.4)',
        
        // Glass Morphism Shadows
        'sktch-glass': '0 8px 32px rgba(33, 11, 75, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'sktch-glass-strong': '0 16px 48px rgba(33, 11, 75, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
        
        // State-specific Shadows
        'sktch-focus': '0 0 0 4px rgba(255, 61, 148, 0.3), 0 8px 32px rgba(33, 11, 75, 0.3)',
        'sktch-active': '0 4px 16px rgba(255, 61, 148, 0.4), 0 2px 8px rgba(33, 11, 75, 0.3)',
      },
      
      // Animation System
      animation: {
        // Pulse Animations (Organic, Not Harsh)
        'sktch-pulse': 'sktchPulse 2s ease-in-out infinite',
        'sktch-pulse-fast': 'sktchPulseFast 1s ease-in-out infinite',
        'sktch-pulse-slow': 'sktchPulseSlow 3s ease-in-out infinite',
        
        // Interactive Animations
        'sktch-bounce': 'sktchBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'sktch-fade-in': 'sktchFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'sktch-slide-up': 'sktchSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'sktch-scale-in': 'sktchScaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Voice-Reactive Animations
        'sktch-voice-ripple': 'sktchVoiceRipple 1.5s ease-out infinite',
        'sktch-listening': 'sktchListening 1.2s ease-in-out infinite',
        'sktch-processing': 'sktchProcessing 1s linear infinite',
        
        // Breathing Animation (Idle State)
        'sktch-breathe': 'sktchBreathe 4s ease-in-out infinite',
        
        // Shimmer Effects
        'sktch-shimmer': 'sktchShimmer 2s ease-in-out infinite',
        'sktch-success-pulse': 'sktchSuccessPulse 0.8s ease-out',
        'sktch-error-shake': 'sktchErrorShake 0.5s ease-in-out',
      },
      
      // Keyframe Definitions
      keyframes: {
        // Organic Pulse (Main HUD)
        sktchPulse: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)', filter: 'brightness(1.1)' },
        },
        sktchPulseFast: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        sktchPulseSlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        
        // Interactive Entrance
        sktchBounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) translateY(100px)' },
          '50%': { transform: 'scale(1.05) translateY(-10px)' },
          '70%': { transform: 'scale(0.9) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        
        // Smooth Transitions
        sktchFadeIn: {
          'from': { opacity: '0', transform: 'translateY(-10px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        sktchSlideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        sktchScaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Voice-Reactive States
        sktchVoiceRipple: {
          '0%': { width: '40px', height: '40px', opacity: '1' },
          '100%': { width: '120px', height: '120px', opacity: '0' },
        },
        sktchListening: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 61, 148, 0.4)' },
          '50%': { transform: 'scale(1.08)', boxShadow: '0 0 40px rgba(255, 61, 148, 0.8)' },
        },
        sktchProcessing: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        // Breathing (Idle State)
        sktchBreathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        
        // Success/Error States
        sktchShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sktchSuccessPulse: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(181, 227, 208, 0.4)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 40px rgba(181, 227, 208, 0.8)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(181, 227, 208, 0.4)' },
        },
        sktchErrorShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      
      // Backdrop Blur System
      backdropBlur: {
        'glass': '20px',
        'glass-light': '10px',
        'glass-strong': '30px',
      },
      
      // Typography Scale (Mathematical Progression)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
      },
      
      // Font Weight Scale
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      
      // Z-index Scale
      zIndex: {
        'modal': '1000',
        'overlay': '999',
        'dropdown': '900',
        'header': '800',
        'hud': '700',
      },
    },
  },
  plugins: [],
};

export default config;