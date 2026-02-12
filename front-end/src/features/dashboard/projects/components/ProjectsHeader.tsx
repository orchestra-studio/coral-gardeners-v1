"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import { usePermission } from "@/hooks/permissions";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export type ProjectType = "all" | "deleted";

interface ProjectsHeaderProps {
  type: ProjectType;
  onCreateClick?: () => void;
}

export default function ProjectsHeader({
  type,
  onCreateClick,
}: ProjectsHeaderProps) {
  const t = useTranslations("dashboard");
  const tProjects = useTranslations("dashboard/projects");
  const locale = useLocale();
  const { hasPermission } = usePermission();

  // Permission check
  const canCreate = hasPermission("projects.create");

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      href: `/${locale}/dashboard`,
    },
    {
      label: t("breadcrumb.projects"),
      href: `/${locale}/dashboard/projects`,
    },
    {
      label: tProjects(`tabs.${type}`),
      current: true,
    },
  ];

  return (
    <PageHeader
      title={tProjects(`${type}.title`)}
      description={tProjects(`${type}.description`)}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      actions={
        type === "all" &&
        onCreateClick &&
        canCreate && (
          <Button
            onClick={onCreateClick}
            startIcon={<IconPlus size={16} />}
            size="sm"
          >
            {tProjects("actions.create")}
          </Button>
        )
      }
      size="md"
    />
  );
}
