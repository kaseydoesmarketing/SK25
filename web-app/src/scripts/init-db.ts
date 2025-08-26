#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing SKTCH database...');

  try {
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection established');

    // Create some sample data for development
    const existingUsers = await prisma.user.count();
    
    if (existingUsers === 0) {
      console.log('📝 Creating sample users...');
      
      // Create sample free user
      const freeUser = await prisma.user.create({
        data: {
          email: 'demo@sktch.com',
          name: 'Demo User',
          isPro: false,
          usageMinutes: 25, // Has used some of their free minutes
          planType: 'free',
          createdAt: new Date(),
        },
      });

      // Create sample pro user  
      const proUser = await prisma.user.create({
        data: {
          email: 'pro@sktch.com',
          name: 'Pro User',
          isPro: true,
          usageMinutes: 500,
          planType: 'pro',
          stripeCustomerId: 'cus_demo_pro',
          subscriptionId: 'sub_demo_pro',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      });

      // Create sample team user
      const teamUser = await prisma.user.create({
        data: {
          email: 'team@sktch.com',
          name: 'Team Admin',
          isPro: true,
          usageMinutes: 1200,
          planType: 'team',
          stripeCustomerId: 'cus_demo_team',
          subscriptionId: 'sub_demo_team',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        },
      });

      console.log(`✅ Created ${freeUser.name} (Free)`);
      console.log(`✅ Created ${proUser.name} (Pro)`);
      console.log(`✅ Created ${teamUser.name} (Team)`);

      // Create sample usage logs
      console.log('📊 Creating sample usage logs...');
      
      const usageLogs = await Promise.all([
        // Free user usage
        prisma.usageLog.create({
          data: {
            userId: freeUser.id,
            minutes: 15,
            website: 'gmail.com',
            mode: 'note',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.usageLog.create({
          data: {
            userId: freeUser.id,
            minutes: 10,
            website: 'claude.ai',
            mode: 'prompt',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        }),
        
        // Pro user usage
        prisma.usageLog.create({
          data: {
            userId: proUser.id,
            minutes: 120,
            website: 'notion.so',
            mode: 'note',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.usageLog.create({
          data: {
            userId: proUser.id,
            minutes: 95,
            website: 'chatgpt.com',
            mode: 'prompt',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.usageLog.create({
          data: {
            userId: proUser.id,
            minutes: 75,
            website: 'linear.app',
            mode: 'tasks',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        }),

        // Team user usage
        prisma.usageLog.create({
          data: {
            userId: teamUser.id,
            minutes: 200,
            website: 'slack.com',
            mode: 'note',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.usageLog.create({
          data: {
            userId: teamUser.id,
            minutes: 150,
            website: 'figma.com',
            mode: 'note',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

      console.log(`✅ Created ${usageLogs.length} usage log entries`);

      // Create sample subscriptions
      console.log('💳 Creating sample subscriptions...');
      
      const subscriptions = await Promise.all([
        prisma.subscription.create({
          data: {
            userId: proUser.id,
            stripeSubscriptionId: 'sub_demo_pro',
            stripePriceId: 'price_pro_monthly',
            status: 'active',
            planType: 'pro',
            billingCycle: 'monthly',
            currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
          },
        }),
        prisma.subscription.create({
          data: {
            userId: teamUser.id,
            stripeSubscriptionId: 'sub_demo_team',
            stripePriceId: 'price_team_yearly',
            status: 'active',
            planType: 'team',
            billingCycle: 'yearly',
            currentPeriodStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            currentPeriodEnd: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
          },
        }),
      ]);

      console.log(`✅ Created ${subscriptions.length} subscription records`);

      // Create sample downloads
      console.log('⬇️ Creating sample downloads...');
      
      const downloads = await Promise.all([
        prisma.download.create({
          data: {
            userId: freeUser.id,
            extensionVersion: 'free',
            platform: 'chrome',
            downloadUrl: 'https://cdn.sktch.com/extensions/sktch-extension-free-v2.1.0.zip',
            isActive: true,
            downloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.download.create({
          data: {
            userId: proUser.id,
            extensionVersion: 'pro',
            platform: 'chrome',
            downloadUrl: 'https://cdn.sktch.com/extensions/sktch-extension-pro-v2.1.0.zip',
            licenseKey: 'sktch_pro_demo_license_123',
            isActive: true,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            downloadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        }),
        prisma.download.create({
          data: {
            userId: teamUser.id,
            extensionVersion: 'team',
            platform: 'chrome',
            downloadUrl: 'https://cdn.sktch.com/extensions/sktch-extension-team-v2.1.0.zip',
            licenseKey: 'sktch_team_demo_license_456',
            isActive: true,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            downloadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

      console.log(`✅ Created ${downloads.length} download records`);

    } else {
      console.log(`ℹ️ Database already has ${existingUsers} users, skipping sample data creation`);
    }

    // Run some basic queries to verify everything works
    console.log('🔍 Running verification queries...');
    
    const stats = {
      totalUsers: await prisma.user.count(),
      proUsers: await prisma.user.count({ where: { isPro: true } }),
      totalUsage: await prisma.usageLog.aggregate({
        _sum: { minutes: true },
      }),
      activeSubscriptions: await prisma.subscription.count({ 
        where: { status: 'active' } 
      }),
      totalDownloads: await prisma.download.count(),
    };

    console.log('📈 Database Statistics:');
    console.log(`   Total Users: ${stats.totalUsers}`);
    console.log(`   Pro Users: ${stats.proUsers}`);
    console.log(`   Total Usage Minutes: ${stats.totalUsage._sum.minutes || 0}`);
    console.log(`   Active Subscriptions: ${stats.activeSubscriptions}`);
    console.log(`   Total Downloads: ${stats.totalDownloads}`);

    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();