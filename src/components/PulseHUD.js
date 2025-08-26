/**
 * SKTCH Pulse HUD Component - Premium voice interface overlay
 * Manages the visual pulse interface, status display, and user interactions
 */

class SKTCHPulseHUD {
  constructor() {
    this.container = null;
    this.isVisible = false;
    this.currentMode = 'note'; // note, prompt, tasks
    this.transcriptionText = '';
    this.isListening = false;
    this.latencyWarning = false;
    
    this.createHUD();
  }

  createHUD() {
    // Create isolated container
    this.container = document.createElement('div');
    this.container.className = 'sktch-hud-container';
    this.container.innerHTML = this.getHUDTemplate();
    
    // Append to body with highest z-index
    document.body.appendChild(this.container);
    
    // Bind event listeners
    this.bindEvents();
    
    // Start hidden
    this.hide();
  }

  getHUDTemplate() {
    return `
      <div class="sktch-hud" role="dialog" aria-label="SKTCH Voice Control Interface" tabindex="0">
        <!-- Performance Indicator -->
        <div class="sktch-perf-indicator" title="Performance Status"></div>
        
        <!-- Pulse Core with Rings -->
        <div class="sktch-pulse-wrapper">
          <div class="sktch-pulse-rings">
            <div class="sktch-pulse-ring"></div>
            <div class="sktch-pulse-ring"></div>
            <div class="sktch-pulse-ring"></div>
          </div>
          <div class="sktch-pulse-core" aria-hidden="true"></div>
        </div>
        
        <!-- Status Display -->
        <div class="sktch-status">
          <div class="sktch-status-text">Ready to listen</div>
        </div>
        
        <!-- Flow Mode Selector -->
        <div class="sktch-flow-mode" role="tablist" aria-label="Flow Modes">
          <button class="sktch-flow-badge sktch-flow-badge--active" 
                  role="tab" 
                  aria-selected="true" 
                  data-mode="note">Note</button>
          <button class="sktch-flow-badge" 
                  role="tab" 
                  aria-selected="false" 
                  data-mode="prompt">Prompt</button>
          <button class="sktch-flow-badge" 
                  role="tab" 
                  aria-selected="false" 
                  data-mode="tasks">Tasks</button>
        </div>
        
        <!-- Transcription Display -->
        <div class="sktch-transcription" 
             role="log" 
             aria-live="polite" 
             aria-label="Voice transcription">
          <span class="sktch-sr-only">Transcription:</span>
          <div class="sktch-transcription-content"></div>
        </div>
        
        <!-- Controls -->
        <div class="sktch-controls">
          <button class="sktch-control-btn sktch-btn-cancel" 
                  type="button" 
                  aria-label="Cancel voice input">Cancel</button>
          <button class="sktch-control-btn sktch-btn-insert" 
                  type="button" 
                  aria-label="Insert transcribed text">Insert</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const hud = this.container.querySelector('.sktch-hud');
    
    // Flow mode switching
    const flowBadges = this.container.querySelectorAll('.sktch-flow-badge');
    flowBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        this.setFlowMode(e.target.dataset.mode);
      });
    });
    
    // Control buttons
    const cancelBtn = this.container.querySelector('.sktch-btn-cancel');
    const insertBtn = this.container.querySelector('.sktch-btn-insert');
    
    cancelBtn.addEventListener('click', () => this.onCancel());
    insertBtn.addEventListener('click', () => this.onInsert());
    
    // Keyboard navigation
    hud.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Prevent event bubbling to host page
    this.container.addEventListener('click', (e) => e.stopPropagation());
    this.container.addEventListener('keydown', (e) => e.stopPropagation());
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'Escape':
        this.onCancel();
        break;
      case 'Enter':
        if (e.ctrlKey || e.metaKey) {
          this.onInsert();
        }
        break;
      case 'Tab':
        // Handle tab navigation within HUD
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  show() {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.container.style.display = 'block';
    
    const hud = this.container.querySelector('.sktch-hud');
    hud.classList.add('sktch-hud--active');
    
    // Focus the HUD for accessibility
    setTimeout(() => {
      hud.focus();
    }, 100);
    
    // Dispatch custom event
    this.dispatchEvent('sktch:hud:show');
  }

  hide() {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    const hud = this.container.querySelector('.sktch-hud');
    
    hud.classList.add('sktch-hud--exit');
    
    setTimeout(() => {
      this.container.style.display = 'none';
      hud.classList.remove('sktch-hud--active', 'sktch-hud--exit');
    }, 400);
    
    this.dispatchEvent('sktch:hud:hide');
  }

  setFlowMode(mode) {
    this.currentMode = mode;
    
    // Update visual state
    const badges = this.container.querySelectorAll('.sktch-flow-badge');
    badges.forEach(badge => {
      const isActive = badge.dataset.mode === mode;
      badge.classList.toggle('sktch-flow-badge--active', isActive);
      badge.setAttribute('aria-selected', isActive.toString());
    });
    
    // Update status text based on mode
    const statusMessages = {
      note: 'Note mode - Natural dictation',
      prompt: 'Prompt mode - AI instruction',
      tasks: 'Tasks mode - Action items'
    };
    
    this.setStatus(statusMessages[mode]);
    this.dispatchEvent('sktch:mode:change', { mode });
  }

  setStatus(text, type = 'info') {
    const statusText = this.container.querySelector('.sktch-status-text');
    statusText.textContent = text;
    
    // Add status type class
    statusText.className = `sktch-status-text sktch-status--${type}`;
  }

  setListening(isListening) {
    this.isListening = isListening;
    const pulseCore = this.container.querySelector('.sktch-pulse-core');
    
    if (isListening) {
      pulseCore.classList.add('sktch-pulse--listening');
      this.setStatus('Listening...', 'listening');
    } else {
      pulseCore.classList.remove('sktch-pulse--listening');
      this.setStatus('Ready to listen', 'ready');
    }
  }

  setProcessing(isProcessing) {
    const pulseCore = this.container.querySelector('.sktch-pulse-core');
    
    if (isProcessing) {
      pulseCore.classList.add('sktch-pulse--processing');
      this.setStatus('Processing...', 'processing');
    } else {
      pulseCore.classList.remove('sktch-pulse--processing');
    }
  }

  updateTranscription(text, isFinal = false) {
    const transcriptionContent = this.container.querySelector('.sktch-transcription-content');
    const transcription = this.container.querySelector('.sktch-transcription');
    
    transcriptionContent.textContent = text;
    this.transcriptionText = text;
    
    // Visual feedback for interim vs final
    if (isFinal) {
      transcription.classList.remove('sktch-transcription--interim');
    } else {
      transcription.classList.add('sktch-transcription--interim');
    }
    
    // Auto-scroll to bottom
    transcription.scrollTop = transcription.scrollHeight;
  }

  updatePerformance(latency) {
    const perfIndicator = this.container.querySelector('.sktch-perf-indicator');
    
    if (latency > 500) {
      perfIndicator.className = 'sktch-perf-indicator sktch-perf--error';
      this.latencyWarning = true;
    } else if (latency > 250) {
      perfIndicator.className = 'sktch-perf-indicator sktch-perf--warning';
      this.latencyWarning = true;
    } else {
      perfIndicator.className = 'sktch-perf-indicator';
      this.latencyWarning = false;
    }
    
    perfIndicator.title = `Latency: ${Math.round(latency)}ms`;
  }

  onCancel() {
    this.transcriptionText = '';
    this.updateTranscription('');
    this.dispatchEvent('sktch:action:cancel');
    this.hide();
  }

  onInsert() {
    if (this.transcriptionText.trim()) {
      this.dispatchEvent('sktch:action:insert', { 
        text: this.transcriptionText,
        mode: this.currentMode 
      });
      this.hide();
    }
  }

  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: { ...detail, source: 'sktch-hud' },
      bubbles: false,
      cancelable: true
    });
    this.container.dispatchEvent(event);
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.isVisible = false;
  }

  // Accessibility methods
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sktch-sr-only';
    announcement.textContent = message;
    
    this.container.appendChild(announcement);
    
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }
}

export default SKTCHPulseHUD;