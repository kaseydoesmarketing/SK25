# SKTCH Chrome Extension Testing Guide

## Installation Instructions

### Prerequisites
- Google Chrome browser
- Built extension files (located in `/Users/kvimedia/SKTCH/dist`)

### Step-by-Step Installation:

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in your Chrome browser
   - OR: Menu (⋮) → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" ON (top-right corner)
   - This enables loading unpacked extensions

3. **Load the SKTCH Extension**
   - Click "Load unpacked" button
   - Navigate to `/Users/kvimedia/SKTCH/dist` folder
   - Select the `dist` folder and click "Select Folder"

4. **Verify Installation**
   - SKTCH extension should appear in your extensions list
   - Extension icon should be visible in Chrome toolbar
   - Version should show: 0.1.0

## Testing Checklist

### Basic Functionality
- [ ] Extension loads without console errors
- [ ] SKTCH icon appears in Chrome toolbar
- [ ] Clicking extension icon opens popup interface
- [ ] Popup displays SKTCH branding and controls

### Voice Activation
- [ ] Keyboard shortcut works: `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows)
- [ ] Voice recording activates with shortcut
- [ ] Microphone permissions granted correctly
- [ ] Voice processing completes within 250ms target

### Website Compatibility Testing

Test on these supported websites:

#### Gmail (mail.google.com)
- [ ] Extension detects Gmail context
- [ ] Voice input works in compose window
- [ ] Pulse HUD appears correctly
- [ ] Note mode: Voice converts to email draft
- [ ] Tasks mode: Creates task items from voice

#### ChatGPT (chat.openai.com)
- [ ] Extension detects ChatGPT context  
- [ ] Voice input works in chat input
- [ ] Prompt mode: Voice converts to optimized prompts
- [ ] Note mode: Voice converts to structured notes
- [ ] Response processing works smoothly

#### Claude (claude.ai)
- [ ] Extension detects Claude context
- [ ] Voice input works in conversation
- [ ] Prompt mode: Voice converts to effective Claude prompts
- [ ] Context switching works between modes

#### Slack (app.slack.com)
- [ ] Extension detects Slack workspace
- [ ] Voice input works in message compose
- [ ] Note mode: Creates formatted Slack messages
- [ ] Tasks mode: Creates actionable items

#### Notion (notion.so)
- [ ] Extension detects Notion pages
- [ ] Voice input works in page editing
- [ ] Note mode: Creates formatted Notion blocks
- [ ] Tasks mode: Creates todo items with proper formatting

### Visual Interface Testing

#### Pulse HUD Animations
- [ ] Pulse HUD appears when voice activated
- [ ] Signature gradient animations display correctly
- [ ] Animation framerate maintains 60fps
- [ ] HUD positioning adapts to different page layouts
- [ ] Visual indicators show recording/processing states

#### Design System Compliance
- [ ] SKTCH gradient colors display correctly
- [ ] Typography matches design system
- [ ] Interactive elements respond appropriately
- [ ] Responsive design works on different screen sizes

### Performance Validation

#### Latency Testing
- [ ] Voice activation: < 100ms from keypress to recording
- [ ] Voice processing: < 250ms from voice end to text output
- [ ] Context switching: < 50ms between Flow Modes
- [ ] Page load impact: < 10ms additional load time

#### Resource Usage
- [ ] Memory usage stays under 50MB per tab
- [ ] CPU usage spikes briefly during voice processing only
- [ ] No memory leaks during extended use
- [ ] Background processing minimal when inactive

### Integration Testing

#### Flow Mode Detection
- [ ] **Note Mode**: Correctly identifies note-taking contexts
- [ ] **Prompt Mode**: Detects AI chat interfaces
- [ ] **Tasks Mode**: Recognizes task/todo management areas
- [ ] Context switching works seamlessly between modes

#### Voice Processing Quality
- [ ] Accurate transcription for clear speech
- [ ] Handles background noise appropriately
- [ ] Processes various accents and speaking styles
- [ ] Error handling for unclear audio

### Error Handling
- [ ] Graceful handling of microphone permission denied
- [ ] Appropriate error messages for network issues
- [ ] Recovery from voice processing failures
- [ ] Fallback behavior on unsupported websites

## Debugging and Troubleshooting

### Common Issues:

1. **Extension Won't Load**
   - Check that developer mode is enabled
   - Verify `/Users/kvimedia/SKTCH/dist` contains all required files
   - Look for manifest.json errors in Chrome console

2. **Voice Not Working**
   - Check microphone permissions: chrome://settings/content/microphone
   - Test microphone in other applications
   - Check browser console for JavaScript errors

3. **Poor Performance**
   - Close other resource-heavy tabs
   - Check Chrome task manager for memory usage
   - Restart Chrome browser

### Debug Console Access:
- Right-click extension icon → "Inspect popup"
- Open DevTools on target website pages
- Check Console tab for error messages
- Monitor Network tab for API calls

## Acceptance Criteria

Extension is ready for production when:
- [ ] All basic functionality tests pass
- [ ] Performance meets specified requirements (< 250ms)
- [ ] Works flawlessly on all 5 supported websites
- [ ] Visual animations maintain 60fps
- [ ] No console errors or warnings
- [ ] Resource usage within acceptable limits
- [ ] User experience is smooth and intuitive

## Next Steps

Once Chrome Extension testing is complete:
1. Document any issues found
2. Verify fixes if problems discovered
3. Proceed with web application integration testing
4. Prepare for production deployment