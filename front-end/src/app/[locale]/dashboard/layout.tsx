import { NextIntlClientProvider } from "next-intl";
import { getMessagesForNamespaces } from "@/config/i18n";
import LayoutClient from "@/layouts/dashboard/layout-client";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/config/brand.config";

interface DashboardLayoutProps {
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
      default: isArabic
        ? BRAND_CONFIG.meta.title.ar
        : BRAND_CONFIG.meta.title.en,
    },
    description: isArabic
      ? BRAND_CONFIG.meta.description.ar
      : BRAND_CONFIG.meta.description.en,
  };
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  // Load dashboard messages for all dashboard pages
  const dashboardMessages = await getMessagesForNamespaces(locale, [
    "common",
    "dashboard",
    "dashboard/overview",
    "dashboard/settings",
    "dashboard/settings/profile",
    "dashboard/settings/security",
    "dashboard/settings/adminroles",
    "dashboard/settings/adminmanagement",
    "dashboard/settings/appsettings",
    "dashboard/users",
    "dashboard/projects",
    "dashboard/ui-component",
    "ai-assistant",
  ]);
  return (
    <NextIntlClientProvider messages={dashboardMessages} locale={locale}>
      <LayoutClient>{children}</LayoutClient>
    </NextIntlClientProvider>
  );
}
