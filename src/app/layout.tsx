import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Backdrop } from "@/components/Backdrop";
import { FilmGrain } from "@/components/FilmGrain";
import "./globals.css";

// Body + label faces are self-hosted via next/font (no runtime request, no CLS).
// The display face (Clash Display) is loaded from Fontshare in <head> below,
// since it isn't on Google Fonts.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lucen — premium website layers, prompt + assets included",
    template: "%s · Lucen",
  },
  description:
    "Browse premium website and UI layers, preview them live, then unlock the full build prompts and bundled assets. New drops every Friday.",
  applicationName: "Lucen",
  openGraph: {
    title: "Lucen — premium website layers, prompt + assets included",
    description:
      "Browse premium website and UI layers, preview them live, then unlock the full build prompts and bundled assets.",
    type: "website",
    siteName: "Lucen",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Clash Display — the display face. Fontshare, not on Google Fonts. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <Backdrop />
        {children}
        {/* Intercepting-route slot: item detail opens here as a modal when
            navigated client-side; a hard load renders the full /l/[slug] page. */}
        {modal}
        <FilmGrain />
      </body>
    </html>
  );
}
