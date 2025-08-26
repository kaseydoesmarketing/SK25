/**
 * SKTCH Background Service Worker - Manages extension lifecycle and permissions
 * Handles keyboard shortcuts, storage, and cross-tab communication
 */

class SKTCHBackgroundService {
  constructor() {
    this.init();
  }

  init() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle keyboard shortcuts
    chrome.commands.onCommand.addListener((command) => {
      this.handleCommand(command);
    });

    // Handle messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle tab updates for context awareness
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    console.log('[SKTCH Background] Service worker initialized');
  }

  async handleInstallation(details) {
    if (details.reason === 'install') {
      // First-time installation
      await this.setDefaultSettings();
      await this.showWelcomePage();
    } else if (details.reason === 'update') {
      // Extension update
      await this.handleUpdate(details);
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      // Core settings
      hotkey: 'Ctrl+Shift+V',
      defaultMode: 'note',
      autoSubmit: false,
      
      // Voice settings
      language: 'en-US',
      voiceFilter: true,
      echoWhisper: false,
      sensitivity: 'medium',
      
      // Performance settings
      latencyWarning: 250,
      maxRecordingTime: 300, // 5 minutes
      
      // Privacy settings
      localProcessing: true,
      telemetry: false,
      
      // Usage tracking for freemium model
      usageMinutes: 0,
      isPro: false,
      firstUse: new Date().toISOString()
    };

    await chrome.storage.sync.set({ sktchSettings: defaultSettings });
    console.log('[SKTCH Background] Default settings initialized');
  }

  async showWelcomePage() {
    // Create welcome tab
    await chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html'),
      active: true
    });
  }

  async handleUpdate(details) {
    const { previousVersion } = details;
    console.log(`[SKTCH Background] Updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
    
    // Handle any migration logic here
    await this.migrateSettings(previousVersion);
  }

  async migrateSettings(fromVersion) {
    const { sktchSettings } = await chrome.storage.sync.get('sktchSettings');
    if (!sktchSettings) return;

    // Future migration logic would go here
    console.log('[SKTCH Background] Settings migration completed');
  }

  async handleCommand(command) {
    if (command === 'activate_sktch') {
      // Get active tab and inject activation command
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (activeTab && activeTab.id) {
        try {
          await chrome.tabs.sendMessage(activeTab.id, {
            type: 'SKTCH_ACTIVATE',
            source: 'keyboard_shortcut'
          });
        } catch (error) {
          console.error('[SKTCH Background] Failed to activate on tab:', error);
          
          // Try injecting content script if not already present
          await this.injectContentScript(activeTab.id);
          
          // Retry activation
          setTimeout(async () => {
            try {
              await chrome.tabs.sendMessage(activeTab.id, {
                type: 'SKTCH_ACTIVATE',
                source: 'keyboard_shortcut'
              });
            } catch (retryError) {
              console.error('[SKTCH Background] Retry activation failed:', retryError);
            }
          }, 100);
        }
      }
    }
  }

  async injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      
      console.log('[SKTCH Background] Content script injected');
    } catch (error) {
      console.error('[SKTCH Background] Content script injection failed:', error);
    }
  }

  async handleMessage(message, sender, sendResponse) {
    const { type, data } = message;

    switch (type) {
      case 'GET_SETTINGS':
        const { sktchSettings } = await chrome.storage.sync.get('sktchSettings');
        sendResponse({ settings: sktchSettings });
        break;

      case 'UPDATE_SETTINGS':
        await chrome.storage.sync.set({ sktchSettings: data.settings });
        sendResponse({ success: true });
        break;

      case 'TRACK_USAGE':
        await this.trackUsage(data.minutes);
        sendResponse({ success: true });
        break;

      case 'CHECK_PERMISSIONS':
        const hasPermissions = await this.checkPermissions(data.permissions);
        sendResponse({ hasPermissions });
        break;

      case 'REQUEST_PERMISSIONS':
        const granted = await this.requestPermissions(data.permissions);
        sendResponse({ granted });
        break;

      case 'GET_TAB_CONTEXT':
        const context = await this.getTabContext(sender.tab);
        sendResponse({ context });
        break;

      case 'LOG_ERROR':
        this.logError(data.error, data.context);
        sendResponse({ logged: true });
        break;

      default:
        console.warn('[SKTCH Background] Unknown message type:', type);
        sendResponse({ error: 'Unknown message type' });
    }
  }

  async trackUsage(minutes) {
    const { sktchSettings } = await chrome.storage.sync.get('sktchSettings');
    if (!sktchSettings) return;

    sktchSettings.usageMinutes += minutes;
    
    // Check if user has exceeded free tier (60 minutes)
    if (!sktchSettings.isPro && sktchSettings.usageMinutes > 60) {
      // Show upgrade notification
      this.showUpgradeNotification();
    }

    await chrome.storage.sync.set({ sktchSettings });
    console.log(`[SKTCH Background] Usage tracked: ${sktchSettings.usageMinutes} minutes total`);
  }

  showUpgradeNotification() {
    chrome.notifications.create('sktch-upgrade', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'SKTCH - Upgrade to Pro',
      message: 'You\'ve used your 60 free minutes. Upgrade to Pro for unlimited voice control.',
      buttons: [
        { title: 'Upgrade Now' },
        { title: 'Maybe Later' }
      ]
    });

    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (notificationId === 'sktch-upgrade') {
        if (buttonIndex === 0) {
          // Open upgrade page
          chrome.tabs.create({ url: 'https://sktch.ai/upgrade' });
        }
        chrome.notifications.clear(notificationId);
      }
    });
  }

  async checkPermissions(permissions) {
    return new Promise((resolve) => {
      chrome.permissions.contains({
        permissions: permissions,
        origins: ['<all_urls>']
      }, resolve);
    });
  }

  async requestPermissions(permissions) {
    return new Promise((resolve) => {
      chrome.permissions.request({
        permissions: permissions,
        origins: ['<all_urls>']
      }, resolve);
    });
  }

  async getTabContext(tab) {
    if (!tab) return null;

    return {
      url: tab.url,
      title: tab.title,
      hostname: new URL(tab.url).hostname,
      timestamp: Date.now()
    };
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Could implement tab-specific optimizations here
    if (changeInfo.status === 'complete' && tab.url) {
      // Tab finished loading - could pre-inject content script on known compatible sites
      const compatibleSites = [
        'claude.ai',
        'chat.openai.com',
        'notion.so',
        'docs.google.com',
        'mail.google.com',
        'slack.com'
      ];

      const hostname = new URL(tab.url).hostname;
      if (compatibleSites.some(site => hostname.includes(site))) {
        // Pre-inject for better performance
        setTimeout(() => {
          this.injectContentScript(tabId).catch(() => {
            // Silently fail - content script might already be present
          });
        }, 1000);
      }
    }
  }

  logError(error, context) {
    console.error('[SKTCH Background] Error logged:', {
      error,
      context,
      timestamp: new Date().toISOString(),
      version: chrome.runtime.getManifest().version
    });

    // Could send to error tracking service here if telemetry is enabled
  }
}

// Initialize background service
new SKTCHBackgroundService();