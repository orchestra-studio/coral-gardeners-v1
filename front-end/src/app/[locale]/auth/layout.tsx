import { NextIntlClientProvider } from "next-intl";
import { getMessagesForNamespaces } from "@/config/i18n";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: {
      template: `%s | ${
        isArabic ? BRAND_CONFIG.name.ar : BRAND_CONFIG.name.en
      }`,
      default: `Authentication | ${
        isArabic ? BRAND_CONFIG.name.ar : BRAND_CONFIG.name.en
      }`,
    },
  };
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;

  // Load auth messages for all auth pages
  const authMessages = await getMessagesForNamespaces(locale, ["auth"]);

  return (
    <NextIntlClientProvider messages={authMessages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
