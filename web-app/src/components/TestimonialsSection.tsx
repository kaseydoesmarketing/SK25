'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Play, Users, TrendingUp, Check } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  metrics?: {
    improvement: string;
    timeframe: string;
    metric: string;
  };
  videoUrl?: string;
  featured?: boolean;
  category: 'productivity' | 'accessibility' | 'enterprise' | 'developer';
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Content Marketing Director',
    company: 'TechFlow',
    avatar: '/avatars/sarah-chen.jpg',
    rating: 5,
    text: "SKTCH transformed my daily workflow completely. I went from spending 4 hours writing content to finishing the same work in 90 minutes. The Pro Voice Filter makes my speech sound more polished than my original writing. It's like having a professional editor and typist combined.",
    metrics: {
      improvement: '156%',
      timeframe: '30 days',
      metric: 'productivity increase'
    },
    featured: true,
    category: 'productivity',
    videoUrl: '/testimonials/sarah-chen.mp4'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Senior Software Engineer',
    company: 'CloudScale',
    avatar: '/avatars/marcus-rodriguez.jpg',
    rating: 5,
    text: "Voice control for code reviews and documentation was a game-changer. I can dictate detailed PR feedback, create technical docs, and write user stories without breaking my flow state. My RSI completely disappeared after switching to voice-first workflows.",
    metrics: {
      improvement: '89%',
      timeframe: '60 days',
      metric: 'RSI reduction'
    },
    featured: true,
    category: 'accessibility'
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    role: 'Accessibility Consultant',
    company: 'Inclusive Design Co',
    avatar: '/avatars/emily-watson.jpg',
    rating: 5,
    text: "As someone who works with assistive technology daily, SKTCH sets the gold standard for voice interfaces. The contextual modes, ambient sounds, and accessibility features show deep understanding of diverse user needs.",
    featured: true,
    category: 'accessibility'
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'VP Engineering',
    company: 'DataStream',
    avatar: '/avatars/alex-kim.jpg',
    rating: 5,
    text: "Rolling out SKTCH Team to our 50-person engineering team increased documentation quality and reduced meeting overhead. The shared macros and admin dashboard make enterprise deployment seamless.",
    metrics: {
      improvement: '40%',
      timeframe: '90 days',
      metric: 'meeting time saved'
    },
    category: 'enterprise'
  },
  {
    id: '5',
    name: 'Jordan Park',
    role: 'UX Designer',
    company: 'DesignLab',
    avatar: '/avatars/jordan-park.jpg',
    rating: 5,
    text: "The interface design is phenomenal – the pulsing HUD feels magical, and the ambient sounds create the perfect focus environment. It's rare to see technology that's both powerful and delightful.",
    category: 'productivity'
  },
  {
    id: '6',
    name: 'Maya Patel',
    role: 'Technical Writer',
    company: 'DevTools Inc',
    avatar: '/avatars/maya-patel.jpg',
    rating: 5,
    text: "Documentation writing speed increased 3x with SKTCH. The context-aware modes automatically adapt to whether I'm writing API docs, tutorials, or blog posts. The Pro Voice Filter catches grammar I would have missed.",
    metrics: {
      improvement: '200%',
      timeframe: '45 days',
      metric: 'writing speed'
    },
    category: 'developer'
  }
];

interface TestimonialsSectionProps {
  showMetrics?: boolean;
  category?: string;
  featured?: boolean;
  className?: string;
}

