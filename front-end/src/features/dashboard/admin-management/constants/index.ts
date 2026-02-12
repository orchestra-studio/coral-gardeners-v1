/**
 * Constants and configuration for Admin Management module
 */

import React from "react";
import {
    IconEye,
    IconEdit,
    IconTrash,
    IconShield,
} from "@tabler/icons-react";

/**
 * Default page size for admins table
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Default sort order for admins
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

export const createAssignRolesMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconShield, { size: 16 }),
    label: t("actions.assignRoles"),
    onClick,
});

export const createDeleteMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconTrash, { size: 16 }),
    label: t("actions.delete"),
    onClick,
});

/**
 * Alert configuration for admin deletion
 */
export const DELETE_ADMIN_ALERT_CONFIG = {
    icon: "warning" as const,
    confirmButtonColor: "var(--rejected, #ef4444)",
};

/**
 * Table configuration
 */
export const TABLE_CONFIG = {
    emptyMessageKey: "table.empty.description",
    showPagination: true,
};

/**
 * Admin avatar configuration
 */
export const AVATAR_CONFIG = {
    size: "w-8 h-8",
    textSize: "text-sm",
    fontWeight: "font-medium",
};
