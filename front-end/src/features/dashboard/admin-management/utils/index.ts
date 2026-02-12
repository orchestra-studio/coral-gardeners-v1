/**
 * Utility functions for Admin Management module
 */

import type { AdminUser } from "@/services/adminManagement";

/**
 * Get admin's full name by combining first and last name
 */
export const getAdminFullName = (admin: AdminUser): string => {
    return `${admin.first_name} ${admin.last_name}`.trim();
};

/**
 * Get admin's initials from first and last name
 */
export const getAdminInitials = (admin: AdminUser): string => {
    return `${admin.first_name.charAt(0)}${admin.last_name.charAt(0)}`;
};

/**
 * Format date string to localized date
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 * Get admin roles as comma-separated string
 */
export const getAdminRolesString = (admin: AdminUser): string => {
    if (!admin.roles || admin.roles.length === 0) {
        return "No roles";
    }
    return admin.roles.map(role => role.name).join(", ");
};

/**
 * Check if admin has specific role
 */
export const hasRole = (admin: AdminUser, roleName: string): boolean => {
    return admin.roles?.some(role => role.name === roleName) ?? false;
};

/**
 * Generate breadcrumb items for admins page
 */
export const generateAdminsBreadcrumb = (
    locale: string,
    dashboardText: string,
    adminsText: string
) => [
        {
            label: dashboardText,
            href: `/${locale}/dashboard`,
        },
        {
            label: adminsText,
            current: true,
        },
    ];
