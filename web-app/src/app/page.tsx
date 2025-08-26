'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Mic, Download, ArrowRight, Chrome, Sparkles, Timer, Shield, Award, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Dynamic imports for heavy components to improve initial loading
const PremiumPulseHUD = dynamic(() => import('@/components/PremiumPulseHUD').then(mod => ({ default: mod.PremiumPulseHUD })), {
  loading: () => (
    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse flex items-center justify-center">
      <Mic className="w-8 h-8 text-purple-400" />
    </div>
  ),
  ssr: false // Disable SSR for interactive component
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default function Home() {
  const [isHUDActive, setIsHUDActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(12847);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  // Subtle user counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    try {
      setDownloadStarted(true);
      const response = await fetch('/download-extension');
      const data = await response.json();
      
      // For now, provide install instructions
      if (data.installInstructions) {
        alert(`Installation Steps:\n${data.installInstructions.steps.join('\n')}`);
      }
    } catch (error) {
      alert('Download will be available soon! For now, please visit chrome://extensions/ and load the unpacked extension from /Users/kvimedia/SKTCH/dist/');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Clean White Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-100 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-8 h-8 rounded-2xl bg-gradient-to-br from-sktch-hot-pink via-sktch-electric-purple to-sktch-deep-purple shadow-lg"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.4 }}
            />
            <span className="text-2xl font-bold tracking-tight text-gray-900">SKTCH</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/features" className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link 
              href="/auth/signin"
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-all duration-300 text-sm font-medium border border-gray-200 hover:border-gray-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area with proper landmark */}
      <main role="main">
        {/* Lively Hero Section - White Background */}
        <section ref={heroRef} className="relative pt-32 pb-24 px-6 md:px-8 bg-gradient-to-b from-purple-50/30 to-white" aria-labelledby="hero-heading">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Live Users Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-full border border-purple-200/50 mb-10 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-purple-800 tracking-wide">
              {currentUser.toLocaleString()} users speaking live
            </span>
          </motion.div>

          {/* Bold Typography Hierarchy */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] max-w-5xl mx-auto">
              Speak anywhere,
              <br />
              <span className="bg-gradient-to-r from-sktch-hot-pink via-sktch-electric-purple to-sktch-deep-purple bg-clip-text text-transparent">
                type nowhere
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-medium leading-relaxed max-w-4xl mx-auto">
              The premium voice-native browser extension for professionals
            </p>
          </motion.div>

          {/* Lively Performance Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-16 text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <Timer className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">Sub-250ms</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">99.9% accuracy</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-semibold">4.9★ rated</span>
            </div>
          </motion.div>

          {/* Premium Circular Pulse HUD - Center Stage */}
          <motion.div
            className="mb-20 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Clean white container */}
              <div className="relative p-16 rounded-4xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-purple-500/10">
                {/* Subtle top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                
                {/* The Premium Circular Pulse HUD */}
                <div className="relative">
                  <PremiumPulseHUD 
                    size="large" 
                    onActivate={() => setIsHUDActive(true)} 
                  />
                  
                  {/* Clean floating labels */}
                  <motion.div
                    className="absolute -top-8 -left-8 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                  >
                    Voice Control
                  </motion.div>
                  <motion.div
                    className="absolute -top-8 -right-8 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 }}
                  >
                    Ready
                  </motion.div>
                </div>
              </div>

              {/* Soft ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-purple-200/20 rounded-4xl blur-3xl -z-10" />
            </div>
          </motion.div>

          {/* Prominent Download Now Button */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.button
              onClick={handleDownload}
              className="px-12 py-6 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 min-w-[320px] justify-center relative overflow-hidden group"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Download SKTCH extension for free - 60 minutes included, no signup required"
            >
              <Download className="w-6 h-6" />
              <div className="text-left">
                <div>Download Now for Free</div>
                <div className="text-base opacity-90 font-medium">60 minutes • No signup required</div>
              </div>
              {downloadStarted && <CheckCircle className="w-6 h-6" />}
              
              {/* Premium button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </motion.button>
          </motion.div>

          {/* Trust indicators with style */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <div className="text-lg text-gray-500 font-medium mb-4">
              Works on Gmail • ChatGPT • Claude • Slack • 1000+ sites
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <span>Chrome Extension</span>
              <span>•</span>
              <span>Instant Install</span>
              <span>•</span>
              <span>Works Everywhere</span>
            </div>
          </motion.div>
        </motion.div>
        </section>

        {/* Lively Features Overview */}
        <section className="py-24 px-6 md:px-8 bg-gradient-to-b from-white to-gray-50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          {/* Engaging section header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 id="features-heading" className="text-5xl md:text-6xl font-black tracking-tight mb-8">
              Voice control that actually
              <span className="block bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple bg-clip-text text-transparent">
                works everywhere
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Transform any website into a voice-controlled interface with professional accuracy
            </p>
          </motion.div>

          {/* Vibrant feature grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="w-10 h-10" />,
                title: "Pro Voice Filter",
                description: "Removes 'ums' and polishes grammar automatically for professional output",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: <Sparkles className="w-10 h-10" />,
                title: "Context-Aware",
                description: "Automatically detects websites and optimizes for docs, AI chats, or tasks",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: <Timer className="w-10 h-10" />,
                title: "Sub-250ms Latency",
                description: "Real-time transcription that keeps up with your natural speaking pace",
                color: "from-blue-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-purple-200 transition-all duration-500 shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        </section>

        {/* Testimonials - Clean integration */}
        <section className="py-20 bg-gray-50" aria-labelledby="testimonials-heading">
          <TestimonialsSection featured={true} showMetrics={false} />
        </section>

        {/* Final CTA - Vibrant style */}
        <section className="py-24 px-6 md:px-8 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="cta-heading">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 id="cta-heading" className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-gray-900">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-medium leading-relaxed">
            Join thousands of professionals who've upgraded to voice-first browsing
          </p>
          <motion.button
            onClick={handleDownload}
            className="px-12 py-6 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Get started with SKTCH extension for free - 60 minutes free, upgrade to Pro for unlimited use"
          >
            Get Started Free
          </motion.button>
          <div className="mt-6 text-gray-500 text-lg">
            60 minutes free • Upgrade to Pro for unlimited use
          </div>
        </motion.div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="py-16 px-6 md:px-8 bg-white border-t border-gray-200" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple shadow-lg" />
            <span className="text-2xl font-bold text-gray-900">SKTCH</span>
          </div>
          <div className="flex gap-8 text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors font-medium">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors font-medium">Terms</Link>
            <Link href="/support" className="hover:text-gray-900 transition-colors font-medium">Support</Link>
          </div>
        </div>
        <div className="text-center text-gray-600 text-base mt-8 font-medium">
          © 2024 SKTCH. Premium voice-native browser extension platform.
        </div>
      </footer>
    </div>
  );
}