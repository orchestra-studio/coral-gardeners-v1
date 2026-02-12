import { useAuth } from '@/store/useAuth';
import { useMemo } from 'react';

/**
 * Permission Hook
 * 
 * Provides utilities to check user permissions
 * 
 * @example
 * ```tsx
 * const { hasPermission, permissions } = usePermission();
 * 
 * if (hasPermission('users.create')) {
 *   // Show create button
 * }
 * 
 * // Check multiple permissions (OR logic)
 * if (hasPermission(['users.create', 'users.edit'])) {
 *   // User has at least one of these permissions
 * }
 * ```
 */
export const usePermission = () => {
    const { user } = useAuth();

    const permissions = useMemo(() => {
        return user?.permissions || [];
    }, [user]);

    const roles = useMemo(() => {
        return user?.roles || [];
    }, [user]);

    /**
     * Check if user has a specific permission or any of the permissions in an array
     * @param permission - Single permission string or array of permissions (OR logic)
     * @returns true if user has the permission(s)
     */
    const hasPermission = (permission: string | string[]): boolean => {
        if (!user || !permissions.length) return false;

        if (Array.isArray(permission)) {
            // OR logic: user needs at least one permission
            return permission.some(p => permissions.includes(p));
        }

        return permissions.includes(permission);
    };

    /**
     * Check if user has ALL of the specified permissions
     * @param requiredPermissions - Array of permissions (AND logic)
     * @returns true if user has all permissions
     */
    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        if (!user || !permissions.length) return false;
        return requiredPermissions.every(p => permissions.includes(p));
    };

    /**
     * Check if user has a specific role
     * @param roleName - Role name to check
     * @returns true if user has the role
     */
    const hasRole = (roleName: string): boolean => {
        if (!user || !roles.length) return false;
        return roles.some(role => role.name === roleName);
    };

    /**
     * Check if user has any of the specified roles
     * @param roleNames - Array of role names (OR logic)
     * @returns true if user has at least one role
     */
    const hasAnyRole = (roleNames: string[]): boolean => {
        if (!user || !roles.length) return false;
        return roleNames.some(roleName => roles.some(role => role.name === roleName));
    };

    return {
        permissions,
        roles,
        hasPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
    };
};
