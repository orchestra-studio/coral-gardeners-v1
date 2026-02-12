/**
 * Constants and configuration for Projects module
 */

import React from "react";
import {
    IconEye,
    IconEdit,
    IconTrash,
    IconRefresh,
} from "@tabler/icons-react";

/**
 * Default page size for projects table
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Default sort order for projects
 */
export const DEFAULT_SORT_ORDER = "desc";

/**
 * Menu item factory functions
 */
export const createViewMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconEye, { size: 16 }),
    label: t("actions.view"),
    onClick,
});

export const createEditMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconEdit, { size: 16 }),
    label: t("actions.edit"),
    onClick,
});

export const createDeleteMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconTrash, { size: 16 }),
    label: t("actions.delete"),
    onClick,
});

export const createRestoreMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconRefresh, { size: 16 }),
    label: t("actions.restore"),
    onClick,
});

/**
 * Alert configuration for project deletion
 */
export const DELETE_PROJECT_ALERT_CONFIG = {
    icon: "warning" as const,
    confirmButtonColor: "var(--rejected, #ef4444)",
};

/**
 * Alert configuration for project restoration
 */
export const RESTORE_PROJECT_ALERT_CONFIG = {
    icon: "question" as const,
    confirmButtonColor: "var(--success, #22c55e)",
};

/**
 * Table configuration
 */
export const TABLE_CONFIG = {
    emptyMessageKey: "table.empty.description",
    searchPlaceholderKey: "table.filters.search",
    showPagination: true,
};

/**
 * Filter configuration
 */
export const FILTER_CONFIG = {
    namePlaceholder: "Search by project name",
    statusPlaceholder: "Filter by status",
    environmentPlaceholder: "Filter by environment",
};

/**
 * Project status configuration
 */
export const PROJECT_STATUS = {
    IN_PROGRESS: "in-progress",
    READY: "ready",
    BLOCKED: "blocked",
} as const;

/**
 * Project status options for filters
 */
export const STATUS_OPTIONS = [
    { value: PROJECT_STATUS.IN_PROGRESS, label: "In Progress" },
    { value: PROJECT_STATUS.READY, label: "Ready" },
    { value: PROJECT_STATUS.BLOCKED, label: "Blocked" },
];
