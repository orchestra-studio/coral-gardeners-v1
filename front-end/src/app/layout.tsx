import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import Script from "next/script";
import { BRAND_CONFIG } from "@/config/brand.config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND_CONFIG.theme.light },
    { media: "(prefers-color-scheme: dark)", color: BRAND_CONFIG.theme.dark },
  ],
};

export const metadata: Metadata = {
  title: BRAND_CONFIG.meta.title.en,
  description: BRAND_CONFIG.meta.description.en,
  keywords: BRAND_CONFIG.meta.keywords,
  authors: [{ name: BRAND_CONFIG.meta.author }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: BRAND_CONFIG.meta.title.en,
    description: BRAND_CONFIG.meta.description.en,
    type: "website",
    locale: "en_US",
    url: BRAND_CONFIG.domain.url,
    siteName: BRAND_CONFIG.name.en,
    images: [
      {
        url: BRAND_CONFIG.meta.ogImage,
        width: 1200,
        height: 630,
        alt: `${BRAND_CONFIG.name.en} Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_CONFIG.meta.title.en,
    description: BRAND_CONFIG.meta.description.en,
    images: [BRAND_CONFIG.meta.twitterImage],
  },
  metadataBase: new URL(BRAND_CONFIG.domain.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Favicon and Manifest Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Prevent flash of wrong theme - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = theme === 'dark' || (!theme && prefersDark);
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`bg-[var(--background)] text-[var(--foreground)] antialiased overflow-x-hidden min-h-screen `}
      >
        {children}

        {/* Structured Data for SEO */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: BRAND_CONFIG.company.en,
                url: BRAND_CONFIG.domain.url,
                logo: BRAND_CONFIG.logo.icon,
                ...(BRAND_CONFIG.contact.email && {
                  email: BRAND_CONFIG.contact.email,
                }),
                ...(BRAND_CONFIG.contact.phone && {
                  telephone: BRAND_CONFIG.contact.phone,
                }),
                ...(BRAND_CONFIG.links.website && {
                  sameAs: [
                    BRAND_CONFIG.links.github,
                    BRAND_CONFIG.links.twitter,
                    BRAND_CONFIG.links.linkedin,
                    BRAND_CONFIG.links.facebook,
                  ].filter(Boolean),
                }),
              },
              {
                "@type": "WebSite",
                name: BRAND_CONFIG.name.en,
                url: BRAND_CONFIG.domain.url,
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${BRAND_CONFIG.domain.url}/?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          })}
        </Script>
      </body>
    </html>
  );
}
