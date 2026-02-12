"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import type { AdminIdentityMeta } from "./hooks/useAdminViewData";

interface AdminViewHeaderProps {
  username: string;
  identity?: (AdminIdentityMeta & { statusLabel: string }) | null;
  isLoading: boolean;
  actions?: React.ReactNode;
}

export default function AdminViewHeader({
  username,
  identity,
  isLoading,
  actions,
}: AdminViewHeaderProps) {
  const t = useTranslations("dashboard");
  const tAdmins = useTranslations("dashboard/settings/adminmanagement");
  const locale = useLocale();

  const displayName = identity?.displayName ?? "";

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tAdmins("title"),
      href: `/${locale}/dashboard/admins-management`,
    },
    {
      label: isLoading ? "..." : displayName || username,
      current: true,
    },
  ];

  return (
    <PageHeader
      title={
        <span>
          {tAdmins("view.titlePrefix")}{" "}
          {isLoading ? (
            <Skeleton width={120} height={20} className="inline-block" />
          ) : (
            displayName || username
          )}
        </span>
      }
      description={tAdmins("view.description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      backUrl={`/${locale}/dashboard/admins-management`}
      actions={actions}
      size="md"
    />
  );
}
