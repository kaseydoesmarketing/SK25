import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { version } = await request.json();

    if (!version || !['free', 'pro', 'team'].includes(version)) {
      return NextResponse.json({ error: 'Invalid version' }, { status: 400 });
    }

    // Check if user has access to requested version
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPro: true, planType: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify access permissions
    if (version === 'pro' && !user.isPro) {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 });
    }

    if (version === 'team' && user.planType !== 'team') {
      return NextResponse.json({ error: 'Team subscription required' }, { status: 403 });
    }

    // Generate license key for paid versions
    const licenseKey = version !== 'free' ? `sktch_${version}_${nanoid(16)}` : null;

    // Create download record
    const download = await prisma.download.create({
      data: {
        userId: session.user.id,
        extensionVersion: version,
        platform: 'chrome',
        downloadUrl: getDownloadUrl(version),
        licenseKey,
        isActive: true,
        expiresAt: version !== 'free' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null, // 1 year expiry for paid versions
      },
    });

    // Track usage analytics
    await trackDownloadAnalytics(session.user.id, version, request);

    return NextResponse.json({
      downloadId: download.id,
      downloadUrl: download.downloadUrl,
      licenseKey: download.licenseKey,
      version,
    });
  } catch (error) {
    console.error('Error creating download:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDownloadUrl(version: string): string {
  const cdnBase = process.env.CDN_BASE_URL || 'https://cdn.sktch.com/extensions';
  const versionMap = {
    free: 'sktch-extension-free-v2.1.0.zip',
    pro: 'sktch-extension-pro-v2.1.0.zip',
    team: 'sktch-extension-team-v2.1.0.zip',
  };
  
  return `${cdnBase}/${versionMap[version as keyof typeof versionMap]}`;
}

async function trackDownloadAnalytics(userId: string, version: string, request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // In a real app, you might send this to an analytics service like Mixpanel, Segment, etc.
    console.log('Download Analytics:', {
      userId,
      version,
      timestamp: new Date().toISOString(),
      userAgent,
      ip: ip.split(',')[0], // Take first IP if multiple
    });

    // You could also store this in your database for internal analytics
    // await prisma.analyticsEvent.create({
    //   data: {
    //     eventType: 'download',
    //     userId,
    //     properties: { version, userAgent, ip },
    //   }
    // });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request if analytics fails
  }
}