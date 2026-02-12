"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";

export default function ComponentsPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: "Components",
      current: true,
    },
  ];

  return (
    <>
      <PageHeader
        title="Complex Components"
        description="Explore complex component examples and patterns"
        breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
        size="md"
      />

      {/* Placeholder - Will be implemented next */}
      <div className="bg-[var(--surface)] rounded-xl p-12 border border-[var(--border)] text-center">
        <h3 className="text-xl font-semibold text-[var(--text)] mb-2">
          Coming Soon
        </h3>
        <p className="text-[var(--text-muted)]">
          Complex components showcase will be added here
        </p>
      </div>
    </>
  );
}
