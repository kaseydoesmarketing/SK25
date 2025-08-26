'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PulseHUD } from './ui/PulseHUD';
import { Button, ButtonGroup } from './ui/Button';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { GradientText } from './ui/Gradient';

export function PulseHUDDemo() {
  const [mode, setMode] = useState<'note' | 'prompt' | 'tasks'>('prompt');
  const [transcription, setTranscription] = useState('');
  const [hudState, setHudState] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');

  const handleHudClick = () => {
    // Demo interaction sequence
    if (hudState === 'idle') {
      setHudState('listening');
      setTranscription('');
      
      // Simulate voice input
      setTimeout(() => {
        setTranscription('Write a comprehensive guide about machine learning...');
      }, 1000);
      
      setTimeout(() => {
        setHudState('processing');
      }, 3000);
      
      setTimeout(() => {
        setHudState('success');
        setTranscription('Write a comprehensive guide about machine learning for beginners');
      }, 5000);
      
      setTimeout(() => {
        setHudState('idle');
        setTranscription('');
      }, 7000);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[500px] p-8">
      {/* Main Demo Container */}
      <Card variant="premium" size="lg" className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <GradientText variant="primary" className="text-xl font-bold">
              SKTCH Voice Control
            </GradientText>
            <p className="text-white/70 text-sm mt-2">
              Premium voice-native browser extension
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Pulse HUD - Crown Jewel */}
            <div className="flex justify-center">
              <PulseHUD
                size="large"
                state={hudState}
                amplitude={0.8}
                onClick={handleHudClick}
                demoMode={false}
                ariaLabel="Voice control interface - click to start demo"
                className="cursor-pointer"
              />
            </div>

            {/* Status Display */}
            <div className="text-center">
              <motion.p
                className="text-sm font-medium text-white/90"
                key={hudState}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {hudState === 'idle' && 'Ready for voice control'}
                {hudState === 'listening' && 'Listening for your voice...'}
                {hudState === 'processing' && 'Processing your request...'}
                {hudState === 'success' && 'Content ready to insert!'}
                {hudState === 'error' && 'Please try again'}
              </motion.p>
            </div>

            {/* Mode Selection */}
            <div className="flex justify-center">
              <ButtonGroup orientation="horizontal">
                {(['note', 'prompt', 'tasks'] as const).map((modeType) => (
                  <Button
                    key={modeType}
                    variant={mode === modeType ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setMode(modeType)}
                    className="capitalize"
                  >
                    {modeType}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Transcription Display */}
            <div className="relative">
              <div className="glass-card p-4 min-h-[80px] rounded-xl">
                <motion.p
                  className={`text-white text-sm leading-relaxed ${
                    transcription ? 'opacity-100' : 'opacity-60'
                  }`}
                  animate={{ 
                    opacity: transcription ? 1 : 0.6,
                    scale: hudState === 'success' ? [1, 1.02, 1] : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {transcription || 'Your voice transcription will appear here...'}
                </motion.p>
              </div>

              {/* Listening Animation Border */}
              {hudState === 'listening' && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-sktch-hot-pink/50"
                  animate={{
                    borderColor: [
                      'rgba(255, 61, 148, 0.3)',
                      'rgba(255, 61, 148, 0.8)',
                      'rgba(255, 61, 148, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="md"
                fullWidth
                disabled={hudState !== 'success'}
                onClick={() => {
                  setHudState('idle');
                  setTranscription('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={hudState !== 'success'}
                onClick={() => {
                  // Simulate insert action
                  setHudState('idle');
                  setTranscription('');
                }}
              >
                Insert Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Instructions */}
      <motion.div
        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="glass-card px-4 py-2 rounded-full border border-sktch-hot-pink/30">
          <motion.p
            className="text-xs font-medium text-sktch-hot-pink text-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Click the pulse to start interactive demo
          </motion.p>
        </div>
      </motion.div>

      {/* Floating particles effect */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-sktch-hot-pink/20 rounded-full"
          style={{
            left: `${30 + i * 20}%`,
            top: `${20 + i * 15}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}