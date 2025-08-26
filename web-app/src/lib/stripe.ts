import Stripe from 'stripe';
import { prisma } from './db';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const getStripePromise = () => {
  return import('@stripe/stripe-js').then(({ loadStripe }) =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );
};

// Subscription management helpers
export const createCheckoutSession = async ({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  quantity = 1,
  trialPeriodDays,
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  quantity?: number;
  trialPeriodDays?: number;
}) => {
  return await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    metadata: {
      userId,
    },
    customer_email: userEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: trialPeriodDays ? {
      trial_period_days: trialPeriodDays,
    } : undefined,
    allow_promotion_codes: true,
  });
};

export const createCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};

export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
};

export const reactivateSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
};

// Stripe product and price configuration
export const STRIPE_CONFIG = {
  PRODUCTS: {
    PRO_SUBSCRIPTION: {
      name: 'SKTCH Pro',
      description: 'Unlimited voice control with premium features',
      features: [
        'Unlimited minutes (fair use)',
        'Pro Voice Filter',
        'Flow Modes (Note/Prompt/Tasks)',
        'Ambient sound packs',
        'Whisper Mode',
        'Preview Mode',
        'Vox Commands',
        'Priority support'
      ]
    },
    TEAM_SUBSCRIPTION: {
      name: 'SKTCH Team',
      description: 'Everything in Pro plus team collaboration features',
      features: [
        'Everything in Pro',
        'Team shared macros',
        'Admin dashboard',
        'Usage analytics',
        'User management',
        'Priority support',
        'Custom onboarding'
      ]
    },
  },
  PRICES: {
    PRO_MONTHLY: {
      amount: 1200, // $12.00 in cents
      currency: 'usd',
      interval: 'month' as Stripe.Price.Recurring.Interval,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    },
    PRO_YEARLY: {
      amount: 11500, // $115.00 in cents (20% discount)
      currency: 'usd',
      interval: 'year' as Stripe.Price.Recurring.Interval,
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
    TEAM_MONTHLY: {
      amount: 2000, // $20.00 in cents per seat
      currency: 'usd',
      interval: 'month' as Stripe.Price.Recurring.Interval,
      priceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
    },
    TEAM_YEARLY: {
      amount: 19200, // $192.00 in cents per seat (20% discount)
      currency: 'usd',
      interval: 'year' as Stripe.Price.Recurring.Interval,
      priceId: process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
    },
  },
  TRIAL_PERIOD_DAYS: 7,
  FREE_TIER_MINUTES: 60,
} as const;

// Helper functions for pricing
export const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

export const getAnnualSavings = (monthlyPrice: number, yearlyPrice: number): string => {
  const monthlyCost = (monthlyPrice * 12) / 100;
  const yearlyCost = yearlyPrice / 100;
  const savings = monthlyCost - yearlyCost;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(savings);
};

export const getPlanFeatures = (plan: 'free' | 'pro' | 'team') => {
  const features = {
    free: [
      '60 minutes per month',
      'Raw speech-to-text',
      'Basic voice control',
      'Chrome extension',
      'Community support'
    ],
    pro: STRIPE_CONFIG.PRODUCTS.PRO_SUBSCRIPTION.features,
    team: STRIPE_CONFIG.PRODUCTS.TEAM_SUBSCRIPTION.features
  };
  
  return features[plan] || [];
};