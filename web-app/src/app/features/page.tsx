'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mic, Zap, Globe, MessageSquare, Sparkles, Volume2, Brain, Shield, 
  Clock, Target, Chrome, ArrowRight, Check, Play, Star, Headphones,
  Settings, Users, Layers, Eye, Wand2, Palette
} from 'lucide-react';

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sktch-deep-purple via-sktch-electric-purple to-sktch-hot-pink">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
          <h1 className="text-2xl font-bold sktch-gradient-text">SKTCH</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-white/90 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/auth/signin" className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-8 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
              <Sparkles className="text-sktch-hot-pink" size={16} />
              <span className="text-sm font-medium text-white/90">Complete Feature Overview</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Voice Control</span>
              <span className="sktch-gradient-text block">Redefined</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Discover every feature that makes SKTCH the most advanced voice-native browser extension
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="sktch-gradient-text">Core Features</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              The foundation of professional voice control technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Zap,
                title: 'Pulse HUD',
                description: 'Beautiful pulsating interface that responds to your voice with sub-250ms latency. Visual feedback that feels magical.',
                features: ['Real-time voice visualization', 'Customizable colors & themes', 'Minimal, non-intrusive design'],
                gradient: 'from-sktch-electric-purple to-sktch-hot-pink'
              },
              {
                icon: Brain,
                title: 'Flow Modes',
                description: 'Intelligent context detection automatically switches between Note, Prompt, and Tasks modes for optimal output.',
                features: ['Auto-detects writing context', 'Smart formatting rules', 'Mode-specific optimizations'],
                gradient: 'from-sktch-mint to-sktch-cool-blue'
              },
              {
                icon: Wand2,
                title: 'Pro Voice Filter',
                description: 'Advanced AI processing removes filler words, improves grammar, and polishes your speech into professional text.',
                features: ['Removes "ums" and hesitations', 'Grammar enhancement', 'Professional tone adjustment'],
                gradient: 'from-sktch-sun-gold to-sktch-coral'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 group hover:scale-105 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 flex items-center justify-center shadow-sktch-glow group-hover:shadow-sktch-elevated transition-all duration-300`}>
                    <feature.icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 sktch-gradient-text">{feature.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                        <Check size={14} className="text-sktch-mint" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Universal</span>
              <span className="sktch-gradient-text"> Compatibility</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Works seamlessly across 1000+ websites and platforms you already use
            </p>
          </motion.div>

          <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-sktch-deep-purple/20 via-sktch-electric-purple/20 to-sktch-hot-pink/20"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                {[
                  { name: 'ChatGPT', category: 'AI Tools' },
                  { name: 'Claude', category: 'AI Tools' },
                  { name: 'Gmail', category: 'Email' },
                  { name: 'Slack', category: 'Communication' },
                  { name: 'Notion', category: 'Productivity' },
                  { name: 'Linear', category: 'Project Management' },
                  { name: 'Figma', category: 'Design' },
                  { name: 'Google Docs', category: 'Documents' },
                  { name: 'Trello', category: 'Project Management' },
                  { name: 'Discord', category: 'Communication' },
                  { name: 'LinkedIn', category: 'Social' },
                  { name: 'Twitter', category: 'Social' }
                ].map((platform, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-4 text-center group hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="text-white font-medium text-sm mb-1">{platform.name}</div>
                    <div className="text-xs text-white/60">{platform.category}</div>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-sktch-mint rounded-full animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-white/80 mb-4">+ 1000 more websites automatically supported</p>
                <button className="px-6 py-3 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-medium rounded-lg hover:shadow-sktch-glow transition-all duration-300">
                  See Full Compatibility List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="sktch-gradient-text">Advanced Features</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Professional-grade capabilities for power users and teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Volume2,
                title: 'Whisper Mode',
                description: 'Perfect for quiet environments, libraries, or late-night work sessions. Advanced noise cancellation ensures accuracy even with minimal volume.',
                features: ['Ultra-sensitive microphone processing', 'Background noise filtering', 'Optimized for quiet speech'],
                gradient: 'from-sktch-cool-blue to-sktch-mint'
              },
              {
                icon: MessageSquare,
                title: 'Vox Commands',
                description: 'Voice commands like "undo that", "new paragraph", "make it bold" give you complete control without touching the keyboard.',
                features: ['Natural language commands', 'Context-aware actions', 'Customizable command phrases'],
                gradient: 'from-sktch-electric-purple to-sktch-hot-pink'
              },
              {
                icon: Eye,
                title: 'Preview Mode',
                description: 'See exactly what will be inserted before committing. Edit, refine, or regenerate your text with visual confirmation.',
                features: ['Real-time text preview', 'Edit before insertion', 'Multiple output options'],
                gradient: 'from-sktch-sun-gold to-sktch-coral'
              },
              {
                icon: Headphones,
                title: 'Ambient Sounds',
                description: 'Built-in focus sounds including rain, coffee shop, forest, and white noise to enhance your concentration while working.',
                features: ['8 ambient sound packs', 'Volume mixing controls', 'Timer-based sessions'],
                gradient: 'from-sktch-deep-purple to-sktch-electric-purple'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 group hover:scale-105 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 flex items-center justify-center shadow-sktch-glow group-hover:shadow-sktch-elevated transition-all duration-300`}>
                    <feature.icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 sktch-gradient-text">{feature.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                        <Check size={14} className="text-sktch-mint" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Enterprise Features */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Team &</span>
              <span className="sktch-gradient-text"> Enterprise</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Powerful collaboration features for organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Shared Macros',
                description: 'Create and share voice macros across your team for consistent messaging and workflows.',
                features: ['Team macro library', 'Version control', 'Usage analytics']
              },
              {
                icon: Settings,
                title: 'Admin Controls',
                description: 'Centralized management dashboard for user permissions, usage monitoring, and policy enforcement.',
                features: ['User management', 'Usage reporting', 'Security policies']
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'SOC2 compliance, SSO integration, and privacy controls for enterprise-grade security.',
                features: ['SSO integration', 'Data encryption', 'Compliance reporting']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow group-hover:shadow-sktch-elevated transition-all duration-300">
                  <feature.icon className="text-white" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 sktch-gradient-text">{feature.title}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-2 text-white/70 text-sm">
                      <Check size={14} className="text-sktch-mint" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="px-6 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="sktch-gradient-text">Technical Excellence</span>
            </h2>
          </motion.div>

          <div className="glass-card p-8 md:p-12 rounded-3xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: '<250ms', label: 'Voice Processing Latency', icon: Clock },
                { metric: '99.9%', label: 'Speech Recognition Accuracy', icon: Target },
                { metric: '1000+', label: 'Compatible Websites', icon: Globe },
                { metric: '24/7', label: 'Offline Processing Available', icon: Shield }
              ].map((spec, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <spec.icon className="text-sktch-hot-pink" size={32} />
                  </div>
                  <div className="text-3xl font-bold sktch-gradient-text mb-2">{spec.metric}</div>
                  <div className="text-white/80 text-sm leading-relaxed">{spec.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-16 text-center">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-white">Experience Every Feature</span>
            <span className="sktch-gradient-text block">Start Your Free Trial</span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get 60 minutes of voice processing free. Upgrade to Pro for unlimited usage and advanced features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-bold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 flex items-center justify-center gap-3">
              <Chrome size={20} />
              <span>Install SKTCH Free</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
            <Link 
              href="/pricing"
              className="px-8 py-4 glass-card text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
            >
              <span>View Pricing</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <p className="text-white/60 text-sm mt-4">
            ✨ No credit card required • Chrome Web Store approved
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
              <span className="text-xl font-bold sktch-gradient-text">SKTCH</span>
            </Link>
            <div className="flex gap-8 text-white/70">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}