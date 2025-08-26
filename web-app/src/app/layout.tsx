import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SKTCH - Voice-Native Browser Extension for Professionals',
    template: '%s | SKTCH'
  },
  description: 'Transform any website into a voice-controlled interface with professional accuracy. Premium voice-native browser extension with sub-250ms latency and 99.9% accuracy.',
  keywords: ['voice control', 'browser extension', 'productivity', 'speech recognition', 'voice typing', 'accessibility', 'professional tools'],
  authors: [{ name: 'SKTCH Team' }],
  creator: 'SKTCH',
  publisher: 'SKTCH',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sktch.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SKTCH - Voice-Native Browser Extension for Professionals',
    description: 'Transform any website into a voice-controlled interface with professional accuracy. Premium voice-native browser extension with sub-250ms latency and 99.9% accuracy.',
    url: '/',
    siteName: 'SKTCH',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SKTCH - Voice-Native Browser Extension',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKTCH - Voice-Native Browser Extension for Professionals',
    description: 'Transform any website into a voice-controlled interface with professional accuracy. Premium voice-native browser extension with sub-250ms latency and 99.9% accuracy.',
    images: ['/og-image.png'],
    creator: '@sktch_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SKTCH" />
        <meta name="application-name" content="SKTCH" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}