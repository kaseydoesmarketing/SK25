# SKTCH Development Setup

## Quick Start - localhost Demo

### 1. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `/Users/kvimedia/SKTCH` directory

### 2. Test the Extension
1. Navigate to https://claude.ai or any text input site
2. Click the SKTCH extension icon in the toolbar to open popup
3. Or use the keyboard shortcut: `Cmd+Shift+V` (Mac) / `Ctrl+Shift+V` (Windows)
4. The Pulse HUD should appear with voice controls

### 3. Features to Test
- **Voice Activation**: Click "Activate Voice Control" or use hotkey
- **Flow Modes**: Switch between Note, Prompt, and Tasks modes  
- **Voice Commands**: Try "new paragraph", "send message", "cancel"
- **Cross-site Compatibility**: Test on Gmail, Slack, Notion, ChatGPT

### 4. Performance Monitoring
- Check the latency indicator (blue dot in HUD)
- Aim for <250ms voice processing latency
- Monitor text insertion speed (<800ms target)

## Architecture Overview

```
SKTCH/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup interface  
├── popup.js              # Popup functionality
├── hud.css               # Pulse HUD styles
├── src/
│   ├── background.js     # Background service worker
│   ├── content.js        # Content script (main logic)
│   ├── components/
│   │   └── PulseHUD.js   # HUD component class
│   ├── modules/
│   │   └── voiceEngine.js # Voice processing engine
│   └── styles/
│       └── design-system.css # Design tokens & CSS vars
└── icons/                # Extension icons
```

## Key Components

### 1. Voice Engine (`src/modules/voiceEngine.js`)
- WebSpeech API integration
- <250ms latency optimization
- Pro Voice Filter (removes "ums", polishes grammar)
- Echo Whisper mode support

### 2. Pulse HUD (`src/components/PulseHUD.js`)  
- Purple-pink gradient design system
- Organic pulsing animations synchronized to voice
- Context-aware Flow Modes
- Accessibility compliant

### 3. Content Script (`src/content.js`)
- Universal web input detection
- Context-aware mode suggestions
- Cross-origin injection handling
- Natural Vox Commands parsing

### 4. Background Service (`src/background.js`)
- Keyboard shortcut handling
- Usage tracking (freemium model)
- Cross-tab communication
- Settings persistence

## Development Commands

```bash
# No build required - direct file loading
# Just reload extension in chrome://extensions after changes

# To test changes:
1. Make code changes
2. Go to chrome://extensions  
3. Click reload button on SKTCH extension
4. Test on target websites
```

## Debugging

### Console Logs
- Content Script: Inspect any web page, check Console
- Background Script: chrome://extensions → SKTCH → "service worker" link  
- Popup: Right-click extension icon → "Inspect popup"

### Common Issues
1. **"Failed to inject content script"** - Refresh target page
2. **HUD not appearing** - Check microphone permissions
3. **Voice not recognized** - Verify WebSpeech API support in browser
4. **Text insertion fails** - Check for CSP blocks in DevTools

## Next Steps for Production

1. **Performance Testing**: Load test with multiple tabs
2. **Cross-browser Support**: Test Firefox/Safari compatibility  
3. **Security Audit**: Review permissions and CSP compliance
4. **A11y Validation**: Screen reader and keyboard navigation testing
5. **Build Optimization**: Minimize bundle size for Chrome Web Store