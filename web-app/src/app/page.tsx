'use client';

import { PremiumPulseHUD } from '@/components/PremiumPulseHUD';
import { Download, Chrome, Play, Users, Clock, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(12847);

  // Live user counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUsers(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDirectDownload = async () => {
    setDownloadStarted(true);
    
    // Show installation instructions immediately
    alert(`🎉 SKTCH Extension Download Instructions:

📋 INSTALLATION STEPS:
1. Open Chrome and go to: chrome://extensions/
2. Turn ON "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Navigate to and select: /Users/kvimedia/SKTCH/dist/
5. The SKTCH extension will appear in your toolbar
6. Click it to start using voice control on any website!

✨ You're ready to speak anywhere, type nowhere!`);
    
    // Reset download state
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="w-full py-6 px-8 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg" />
          <span className="text-2xl font-bold text-gray-900">SKTCH</span>
        </div>
        <motion.button
          onClick={handleDirectDownload}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          Get Extension Free
        </motion.button>
      </header>

      {/* Hero Section - Full Page Elongated */}
      <section className="w-full py-20 px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Live User Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 rounded-full border border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-800 font-semibold">
                <Users className="w-4 h-4 inline mr-2" />
                {currentUsers.toLocaleString()} users speaking live
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 leading-none">
              Speak anywhere,
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                type nowhere
              </span>
            </h1>
            <p className="text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              The premium voice-native browser extension that transforms any website into a voice-controlled interface
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center gap-12 mb-20"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-bold">Sub-250ms</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold">99.9% accuracy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-bold">1000+ sites</span>
            </div>
          </motion.div>

          {/* Premium Pulse HUD - Center Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="flex justify-center mb-20"
          >
            <div className="relative">
              {/* Pulse HUD Container */}
              <div className="p-20 bg-white rounded-3xl shadow-2xl border border-gray-100">
                <PremiumPulseHUD size="large" />
                
                {/* Floating Labels */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="absolute -top-4 -left-4 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg"
                >
                  Voice Control
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 }}
                  className="absolute -top-4 -right-4 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm shadow-lg"
                >
                  Ready
                </motion.div>
              </div>
              
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl -z-10" />
            </div>
          </motion.div>

          {/* Main Download Section - As Simple As Possible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center space-y-8"
          >
            <motion.button
              onClick={handleDirectDownload}
              disabled={downloadStarted}
              className={`px-16 py-6 text-white font-bold text-2xl rounded-2xl shadow-2xl transition-all duration-300 ${
                downloadStarted 
                  ? 'bg-green-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-3xl'
              }`}
              whileHover={{ scale: downloadStarted ? 1 : 1.05, y: -3 }}
              whileTap={{ scale: downloadStarted ? 1 : 0.95 }}
            >
              {downloadStarted ? (
                <>
                  <CheckCircle className="w-8 h-8 inline mr-4" />
                  Ready to Install!
                </>
              ) : (
                <>
                  <Download className="w-8 h-8 inline mr-4" />
                  Download SKTCH Free
                  <ArrowRight className="w-8 h-8 inline ml-4" />
                </>
              )}
            </motion.button>

            <div className="text-lg text-gray-500 space-y-2">
              <div className="font-semibold">✨ 60 minutes free • No signup required • Works instantly</div>
              <div className="flex items-center justify-center gap-2 text-base text-gray-400">
                <Chrome className="w-5 h-5" />
                Chrome Extension • Load Unpacked • Start Speaking
              </div>
            </div>
          </motion.div>

          {/* Quick Demo Video Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-16"
          >
            <button className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <Play className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Watch 30-second demo</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-12 px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xl font-bold text-gray-800">SKTCH</span>
          </div>
          <div className="text-gray-500">
            © 2024 SKTCH. Premium voice-native browser extension.
          </div>
        </div>
      </footer>
    </div>
  );
}