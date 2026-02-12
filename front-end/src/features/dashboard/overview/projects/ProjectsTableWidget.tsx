"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useProjects } from "@/services/projects";
import { useLocale } from "@/hooks/locale/useLocale";
import Table, { ExportButton } from "@/components/Table";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { PROJECTS_PER_PAGE } from "./config/constants";
import {
  useTransformedProjects,
  useProjectsTableSetup,
  getProjectsPagination,
} from "./lib/utils";
import type { ProjectDisplay, Locale } from "./types/";

export default function ProjectsTableWidget() {
  const t = useTranslations("dashboard/overview");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects with pagination
  const { data, isLoading, isError, error } = useProjects({
    page: currentPage,
    page_count: PROJECTS_PER_PAGE,
  });

  // Transform API data to display format
  const projects = useTransformedProjects(data?.projects, locale);

  // Pagination info from API
  const { totalItems, totalPages } = getProjectsPagination(data);

  const { columns, tableRef, handleExport } = useProjectsTableSetup({
    t,
    projects,
    filename: "projects",
  });

  return (
    <WidgetCard
      className="p-3 sm:p-4"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={t("projects.title")}
        description={t("projects.description")}
        action={
          <ExportButton
            onExport={handleExport}
            disabled={isLoading || !projects || projects.length === 0}
            translations={{
              button: t("projects.export.button"),
              csv: t("projects.export.csv"),
              csvDescription: t("projects.export.csvDescription"),
              image: t("projects.export.image"),
              imageDescription: t("projects.export.imageDescription"),
              exportingCsv: t("projects.export.exportingCsv"),
              exportingImage: t("projects.export.exportingImage"),
            }}
          />
        }
      />

      <div className="overflow-x-auto">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-[var(--errorColor)] mb-2">
              {t("projects.error")}
            </div>
            {error && (
              <div className="text-sm text-[var(--text-muted)]">
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            )}
          </div>
        ) : (
          <Table<ProjectDisplay>
            className="w-full rounded-md"
            columns={columns}
            data={projects}
            loading={isLoading}
            skeletonRowCount={10}
            emptyMessage={t("projects.noData")}
            showPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PROJECTS_PER_PAGE}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            tableRef={tableRef}
            paginationTranslations={{
              showing: tCommon("Pagination.showing"),
              to: tCommon("Pagination.to"),
              of: tCommon("Pagination.of"),
              results: tCommon("Pagination.results"),
              previous: tCommon("Pagination.previous"),
              next: tCommon("Pagination.next"),
              total: tCommon("Pagination.total"),
            }}
          />
        )}
      </div>
    </WidgetCard>
  );
}