export function TestimonialsSection({ 
  showMetrics = true, 
  category, 
  featured = false, 
  className = '' 
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter testimonials based on props
  const filteredTestimonials = testimonials.filter(t => {
    if (featured && !t.featured) return false;
    if (category && t.category !== category) return false;
    return true;
  });

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 6000); // 6 seconds per testimonial

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = filteredTestimonials[currentIndex];

  if (filteredTestimonials.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Star className="text-sktch-hot-pink fill-current" size={16} />
            <span className="text-sm font-medium text-white/90">4.9/5 from 10,000+ users</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by <span className="sktch-gradient-text">Professionals Worldwide</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            See how voice control is transforming workflows across industries
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Testimonial */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-sktch-hot-pink/10 via-transparent to-sktch-electric-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Quote Icon */}
                <Quote className="text-sktch-hot-pink mb-6" size={40} />
                
                {/* Testimonial Text */}
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/90 text-lg leading-relaxed mb-8"
                  >
                    "{currentTestimonial.text}"
                  </motion.blockquote>
                </AnimatePresence>

                {/* Author Info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center gap-4 mb-6"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl flex items-center justify-center shadow-sktch-glow">
                      <span className="text-white font-bold text-lg">
                        {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">{currentTestimonial.name}</div>
                      <div className="text-white/70">{currentTestimonial.role}</div>
                      <div className="text-sktch-hot-pink text-sm font-medium">{currentTestimonial.company}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Rating */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <div className="flex">
                      {Array.from({ length: currentTestimonial.rating }, (_, i) => (
                        <Star key={i} className="text-sktch-hot-pink fill-current" size={16} />
                      ))}
                    </div>
                    <span className="text-white/70 text-sm">Verified customer</span>
                  </motion.div>
                </AnimatePresence>

                {/* Video Play Button */}
                {currentTestimonial.videoUrl && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                  >
                    <Play size={16} />
                    <span className="text-sm font-medium">Watch video testimonial</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                {filteredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-sktch-hot-pink w-6' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="text-white/70" size={16} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ArrowRight className="text-white/70" size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Metrics & Stats */}
          {showMetrics && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Key Metric */}
              {currentTestimonial.metrics && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 text-center bg-gradient-to-r from-sktch-hot-pink/20 to-sktch-electric-purple/20"
                  >
                    <div className="text-3xl font-bold sktch-gradient-text mb-2">
                      {currentTestimonial.metrics.improvement}
                    </div>
                    <div className="text-white font-medium mb-1">
                      {currentTestimonial.metrics.metric}
                    </div>
                    <div className="text-white/60 text-sm">
                      in {currentTestimonial.metrics.timeframe}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Overall Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="text-sktch-mint" size={20} />
                  </div>
                  <div className="text-xl font-bold text-white">10,000+</div>
                  <div className="text-white/70 text-sm">Active Users</div>
                </div>
                
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="text-sktch-hot-pink" size={20} />
                  </div>
                  <div className="text-xl font-bold text-white">2.3x</div>
                  <div className="text-white/70 text-sm">Avg Productivity</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold mb-4">Trusted By</h4>
                {[
                  'Fortune 500 companies',
                  '50+ universities worldwide',
                  'Government agencies',
                  'Healthcare organizations'
                ].map((indicator, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="text-sktch-mint flex-shrink-0" size={16} />
                    <span className="text-white/80 text-sm">{indicator}</span>
                  </div>
                ))}
              </div>

              {/* ROI Calculator CTA */}
              <div className="glass-card p-6 bg-gradient-to-r from-sktch-deep-purple/20 to-sktch-electric-purple/20">
                <h4 className="text-white font-semibold mb-3">Calculate Your ROI</h4>
                <p className="text-white/80 text-sm mb-4">
                  See how much time and money you could save with SKTCH voice control.
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-medium rounded-lg hover:shadow-sktch-glow transition-all duration-300">
                  Try ROI Calculator
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Additional Testimonials Grid */}
        {!featured && (
          <motion.div 
            className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {filteredTestimonials.slice(0, 6).map((testimonial, index) => (
              <div key={testimonial.id} className="glass-card p-6 text-center">
                <div className="flex justify-center mb-3">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="text-sktch-hot-pink fill-current" size={14} />
                  ))}
                </div>
                
                <p className="text-white/90 text-sm mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sktch-mint to-sktch-cool-blue rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">{testimonial.name}</div>
                    <div className="text-white/60 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}