import type { Metadata } from "next";
import { DM_Sans, Cabin } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from './registry';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const cabin = Cabin({
  subsets: ['latin'],
  variable: '--font-cabin',
});

export const metadata: Metadata = {
  title: "VØDA | AI-Powered Music Insights",
  description: "Your personal music intelligence hub. Discover insights about your listening habits, create smart playlists, and explore your Spotify journey with AI.",
  keywords: "spotify, music analytics, ai, playlists, music insights, music stats",
  openGraph: {
    title: 'VØDA | AI-Powered Music Insights',
    description: 'Your personal music intelligence hub powered by AI',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'VØDA - Music Intelligence Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VØDA | AI-Powered Music Insights',
    description: 'Your personal music intelligence hub powered by AI',
  },
  icons: {
    icon: '/favicon.ico', // You'll need to create these icons
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#1ed760',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cabin.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
