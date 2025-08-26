'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Download, 
  Chrome, 
  Shield, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Users,
  Clock
} from 'lucide-react';

interface DownloadInfo {
  version: string;
  size: string;
  releaseDate: string;
  features: string[];
  requirements: string[];
}

export default function DownloadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'team'>('free');

  // Check if user came from a successful payment
  const paymentSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (session?.user) {
      setUserPlan(session.user.isPro ? 'pro' : 'free');
    }
  }, [session]);

  const downloadInfo: Record<string, DownloadInfo> = {
    free: {
      version: '2.1.0',
      size: '2.3 MB',
      releaseDate: 'January 15, 2024',
      features: [
        '60 minutes voice control per month',
        'Basic speech-to-text processing',
        'Works on 1000+ websites',
        'Community support',
        'Chrome Web Store verified'
      ],
      requirements: [
        'Chrome browser version 90+',
        'Microphone access',
        'Internet connection for processing'
      ]
    },
    pro: {
      version: '2.1.0 Pro',
      size: '2.8 MB',
      releaseDate: 'January 15, 2024',
      features: [
        'Unlimited voice control minutes',
        'Pro Voice Filter with AI enhancement',
        'Flow Modes (Note/Prompt/Tasks)',
        'Ambient sound packs',
        'Whisper Mode for quiet environments',
        'Preview Mode with edit before insert',
        'Vox Commands ("undo that", "new paragraph")',
        'Priority processing (sub-250ms latency)',
        'Premium support',
        'Early access to beta features'
      ],
      requirements: [
        'Chrome browser version 90+',
        'Active SKTCH Pro subscription',
        'Microphone access',
        'Internet connection for processing'
      ]
    },
    team: {
      version: '2.1.0 Team',
      size: '3.1 MB',
      releaseDate: 'January 15, 2024',
      features: [
        'All Pro features included',
        'Team shared macros library',
        'Admin dashboard and user management',
        'Usage analytics and reporting',
        'Team onboarding assistance',
        'SSO integration (coming soon)',
        'Priority enterprise support',
        'Custom deployment options'
      ],
      requirements: [
        'Chrome browser version 90+',
        'Active SKTCH Team subscription',
        'Admin-approved installation',
        'Microphone access',
        'Internet connection for processing'
      ]
    }
  };

  const handleDownload = async (version: 'free' | 'pro' | 'team') => {
    if (version !== 'free' && !session) {
      router.push('/auth/signin?redirect=/download');
      return;
    }

    if (version === 'pro' && !session?.user?.isPro) {
      router.push('/pricing');
      return;
    }

    if (version === 'team' && (session?.user as any)?.planType !== 'team') {
      router.push('/pricing');
      return;
    }

    setIsDownloading(true);

    try {
      // Track download analytics
      await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version,
          userId: session?.user?.id,
          userAgent: navigator.userAgent,
        }),
      });

      // Generate download record if user is authenticated
      if (session?.user?.id) {
        const response = await fetch('/api/downloads/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ version }),
        });

        if (response.ok) {
          const { downloadUrl, licenseKey } = await response.json();
          
          // Store license key in localStorage for extension access
          if (licenseKey) {
            localStorage.setItem('sktch_license_key', licenseKey);
          }

          // Trigger download
          window.open(downloadUrl || getDownloadUrl(version), '_blank');
        }
      } else {
        // Free version direct download
        window.open(getDownloadUrl(version), '_blank');
      }

      setDownloadStarted(true);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadUrl = (version: string) => {
    // In production, these would be signed URLs from your CDN
    const baseUrl = process.env.NEXT_PUBLIC_CDN_URL || '/downloads';
    return `${baseUrl}/sktch-extension-${version}.zip`;
  };

  const currentInfo = downloadInfo[userPlan];

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
          {session ? (
            <Link href="/dashboard" className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/signin" className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 border border-green-400/50 bg-green-400/10"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-400" size={24} />
              <div>
                <h3 className="text-white font-semibold">Payment Successful!</h3>
                <p className="text-white/80 text-sm">Your subscription is now active. Download the Pro extension below.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
            <Download className="text-sktch-hot-pink" size={16} />
            <span className="text-sm font-medium text-white/90">Chrome Extension Download</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Download</span>
            <span className="sktch-gradient-text block">SKTCH Extension</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Install the SKTCH browser extension and transform your web experience with professional voice control
          </p>
        </motion.div>

        {/* Download Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Version */}
          <motion.div 
            className="glass-card p-8 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sktch-mint to-sktch-cool-blue rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow">
              <Zap className="text-white" size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Free Version</h3>
            <p className="text-white/80 mb-6">Perfect for trying voice control</p>
            
            <div className="text-center mb-6">
              <div className="text-sm text-white/60">Version {downloadInfo.free.version}</div>
              <div className="text-sm text-white/60">{downloadInfo.free.size} • {downloadInfo.free.releaseDate}</div>
            </div>

            <div className="space-y-2 mb-8 text-left">
              {downloadInfo.free.features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="text-sktch-mint flex-shrink-0 mt-0.5" size={14} />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDownload('free')}
              disabled={isDownloading}
              className="w-full py-3 px-6 bg-white/10 border border-white/30 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 group"
            >
              {isDownloading ? (
                'Downloading...'
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Download size={16} />
                  <span>Download Free</span>
                </div>
              )}
            </button>
          </motion.div>

          {/* Pro Version */}
          <motion.div 
            className="glass-card p-8 text-center relative border-2 border-sktch-hot-pink/50 shadow-sktch-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1 shadow-sktch-glow">
                <Crown size={16} />
                Most Popular
              </div>
            </div>

            <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow">
              <Crown className="text-white" size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Pro Version</h3>
            <p className="text-white/80 mb-6">Unlimited voice control with AI enhancement</p>
            
            <div className="text-center mb-6">
              <div className="text-sm text-white/60">Version {downloadInfo.pro.version}</div>
              <div className="text-sm text-white/60">{downloadInfo.pro.size} • {downloadInfo.pro.releaseDate}</div>
            </div>

            <div className="space-y-2 mb-8 text-left">
              {downloadInfo.pro.features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="text-sktch-hot-pink flex-shrink-0 mt-0.5" size={14} />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {session?.user?.isPro ? (
              <button
                onClick={() => handleDownload('pro')}
                disabled={isDownloading}
                className="w-full py-3 px-6 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 disabled:opacity-50 group"
              >
                {isDownloading ? (
                  'Downloading...'
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Download size={16} />
                    <span>Download Pro</span>
                  </div>
                )}
              </button>
            ) : (
              <Link
                href="/pricing"
                className="w-full py-3 px-6 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Crown size={16} />
                <span>Upgrade to Pro</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </Link>
            )}
          </motion.div>

          {/* Team Version */}
          <motion.div 
            className="glass-card p-8 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sktch-sun-gold to-sktch-coral rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow">
              <Users className="text-white" size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Team Version</h3>
            <p className="text-white/80 mb-6">Pro features plus team collaboration</p>
            
            <div className="text-center mb-6">
              <div className="text-sm text-white/60">Version {downloadInfo.team.version}</div>
              <div className="text-sm text-white/60">{downloadInfo.team.size} • {downloadInfo.team.releaseDate}</div>
            </div>

            <div className="space-y-2 mb-8 text-left">
              {downloadInfo.team.features.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="text-sktch-coral flex-shrink-0 mt-0.5" size={14} />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/pricing"
              className="w-full py-3 px-6 bg-gradient-to-r from-sktch-sun-gold to-sktch-coral text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Users size={16} />
              <span>Get Team Plan</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Installation Instructions */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Installation Guide</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Download Extension',
                description: 'Click the download button above to get the SKTCH extension file for your plan level.',
                icon: Download
              },
              {
                step: '02', 
                title: 'Install in Chrome',
                description: 'Open Chrome Extensions (chrome://extensions), enable Developer Mode, and drag the extension file.',
                icon: Chrome
              },
              {
                step: '03',
                title: 'Grant Permissions',
                description: 'Allow microphone access and website permissions. The extension will show a green icon when ready.',
                icon: Shield
              }
            ].map((item, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className="text-5xl font-bold sktch-gradient-text mb-4 opacity-20">
                  {item.step}
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sktch-glow">
                  <item.icon className="text-white" size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Requirements & Support */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* System Requirements */}
          <motion.div 
            className="glass-card p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="text-sktch-hot-pink" size={24} />
              System Requirements
            </h3>
            
            <div className="space-y-3">
              {currentInfo.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-sktch-mint flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-white/90">{req}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="glass-card p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-sktch-hot-pink" size={24} />
              Need Help?
            </h3>
            
            <div className="space-y-4">
              <p className="text-white/80">
                Having trouble with installation or setup? Our support team is here to help.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link 
                  href="/support" 
                  className="flex items-center gap-2 text-sktch-mint hover:text-white transition-colors"
                >
                  <span>📚 Installation Guide</span>
                </Link>
                <Link 
                  href="/support/contact" 
                  className="flex items-center gap-2 text-sktch-mint hover:text-white transition-colors"
                >
                  <span>💬 Contact Support</span>
                </Link>
                <Link 
                  href="/support/faq" 
                  className="flex items-center gap-2 text-sktch-mint hover:text-white transition-colors"
                >
                  <span>❓ FAQ</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Download Success Message */}
        {downloadStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sktch-hot-pink to-sktch-electric-purple rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="text-white" size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Download Started!</h3>
              <p className="text-white/80 mb-6">
                Your SKTCH extension is downloading. Follow the installation guide above to complete setup.
              </p>
              
              <button
                onClick={() => setDownloadStarted(false)}
                className="px-6 py-3 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-semibold rounded-lg"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
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