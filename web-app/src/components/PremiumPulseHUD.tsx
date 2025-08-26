'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface PremiumPulseHUDProps {
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  onActivate?: () => void;
  className?: string;
}

export function PremiumPulseHUD({ 
  size = 'large', 
  isActive = false, 
  onActivate,
  className = '' 
}: PremiumPulseHUDProps) {
  const [isListening, setIsListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  const iconSizes = {
    small: 20,
    medium: 28,
    large: 36
  };

  // Demo mode - simulate voice pulsing
  useEffect(() => {
    if (isDemo) {
      const interval = setInterval(() => {
        const randomAmplitude = Math.random() * 0.8 + 0.2;
        setAmplitude(randomAmplitude);
        
        // Simulate speech text
        const demoTexts = [
          'Hey, can you review this document...',
          'Write a summary of our meeting today',
          'Create a new task for the project',
          'Send message to the team about updates'
        ];
        
        if (Math.random() > 0.7) {
          setSpeechText(demoTexts[Math.floor(Math.random() * demoTexts.length)]);
        }
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [isDemo]);

  const handleClick = () => {
    if (!isDemo) {
      setIsDemo(true);
      setIsListening(true);
      onActivate?.();
      
      // Stop demo after 5 seconds
      setTimeout(() => {
        setIsDemo(false);
        setIsListening(false);
        setSpeechText('');
        setAmplitude(0);
      }, 5000);
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Main Pulse HUD Circle */}
      <motion.div
        className={`relative ${sizeClasses[size]} cursor-pointer`}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer pulsing rings */}
        <AnimatePresence>
          {(isListening || isDemo) && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-purple-500 to-pink-500"
                  style={{
                    background: `conic-gradient(from 0deg, 
                      #8B5CF6 0%, 
                      #A855F7 25%, 
                      #C084FC 50%, 
                      #E879F9 75%, 
                      #F0ABFC 100%
                    )`,
                    padding: '2px',
                  }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 1.5 + i * 0.3, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main circular HUD */}
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
          style={{
            background: isListening || isDemo 
              ? `radial-gradient(circle at center, 
                  #8B5CF6 0%, 
                  #A855F7 30%, 
                  #C084FC 60%, 
                  #E879F9 100%
                )`
              : `linear-gradient(135deg, 
                  #8B5CF6 0%, 
                  #A855F7 25%, 
                  #C084FC 50%, 
                  #E879F9 75%, 
                  #F0ABFC 100%
                )`
          }}
          animate={{
            scale: isListening || isDemo ? [1, 1.1 + amplitude * 0.3, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {/* Inner glow effect */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            }}
          />
          
          {/* Voice amplitude visualization */}
          <AnimatePresence>
            {(isListening || isDemo) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at center, 
                    rgba(255,255,255,${amplitude * 0.5}) 0%, 
                    rgba(255,255,255,${amplitude * 0.2}) 40%, 
                    transparent 70%
                  )`
                }}
                animate={{
                  scale: [1, 1 + amplitude * 0.2, 1],
                }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut"
                }}
              />
            )}
          </AnimatePresence>

          {/* Microphone icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isListening || isDemo ? [1, 1.1, 1] : 1,
                rotate: isListening || isDemo ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: 0.5,
                repeat: isListening || isDemo ? Infinity : 0
              }}
            >
              {isListening || isDemo ? (
                <Mic 
                  size={iconSizes[size]} 
                  className="text-white drop-shadow-lg" 
                />
              ) : (
                <MicOff 
                  size={iconSizes[size]} 
                  className="text-white/80 drop-shadow-lg" 
                />
              )}
            </motion.div>
          </div>

          {/* Shimmer effect for premium feel */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm font-medium text-gray-700 mb-1">
          {isListening || isDemo ? 'Listening...' : 'Click to activate'}
        </div>
        {speechText && (
          <motion.div
            className="px-3 py-1 bg-white rounded-full shadow-sm border max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="text-xs text-gray-600 truncate">
              "{speechText}"
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating particles for premium effect */}
      <AnimatePresence>
        {(isListening || isDemo) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-300 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}