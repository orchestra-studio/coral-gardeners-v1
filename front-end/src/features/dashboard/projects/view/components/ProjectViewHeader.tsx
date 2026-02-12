"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import PageHeader from "@/components/PageHeader";
import type { Project } from "@/services/projects";

interface ProjectViewHeaderProps {
  project: Project | undefined;
  isLoading: boolean;
}

export default function ProjectViewHeader({ project }: ProjectViewHeaderProps) {
  const t = useTranslations("dashboard/projects");
  const locale = useLocale() as "en" | "ar";

  const breadcrumbItems = [
    {
      label: t("title"),
      href: `/${locale}/dashboard/projects`,
    },
    {
      label: t("tabs.all"),
      href: `/${locale}/dashboard/projects/all`,
    },
    {
      label: project?.translations[locale]?.name || "...",
      current: true,
    },
  ];

  const title = project
    ? `${t("view.titlePrefix")} ${
        project.translations[locale]?.name || project.translations.en.name
      }`
    : t("view.titlePrefix") + " ...";

  return (
    <PageHeader
      title={title}
      description={t("view.description")}
      breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      backUrl={`/${locale}/dashboard/projects/all`}
      size="md"
    />
  );
}
