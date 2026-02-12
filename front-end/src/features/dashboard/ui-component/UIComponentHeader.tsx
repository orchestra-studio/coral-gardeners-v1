"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";
import { ShineBadge } from "@/components/ui/ShineBadge";

export default function UIComponentHeader() {
  const t = useTranslations("dashboard");
  const tUI = useTranslations("dashboard/ui-component");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tUI("breadcrumb.uiComponent"),
      current: true,
    },
  ];

  // Component counts per category
  const componentCounts = {
    total: 49,
    inputs: 12,
    feedback: 7,
    navigation: 12,
    layout: 17,
  };

  return (
    <PageHeader
      title={
        <div className="flex flex-wrap items-center gap-3">
          <span>{tUI("title")}</span>
          <ShineBadge variant="default" size="md">
            {componentCounts.total} {tUI("stats.components")}
          </ShineBadge>
        </div>
      }
      description={tUI("description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      size="md"
    />
  );
}
