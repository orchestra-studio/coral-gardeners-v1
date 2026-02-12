/**
 * Hook for managing projects table state and filters
 */

import { useMemo, useState } from "react";
import type { Project, ProjectsFilters, ProjectStatus } from "@/services/projects";
import { TableFilterField as FilterField } from "@/components/Table";

/**
 * Hook for managing projects table state and filters
 */
export const useProjectsTable = () => {
    const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Build API filters
    const apiFilters: ProjectsFilters = useMemo(() => {
        const filters: ProjectsFilters = {
            page: currentPage,
            page_count: pageSize,
        };

        // Add search query
        if (filterValues.search && String(filterValues.search).trim()) {
            filters.name = String(filterValues.search);
        }

        // Add filter values
        if (filterValues.name) {
            filters.name = String(filterValues.name);
        }
        if (filterValues.status) {
            filters.status = String(filterValues.status) as ProjectStatus;
        }
        if (filterValues.environment) {
            filters.environment = String(filterValues.environment);
        }

        return filters;
    }, [filterValues, currentPage, pageSize]);

    // Event handlers
    const onFilter = (filters: Record<string, unknown>) => {
        setFilterValues(filters);
        setCurrentPage(1);
    };

    const onResetFilters = () => {
        setFilterValues({});
        setCurrentPage(1);
    };

    return {
        filterValues,
        currentPage,
        pageSize,
        apiFilters,
        setCurrentPage,
        onFilter,
        onResetFilters,
    };
};

/**
 * Hook for generating filter fields configuration
 */
export const useProjectsFilterFields = (type: "all" | "deleted", t?: (key: string) => string): FilterField[] => {
    return useMemo(() => {
        // Return filter fields for both "all" and "deleted" types
        return [
            {
                name: "search",
                label: t ? t("table.filters.searchLabel") : "Search",
                type: "search",
                placeholder: t ? t("table.filters.search") : "Search projects...",
            },
            {
                name: "name",
                label: t ? t("table.filters.name") : "Name",
                type: "text",
                placeholder: t ? t("table.filters.searchName") : "Search by project name",
            },
            {
                name: "status",
                label: t ? t("table.filters.status") : "Status",
                type: "select",
                placeholder: t ? t("table.filters.selectStatus") : "Select status",
                options: [
                    { value: "in-progress", label: t ? t("table.status.inProgress") : "In Progress" },
                    { value: "ready", label: t ? t("table.status.ready") : "Ready" },
                    { value: "blocked", label: t ? t("table.status.blocked") : "Blocked" },
                ],
            },
            {
                name: "environment",
                label: t ? t("table.filters.environment") : "Environment",
                type: "text",
                placeholder: t ? t("table.filters.searchEnvironment") : "Filter by environment",
            },
        ];
    }, [t]);
};

/**
 * Hook for managing project action handlers
 */
export const useProjectActions = (
    type: "all" | "deleted",
    onEdit: (project: Project) => void,
    onDelete?: (project: Project) => void,
    onRestore?: (project: Project) => void
) => {
    const handleDelete = useMemo(
        () => (project: Project) => {
            if (onDelete) {
                onDelete(project);
            }
        },
        [onDelete]
    );

    const handleRestore = useMemo(
        () => (project: Project) => {
            if (onRestore) {
                onRestore(project);
            }
        },
        [onRestore]
    );

    return {
        handleEdit: onEdit,
        handleAction: type === "all" ? handleDelete : handleRestore,
    };
};

/**
 * Hook for processing table data
 */
export const useProjectsTableData = (projects: Project[] | undefined) => {
    return useMemo(() => {
        return projects || [];
    }, [projects]);
};

/**
 * Hook for calculating pagination info
 */
export const useProjectsPagination = (displayData: Project[], pageSize: number) => {
    return useMemo(() => {
        const totalItems = displayData.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return { totalItems, totalPages };
    }, [displayData.length, pageSize]);
};
