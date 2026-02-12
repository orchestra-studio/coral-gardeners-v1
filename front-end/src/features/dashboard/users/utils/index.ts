/**
 * Utility functions for Users module
 */

import { User, StatusVariant } from "../types";

/**
 * Get user's full name by combining first and last name
 */
export const getUserFullName = (user: User): string => {
    return `${user.first_name} ${user.last_name}`.trim();
};

/**
 * Get user's initials from first and last name
 */
export const getUserInitials = (user: User): string => {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
};

/**
 * Format date string to localized date
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 * Get status variant based on verification status
 */
export const getStatusVariant = (isVerified: boolean): StatusVariant => {
    return isVerified ? "success" : "warning";
};

/**
 * Check if user is verified
 */
export const isUserVerified = (user: User): boolean => {
    return !!user.email_verified_at;
};

/**
 * Get user status label key for translation
 */
export const getUserStatusLabelKey = (user: User): string => {
    return isUserVerified(user) ? "status.verified" : "status.pending";
};

/**
 * Get user verification text key for translation
 */
export const getUserVerificationTextKey = (isVerified: boolean): string => {
    return isVerified ? "table.verified" : "table.unverified";
};

/**
 * Generate breadcrumb items for users page
 */
export const generateUsersBreadcrumb = (
    locale: string,
    dashboardText: string,
    usersText: string
) => [
        {
            label: dashboardText,
            href: `/${locale}/dashboard`,
        },
        {
            label: usersText,
            current: true,
        },
    ];

/**
 * Get page title and description based on type
 */
export const getUsersPageContent = (
    type: "all" | "deleted",
    t: (key: string) => string
) => {
    const title = type === "deleted" ? t("deleted.title") : t("title");
    const description = type === "deleted" ? t("deleted.description") : t("description");

    return { title, description };
};