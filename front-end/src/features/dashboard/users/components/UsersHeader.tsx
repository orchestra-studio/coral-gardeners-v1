"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";

export type UserType = "all" | "deleted";

interface UsersHeaderProps {
  type: UserType;
  actions?: React.ReactNode;
}

export default function UsersHeader({ type, actions }: UsersHeaderProps) {
  const t = useTranslations("dashboard");
  const tUsers = useTranslations("dashboard/users");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: t("breadcrumb.users"),
      href: `/${locale}/dashboard/users`,
    },
    {
      label: tUsers(`tabs.${type}`),
      current: true,
    },
  ];

  return (
    <PageHeader
      title={tUsers(`${type}.title`)}
      description={tUsers(`${type}.description`)}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      actions={actions}
      size="md"
    />
  );
}
