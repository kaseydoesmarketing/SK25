'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Check, Crown, Zap, Shield, Star, Users, ArrowRight, Sparkles, ToggleLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStripePromise, STRIPE_CONFIG, formatPrice, getAnnualSavings, getPlanFeatures } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'team', cycle: 'monthly' | 'yearly') => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    setIsLoading(true);
    setSelectedPlan(`${plan}_${cycle}`);

    try {
      const priceId = plan === 'pro' 
        ? (cycle === 'monthly' ? STRIPE_CONFIG.PRICES.PRO_MONTHLY.priceId : STRIPE_CONFIG.PRICES.PRO_YEARLY.priceId)
        : (cycle === 'monthly' ? STRIPE_CONFIG.PRICES.TEAM_MONTHLY.priceId : STRIPE_CONFIG.PRICES.TEAM_YEARLY.priceId);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
          trialPeriodDays: STRIPE_CONFIG.TRIAL_PERIOD_DAYS,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      if (sessionId) {
        const stripe = await getStripePromise();
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

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
          {session ? (
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/auth/signin"
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              Sign In
            </Link>
          )}
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
            <Sparkles className="text-sktch-hot-pink" size={16} />
            <span className="text-sm font-medium text-white/90">7-day free trial • No credit card required</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="sktch-gradient-text">Voice Control</span> Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Start free with 60 minutes, then upgrade to Pro for unlimited voice control across all your favorite websites.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'monthly' ? 'text-white' : 'text-white/60'
            }`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-white/20 rounded-full border border-white/30 transition-all duration-300 hover:bg-white/30"
            >
              <div className={`absolute w-5 h-5 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple rounded-full top-1 transition-all duration-300 ${
                billingCycle === 'yearly' ? 'right-1' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${
              billingCycle === 'yearly' ? 'text-white' : 'text-white/60'
            }`}>Yearly</span>
            {billingCycle === 'yearly' && (
              <div className="bg-sktch-hot-pink/20 border border-sktch-hot-pink/40 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-sktch-hot-pink">Save 20%</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Tier */}
          <motion.div 
            className="glass-card p-8 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sktch-mint to-sktch-cool-blue rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sktch-glow">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $0<span className="text-lg text-white/70">/month</span>
              </div>
              <p className="text-white/80">Perfect for trying SKTCH</p>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {getPlanFeatures('free').map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-sktch-mint flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-white/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              href={session ? '/dashboard' : '/auth/signin'}
              className="w-full py-3 px-6 bg-white/10 border border-white/30 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors block text-center"
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </motion.div>

          {/* Pro Tier */}
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

            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sktch-electric-purple to-sktch-hot-pink rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sktch-glow">
                <Crown className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-2">
                {billingCycle === 'monthly' 
                  ? formatPrice(STRIPE_CONFIG.PRICES.PRO_MONTHLY.amount)
                  : formatPrice(Math.floor(STRIPE_CONFIG.PRICES.PRO_YEARLY.amount / 12))
                }
                <span className="text-lg text-white/70">/month</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sktch-hot-pink text-sm font-medium mb-2">
                  Save {getAnnualSavings(STRIPE_CONFIG.PRICES.PRO_MONTHLY.amount, STRIPE_CONFIG.PRICES.PRO_YEARLY.amount)} annually
                </div>
              )}
              <p className="text-white/80">For power users and professionals</p>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {getPlanFeatures('pro').slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-sktch-hot-pink flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-white/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade('pro', billingCycle)}
              disabled={isLoading && selectedPlan === `pro_${billingCycle}`}
              className="w-full py-3 px-6 bg-gradient-to-r from-sktch-hot-pink to-sktch-electric-purple text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 disabled:opacity-50 group"
            >
              {isLoading && selectedPlan === `pro_${billingCycle}` ? (
                'Creating checkout...'
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Start 7-Day Trial</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              )}
            </button>
            
            <p className="text-white/60 text-xs mt-2">Then {formatPrice(billingCycle === 'monthly' ? STRIPE_CONFIG.PRICES.PRO_MONTHLY.amount : STRIPE_CONFIG.PRICES.PRO_YEARLY.amount)}{billingCycle === 'monthly' ? '/month' : '/year'}</p>
          </motion.div>

          {/* Team Tier */}
          <motion.div 
            className="glass-card p-8 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sktch-sun-gold to-sktch-coral rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sktch-glow">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Team</h3>
              <div className="text-4xl font-bold text-white mb-2">
                {billingCycle === 'monthly' 
                  ? formatPrice(STRIPE_CONFIG.PRICES.TEAM_MONTHLY.amount)
                  : formatPrice(Math.floor(STRIPE_CONFIG.PRICES.TEAM_YEARLY.amount / 12))
                }
                <span className="text-lg text-white/70">/seat/month</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-sktch-hot-pink text-sm font-medium mb-2">
                  Save {getAnnualSavings(STRIPE_CONFIG.PRICES.TEAM_MONTHLY.amount, STRIPE_CONFIG.PRICES.TEAM_YEARLY.amount)} per seat annually
                </div>
              )}
              <p className="text-white/80">For teams and organizations</p>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {getPlanFeatures('team').slice(0, 6).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-sktch-coral flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-white/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade('team', billingCycle)}
              disabled={isLoading && selectedPlan === `team_${billingCycle}`}
              className="w-full py-3 px-6 bg-gradient-to-r from-sktch-sun-gold to-sktch-coral text-white font-semibold rounded-xl shadow-sktch-glow hover:shadow-sktch-elevated transition-all duration-300 disabled:opacity-50 group"
            >
              {isLoading && selectedPlan === `team_${billingCycle}` ? (
                'Creating checkout...'
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Start Team Trial</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              )}
            </button>
            
            <p className="text-white/60 text-xs mt-2">Then {formatPrice(billingCycle === 'monthly' ? STRIPE_CONFIG.PRICES.TEAM_MONTHLY.amount : STRIPE_CONFIG.PRICES.TEAM_YEARLY.amount)} per seat{billingCycle === 'monthly' ? '/month' : '/year'}</p>
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <motion.div 
          className="max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Complete Feature Comparison</h2>
          
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">Features</th>
                    <th className="text-center p-4 text-white font-semibold">Free</th>
                    <th className="text-center p-4 text-white font-semibold">Pro</th>
                    <th className="text-center p-4 text-white font-semibold">Team</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  {[
                    { feature: 'Voice Control Time', free: '60 minutes/month', pro: 'Unlimited', team: 'Unlimited' },
                    { feature: 'Website Compatibility', free: '✓', pro: '✓', team: '✓' },
                    { feature: 'Pro Voice Filter', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Flow Modes (Note/Prompt/Tasks)', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Ambient Sound Packs', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Whisper Mode', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Vox Commands', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Preview Mode', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Priority Processing', free: '-', pro: '✓', team: '✓' },
                    { feature: 'Team Shared Macros', free: '-', pro: '-', team: '✓' },
                    { feature: 'Admin Dashboard', free: '-', pro: '-', team: '✓' },
                    { feature: 'Usage Analytics', free: 'Basic', pro: 'Advanced', team: 'Team Analytics' },
                    { feature: 'Priority Support', free: '-', pro: '✓', team: '✓ + Onboarding' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4">
                        {row.free === '✓' ? <Check className="text-sktch-mint mx-auto" size={20} /> : 
                         row.free === '-' ? <span className="text-white/30">-</span> : 
                         <span className="text-white/80">{row.free}</span>}
                      </td>
                      <td className="text-center p-4">
                        {row.pro === '✓' ? <Check className="text-sktch-hot-pink mx-auto" size={20} /> : 
                         row.pro === '-' ? <span className="text-white/30">-</span> : 
                         <span className="text-sktch-hot-pink font-semibold">{row.pro}</span>}
                      </td>
                      <td className="text-center p-4">
                        {row.team === '✓' ? <Check className="text-sktch-coral mx-auto" size={20} /> : 
                         row.team === '-' ? <span className="text-white/30">-</span> : 
                         <span className="text-sktch-coral font-semibold">{row.team}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Loved by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "SKTCH Pro has revolutionized my workflow. The unlimited voice control saves me hours every day.",
                author: "Alex Chen",
                role: "AI Researcher",
                rating: 5
              },
              {
                text: "The low-latency processing in Pro mode is incredible. It feels like magic when writing long prompts.",
                author: "Sarah Johnson",
                role: "Content Creator",
                rating: 5
              },
              {
                text: "Custom voice shortcuts are a game-changer. I can trigger complex workflows with simple voice commands.",
                author: "Mike Rodriguez",
                role: "Developer",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex justify-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="text-sktch-hot-pink fill-current" size={16} />
                  ))}
                </div>
                <p className="text-white/90 mb-4 text-sm">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-white/70 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your Pro subscription at any time. You'll retain Pro features until the end of your billing period."
              },
              {
                question: "What happens if I exceed 60 minutes on the free plan?",
                answer: "You'll get a friendly notification to upgrade to Pro. Your extension won't stop working, but you'll be encouraged to upgrade for unlimited access."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 7-day money-back guarantee if you're not satisfied with SKTCH Pro."
              },
              {
                question: "Which websites does SKTCH work on?",
                answer: "SKTCH works on virtually all websites including Gmail, Slack, Notion, ChatGPT, Claude, Google Docs, and thousands more."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-white/80 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}