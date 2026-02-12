/**
 * Role TanStack Query Hooks - Queries Only
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles';
import { Role, RolesListResponse, RolesListParams } from '../types/roleTypes';
import { roleKeys } from '../keys/roleKeys';

/**
 * Hook to get available roles for dropdown
 */
export function useRolesSelect() {
    return useQuery<Role[]>({
        queryKey: roleKeys.select(),
        queryFn: async () => {
            const response = await rolesApi.getRolesForDropdown();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch roles');
            }
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to get roles statistics
 */
export function useRolesStatistics() {
    return useQuery({
        queryKey: roleKeys.statistics(),
        queryFn: async () => {
            const response = await rolesApi.getStatistics();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch roles statistics');
            }
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000, // 2 minutes - statistics might change more frequently
    });
}

/**
 * Hook to get paginated list of roles
 */
export function useRolesList(params: RolesListParams = {}) {
    return useQuery<RolesListResponse>({
        queryKey: roleKeys.list(params),
        queryFn: async () => {
            const response = await rolesApi.list(params);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch roles');
            }
            // The response.data should be the paginated response structure
            return response.data as unknown as RolesListResponse;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to get all available permissions in the system
 * Returns permissions grouped by module with multilingual support
 */
export function useAllPermissions() {
    return useQuery<Record<string, {
        name: string;
        display_name: { ar: string; en: string };
        description?: { ar: string; en: string }
    }[]>>({
        queryKey: roleKeys.permissions(),
        queryFn: async () => {
            const response = await rolesApi.getPermissions();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch permissions');
            }
            return response.data;
        },
        staleTime: 15 * 60 * 1000, // 15 minutes
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook to get permissions assigned to a specific role
 */
export function useRolePermissionsList(roleId?: string | number) {
    return useQuery<string[]>({
        queryKey: roleKeys.rolePermissions(roleId!),
        queryFn: async () => {
            const response = await rolesApi.getRolePermissions(roleId!);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch role permissions');
            }

            if (!response.data) {
                return [];
            }

            // Extract permissions from the role object
            const role = response.data;

            // The API returns permissions as objects with 'name' property
            if (role?.permissions && Array.isArray(role.permissions)) {
                return role.permissions.map((permission: string | { name: string }) =>
                    typeof permission === 'string' ? permission : permission.name
                );
            }

            return [];
        },
        enabled: !!roleId, // Only run query if roleId exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
}