import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { version, userId, userAgent } = await request.json();

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const referer = request.headers.get('referer');
    const timestamp = new Date().toISOString();

    // Analytics event data
    const analyticsData = {
      event: 'extension_download',
      properties: {
        version,
        userId: userId || 'anonymous',
        timestamp,
        userAgent,
        ip: ip.split(',')[0], // Take first IP if multiple
        referer,
        platform: 'chrome',
      },
    };

    // Log to console (in production, send to your analytics service)
    console.log('Download Analytics Event:', analyticsData);

    // In production, you would send this to your analytics service
    // Examples:
    
    // Mixpanel
    // await fetch('https://api.mixpanel.com/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     event: analyticsData.event,
    //     properties: { ...analyticsData.properties, token: process.env.MIXPANEL_TOKEN }
    //   })
    // });

    // Google Analytics 4
    // await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     client_id: userId || 'anonymous',
    //     events: [{
    //       name: 'extension_download',
    //       parameters: analyticsData.properties
    //     }]
    //   })
    // });

    // Segment
    // await fetch('https://api.segment.io/v1/track', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Basic ${Buffer.from(process.env.SEGMENT_WRITE_KEY + ':').toString('base64')}`
    //   },
    //   body: JSON.stringify({
    //     userId: userId || 'anonymous',
    //     event: 'Extension Download',
    //     properties: analyticsData.properties
    //   })
    // });

    // PostHog
    // await fetch('https://app.posthog.com/capture/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     api_key: process.env.POSTHOG_API_KEY,
    //     event: 'extension_download',
    //     properties: analyticsData.properties,
    //     distinct_id: userId || 'anonymous'
    //   })
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json({ success: true });
  }
}