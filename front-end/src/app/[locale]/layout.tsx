import { NextIntlClientProvider } from "next-intl";

import { Locale, getMessagesForNamespaces } from "@/config/i18n";
import AppLayout from "../../layouts/app";
import Providers from "./providers";
import { notFound } from "next/navigation";
import LocaleHandler from "@/components/LocaleHandler";

// Define the supported locales
const locales = ["en", "ar"] as const;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Load only layouts messages for root layout (navbar, footer, etc.)
  const messages = await getMessagesForNamespaces(locale, ["layouts"]);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      <NextIntlClientProvider messages={messages} locale={locale}>
        <LocaleHandler />
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </NextIntlClientProvider>
    </>
  );
}
