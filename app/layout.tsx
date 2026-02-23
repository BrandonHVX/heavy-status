import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Heavy Status - Breaking News & Community Stories",
    template: "%s | Heavy Status",
  },
  description: "Stay informed with breaking news, featured stories, and live coverage from Heavy Status.",
  metadataBase: new URL(process.env.SITE_URL || "https://news-pwa.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Heavy Status",
    title: "Heavy Status - Breaking News & Community Stories",
    description: "Stay informed with breaking news, featured stories, and live coverage from Heavy Status.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Heavy Status" />
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: "704f7619-c14c-4769-aad8-f0584a197f44",
      notifyButton: {
        enable: true,
      },
      promptOptions: {
        slidedown: {
          prompts: [
            {
              type: "push",
              autoPrompt: true,
              text: {
                actionMessage: "Get instant alerts for breaking news and stories from Heavy Status",
                acceptButton: "Allow",
                cancelButton: "Maybe Later",
              },
              delay: {
                pageViews: 1,
                timeDelay: 3,
              },
            }
          ]
        }
      }
    });
  });
`,
          }}
        />
      </head>
      <body>
        <div className="min-h-screen bg-white text-gray-900 max-w-lg mx-auto relative shadow-[0_0_40px_rgba(0,0,0,0.06)]">
          <Header />
          <main className="min-h-[calc(100vh-3.5rem-4rem)]">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
