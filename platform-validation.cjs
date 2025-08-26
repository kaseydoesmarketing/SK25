#!/usr/bin/env node

/**
 * SKTCH Platform Validation Script
 * Comprehensive testing of web application and Chrome extension integration
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}: Found`, colors.green);
    return true;
  } else {
    log(`❌ ${description}: Missing`, colors.red);
    return false;
  }
}

function validateJSON(filePath, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    log(`✅ ${description}: Valid JSON`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description}: Invalid JSON - ${error.message}`, colors.red);
    return false;
  }
}

function checkWebAppAccessibility(callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      log(`✅ Web Application: Accessible at http://localhost:3001`, colors.green);
      callback(true);
    } else {
      log(`❌ Web Application: HTTP ${res.statusCode}`, colors.red);
      callback(false);
    }
  });

  req.on('timeout', () => {
    log(`❌ Web Application: Request timeout`, colors.red);
    callback(false);
  });

  req.on('error', (err) => {
    log(`❌ Web Application: Connection error - ${err.message}`, colors.red);
    callback(false);
  });

  req.setTimeout(5000);
  req.end();
}

async function runValidation() {
  log(`${colors.bold}🚀 SKTCH Platform Validation${colors.reset}\n`);

  let passed = 0;
  let total = 0;

  // Chrome Extension Validation
  log(`${colors.blue}📦 Chrome Extension Validation${colors.reset}`);
  
  const extensionChecks = [
    ['/Users/kvimedia/SKTCH/dist/manifest.json', 'Extension manifest.json'],
    ['/Users/kvimedia/SKTCH/dist/background.js', 'Background script'],
    ['/Users/kvimedia/SKTCH/dist/content.js', 'Content script'],
    ['/Users/kvimedia/SKTCH/dist/popup.html', 'Popup HTML'],
    ['/Users/kvimedia/SKTCH/dist/popup.js', 'Popup script'],
    ['/Users/kvimedia/SKTCH/dist/hud.css', 'HUD styles'],
    ['/Users/kvimedia/SKTCH/dist/icons/icon16.png', 'Icon 16px'],
    ['/Users/kvimedia/SKTCH/dist/icons/icon48.png', 'Icon 48px'],
    ['/Users/kvimedia/SKTCH/dist/icons/icon128.png', 'Icon 128px']
  ];

  extensionChecks.forEach(([filePath, description]) => {
    total++;
    if (checkFileExists(filePath, description)) {
      passed++;
    }
  });

  // Validate JSON files
  total++;
  if (validateJSON('/Users/kvimedia/SKTCH/dist/manifest.json', 'Extension manifest JSON')) {
    passed++;
  }

  // Web Application Validation  
  log(`\n${colors.blue}🌐 Web Application Validation${colors.reset}`);
  
  const webAppChecks = [
    ['/Users/kvimedia/SKTCH/web-app/package.json', 'Web app package.json'],
    ['/Users/kvimedia/SKTCH/web-app/next.config.ts', 'Next.js configuration'],
    ['/Users/kvimedia/SKTCH/web-app/tailwind.config.ts', 'Tailwind configuration'],
    ['/Users/kvimedia/SKTCH/web-app/src/app/page.tsx', 'Homepage component'],
    ['/Users/kvimedia/SKTCH/web-app/src/app/globals.css', 'Global styles'],
    ['/Users/kvimedia/SKTCH/web-app/src/components/PulseHUDDemo.tsx', 'Pulse HUD demo'],
    ['/Users/kvimedia/SKTCH/web-app/src/components/ui/PulseHUD.tsx', 'Pulse HUD component']
  ];

  webAppChecks.forEach(([filePath, description]) => {
    total++;
    if (checkFileExists(filePath, description)) {
      passed++;
    }
  });

  // Test web app accessibility
  log('\n🔗 Testing Web Application Accessibility...');
  return new Promise((resolve) => {
    total++;
    checkWebAppAccessibility((isAccessible) => {
      if (isAccessible) {
        passed++;
      }
      
      // Final Results
      log(`\n${colors.bold}📊 Validation Results${colors.reset}`);
      const percentage = Math.round((passed / total) * 100);
      
      if (percentage >= 90) {
        log(`✅ Platform Status: ${passed}/${total} checks passed (${percentage}%)`, colors.green);
        log(`🎉 SKTCH Platform is ready for deployment!`, colors.green);
      } else if (percentage >= 70) {
        log(`⚠️  Platform Status: ${passed}/${total} checks passed (${percentage}%)`, colors.yellow);
        log(`🔧 Some issues need attention before deployment`, colors.yellow);
      } else {
        log(`❌ Platform Status: ${passed}/${total} checks passed (${percentage}%)`, colors.red);
        log(`🚨 Critical issues prevent deployment`, colors.red);
      }

      log(`\n${colors.bold}🔗 Access Links:${colors.reset}`);
      log(`📱 Web Application: http://localhost:3001`, colors.blue);
      log(`🧩 Chrome Extension: Load /Users/kvimedia/SKTCH/dist in chrome://extensions/`, colors.blue);
      
      resolve({ passed, total, percentage });
    });
  });
}

// Run validation
if (require.main === module) {
  runValidation().catch(console.error);
}

module.exports = { runValidation };