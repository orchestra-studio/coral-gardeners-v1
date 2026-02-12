/**
 * Constants and configuration for Users module
 */

import React from "react";
import {
    IconEye,
    IconEdit,
    IconMail,
    IconCheck,
    IconTrash,
    IconRefresh,
} from "@tabler/icons-react";

/**
 * Default page size for users table
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Default sort order for users
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

export const createResendVerificationMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconMail, { size: 16 }),
    label: t("actions.resendVerification"),
    onClick,
});

export const createMarkVerifiedMenuItem = (t: (key: string) => string, onClick: () => void) => ({
    icon: React.createElement(IconCheck, { size: 16 }),
    label: t("actions.markVerified"),
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
 * Alert configuration for user deletion
 */
export const DELETE_USER_ALERT_CONFIG = {
    icon: "warning" as const,
    confirmButtonColor: "var(--rejected, #ef4444)",
};

/**
 * Alert configuration for user restoration
 */
export const RESTORE_USER_ALERT_CONFIG = {
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
    emailPlaceholder: "Filter by email",
    phonePlaceholder: "Filter by phone",
    namePlaceholder: "Search by first/last name",
    datePlaceholder: "YYYY-MM-DD",
};

/**
 * Email verification badge configuration
 */
export const EMAIL_BADGE_CONFIG = {
    iconSize: 8,
    containerSize: "w-3 h-3",
    verifiedBgOpacity: "/10",
    unverifiedBgOpacity: "/10",
};

/**
 * User avatar configuration
 */
export const AVATAR_CONFIG = {
    size: "w-8 h-8",
    textSize: "text-sm",
    fontWeight: "font-medium",
};