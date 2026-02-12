import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";

interface AdminsHeaderProps {
  actions?: React.ReactNode;
}

export default function AdminsHeader({ actions }: AdminsHeaderProps) {
  const t = useTranslations("dashboard");
  const tAdmins = useTranslations("dashboard/settings/adminmanagement");
  const locale = useLocale();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tAdmins("title"),
      current: true,
    },
  ];

  return (
    <PageHeader
      title={tAdmins("title")}
      description={tAdmins("description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      actions={actions}
      size="md"
    />
  );
}
