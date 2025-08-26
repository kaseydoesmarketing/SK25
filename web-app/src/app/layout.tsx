import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SKTCH - Voice-Native Browser Extension",
  description: "Transform any web input into a voice-controlled interface. Perfect for AI tools, content creation, and productivity workflows.",
  keywords: "voice control, browser extension, AI tools, productivity, voice to text, speech recognition",
  authors: [{ name: "SKTCH Team" }],
  openGraph: {
    title: "SKTCH - Voice-Native Browser Extension",
    description: "Transform any web input into a voice-controlled interface. Perfect for AI tools, content creation, and productivity workflows.",
    type: "website",
    siteName: "SKTCH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
