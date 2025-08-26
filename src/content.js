/**
 * SKTCH Content Script - Universal web input integration
 * Handles injection into all web inputs, context detection, and text insertion
 */

import SKTCHVoiceEngine from './modules/voiceEngine.js';
import SKTCHPulseHUD from './components/PulseHUD.js';

class SKTCHContentScript {
  constructor() {
    this.voiceEngine = null;
    this.hud = null;
    this.activeElement = null;
    this.contextDetector = null;
    this.isActive = false;
    this.insertionQueue = [];
    
    this.init();
  }

  async init() {
    try {
      // Initialize core components
      this.voiceEngine = new SKTCHVoiceEngine();
      this.hud = new SKTCHPulseHUD();
      this.contextDetector = new SKTCHContextDetector();
      
      // Setup component communication
      this.setupVoiceEngineCallbacks();
      this.setupHUDEventListeners();
      this.setupKeyboardListeners();
      
      // Initialize context detection
      this.contextDetector.startMonitoring();
      
      console.log('[SKTCH] Content script initialized successfully');
      
    } catch (error) {
      console.error('[SKTCH] Content script initialization failed:', error);
    }
  }

  setupVoiceEngineCallbacks() {
    this.voiceEngine.setCallbacks({
      onTranscription: (text, isFinal) => {
        this.hud.updateTranscription(text, isFinal);
        
        // Update performance indicator
        const latency = this.voiceEngine.getAverageLatency();
        this.hud.updatePerformance(latency);
        
        if (isFinal) {
          this.handleFinalTranscription(text);
        }
      },
      
      onCommand: (command) => {
        this.handleVoxCommand(command);
      },
      
      onError: (error) => {
        this.hud.setStatus(`Error: ${error}`, 'error');
        console.error('[SKTCH Voice Engine] Error:', error);
      },
      
      onStatusChange: (status) => {
        this.hud.setListening(status === 'listening');
      }
    });
  }

  setupHUDEventListeners() {
    this.hud.container.addEventListener('sktch:action:insert', (e) => {
      const { text, mode } = e.detail;
      this.insertText(text, mode);
    });
    
    this.hud.container.addEventListener('sktch:action:cancel', () => {
      this.stopListening();
    });
    
    this.hud.container.addEventListener('sktch:mode:change', (e) => {
      // Context-aware mode changes can trigger different voice processing
      const { mode } = e.detail;
      this.handleModeChange(mode);
    });
  }

  setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      // Activation hotkey: Cmd/Ctrl + Shift + V
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        this.toggle();
      }
      
      // ESC to cancel
      if (e.key === 'Escape' && this.isActive) {
        this.stopListening();
      }
    });
  }

  async toggle() {
    if (this.isActive) {
      this.stopListening();
    } else {
      await this.startListening();
    }
  }

  async startListening() {
    try {
      // Detect active input element
      this.activeElement = this.contextDetector.getActiveInput();
      
      if (!this.activeElement) {
        this.hud.setStatus('No input field detected', 'warning');
        this.hud.show();
        
        setTimeout(() => {
          this.hud.hide();
        }, 2000);
        return;
      }
      
      // Show HUD
      this.hud.show();
      this.isActive = true;
      
      // Set appropriate flow mode based on context
      const suggestedMode = this.contextDetector.getSuggestedMode(this.activeElement);
      this.hud.setFlowMode(suggestedMode);
      
      // Start voice recognition
      const started = await this.voiceEngine.startListening();
      
      if (!started) {
        this.hud.setStatus('Failed to start voice recognition', 'error');
        setTimeout(() => this.stopListening(), 2000);
      }
      
    } catch (error) {
      console.error('[SKTCH] Failed to start listening:', error);
      this.hud.setStatus('Activation failed', 'error');
      setTimeout(() => this.stopListening(), 2000);
    }
  }

  stopListening() {
    this.isActive = false;
    this.voiceEngine.stopListening();
    this.hud.hide();
    this.activeElement = null;
  }

  handleFinalTranscription(text) {
    // Apply context-aware processing based on current mode
    const mode = this.hud.currentMode;
    const processedText = this.processTextForMode(text, mode);
    
    this.hud.updateTranscription(processedText, true);
  }

  processTextForMode(text, mode) {
    switch (mode) {
      case 'note':
        // Natural dictation - apply Pro Voice Filter
        return this.voiceEngine.applyVoiceFilter(text);
      
      case 'prompt':
        // AI instruction mode - preserve natural language
        return text.trim();
      
      case 'tasks':
        // Task mode - format as action items
        return this.formatAsTask(text);
      
      default:
        return text;
    }
  }

  formatAsTask(text) {
    // Simple task formatting
    if (!text.startsWith('- ') && !text.startsWith('* ')) {
      return `- ${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    }
    return text;
  }

  handleVoxCommand(command) {
    const commandLower = command.toLowerCase();
    
    if (commandLower.includes('undo') || commandLower.includes('delete')) {
      this.handleUndoCommand();
    } else if (commandLower.includes('new paragraph')) {
      this.insertText('\n\n');
    } else if (commandLower.includes('new line')) {
      this.insertText('\n');
    } else if (commandLower.includes('send') || commandLower.includes('submit')) {
      this.handleSubmitCommand();
    } else if (commandLower.includes('cancel') || commandLower.includes('stop')) {
      this.stopListening();
    }
  }

  async insertText(text, mode = null) {
    if (!this.activeElement || !text.trim()) return;
    
    const startTime = performance.now();
    
    try {
      const success = await this.contextDetector.insertIntoElement(this.activeElement, text);
      
      const insertionTime = performance.now() - startTime;
      
      if (success && insertionTime < 800) {
        this.hud.setStatus('Text inserted successfully', 'success');
        
        // Brief success indicator
        setTimeout(() => {
          this.stopListening();
        }, 500);
        
      } else if (insertionTime >= 800) {
        this.hud.setStatus('Slow insertion detected', 'warning');
        console.warn('[SKTCH] Insertion took', insertionTime, 'ms');
      } else {
        this.hud.setStatus('Insertion failed', 'error');
      }
      
    } catch (error) {
      console.error('[SKTCH] Text insertion failed:', error);
      this.hud.setStatus('Insertion failed', 'error');
    }
  }

  handleUndoCommand() {
    // Simple undo - remove last inserted text if possible
    if (this.activeElement && this.activeElement.value !== undefined) {
      // For input/textarea elements
      const currentValue = this.activeElement.value;
      // This is a simplified undo - in production, we'd maintain an insertion history
      this.hud.setStatus('Undo not yet implemented', 'info');
    }
  }

  handleSubmitCommand() {
    // Find and trigger submit button or form
    const form = this.activeElement.closest('form');
    if (form) {
      const submitBtn = form.querySelector('[type="submit"], button[type="submit"], .send-button, .submit-button');
      if (submitBtn) {
        submitBtn.click();
        this.stopListening();
        return;
      }
    }
    
    // Look for common submit patterns
    const submitSelectors = [
      '[data-testid*="send"]',
      '[aria-label*="send" i]',
      '.send-btn',
      '.submit-btn',
      'button:contains("Send")',
      'button:contains("Submit")'
    ];
    
    for (const selector of submitSelectors) {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) { // visible check
        btn.click();
        this.stopListening();
        return;
      }
    }
    
    this.hud.setStatus('Submit button not found', 'warning');
  }

  handleModeChange(mode) {
    // Adjust voice processing based on mode
    switch (mode) {
      case 'prompt':
        this.voiceEngine.disableEchoWhisper(); // More natural for AI prompts
        break;
      case 'tasks':
        this.voiceEngine.enableEchoWhisper(); // Better for quick task entry
        break;
      default:
        this.voiceEngine.disableEchoWhisper();
    }
  }
}

/**
 * Context Detection Class - Identifies input elements and suggests appropriate modes
 */
class SKTCHContextDetector {
  constructor() {
    this.inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      'input:not([type])',
      'textarea',
      '[contenteditable="true"]',
      '[contenteditable=""]',
      '.notranslate', // Common in rich text editors
      '[role="textbox"]'
    ];
    
    this.contextPatterns = {
      note: [
        /notion|roam|obsidian|bear|notes/i,
        /blog|article|write|compose/i,
        /document|doc|text/i
      ],
      prompt: [
        /openai|claude|chatgpt|bard|assistant/i,
        /ai|prompt|query/i,
        /playground|console/i
      ],
      tasks: [
        /task|todo|project|issue|ticket/i,
        /jira|asana|trello|linear/i,
        /kanban|board|sprint/i
      ]
    };
  }

  startMonitoring() {
    // Monitor for dynamically added input elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processNewElements(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processNewElements(element) {
    // Check if new element or its children are input elements
    if (this.isInputElement(element)) {
      this.enhanceInputElement(element);
    }
    
    const inputs = element.querySelectorAll(this.inputSelectors.join(','));
    inputs.forEach(input => this.enhanceInputElement(input));
  }

  enhanceInputElement(element) {
    // Add subtle indicator that SKTCH is available
    if (!element.hasAttribute('data-sktch-enhanced')) {
      element.setAttribute('data-sktch-enhanced', 'true');
      
      // Could add subtle visual indicator here
    }
  }

  getActiveInput() {
    const activeElement = document.activeElement;
    
    // Check if currently focused element is an input
    if (this.isInputElement(activeElement)) {
      return activeElement;
    }
    
    // Look for recently focused inputs
    const allInputs = document.querySelectorAll(this.inputSelectors.join(','));
    for (const input of allInputs) {
      if (this.isVisible(input) && this.isFocusable(input)) {
        return input;
      }
    }
    
    return null;
  }

  isInputElement(element) {
    if (!element || !element.tagName) return false;
    
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'input') {
      const type = element.type.toLowerCase();
      return ['text', 'email', 'search', '', undefined].includes(type);
    }
    
    if (tagName === 'textarea') return true;
    
    if (element.hasAttribute('contenteditable')) {
      const editable = element.getAttribute('contenteditable');
      return editable === 'true' || editable === '';
    }
    
    if (element.hasAttribute('role') && element.getAttribute('role') === 'textbox') {
      return true;
    }
    
    return false;
  }

  isVisible(element) {
    return element.offsetParent !== null && 
           getComputedStyle(element).visibility !== 'hidden' &&
           getComputedStyle(element).display !== 'none';
  }

  isFocusable(element) {
    return !element.disabled && !element.readOnly;
  }

  getSuggestedMode(element) {
    const context = this.getElementContext(element);
    
    for (const [mode, patterns] of Object.entries(this.contextPatterns)) {
      if (patterns.some(pattern => pattern.test(context))) {
        return mode;
      }
    }
    
    return 'note'; // Default mode
  }

  getElementContext(element) {
    // Gather context from various sources
    const contexts = [
      element.placeholder || '',
      element.getAttribute('aria-label') || '',
      element.getAttribute('data-testid') || '',
      element.className,
      element.id,
      document.title,
      window.location.hostname
    ];
    
    return contexts.filter(Boolean).join(' ').toLowerCase();
  }

  async insertIntoElement(element, text) {
    try {
      const tagName = element.tagName.toLowerCase();
      
      if (tagName === 'input' || tagName === 'textarea') {
        return this.insertIntoFormInput(element, text);
      } else if (element.hasAttribute('contenteditable')) {
        return this.insertIntoContentEditable(element, text);
      } else if (element.hasAttribute('role') && element.getAttribute('role') === 'textbox') {
        return this.insertIntoAriaTextbox(element, text);
      }
      
      return false;
    } catch (error) {
      console.error('[SKTCH Context Detector] Insertion failed:', error);
      return false;
    }
  }

  insertIntoFormInput(element, text) {
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    const beforeText = element.value.substring(0, startPos);
    const afterText = element.value.substring(endPos);
    
    element.value = beforeText + text + afterText;
    element.selectionStart = element.selectionEnd = startPos + text.length;
    
    // Trigger input events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    return true;
  }

  insertIntoContentEditable(element, text) {
    element.focus();
    
    // Use execCommand for broader compatibility
    if (document.execCommand) {
      return document.execCommand('insertText', false, text);
    }
    
    // Fallback for newer browsers
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
    
    return false;
  }

  insertIntoAriaTextbox(element, text) {
    // Handle custom textbox implementations
    element.focus();
    
    // Try standard approaches first
    if (this.insertIntoContentEditable(element, text)) {
      return true;
    }
    
    // Fallback to setting textContent
    element.textContent = (element.textContent || '') + text;
    
    // Trigger custom events that the component might listen to
    element.dispatchEvent(new CustomEvent('input', { 
      bubbles: true, 
      detail: { value: element.textContent } 
    }));
    
    return true;
  }
}

// Initialize SKTCH when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SKTCHContentScript();
  });
} else {
  new SKTCHContentScript();
}