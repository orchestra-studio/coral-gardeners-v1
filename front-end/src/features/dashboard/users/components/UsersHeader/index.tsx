"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";

interface UsersHeaderProps {
  actions?: React.ReactNode;
  type: "all" | "deleted";
}

export default function UsersHeader({ actions, type }: UsersHeaderProps) {
  const t = useTranslations("dashboard");
  const tUsers = useTranslations("dashboard/users");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tUsers("title"),
      current: true,
    },
  ];

  const title = type === "deleted" ? tUsers("deleted.title") : tUsers("title");
  const description =
    type === "deleted" ? tUsers("deleted.description") : tUsers("description");

  return (
    <PageHeader
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      title={title}
      description={description}
      actions={actions}
    />
  );
}
