'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Brain,
  Target,
  Sparkles,
  MessageSquare,
  Headphones
} from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readingTime: string;
  category: string;
  featured?: boolean;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    slug: 'hands-free-workflows-voice-native-tools-2x-output',
    title: 'Hands-Free Workflows: How Voice-Native Tools 2× Your Output',
    excerpt: 'Discover the productivity metrics and real-world case studies showing how voice-first interfaces are revolutionizing professional workflows. From reducing RSI to accelerating content creation.',
    author: {
      name: 'Alex Chen',
      avatar: '/avatars/alex-chen.jpg',
      role: 'Head of Product'
    },
    publishedAt: '2024-01-15',
    readingTime: '8 min read',
    category: 'Productivity',
    featured: true,
    image: '/blog/hands-free-workflows.jpg',
    tags: ['Productivity', 'Voice Control', 'Workflows', 'Case Studies']
  },
  {
    slug: 'prompt-faster-speech-to-prompt-patterns-ai',
    title: 'Prompt Faster: Speech-to-Prompt Patterns for ChatGPT & Claude',
    excerpt: 'Master the art of voice-driven AI prompting with proven patterns and techniques. Learn how to structure your speech for optimal AI responses and dramatically faster content creation.',
    author: {
      name: 'Sarah Rodriguez',
      avatar: '/avatars/sarah-rodriguez.jpg',
      role: 'AI Researcher'
    },
    publishedAt: '2024-01-12',
    readingTime: '12 min read',
    category: 'AI & Prompting',
    featured: true,
    image: '/blog/prompt-faster.jpg',
    tags: ['AI', 'Prompting', 'ChatGPT', 'Claude', 'Voice']
  },
  {
    slug: 'designing-calm-ui-pulses-ambience-inclusive-ux',
    title: 'Designing a Calm UI: Pulses, Ambience, and Inclusive UX for Everyone',
    excerpt: 'Explore the UX design philosophy behind SKTCH\'s calm interface. Learn about accessibility-first design, visual feedback systems, and creating inclusive voice experiences.',
    author: {
      name: 'Jordan Kim',
      avatar: '/avatars/jordan-kim.jpg',
      role: 'Lead Designer'
    },
    publishedAt: '2024-01-10',
    readingTime: '10 min read',
    category: 'Design & UX',
    featured: true,
    image: '/blog/calm-ui-design.jpg',
    tags: ['Design', 'UX', 'Accessibility', 'Inclusive Design']
  },
  {
    slug: 'voice-control-rsi-accessibility-technology',
    title: 'Voice Control as Accessibility Technology: Beyond RSI Prevention',
    excerpt: 'How voice-native interfaces are transforming accessibility in the digital workspace. Real stories from users with diverse needs and capabilities.',
    author: {
      name: 'Dr. Maria Santos',
      avatar: '/avatars/maria-santos.jpg',
      role: 'Accessibility Consultant'
    },
    publishedAt: '2024-01-08',
    readingTime: '7 min read',
    category: 'Accessibility',
    image: '/blog/accessibility-technology.jpg',
    tags: ['Accessibility', 'Health', 'Ergonomics', 'Technology']
  },
  {
    slug: 'future-of-browser-interaction-voice-first-web',
    title: 'The Future of Browser Interaction: Building the Voice-First Web',
    excerpt: 'Technical deep-dive into voice-first web technologies, browser APIs, and the infrastructure powering the next generation of web interactions.',
    author: {
      name: 'Marcus Thompson',
      avatar: '/avatars/marcus-thompson.jpg',
      role: 'Principal Engineer'
    },
    publishedAt: '2024-01-05',
    readingTime: '15 min read',
    category: 'Technology',
    image: '/blog/voice-first-web.jpg',
    tags: ['Technology', 'Web APIs', 'Browser', 'Voice', 'Future']
  },
  {
    slug: 'ambient-sounds-focus-productivity-science',
    title: 'The Science of Ambient Sounds: How Audio Environments Boost Focus',
    excerpt: 'Research-backed insights into how ambient soundscapes enhance cognitive performance and why SKTCH includes built-in focus sounds.',
    author: {
      name: 'Dr. Emily Foster',
      avatar: '/avatars/emily-foster.jpg',
      role: 'Cognitive Scientist'
    },
    publishedAt: '2024-01-03',
    readingTime: '9 min read',
    category: 'Science',
    image: '/blog/ambient-sounds-science.jpg',
    tags: ['Science', 'Focus', 'Productivity', 'Audio', 'Research']
  }
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const categories = ['All', 'Productivity', 'AI & Prompting', 'Design & UX', 'Technology', 'Accessibility', 'Science'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sktch-deep-purple via-sktch-electric-purple to-sktch-hot-pink">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
          <h1 className="text-2xl font-bold sktch-gradient-text">SKTCH</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/features" className="text-white/90 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-white/90 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/auth/signin" className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Brain className="text-sktch-hot-pink" size={16} />
            <span className="text-sm font-medium text-white/90">Insights & Research</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">SKTCH</span>
            <span className="sktch-gradient-text block">Knowledge Hub</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Deep insights into voice-native technology, productivity research, and the future of human-computer interaction
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <TrendingUp className="text-sktch-hot-pink" size={24} />
                Featured Articles
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="glass-card group overflow-hidden hover:scale-105 transition-all duration-500 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sktch-hot-pink/10 via-transparent to-sktch-electric-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sktch-glow">
                          Featured
                        </div>
                      </div>
                      
                      {/* Mock Image Placeholder */}
                      <div className="h-48 bg-gradient-to-br from-sktch-electric-purple/20 to-sktch-hot-pink/20 flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl flex items-center justify-center">
                          {post.category === 'Productivity' && <Target className="text-white" size={28} />}
                          {post.category === 'AI & Prompting' && <Brain className="text-white" size={28} />}
                          {post.category === 'Design & UX' && <Sparkles className="text-white" size={28} />}
                          {post.category === 'Technology' && <Zap className="text-white" size={28} />}
                          {post.category === 'Accessibility' && <MessageSquare className="text-white" size={28} />}
                          {post.category === 'Science' && <Headphones className="text-white" size={28} />}
                        </div>
                      </div>
                      
                      <div className="p-6 relative z-10">
                        {/* Category */}
                        <div className="inline-block px-3 py-1 bg-sktch-hot-pink/20 border border-sktch-hot-pink/40 rounded-full text-xs font-semibold text-sktch-hot-pink mb-3">
                          {post.category}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:sktch-gradient-text transition-all duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {/* Author & Meta */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-sktch-mint to-sktch-cool-blue rounded-full flex items-center justify-center">
                            <User className="text-white" size={16} />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{post.author.name}</div>
                            <div className="text-white/60 text-xs">{post.author.role}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-white/60 text-xs mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{post.readingTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-sktch-hot-pink font-medium text-sm group/link hover:gap-3 transition-all duration-200"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="group-hover/link:translate-x-1 transition-transform" size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">All Articles</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="glass-card p-6 group hover:scale-105 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sktch-mint/5 via-transparent to-sktch-cool-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    {/* Category */}
                    <div className="inline-block px-3 py-1 bg-sktch-mint/20 border border-sktch-mint/40 rounded-full text-xs font-semibold text-sktch-mint mb-3">
                      {post.category}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:sktch-gradient-text transition-all duration-300">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Author & Meta */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-sktch-sun-gold to-sktch-coral rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{post.author.name}</div>
                        <div className="text-white/60 text-xs">{post.author.role}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-white/60 text-xs mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sktch-mint font-medium text-sm group/link hover:gap-3 transition-all duration-200"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="group-hover/link:translate-x-1 transition-transform" size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Newsletter Signup */}
        <motion.section 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow">
              <Sparkles className="text-white" size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-white/80 mb-6">
              Get the latest insights on voice-native technology, productivity research, and SKTCH updates delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-sktch-hot-pink focus:bg-white/20 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-semibold rounded-lg hover:shadow-sktch-glow transition-all duration-300">
                Subscribe
              </button>
            </div>
            
            <p className="text-white/60 text-xs mt-3">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </motion.section>
      </div>

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