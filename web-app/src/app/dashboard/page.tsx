'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  Clock, 
  BarChart3, 
  Settings, 
  Crown, 
  Download,
  ExternalLink,
  LogOut,
  Sparkles,
  MessageSquare,
  Play
} from 'lucide-react';
import { WebVoiceControl } from '@/components/WebVoiceControl';

interface UsageStats {
  totalMinutes: number;
  thisWeekMinutes: number;
  averageLatency: number;
  favoriteMode: string;
  websitesUsed: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalMinutes: 0,
    thisWeekMinutes: 0,
    averageLatency: 0,
    favoriteMode: 'prompt',
    websitesUsed: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch usage stats from API
    // This would be a real API call in production
    const fetchStats = async () => {
      // Mock data for demo
      setUsageStats({
        totalMinutes: 42,
        thisWeekMinutes: 15,
        averageLatency: 125,
        favoriteMode: 'prompt',
        websitesUsed: 8
      });
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sktch-deep-purple via-sktch-electric-purple to-sktch-hot-pink flex items-center justify-center">
        <div className="pulse-hud"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const progressPercentage = Math.min((usageStats.totalMinutes / 60) * 100, 100);
  const isPro = session.user?.isPro || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sktch-deep-purple via-sktch-electric-purple to-sktch-hot-pink">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sktch-pulse animate-sktch-pulse shadow-sktch-glow"></div>
              <h1 className="text-xl font-bold sktch-gradient-text">SKTCH</h1>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
                <img 
                  src={session.user?.image || ''} 
                  alt={session.user?.name || ''} 
                  className="w-8 h-8 rounded-full"
                />
                <span>{session.user?.name}</span>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-white/70 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-white/80">
            Manage your voice control settings and track your usage.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <a
            href="chrome://extensions/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 hover:bg-white/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Download className="text-sktch-hot-pink group-hover:scale-110 transition-transform" size={24} />
              <h3 className="font-semibold text-white">Extension</h3>
            </div>
            <p className="text-white/80 text-sm">Open Chrome Extensions page to manage SKTCH</p>
            <ExternalLink className="text-white/50 mt-2" size={16} />
          </a>

          <Link href="/settings" className="glass-card p-6 hover:bg-white/20 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="text-sktch-accent-blue group-hover:scale-110 transition-transform" size={24} />
              <h3 className="font-semibold text-white">Settings</h3>
            </div>
            <p className="text-white/80 text-sm">Customize voice control preferences</p>
          </Link>

          <Link href="/usage" className="glass-card p-6 hover:bg-white/20 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="text-sktch-electric-purple group-hover:scale-110 transition-transform" size={24} />
              <h3 className="font-semibold text-white">Analytics</h3>
            </div>
            <p className="text-white/80 text-sm">View detailed usage statistics</p>
          </Link>

          {!isPro && (
            <Link href="/pricing" className="glass-card p-6 bg-gradient-to-br from-sktch-hot-pink to-sktch-electric-purple hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="text-white group-hover:scale-110 transition-transform" size={24} />
                <h3 className="font-semibold text-white">Upgrade Pro</h3>
              </div>
              <p className="text-white/90 text-sm">Unlimited voice control for $12/month</p>
            </Link>
          )}
        </div>

        {/* Web Voice Control Demo */}
        <div className="mb-8">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="text-sktch-hot-pink" size={24} />
                  Try SKTCH in Your Browser
                </h2>
                <p className="text-white/80">Experience voice control right here in your dashboard. Perfect for testing and trying new features.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Demo</span>
              </div>
            </div>
            
            <WebVoiceControl 
              onTextGenerated={(text, mode) => {
                console.log('Generated text:', text, 'Mode:', mode);
                // You could save this to user's history, etc.
              }}
              className=""
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Usage Overview */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Mic className="text-sktch-hot-pink" size={24} />
                Voice Control Usage
              </h2>

              {!isPro && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Free Tier Progress</span>
                    <span className="text-white text-sm font-medium">{usageStats.totalMinutes}/60 minutes</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-sktch-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  {progressPercentage > 80 && (
                    <p className="text-sktch-hot-pink text-sm mt-2">
                      You're running low on free minutes! Consider upgrading to Pro.
                    </p>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{usageStats.thisWeekMinutes}</div>
                  <div className="text-white/70 text-sm">Minutes this week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{usageStats.averageLatency}ms</div>
                  <div className="text-white/70 text-sm">Average latency</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="text-sktch-accent-blue" size={20} />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {[
                  { website: 'claude.ai', mode: 'Prompt', minutes: 8, time: '2 hours ago' },
                  { website: 'notion.so', mode: 'Note', minutes: 12, time: '5 hours ago' },
                  { website: 'mail.google.com', mode: 'Tasks', minutes: 5, time: '1 day ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-sktch-hot-pink rounded-full"></div>
                      <div>
                        <div className="text-white text-sm font-medium">{activity.website}</div>
                        <div className="text-white/60 text-xs">{activity.mode} mode • {activity.minutes} min</div>
                      </div>
                    </div>
                    <div className="text-white/60 text-xs">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Favorite Mode</span>
                  <span className="text-white font-medium capitalize">{usageStats.favoriteMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Websites Used</span>
                  <span className="text-white font-medium">{usageStats.websitesUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Account Status</span>
                  <span className={`font-medium ${isPro ? 'text-sktch-hot-pink' : 'text-white/80'}`}>
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Extension Status */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Extension Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Chrome Extension Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Microphone Access Granted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sktch-accent-blue rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm">Ready for Voice Control</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pro Tips</h3>
              <div className="space-y-3 text-sm text-white/80">
                <p>• Use Cmd+Shift+V to quickly activate voice control</p>
                <p>• Try "new paragraph" for better text formatting</p>
                <p>• Switch modes based on your task context</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}