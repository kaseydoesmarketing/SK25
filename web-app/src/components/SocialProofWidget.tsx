'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Download, Star, TrendingUp, MapPin, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'signup' | 'upgrade' | 'download' | 'review';
  user: {
    name: string;
    location: string;
    avatar?: string;
  };
  metadata: {
    plan?: string;
    rating?: number;
    timeAgo: string;
  };
  timestamp: Date;
}

interface SocialProofWidgetProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  showStats?: boolean;
}

// Mock real-time activities (in production, this would come from your analytics)
const generateMockActivity = (): Activity => {
  const types: Activity['type'][] = ['signup', 'upgrade', 'download', 'review'];
  const names = [
    'Alex Chen', 'Sarah Johnson', 'Marcus Rodriguez', 'Emily Watson', 'Jordan Park',
    'Maya Patel', 'David Kim', 'Lisa Thompson', 'Ahmed Hassan', 'Sofia Garcia',
    'Ryan O\'Connor', 'Priya Sharma', 'Carlos Santos', 'Nicole Brown', 'Jake Wilson'
  ];
  const locations = [
    'San Francisco, CA', 'New York, NY', 'London, UK', 'Toronto, CA', 'Sydney, AU',
    'Berlin, DE', 'Tokyo, JP', 'Singapore, SG', 'Amsterdam, NL', 'Stockholm, SE',
    'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Vancouver, CA', 'Dublin, IE'
  ];
  const plans = ['Pro', 'Team'];

  const type = types[Math.floor(Math.random() * types.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    user: {
      name,
      location,
      avatar: `/avatars/${name.toLowerCase().replace(' ', '-')}.jpg`
    },
    metadata: {
      plan: type === 'upgrade' ? plans[Math.floor(Math.random() * plans.length)] : undefined,
      rating: type === 'review' ? 5 : undefined,
      timeAgo: ['just now', '2 min ago', '5 min ago', '8 min ago'][Math.floor(Math.random() * 4)]
    },
    timestamp: new Date()
  };
};

export function SocialProofWidget({ 
  position = 'bottom-left', 
  className = '',
  showStats = true 
}: SocialProofWidgetProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    activeUsers: 1247,
    todaySignups: 42,
    totalUsers: 10000,
    avgRating: 4.9
  });

  // Initialize with some activities
  useEffect(() => {
    const initialActivities = Array.from({ length: 5 }, generateMockActivity);
    setActivities(initialActivities);
    setCurrentActivity(initialActivities[0]);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
      setCurrentActivity(newActivity);
      setIsVisible(true);

      // Update stats occasionally
      if (Math.random() < 0.3) {
        setStats(prev => ({
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
          todaySignups: prev.todaySignups + (Math.random() < 0.5 ? 1 : 0)
        }));
      }
    }, Math.random() * 15000 + 10000); // Random interval between 10-25 seconds

    return () => clearInterval(interval);
  }, []);

  // Hide notification after showing
  useEffect(() => {
    if (isVisible && currentActivity) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, currentActivity]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      default:
        return 'bottom-6 left-6';
    }
  };

  const getActivityConfig = (activity: Activity) => {
    switch (activity.type) {
      case 'signup':
        return {
          icon: Users,
          iconColor: 'text-green-400',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          message: `just signed up`,
          badge: 'New User'
        };
      case 'upgrade':
        return {
          icon: TrendingUp,
          iconColor: 'text-sktch-hot-pink',
          bgColor: 'from-sktch-hot-pink/20 to-sktch-electric-purple/20',
          message: `upgraded to ${activity.metadata.plan}`,
          badge: 'Upgrade'
        };
      case 'download':
        return {
          icon: Download,
          iconColor: 'text-blue-400',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          message: `downloaded the extension`,
          badge: 'Download'
        };
      case 'review':
        return {
          icon: Star,
          iconColor: 'text-yellow-400',
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          message: `left a ${activity.metadata.rating}-star review`,
          badge: 'Review'
        };
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <div className="flex flex-col gap-4 max-w-sm">
        {/* Live Activity Notification */}
        <AnimatePresence>
          {isVisible && currentActivity && (
            <motion.div
              initial={{ opacity: 0, x: position.includes('left') ? -100 : 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('left') ? -100 : 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card p-4 shadow-2xl border border-white/20 max-w-xs"
            >
              {(() => {
                const config = getActivityConfig(currentActivity);
                const Icon = config.icon;
                
                return (
                  <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${config.bgColor}`}>
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className={config.iconColor} size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium text-sm truncate">
                            {currentActivity.user.name}
                          </p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            config.badge === 'New User' ? 'bg-green-400/20 text-green-400' :
                            config.badge === 'Upgrade' ? 'bg-sktch-hot-pink/20 text-sktch-hot-pink' :
                            config.badge === 'Download' ? 'bg-blue-400/20 text-blue-400' :
                            'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {config.badge}
                          </span>
                        </div>
                        
                        <p className="text-white/80 text-xs mb-2">
                          {config.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <MapPin size={10} />
                          <span className="truncate">{currentActivity.user.location}</span>
                          <span>•</span>
                          <Clock size={10} />
                          <span>{currentActivity.metadata.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Widget */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-4 shadow-xl border border-white/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">Live Activity</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-white font-bold text-lg">
                  {stats.activeUsers.toLocaleString()}
                </div>
                <div className="text-white/70 text-xs">Online Now</div>
              </div>
              
              <div className="text-center">
                <div className="text-sktch-hot-pink font-bold text-lg">
                  +{stats.todaySignups}
                </div>
                <div className="text-white/70 text-xs">Today</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">
                  {stats.totalUsers.toLocaleString()}+ users
                </span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-current" size={12} />
                  <span className="text-white/70">{stats.avgRating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}