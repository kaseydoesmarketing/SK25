import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const timestamp = new Date().toISOString();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Enhanced performance data
    const performanceData = {
      ...data,
      timestamp,
      ip: ip.split(',')[0],
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    };

    // Log performance metrics (in production, send to your analytics service)
    console.log('📊 Performance Analytics:', performanceData);

    // In production, you would send this to services like:
    
    // Google Analytics 4
    // if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
    //   await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       client_id: performanceData.userId || 'anonymous',
    //       events: [{
    //         name: 'page_performance',
    //         parameters: {
    //           page_location: performanceData.url,
    //           lcp: performanceData.metrics?.lcp,
    //           fid: performanceData.metrics?.fid,
    //           cls: performanceData.metrics?.cls,
    //           custom_metric_voice_ready: performanceData.metrics?.voiceControlReady
    //         }
    //       }]
    //     })
    //   });
    // }

    // PostHog
    // if (process.env.POSTHOG_API_KEY) {
    //   await fetch('https://app.posthog.com/capture/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       api_key: process.env.POSTHOG_API_KEY,
    //       event: 'page_performance',
    //       properties: {
    //         ...performanceData,
    //         $current_url: performanceData.url,
    //         $performance: performanceData.metrics
    //       },
    //       distinct_id: performanceData.userId || 'anonymous'
    //     })
    //   });
    // }

    // Mixpanel
    // if (process.env.MIXPANEL_TOKEN) {
    //   await fetch('https://api.mixpanel.com/track', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       event: 'Page Performance',
    //       properties: {
    //         ...performanceData,
    //         token: process.env.MIXPANEL_TOKEN
    //       }
    //     })
    //   });
    // }

    // DataDog RUM (Real User Monitoring)
    // if (process.env.DATADOG_CLIENT_TOKEN) {
    //   await fetch('https://rum.datadoghq.com/v1/input/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'DD-API-KEY': process.env.DATADOG_CLIENT_TOKEN
    //     },
    //     body: JSON.stringify({
    //       service: 'sktch-web',
    //       session_id: performanceData.sessionId,
    //       view: {
    //         url: performanceData.url,
    //         loading_time: performanceData.metrics?.timeToInteractive
    //       },
    //       vitals: {
    //         lcp: performanceData.metrics?.lcp,
    //         fid: performanceData.metrics?.fid,
    //         cls: performanceData.metrics?.cls
    //       }
    //     })
    //   });
    // }

    // Sentry Performance Monitoring
    // if (process.env.SENTRY_DSN) {
    //   // Sentry performance data would be sent via their SDK
    // }

    // Custom monitoring alerts for poor performance
    if (performanceData.type === 'page_metrics') {
      const { scores } = performanceData;
      
      // Alert if Core Web Vitals are poor
      if (scores && scores.overall < 60) {
        console.warn('⚠️ Poor page performance detected:', {
          url: performanceData.url,
          scores,
          userAgent: performanceData.userAgent
        });

        // In production, you might want to:
        // - Send alert to Slack
        // - Create Sentry issue
        // - Log to monitoring service
        // - Trigger performance investigation
      }

      // Track voice control performance specifically
      if (performanceData.metrics?.voiceControlReady > 5000) {
        console.warn('⚠️ Slow voice control initialization:', {
          url: performanceData.url,
          voiceReady: performanceData.metrics.voiceControlReady,
          userAgent: performanceData.userAgent
        });
      }
    }

    // Store in database for historical analysis (optional)
    // await prisma.performanceMetric.create({
    //   data: {
    //     url: performanceData.url,
    //     lcp: performanceData.metrics?.lcp,
    //     fid: performanceData.metrics?.fid,
    //     cls: performanceData.metrics?.cls,
    //     ttfb: performanceData.metrics?.ttfb,
    //     voiceControlReady: performanceData.metrics?.voiceControlReady,
    //     overallScore: performanceData.scores?.overall,
    //     userAgent: performanceData.userAgent,
    //     ip: performanceData.ip,
    //     timestamp: new Date(performanceData.timestamp)
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Performance analytics error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json({ success: true });
  }
}