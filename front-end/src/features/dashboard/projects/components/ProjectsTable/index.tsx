"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import Table from "@/components/Table";
import type { Project } from "@/services/projects";
import { useProjects, useDeletedProjects } from "@/services/projects";
import { createProjectColumns } from "../ProjectColumns";
import { useProjectsTable, useProjectsFilterFields } from "../../hooks";

interface ProjectsTableProps {
  type: "all" | "deleted";
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onRestore?: (project: Project) => void;
}

export default function ProjectsTable({
  type,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: ProjectsTableProps) {
  const t = useTranslations("dashboard/projects");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "en" | "ar";

  // Use table hook for filters and pagination
  const {
    filterValues,
    currentPage,
    pageSize,
    apiFilters,
    setCurrentPage,
    onFilter,
    onResetFilters,
  } = useProjectsTable();

  const filterFields = useProjectsFilterFields(type, t);

  // Fetch projects data based on type with API filters
  const { data: allProjectsData, isFetching: isFetchingAll } = useProjects(
    apiFilters,
    type === "all"
  );

  const { data: deletedProjectsData, isFetching: isFetchingDeleted } =
    useDeletedProjects(apiFilters, type === "deleted");

  const projectsData = type === "all" ? allProjectsData : deletedProjectsData;
  const isFetching = type === "all" ? isFetchingAll : isFetchingDeleted;

  // Use API data directly
  const displayData = useMemo(() => {
    return projectsData?.projects || [];
  }, [projectsData]);

  // Pagination info from API
  const totalItems = projectsData?.pagination.total || 0;
  const totalPages = projectsData?.pagination.totalPages || 1;

  // Create columns with handlers
  const columns = useMemo(
    () => createProjectColumns(locale, onView, onEdit, onDelete, onRestore, t),
    [locale, onView, onEdit, onDelete, onRestore, t]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md">
        <Table<Project>
          data={displayData}
          columns={columns}
          loading={isFetching}
          skeletonRowCount={10}
          emptyMessage={t("table.empty.description")}
          // Pagination
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          paginationTranslations={{
            showing: tCommon("Pagination.showing"),
            to: tCommon("Pagination.to"),
            of: tCommon("Pagination.of"),
            results: tCommon("Pagination.results"),
            previous: tCommon("Pagination.previous"),
            total: tCommon("Pagination.total"),
            next: tCommon("Pagination.next"),
          }}
          // Filter with integrated search bar - shown for both types
          showFilter
          filterFields={filterFields}
          filterDefaultValues={filterValues}
          onFilter={onFilter}
          onResetFilters={onResetFilters}
          filterButtonLabel={t("table.filters.filterButton")}
          resetButtonLabel={t("table.filters.reset")}
        />
      </div>
    </div>
  );
}
