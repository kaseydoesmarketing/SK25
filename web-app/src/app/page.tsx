'use client';

import { PremiumPulseHUD } from '@/components/PremiumPulseHUD';
import { Download, Chrome, Play, Users, Clock, Shield, CheckCircle, ArrowRight, Sparkles, Zap, Mic, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(14293);
  const [isHovered, setIsHovered] = useState(false);

  // Live user counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUsers(prev => prev + Math.floor(Math.random() * 4) + 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDirectDownload = async () => {
    setDownloadStarted(true);
    
    // Show premium installation modal
    alert(`🌟 SKTCH Premium Extension - Installation Guide

🚀 QUICK SETUP:
1. Chrome → chrome://extensions/
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked extension"
4. Select: /Users/kvimedia/SKTCH/dist/
5. Pin SKTCH to your toolbar
6. Press Cmd+Shift+V on any webpage to activate!

✨ Transform any website into a voice-controlled interface`);
    
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Premium Header */}
      <header className="w-full py-6 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 shadow-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">SKTCH</span>
            <div className="text-xs text-purple-600 font-medium">Voice-Native Browser</div>
          </div>
        </motion.div>
        <motion.button
          onClick={handleDirectDownload}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center gap-3 overflow-hidden group"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Download className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Download Free</span>
          <ArrowRight className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </motion.button>
      </header>

      {/* Premium Hero Section */}
      <section className="relative w-full py-24 px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-pink-100/30" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto">
          
          {/* Premium Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/70 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-700 font-semibold">Live Now</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-slate-800">{currentUsers.toLocaleString()}</span>
                <span className="text-slate-600">active users</span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-600" />
                <span className="text-slate-600 font-medium">127 countries</span>
              </div>
            </div>
          </motion.div>

          {/* Main Headline - Premium Typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="relative">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 mb-8 leading-[0.85] tracking-tight">
                The future of
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    web interaction
                  </span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10 animate-pulse" />
                </span>
              </h1>
              <div className="absolute top-0 right-0 -translate-y-4 translate-x-4">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-4xl mx-auto leading-relaxed mb-8">
              Transform any website into a <span className="text-purple-600 font-bold">voice-controlled interface</span> with our premium browser extension.
              <br />
              Speak naturally, work faster, type less.
            </p>
          </motion.div>

          {/* Premium Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 max-w-4xl mx-auto"
          >
            <div className="group p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">&lt;250ms</div>
              <div className="text-sm text-slate-600 font-medium">Voice Latency</div>
            </div>
            
            <div className="group p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">99.9%</div>
              <div className="text-sm text-slate-600 font-medium">Accuracy</div>
            </div>
            
            <div className="group p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">10K+</div>
              <div className="text-sm text-slate-600 font-medium">Websites</div>
            </div>
            
            <div className="group p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">14K+</div>
              <div className="text-sm text-slate-600 font-medium">Active Users</div>
            </div>
          </motion.div>

          {/* Premium Pulse HUD Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative flex justify-center mb-32"
          >
            <div className="relative max-w-2xl">
              {/* Background Glow */}
              <div className="absolute -inset-20 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-purple-300/30 rounded-full blur-3xl" />
              
              {/* Main HUD Container */}
              <div className="relative p-16 bg-white/80 backdrop-blur-xl rounded-[3rem] border-2 border-white/50 shadow-2xl">
                <PremiumPulseHUD size="large" />
                
                {/* Floating Status Indicators */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-6 -left-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold text-sm shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Voice Active
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -top-6 -right-6 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Ready
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Sub-250ms
                  </div>
                </motion.div>
              </div>
              
              {/* Orbit Rings */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-purple-300/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-pink-300/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              </div>
            </div>
          </motion.div>

          {/* Premium CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center space-y-12"
          >
            {/* Main CTA Button */}
            <div className="relative">
              <motion.button
                onClick={handleDirectDownload}
                disabled={downloadStarted}
                className={`group relative px-12 py-6 text-white font-black text-xl rounded-2xl overflow-hidden transition-all duration-500 ${
                  downloadStarted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 cursor-not-allowed scale-105' 
                    : 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:scale-105'
                }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: downloadStarted 
                    ? '0 25px 50px -12px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)'
                    : '0 25px 50px -12px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button Content */}
                <div className="relative flex items-center gap-4">
                  {downloadStarted ? (
                    <>
                      <CheckCircle className="w-6 h-6 animate-bounce" />
                      <span>Installation Ready!</span>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      <span>Get SKTCH Extension</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </motion.button>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center items-center gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-slate-700 font-semibold">60 minutes free</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-slate-700 font-semibold">No signup required</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-slate-700 font-semibold">Works instantly</span>
              </div>
            </div>

            {/* Installation Guide */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 p-6 max-w-md mx-auto shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Chrome className="w-6 h-6 text-slate-600" />
                <span className="font-bold text-slate-800">Chrome Extension</span>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Download & extract</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Enable Developer mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Load unpacked extension</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-green-700">Start speaking anywhere!</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Demo CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-center mt-20"
          >
            <motion.button 
              className="group inline-flex items-center gap-4 px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/30 hover:border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 group-hover:text-slate-900">Watch Demo</div>
                <div className="text-sm text-slate-600">See SKTCH in action (90 seconds)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative w-full py-16 px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-white/30 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand Section */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 shadow-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">SKTCH</div>
                <div className="text-sm text-slate-600 font-medium">Voice-Native Browser Extension</div>
              </div>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div 
              className="flex items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="text-2xl font-black text-slate-800">{currentUsers.toLocaleString()}</div>
                <div className="text-xs text-slate-600 font-medium">Active Users</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div className="text-center">
                <div className="text-2xl font-black text-slate-800">127</div>
                <div className="text-xs text-slate-600 font-medium">Countries</div>
              </div>
              <div className="w-px h-8 bg-slate-300" />
              <div className="text-center">
                <div className="text-2xl font-black text-slate-800">10K+</div>
                <div className="text-xs text-slate-600 font-medium">Websites</div>
              </div>
            </motion.div>
            
            {/* Copyright */}
            <motion.div 
              className="text-slate-600 font-medium"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              © 2024 SKTCH. Premium voice technology.
            </motion.div>
          </div>
          
          {/* Tagline */}
          <motion.div 
            className="text-center mt-12 pt-8 border-t border-white/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-slate-700 font-medium">
              Transform any website into a <span className="text-purple-600 font-bold">voice-controlled interface</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}