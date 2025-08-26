'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, TrendingUp, Sparkles, AlertCircle, Timer, X } from 'lucide-react';

interface UrgencyBarProps {
  type: 'limited_time' | 'user_count' | 'price_increase' | 'early_bird' | 'beta_access';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  endDate?: Date;
  dismissible?: boolean;
  className?: string;
}

export function UrgencyBar({ 
  type, 
  title, 
  subtitle, 
  ctaText = 'Get Started',
  ctaUrl = '/pricing',
  endDate,
  dismissible = true,
  className = '' 
}: UrgencyBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Countdown timer for limited time offers
  useEffect(() => {
    if (type === 'limited_time' && endDate) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft(null);
          setIsVisible(false);
        }
      };

      const interval = setInterval(updateTimer, 1000);
      updateTimer();

      return () => clearInterval(interval);
    }
  }, [type, endDate]);

  // Don't render if not visible
  if (!isVisible) return null;

  const getUrgencyConfig = () => {
    switch (type) {
      case 'limited_time':
        return {
          icon: Clock,
          bgGradient: 'from-red-500/20 to-orange-500/20',
          borderColor: 'border-red-400/40',
          iconColor: 'text-red-400',
          title: title || 'Limited Time: 50% Off Pro Plans',
          subtitle: subtitle || 'Upgrade today and save on your first year. Offer ends soon!',
          urgencyLevel: 'high'
        };
      
      case 'user_count':
        return {
          icon: Users,
          bgGradient: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-400/40',
          iconColor: 'text-blue-400',
          title: title || '1,000+ Users Joined This Week',
          subtitle: subtitle || 'Join the growing community of voice-first professionals',
          urgencyLevel: 'medium'
        };
      
      case 'price_increase':
        return {
          icon: TrendingUp,
          bgGradient: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-400/40',
          iconColor: 'text-yellow-400',
          title: title || 'Price Increase Coming January 1st',
          subtitle: subtitle || 'Lock in current pricing with an annual plan today',
          urgencyLevel: 'high'
        };
      
      case 'early_bird':
        return {
          icon: Sparkles,
          bgGradient: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-400/40',
          iconColor: 'text-purple-400',
          title: title || 'Early Bird Special: Pro for $9/month',
          subtitle: subtitle || 'First 100 customers get 25% off forever',
          urgencyLevel: 'high'
        };
      
      case 'beta_access':
        return {
          icon: AlertCircle,
          bgGradient: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-400/40',
          iconColor: 'text-green-400',
          title: title || 'Beta: New AI Voice Features Available',
          subtitle: subtitle || 'Get early access to next-gen voice processing',
          urgencyLevel: 'medium'
        };
      
      default:
        return {
          icon: Clock,
          bgGradient: 'from-sktch-electric-purple/20 to-sktch-hot-pink/20',
          borderColor: 'border-sktch-hot-pink/40',
          iconColor: 'text-sktch-hot-pink',
          title: title || 'Special Offer Available',
          subtitle: subtitle || 'Limited time opportunity',
          urgencyLevel: 'medium'
        };
    }
  };

  const config = getUrgencyConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -50, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`relative overflow-hidden ${className}`}
        >
          <div className={`glass-card border ${config.borderColor} bg-gradient-to-r ${config.bgGradient} backdrop-blur-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <Icon className={`${config.iconColor} ${config.urgencyLevel === 'high' ? 'animate-pulse' : ''}`} size={24} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        {config.title}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  {timeLeft && type === 'limited_time' && (
                    <div className="hidden md:flex items-center gap-3">
                      <Timer className="text-red-400" size={16} />
                      <div className="flex items-center gap-2 font-mono">
                        <div className="text-center">
                          <div className="text-white font-bold text-sm">{timeLeft.days}</div>
                          <div className="text-white/60 text-xs">D</div>
                        </div>
                        <div className="text-white/60">:</div>
                        <div className="text-center">
                          <div className="text-white font-bold text-sm">{timeLeft.hours.toString().padStart(2, '0')}</div>
                          <div className="text-white/60 text-xs">H</div>
                        </div>
                        <div className="text-white/60">:</div>
                        <div className="text-center">
                          <div className="text-white font-bold text-sm">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                          <div className="text-white/60 text-xs">M</div>
                        </div>
                        <div className="text-white/60">:</div>
                        <div className="text-center">
                          <div className="text-white font-bold text-sm">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                          <div className="text-white/60 text-xs">S</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA & Dismiss */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={ctaUrl}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 ${
                      config.urgencyLevel === 'high' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:shadow-red-500/25' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {ctaText}
                  </a>

                  {dismissible && (
                    <button
                      onClick={() => setIsVisible(false)}
                      className="p-1 text-white/60 hover:text-white/80 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile countdown */}
              {timeLeft && type === 'limited_time' && (
                <div className="md:hidden mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2 font-mono text-center">
                    <span className="text-white/80 text-xs">Ends in:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-sm">{timeLeft.days}d</span>
                      <span className="text-white font-bold text-sm">{timeLeft.hours.toString().padStart(2, '0')}h</span>
                      <span className="text-white font-bold text-sm">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                      <span className="text-white font-bold text-sm">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Animated progress bar for high urgency */}
            {config.urgencyLevel === 'high' && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-orange-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}