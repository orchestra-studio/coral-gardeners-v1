/**
 * Utility functions for Projects module
 */

import { Project, StatusVariant } from "../types";

/**
 * Get project name in current locale
 */
export const getProjectName = (project: Project, locale: "en" | "ar" = "en"): string => {
    return project.translations?.[locale]?.name || project.translations?.en?.name || "";
};

/**
 * Get project description in current locale
 */
export const getProjectDescription = (project: Project, locale: "en" | "ar" = "en"): string => {
    return project.translations?.[locale]?.description || project.translations?.en?.description || "";
};

/**
 * Get project environment in current locale
 */
export const getProjectEnvironment = (project: Project, locale: "en" | "ar" = "en"): string => {
    return project.translations?.[locale]?.environment || project.translations?.en?.environment || "";
};

/**
 * Format date string to localized date
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 * Get status variant based on project status
 */
export const getStatusVariant = (status: string): StatusVariant => {
    switch (status) {
        case "ready":
            return "success";
        case "in-progress":
            return "info";
        case "blocked":
            return "warning";
        default:
            return "info";
    }
};

/**
 * Get project status label key for translation
 */
export const getProjectStatusLabelKey = (status: string): string => {
    return `status.${status}`;
};

/**
 * Generate breadcrumb items for projects page
 */
export const generateProjectsBreadcrumb = (
    locale: string,
    dashboardText: string,
    projectsText: string
) => [
        {
            label: dashboardText,
            href: `/${locale}/dashboard`,
        },
        {
            label: projectsText,
            current: true,
        },
    ];

/**
 * Get page title and description based on type
 */
export const getProjectsPageContent = (
    type: "all" | "deleted",
    t: (key: string) => string
) => {
    const title = type === "deleted" ? t("deleted.title") : t("title");
    const description = type === "deleted" ? t("deleted.description") : t("description");

    return { title, description };
};
