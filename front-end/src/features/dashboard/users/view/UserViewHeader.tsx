"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import type { UserIdentityMeta } from "@/features/dashboard/users/view/hooks/useUserViewData";

interface UserViewHeaderProps {
  username: string;
  identity?: UserIdentityMeta | null;
  isLoading: boolean;
  actions?: React.ReactNode;
}

export default function UserViewHeader({
  username,
  identity,
  isLoading,
  actions,
}: UserViewHeaderProps) {
  const t = useTranslations("dashboard");
  const tUsers = useTranslations("dashboard/users");
  const locale = useLocale();

  const displayName = identity?.displayName ?? "";

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: tUsers("title"),
      href: `/${locale}/dashboard/users`,
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
          {tUsers("view.titlePrefix")}{" "}
          {isLoading ? (
            <Skeleton width={120} height={20} className="inline-block" />
          ) : (
            displayName || username
          )}
        </span>
      }
      description={tUsers("view.description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      backUrl={`/${locale}/dashboard/users/all`}
      actions={actions}
      size="md"
    />
  );
}
