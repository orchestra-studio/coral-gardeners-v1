/**
 * Utility functions and hooks for Projects Table Widget
 */

import { useCallback, useMemo } from "react";
import type { Project } from "@/services/projects";
import type { PaginatedProjectsData } from "@/services/projects/hooks/useProjects";
import { useTableExport, type ExportFormat } from "@/components/Table";
import type { ProjectDisplay, Locale } from "../types";
import {
    PROJECT_ICON_MAP,
    DEFAULT_PROJECT_ICON,
    DEFAULT_PROJECT_IMAGE,
} from "../config/constants";
import { getTableColumns } from "../config/tableConfig";
import { getExportColumns } from "../config/exportConfig";

type Translator = (key: string) => string;

/**
 * Transform API project data to display format
 */
export const transformProjectToDisplay = (
    project: Project,
    locale: Locale
): ProjectDisplay => {
    const translation = project.translations[locale] || project.translations.en;

    return {
        id: project.id.toString(),
        name: translation.name,
        description: translation.description,
        status: project.status,
        date: new Date(project.updated_at).toLocaleDateString(
            locale === "ar" ? "ar-SA" : "en-US"
        ),
        version: project.version,
        icon: project.icon_name
            ? PROJECT_ICON_MAP[project.icon_name] || DEFAULT_PROJECT_ICON
            : DEFAULT_PROJECT_ICON,
        image: project.image || DEFAULT_PROJECT_IMAGE,
    };
};

/**
 * Hook to transform projects array to display format
 */
export const useTransformedProjects = (
    projects: Project[] | undefined,
    locale: Locale
): ProjectDisplay[] => {
    return useMemo(() => {
        if (!projects) return [];
        return projects.map((project) => transformProjectToDisplay(project, locale));
    }, [projects, locale]);
};

/**
 * Build data for table columns translations
 */
const getTableColumnTranslations = (t: Translator) => ({
    columns: {
        name: t("projects.columns.name"),
        status: t("projects.columns.status"),
        lastUpdated: t("projects.columns.lastUpdated"),
        actions: t("projects.columns.actions"),
    },
    status: {
        "in-progress": t("projects.status.inProgress"),
        ready: t("projects.status.ready"),
        blocked: t("projects.status.blocked"),
    },
    actions: {
        viewDetails: t("projects.actions.viewDetails"),
        edit: t("projects.actions.edit"),
        delete: t("projects.actions.delete"),
        openActionsMenu: t("projects.actions.openMenu"),
        viewProjectDetails: t("projects.actions.viewDetails"),
        editProject: t("projects.actions.edit"),
        deleteProject: t("projects.actions.delete"),
    },
});

/**
 * Build data for export columns translations
 */
const getExportColumnTranslations = (t: Translator) => ({
    columns: {
        name: t("projects.columns.name"),
        status: t("projects.columns.status"),
        lastUpdated: t("projects.columns.lastUpdated"),
    },
    status: {
        "in-progress": t("projects.status.inProgress"),
        ready: t("projects.status.ready"),
        blocked: t("projects.status.blocked"),
    },
});

/**
 * Hook to memoize table columns using translations
 */
export const useProjectTableColumns = (t: Translator) =>
    useMemo(() => getTableColumns(getTableColumnTranslations(t)), [t]);

/**
 * Hook to memoize export columns using translations
 */
export const useProjectExportColumns = (t: Translator) =>
    useMemo(() => getExportColumns(getExportColumnTranslations(t)), [t]);

/**
 * Extract pagination values from API response
 */
export const getProjectsPagination = (data?: PaginatedProjectsData | null) => ({
    totalItems: data?.pagination.total ?? 0,
    totalPages: data?.pagination.totalPages ?? 1,
});

interface UseProjectsTableSetupParams {
    t: Translator;
    projects: ProjectDisplay[];
    filename?: string;
}

/**
 * Hook to prepare table columns, export handler, and ref
 */
export const useProjectsTableSetup = ({
    t,
    projects,
    filename = "projects",
}: UseProjectsTableSetupParams) => {
    const columns = useProjectTableColumns(t);
    const exportColumns = useProjectExportColumns(t);

    const { tableRef, exportAsCSV, exportAsImage } = useTableExport({
        data: projects,
        columns,
        exportColumns,
        filename,
    });

    const handleExport = useCallback(
        async (format: ExportFormat) => {
            if (format === "csv") {
                await exportAsCSV();
            } else {
                await exportAsImage();
            }
        },
        [exportAsCSV, exportAsImage]
    );

    return {
        columns,
        tableRef,
        handleExport,
    };
};
