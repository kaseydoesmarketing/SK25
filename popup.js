/**
 * SKTCH Popup Interface - Extension popup functionality
 * Manages settings, status display, and user interactions
 */

class SKTCHPopup {
  constructor() {
    this.settings = null;
    this.init();
  }

  async init() {
    try {
      await this.loadSettings();
      this.setupEventListeners();
      this.updateUI();
      
      console.log('[SKTCH Popup] Initialized successfully');
    } catch (error) {
      console.error('[SKTCH Popup] Initialization failed:', error);
    }
  }

  async loadSettings() {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_SETTINGS'
    });
    
    this.settings = response.settings || {};
  }

  setupEventListeners() {
    // Toggle switches
    const voiceFilterToggle = document.getElementById('voiceFilterToggle');
    const echoWhisperToggle = document.getElementById('echoWhisperToggle');
    const autoSubmitToggle = document.getElementById('autoSubmitToggle');
    
    voiceFilterToggle.addEventListener('click', () => {
      this.toggleSetting('voiceFilter', voiceFilterToggle);
    });
    
    echoWhisperToggle.addEventListener('click', () => {
      this.toggleSetting('echoWhisper', echoWhisperToggle);
    });
    
    autoSubmitToggle.addEventListener('click', () => {
      this.toggleSetting('autoSubmit', autoSubmitToggle);
    });
    
    // Action buttons
    const activateBtn = document.getElementById('activateBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const upgradeBtn = document.getElementById('upgradeBtn');
    
    activateBtn.addEventListener('click', () => this.activateVoiceControl());
    settingsBtn.addEventListener('click', () => this.openSettings());
    
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => this.openUpgradePage());
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('action-btn')) {
        e.target.click();
      }
    });
  }

  async toggleSetting(settingKey, toggleElement) {
    this.settings[settingKey] = !this.settings[settingKey];
    toggleElement.classList.toggle('active', this.settings[settingKey]);
    
    await this.saveSettings();
  }

  async saveSettings() {
    await chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      data: { settings: this.settings }
    });
  }

  updateUI() {
    // Update toggle states
    const voiceFilterToggle = document.getElementById('voiceFilterToggle');
    const echoWhisperToggle = document.getElementById('echoWhisperToggle');
    const autoSubmitToggle = document.getElementById('autoSubmitToggle');
    
    voiceFilterToggle.classList.toggle('active', this.settings.voiceFilter);
    echoWhisperToggle.classList.toggle('active', this.settings.echoWhisper);
    autoSubmitToggle.classList.toggle('active', this.settings.autoSubmit);
    
    // Update usage statistics
    this.updateUsageStats();
    
    // Show upgrade section if needed
    this.updateUpgradeSection();
  }

  updateUsageStats() {
    const usageMinutes = document.getElementById('usageMinutes');
    const avgLatency = document.getElementById('avgLatency');
    
    if (usageMinutes) {
      usageMinutes.textContent = Math.round(this.settings.usageMinutes || 0);
    }
    
    // Latency would come from active content script
    if (avgLatency) {
      avgLatency.textContent = '125ms'; // Placeholder
    }
  }

  updateUpgradeSection() {
    const upgradeSection = document.getElementById('upgradeSection');
    const freeUsage = document.getElementById('freeUsage');
    const usageBar = document.getElementById('usageBar');
    
    if (!this.settings.isPro && this.settings.usageMinutes > 50) {
      upgradeSection.style.display = 'block';
      
      const usedMinutes = Math.min(this.settings.usageMinutes, 60);
      const percentage = (usedMinutes / 60) * 100;
      
      freeUsage.textContent = usedMinutes;
      usageBar.style.width = `${percentage}%`;
      
      if (percentage >= 100) {
        usageBar.style.background = '#ff4444';
      }
    }
  }

  async activateVoiceControl() {
    try {
      const activateBtn = document.getElementById('activateBtn');
      const statusText = document.getElementById('statusText');
      
      activateBtn.textContent = 'Activating...';
      activateBtn.disabled = true;
      
      // Get active tab
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!activeTab) {
        throw new Error('No active tab found');
      }
      
      // Send activation message
      await chrome.tabs.sendMessage(activeTab.id, {
        type: 'SKTCH_ACTIVATE',
        source: 'popup'
      });
      
      statusText.textContent = 'Voice control activated';
      
      // Close popup after successful activation
      setTimeout(() => {
        window.close();
      }, 500);
      
    } catch (error) {
      console.error('[SKTCH Popup] Activation failed:', error);
      
      const activateBtn = document.getElementById('activateBtn');
      const statusText = document.getElementById('statusText');
      
      activateBtn.textContent = 'Activate Voice Control';
      activateBtn.disabled = false;
      statusText.textContent = 'Activation failed - try refreshing the page';
      
      // Try injecting content script
      this.injectContentScript();
    }
  }

  async injectContentScript() {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['src/content.js']
      });
      
      // Retry activation after injection
      setTimeout(() => {
        this.activateVoiceControl();
      }, 500);
      
    } catch (error) {
      console.error('[SKTCH Popup] Content script injection failed:', error);
    }
  }

  openSettings() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
    window.close();
  }

  openUpgradePage() {
    chrome.tabs.create({
      url: 'https://sktch.ai/upgrade'
    });
    window.close();
  }

  // Helper method to format latency display
  formatLatency(ms) {
    if (ms < 100) return `${ms}ms`;
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SKTCHPopup();
  });
} else {
  new SKTCHPopup();
}