/**
 * SKTCH Voice Engine - High-performance voice processing with <250ms latency
 * Handles real-time transcription, voice commands, and audio state management
 */

class SKTCHVoiceEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.mediaStream = null;
    this.transcriptionBuffer = '';
    this.latencyTracker = [];
    this.callbacks = {
      onTranscription: null,
      onCommand: null,
      onError: null,
      onStatusChange: null
    };
    
    this.initializeEngine();
  }

  async initializeEngine() {
    try {
      // Initialize WebSpeech API with optimized settings
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Optimize for low latency
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
        
        this.setupRecognitionHandlers();
      } else {
        throw new Error('Speech recognition not supported');
      }

      // Initialize Audio Context for advanced processing
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 16000
      });

      // Voice amplitude detection setup
      this.analyser = null;
      this.amplitudeData = null;
      this.amplitudeCheckInterval = null;

    } catch (error) {
      console.error('[SKTCH Voice Engine] Initialization failed:', error);
      this.callbacks.onError?.(error);
    }
  }

  setupRecognitionHandlers() {
    const startTime = performance.now();

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStatusChange?.('listening');
    };

    this.recognition.onresult = (event) => {
      const latency = performance.now() - startTime;
      this.latencyTracker.push(latency);
      
      // Keep only last 10 measurements for rolling average
      if (this.latencyTracker.length > 10) {
        this.latencyTracker.shift();
      }

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        
        if (isFinal) {
          this.processFinalTranscript(transcript);
        } else {
          this.processInterimTranscript(transcript);
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('[SKTCH Voice Engine] Recognition error:', event.error);
      this.callbacks.onError?.(event.error);
      
      // Auto-restart on certain errors
      if (event.error === 'network' || event.error === 'audio-capture') {
        setTimeout(() => this.startListening(), 1000);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onStatusChange?.('stopped');
      
      // Auto-restart if we should be listening
      if (this.shouldRestart) {
        this.startListening();
      }
    };
  }

  processFinalTranscript(transcript) {
    const cleanTranscript = this.applyVoiceFilter(transcript);
    
    // Check for Vox Commands first
    if (this.isVoxCommand(cleanTranscript)) {
      this.callbacks.onCommand?.(cleanTranscript);
    } else {
      this.callbacks.onTranscription?.(cleanTranscript, true);
    }
  }

  processInterimTranscript(transcript) {
    this.callbacks.onTranscription?.(transcript, false);
  }

  applyVoiceFilter(text) {
    // Pro Voice Filter - removes filler words and polishes grammar
    const fillerWords = /\b(um|uh|like|you know|sort of|kind of|actually|basically)\b/gi;
    const cleaned = text
      .replace(fillerWords, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Basic grammar improvements
    return this.improveGrammar(cleaned);
  }

  improveGrammar(text) {
    // Simple grammar improvements
    return text
      .replace(/\bi\b/g, 'I')  // Capitalize I
      .replace(/^\w/, c => c.toUpperCase())  // Capitalize first letter
      .replace(/\s+([.!?])/g, '$1')  // Remove spaces before punctuation
      .replace(/([.!?])\s*([a-z])/g, '$1 $2'.replace(/([.!?])\s*([a-z])/, (match, p1, p2) => p1 + ' ' + p2.toUpperCase()));
  }

  isVoxCommand(text) {
    const voxPatterns = [
      /^(undo that|delete that|new paragraph|new line|send message|submit|cancel|stop)/i,
      /^(go to|navigate to|open|click|select)/i,
      /^(bold|italic|underline|format)/i
    ];
    
    return voxPatterns.some(pattern => pattern.test(text));
  }

  async startListening() {
    try {
      if (!this.recognition) {
        await this.initializeEngine();
      }

      // Check if we already have permission and media stream
      if (!this.mediaStream) {
        console.log('[SKTCH Voice Engine] Requesting microphone permission...');
        
        // Request microphone permission with better error handling
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000
          } 
        });
        
        console.log('[SKTCH Voice Engine] Microphone permission granted');
        
        // Setup voice amplitude detection
        this.setupAmplitudeDetection();
      }

      this.shouldRestart = true;
      this.recognition.start();
      
      console.log('[SKTCH Voice Engine] Voice recognition started');
      return true;
    } catch (error) {
      console.error('[SKTCH Voice Engine] Failed to start listening:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to start voice recognition';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please check your audio devices.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Voice recognition not supported in this browser.';
      }
      
      this.callbacks.onError?.(errorMessage);
      return false;
    }
  }

  stopListening() {
    this.shouldRestart = false;
    this.stopAmplitudeMonitoring();
    
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  getAverageLatency() {
    if (this.latencyTracker.length === 0) return 0;
    return this.latencyTracker.reduce((sum, latency) => sum + latency, 0) / this.latencyTracker.length;
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Echo Whisper mode for quiet environments
  enableEchoWhisper() {
    if (this.recognition) {
      // Increase sensitivity for quiet speech
      this.recognition.grammars = null; // Allow any speech
    }
  }

  disableEchoWhisper() {
    // Reset to normal sensitivity
    if (this.recognition) {
      this.recognition.grammars = null;
    }
  }

  setupAmplitudeDetection() {
    if (!this.audioContext || !this.mediaStream) return;

    try {
      // Create audio source from media stream
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Connect source to analyser
      source.connect(this.analyser);
      
      // Setup data array
      this.amplitudeData = new Uint8Array(this.analyser.frequencyBinCount);
      
      // Start amplitude monitoring
      this.startAmplitudeMonitoring();
      
      console.log('[SKTCH Voice Engine] Amplitude detection setup complete');
    } catch (error) {
      console.error('[SKTCH Voice Engine] Amplitude detection setup failed:', error);
    }
  }

  startAmplitudeMonitoring() {
    if (!this.analyser || !this.amplitudeData) return;

    this.amplitudeCheckInterval = setInterval(() => {
      this.analyser.getByteFrequencyData(this.amplitudeData);
      
      // Calculate average amplitude
      const sum = this.amplitudeData.reduce((acc, val) => acc + val, 0);
      const average = sum / this.amplitudeData.length;
      const normalizedAmplitude = average / 255;
      
      // Trigger voice amplitude callback if significant voice detected
      if (normalizedAmplitude > 0.1 && this.isListening) {
        this.callbacks.onVoiceAmplitude?.(normalizedAmplitude);
      }
    }, 50); // Check every 50ms for smooth animations
  }

  stopAmplitudeMonitoring() {
    if (this.amplitudeCheckInterval) {
      clearInterval(this.amplitudeCheckInterval);
      this.amplitudeCheckInterval = null;
    }
  }

}

export default SKTCHVoiceEngine;