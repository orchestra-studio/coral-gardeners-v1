"use client";

import React from "react";
import { BRAND_CONFIG, getCompanyName } from "@/config/brand.config";
import { useLocale } from "@/hooks/locale/useLocale";

export default function DashboardFooter() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const companyName = getCompanyName(locale);
  const brandName =
    BRAND_CONFIG.name[locale as keyof typeof BRAND_CONFIG.name] ||
    BRAND_CONFIG.name.en;

  return (
    <footer className="bg-[var(--surface)] px-6 py-3 rounded-2xl">
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] flex-nowrap gap-2 overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 truncate whitespace-nowrap">
          <span>© {currentYear}</span>
          <span className="hidden xs:inline">{brandName}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">v{BRAND_CONFIG.version}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
          <span className="hidden md:inline">by</span>
          <span className="font-medium text-[var(--text)]">{companyName}</span>
        </div>
      </div>
    </footer>
  );
}
