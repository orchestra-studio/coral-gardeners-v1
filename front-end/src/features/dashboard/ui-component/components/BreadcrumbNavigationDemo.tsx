"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface BreadcrumbNavigationDemoProps {
  className?: string;
}

export default function BreadcrumbNavigationDemo({
  className,
}: BreadcrumbNavigationDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("components.breadcrumbNavigation.labels.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: t("components.breadcrumbNavigation.labels.users"),
      href: `/${locale}/dashboard/users`,
    },
    {
      label: t("components.breadcrumbNavigation.labels.profile"),
      current: true,
    },
  ];

  return (
    <DemoCard
      title={t("components.breadcrumbNavigation.title")}
      description={t("components.breadcrumbNavigation.description")}
      className={className}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
        <BreadcrumbNavigation items={breadcrumbItems} />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const breadcrumbItems = [
  {
    label: "Dashboard",
    href: "/dashboard"
  },
  {
    label: "Users", 
    href: "/dashboard/users"
  },
  {
    label: "Profile",
    current: true
  }
];

<BreadcrumbNavigation items={breadcrumbItems} />`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
