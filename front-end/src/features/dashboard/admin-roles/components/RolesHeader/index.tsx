import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";

interface RolesHeaderProps {
  actions?: React.ReactNode;
}

export default function RolesHeader({ actions }: RolesHeaderProps) {
  const t = useTranslations("dashboard");
  const tRoles = useTranslations("dashboard/settings/adminroles");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tRoles("title"),
      current: true,
    },
  ];

  return (
    <PageHeader
      title={tRoles("title")}
      description={tRoles("description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      actions={actions}
      size="md"
    />
  );
}
