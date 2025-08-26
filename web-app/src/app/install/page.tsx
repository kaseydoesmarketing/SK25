'use client';

import { motion } from 'framer-motion';
import { 
  Chrome, 
  Download, 
  Settings, 
  Mic, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Headphones
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function InstallPage() {
  const [copiedPath, setCopiedPath] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText('/Users/kvimedia/SKTCH/dist/');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sktch-deep-purple via-sktch-electric-purple to-sktch-hot-pink">
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
          <h1 className="text-2xl font-bold sktch-gradient-text">SKTCH</h1>
        </Link>
        <Link 
          href="/"
          className="px-5 py-2.5 glass-card text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
        >
          Back to Home
        </Link>
      </nav>

      {/* Header */}
      <section className="px-6 md:px-8 py-16 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Install</span>{' '}
            <span className="sktch-gradient-text">SKTCH</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Transform your browser into a voice-controlled interface in under 60 seconds
          </p>
          <div className="flex items-center justify-center gap-4 text-sktch-mint">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">No account required to start</span>
          </div>
        </motion.div>
      </section>

      {/* Installation Methods */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Method 1: Chrome Web Store */}
            <motion.div
              className="glass-card p-8 rounded-3xl border border-sktch-mint/30"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sktch-mint to-sktch-cool-blue flex items-center justify-center mx-auto mb-4">
                  <Chrome className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Chrome Web Store</h2>
                <p className="text-white/70">Recommended for most users</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-mint/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-mint font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Visit Chrome Web Store</h3>
                    <a 
                      href="https://chrome.google.com/webstore/detail/sktch"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sktch-mint to-sktch-cool-blue text-white font-semibold rounded-lg hover:shadow-sktch-glow transition-all duration-300"
                    >
                      <Chrome className="w-4 h-4" />
                      Install from Chrome Web Store
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-mint/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-mint font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Click "Add to Chrome"</h3>
                    <p className="text-white/70 text-sm">
                      The extension will be added to your browser automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-mint/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-mint font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Grant Permissions</h3>
                    <p className="text-white/70 text-sm">
                      Allow microphone access when prompted
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-black/20 rounded-xl border border-sktch-mint/20">
                <div className="flex items-center gap-2 text-sktch-mint mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Automatic Updates</span>
                </div>
                <p className="text-white/60 text-sm">
                  Chrome Web Store installations receive automatic updates and security patches
                </p>
              </div>
            </motion.div>

            {/* Method 2: Developer Mode */}
            <motion.div
              className="glass-card p-8 rounded-3xl border border-sktch-electric-purple/30"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sktch-electric-purple to-sktch-hot-pink flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Developer Mode</h2>
                <p className="text-white/70">For testing and development</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-electric-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-electric-purple font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Open Chrome Extensions</h3>
                    <div className="bg-black/20 rounded-lg p-3 font-mono text-sm text-sktch-electric-purple">
                      chrome://extensions/
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-electric-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-electric-purple font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Enable Developer Mode</h3>
                    <p className="text-white/70 text-sm">
                      Toggle the "Developer mode" switch in the top right
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sktch-electric-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sktch-electric-purple font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Load Unpacked Extension</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Click "Load unpacked" and select the SKTCH folder:
                    </p>
                    <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
                      <code className="font-mono text-sm text-sktch-electric-purple">
                        /Users/kvimedia/SKTCH/dist/
                      </code>
                      <button
                        onClick={copyPath}
                        className="px-3 py-1 bg-sktch-electric-purple/20 hover:bg-sktch-electric-purple/30 rounded transition-colors flex items-center gap-2"
                      >
                        {copiedPath ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-sktch-mint" />
                            <span className="text-sktch-mint text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-sktch-electric-purple" />
                            <span className="text-sktch-electric-purple text-sm">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-black/20 rounded-xl border border-sktch-hot-pink/20">
                <div className="flex items-center gap-2 text-sktch-hot-pink mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Development Version</span>
                </div>
                <p className="text-white/60 text-sm">
                  This method loads the latest development version with all features enabled
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* First Time Setup */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12 rounded-3xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              First Time <span className="sktch-gradient-text">Setup</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Permissions */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sktch-mint/20 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-sktch-mint" />
                  </div>
                  Grant Permissions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 px-4 bg-black/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sktch-mint flex-shrink-0" />
                    <div>
                      <div className="text-white/80 font-medium">Microphone Access</div>
                      <div className="text-white/50 text-sm">Required for voice recognition</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 px-4 bg-black/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sktch-mint flex-shrink-0" />
                    <div>
                      <div className="text-white/80 font-medium">Active Tab Access</div>
                      <div className="text-white/50 text-sm">Detect input fields on websites</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 px-4 bg-black/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sktch-mint flex-shrink-0" />
                    <div>
                      <div className="text-white/80 font-medium">Storage Access</div>
                      <div className="text-white/50 text-sm">Save your preferences locally</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Installation */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sktch-hot-pink/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-sktch-hot-pink" />
                  </div>
                  Test Installation
                </h3>
                <div className="space-y-4">
                  <div className="py-3 px-4 bg-black/20 rounded-xl">
                    <div className="text-white/80 font-medium mb-1">1. Visit any website</div>
                    <div className="text-white/50 text-sm">Try Gmail, ChatGPT, or Claude</div>
                  </div>
                  <div className="py-3 px-4 bg-black/20 rounded-xl">
                    <div className="text-white/80 font-medium mb-1">2. Press Cmd+Shift+V</div>
                    <div className="text-white/50 text-sm">Activate SKTCH voice control</div>
                  </div>
                  <div className="py-3 px-4 bg-black/20 rounded-xl">
                    <div className="text-white/80 font-medium mb-1">3. See the Pulse HUD</div>
                    <div className="text-white/50 text-sm">Purple-pink gradient should appear</div>
                  </div>
                  <div className="py-3 px-4 bg-black/20 rounded-xl">
                    <div className="text-white/80 font-medium mb-1">4. Start speaking</div>
                    <div className="text-white/50 text-sm">Watch your words appear in real-time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                <span className="sktch-gradient-text">Pro Tips</span> for Best Experience
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-black/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-sktch-mint/20 flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-6 h-6 text-sktch-mint" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Use Quality Microphone</h4>
                  <p className="text-white/70 text-sm">
                    Built-in laptop mics work, but external microphones improve accuracy
                  </p>
                </div>
                
                <div className="text-center p-6 bg-black/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-sktch-electric-purple/20 flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-sktch-electric-purple" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Customize Settings</h4>
                  <p className="text-white/70 text-sm">
                    Access settings with Cmd+Shift+S to adjust voice filter and themes
                  </p>
                </div>
                
                <div className="text-center p-6 bg-black/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-sktch-hot-pink/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-sktch-hot-pink" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Practice Commands</h4>
                  <p className="text-white/70 text-sm">
                    Try "undo that", "new paragraph", and "send message" for faster workflows
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12 rounded-3xl border border-sktch-coral/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              <span className="sktch-gradient-text">Troubleshooting</span>
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-black/20 rounded-xl border border-sktch-coral/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-sktch-coral" />
                  Extension Not Loading?
                </h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Ensure Chrome version 88+ (check chrome://version/)</li>
                  <li>• Verify extension folder path is correct</li>
                  <li>• Check if Developer Mode is enabled</li>
                  <li>• Restart Chrome after installation</li>
                </ul>
              </div>

              <div className="p-6 bg-black/20 rounded-xl border border-sktch-coral/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-sktch-coral" />
                  Voice Not Working?
                </h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Allow microphone permission in Chrome settings</li>
                  <li>• Check system microphone isn't muted</li>
                  <li>• Try refreshing the page and pressing Cmd+Shift+V again</li>
                  <li>• Ensure no other apps are using the microphone</li>
                </ul>
              </div>

              <div className="p-6 bg-black/20 rounded-xl border border-sktch-coral/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-sktch-coral" />
                  Pulse HUD Not Appearing?
                </h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Click on a text input field first</li>
                  <li>• Try the keyboard shortcut: Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows)</li>
                  <li>• Check if the website has iframe restrictions</li>
                  <li>• Reload the extension from chrome://extensions/</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/60 mb-4">Still having issues?</p>
              <Link 
                href="/support"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sktch-mint to-sktch-cool-blue text-white font-semibold rounded-xl hover:shadow-sktch-glow transition-all duration-300"
              >
                Get Support
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="glass-card p-8 md:p-12 rounded-3xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to <span className="sktch-gradient-text">Transform</span> Your Workflow?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              SKTCH is installed and ready. Start speaking on any website to experience the magic of voice-first browsing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/demo"
                className="px-8 py-4 bg-sktch-primary text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Try Interactive Demo
              </Link>
              <Link 
                href="/features"
                className="px-8 py-4 glass-card text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
              >
                Explore Features
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
              <span className="text-xl font-bold sktch-gradient-text">SKTCH</span>
            </div>
            <div className="flex gap-8 text-white/70">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="text-center text-white/50 text-sm mt-8">
            © 2024 SKTCH. Premium voice-native browser extension platform.
          </div>
        </div>
      </footer>
    </div>
  );
}