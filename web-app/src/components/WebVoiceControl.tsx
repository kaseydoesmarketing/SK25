'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles,
  MessageSquare,
  FileText,
  CheckSquare,
  Wand2,
  Copy,
  Send
} from 'lucide-react';

interface VoiceControlState {
  isListening: boolean;
  isProcessing: boolean;
  currentMode: 'note' | 'prompt' | 'tasks';
  transcript: string;
  processedText: string;
  volume: number;
  error: string | null;
}

interface WebVoiceControlProps {
  onTextGenerated?: (text: string, mode: string) => void;
  className?: string;
}

export function WebVoiceControl({ onTextGenerated, className = '' }: WebVoiceControlProps) {
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    isProcessing: false,
    currentMode: 'prompt',
    transcript: '',
    processedText: '',
    volume: 0,
    error: null
  });

  const [settings, setSettings] = useState({
    proVoiceFilter: true,
    ambientSounds: false,
    whisperMode: false,
    previewMode: true
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mock voice processing (in production, this would connect to your voice API)
  const processVoice = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTexts = {
          note: "Here's my meeting summary from today's discussion about the new product launch. We covered three key points: budget allocation, timeline requirements, and team responsibilities.",
          prompt: "Create a comprehensive marketing strategy for a new SaaS product targeting small businesses. Include pricing tiers, customer acquisition channels, and competitive analysis.",
          tasks: "1. Review Q4 budget proposals\n2. Schedule client presentation for next week\n3. Update project documentation\n4. Follow up with development team on API integration"
        };
        resolve(mockTexts[state.currentMode]);
      }, 2000);
    });
  };

  // Initialize audio context and analyzer
  useEffect(() => {
    const initAudioAnalyser = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Stop the stream immediately (we just wanted to set up the analyzer)
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    initAudioAnalyser();
  }, []);

  // Volume monitoring
  const updateVolume = () => {
    if (!analyserRef.current || !state.isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value) / dataArray.length;
    setState(prev => ({ ...prev, volume: average / 255 }));
    
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const startListening = async () => {
    try {
      setState(prev => ({ ...prev, error: null, transcript: '', processedText: '' }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        setState(prev => ({ ...prev, isProcessing: true }));
        
        try {
          const processedText = await processVoice(audioBlob);
          setState(prev => ({ 
            ...prev, 
            processedText,
            isProcessing: false 
          }));
          
          if (onTextGenerated) {
            onTextGenerated(processedText, state.currentMode);
          }
        } catch (error) {
          setState(prev => ({ 
            ...prev, 
            error: 'Processing failed. Please try again.',
            isProcessing: false 
          }));
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setState(prev => ({ ...prev, isListening: true }));
      
      // Start volume monitoring
      updateVolume();
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Microphone access denied. Please enable microphone permissions.',
        isListening: false 
      }));
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && state.isListening) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isListening: false, volume: 0 }));
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const switchMode = (mode: 'note' | 'prompt' | 'tasks') => {
    setState(prev => ({ ...prev, currentMode: mode, transcript: '', processedText: '' }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.processedText);
  };

  const modeIcons = {
    note: FileText,
    prompt: MessageSquare,
    tasks: CheckSquare
  };

  const modeColors = {
    note: 'from-sktch-mint to-sktch-cool-blue',
    prompt: 'from-sktch-electric-purple to-sktch-hot-pink',
    tasks: 'from-sktch-sun-gold to-sktch-coral'
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Mode Selection */}
      <div className="mb-8">
        <h3 className="text-white/80 text-sm font-medium mb-4">Select Voice Mode:</h3>
        <div className="flex gap-4">
          {(['note', 'prompt', 'tasks'] as const).map((mode) => {
            const Icon = modeIcons[mode];
            const isActive = state.currentMode === mode;
            
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${modeColors[mode]} rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  isActive ? 'shadow-sktch-glow' : ''
                }`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-white font-medium capitalize mb-1">{mode}</div>
                <div className="text-white/60 text-xs">
                  {mode === 'note' && 'Clean notes & summaries'}
                  {mode === 'prompt' && 'AI-ready prompts'}
                  {mode === 'tasks' && 'Structured task lists'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Voice Control Interface */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sktch-deep-purple/20 via-sktch-electric-purple/20 to-sktch-hot-pink/20"></div>
        
        <div className="relative z-10">
          {/* Central HUD */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Animated Pulse Ring */}
              <motion.div
                className={`w-32 h-32 rounded-full border-4 ${
                  state.isListening ? 'border-sktch-hot-pink' : 'border-white/30'
                } relative`}
                animate={state.isListening ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: state.isListening ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {/* Volume-based inner ring */}
                <motion.div
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink"
                  style={{ 
                    opacity: state.isListening ? 0.3 + (state.volume * 0.7) : 0.1,
                    transform: `scale(${0.8 + (state.volume * 0.4)})`
                  }}
                />
                
                {/* Main Button */}
                <button
                  onClick={state.isListening ? stopListening : startListening}
                  disabled={state.isProcessing}
                  className="absolute inset-4 rounded-full bg-gradient-to-br from-sktch-deep-purple to-sktch-electric-purple shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 flex items-center justify-center group disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {state.isProcessing ? (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <Wand2 className="text-white animate-spin" size={28} />
                      </motion.div>
                    ) : state.isListening ? (
                      <motion.div
                        key="listening"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-white"
                      >
                        <Square size={28} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-white group-hover:scale-110 transition-transform"
                      >
                        <Mic size={28} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </div>
            
            {/* Status Text */}
            <div className="mt-6">
              <div className="text-2xl font-bold text-white mb-2">
                {state.isProcessing && 'Processing with Pro Voice Filter...'}
                {state.isListening && !state.isProcessing && 'Listening...'}
                {!state.isListening && !state.isProcessing && 'Ready for Voice Input'}
              </div>
              
              <div className="text-white/70">
                {state.isProcessing && 'Applying AI enhancements and grammar optimization'}
                {state.isListening && !state.isProcessing && `Speaking in ${state.currentMode} mode`}
                {!state.isListening && !state.isProcessing && 'Click the microphone to start speaking'}
              </div>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {[
              { 
                key: 'proVoiceFilter', 
                label: 'Pro Voice Filter', 
                icon: Wand2,
                description: 'AI-powered speech enhancement'
              },
              { 
                key: 'whisperMode', 
                label: 'Whisper Mode', 
                icon: settings.whisperMode ? VolumeX : Volume2,
                description: 'Enhanced quiet speech detection'
              },
              { 
                key: 'previewMode', 
                label: 'Preview Mode', 
                icon: MessageSquare,
                description: 'Show text before inserting'
              }
            ].map((setting) => (
              <button
                key={setting.key}
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  [setting.key]: !prev[setting.key as keyof typeof settings] 
                }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  settings[setting.key as keyof typeof settings]
                    ? 'bg-sktch-hot-pink/20 text-sktch-hot-pink border border-sktch-hot-pink/40'
                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
                }`}
                title={setting.description}
              >
                <setting.icon size={16} />
                <span>{setting.label}</span>
              </button>
            ))}
          </div>

          {/* Error Display */}
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-center"
            >
              {state.error}
            </motion.div>
          )}

          {/* Output Display */}
          <AnimatePresence>
            {state.processedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 border border-white/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="text-sktch-hot-pink" size={18} />
                    Processed Output ({state.currentMode} mode)
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className="p-2 bg-sktch-hot-pink/20 hover:bg-sktch-hot-pink/30 rounded-lg transition-colors text-sktch-hot-pink"
                      title="Use this text"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                  {state.processedText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Tips */}
          <div className="mt-6 text-center">
            <div className="text-white/60 text-sm">
              💡 <strong>Pro tips:</strong> Try saying "new paragraph", "make it bold", or "undo that" for advanced control
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}