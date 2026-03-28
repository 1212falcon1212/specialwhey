import type { Metadata, Viewport } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SWRProvider } from "@/lib/swr-provider";
import { OrganizationJsonLd } from "@/components/shared/json-ld";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://specialwhey.com.tr"),
  title: {
    default: "Special Whey - Kendi Protein Karışımını Oluştur",
    template: "%s | Special Whey",
  },
  description:
    "Kendi protein karışımını oluştur. Whey, İzolat, BCAA ve daha fazlası ile kişiselleştirilmiş protein tozu.",
  keywords: [
    "protein tozu",
    "whey protein",
    "protein karışımı",
    "sporcu gıdası",
    "bcaa",
    "kreatin",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Special Whey",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ff6b2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Special Whey" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${montserrat.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <OrganizationJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <SWRProvider>
          {children}
          <Toaster position="top-right" richColors />
        </SWRProvider>
      </body>
    </html>
  );
}
