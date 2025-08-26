import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, successUrl, cancelUrl, trialPeriodDays, quantity = 1 } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = session.user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name!,
        metadata: {
          userId: session.user.id,
        },
      });

      stripeCustomerId = stripeCustomer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    // Validate price ID
    const validPriceIds = [
      STRIPE_CONFIG.PRICES.PRO_MONTHLY.priceId,
      STRIPE_CONFIG.PRICES.PRO_YEARLY.priceId,
      STRIPE_CONFIG.PRICES.TEAM_MONTHLY.priceId,
      STRIPE_CONFIG.PRICES.TEAM_YEARLY.priceId,
    ].filter(Boolean);

    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: trialPeriodDays ? {
        trial_period_days: trialPeriodDays,
      } : undefined,
      metadata: {
        userId: session.user.id,
        priceId: priceId,
      },
      // Tax calculation
      automatic_tax: {
        enabled: true,
      },
      // Invoice settings
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'SKTCH Voice Control Subscription',
          metadata: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}