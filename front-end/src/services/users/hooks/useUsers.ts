/**
 * Users TanStack Query Hooks - Queries Only
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { userManagementApi } from '@/lib/api/users';
import { User, UsersFilters } from '../types/userTypes';
import { usersKeys } from '../keys/userKeys';

// Type for paginated users data
export interface PaginatedUsersData {
    users: User[];
    pagination: {
        page: number;
        totalPages: number;
        limit: number;
        total: number;
    };
}

/**
 * Hook to get all users with optional filters
 * Returns full response including pagination metadata
 */
export function useUsers(filters: UsersFilters = {}, enabled = true) {
    return useQuery<PaginatedUsersData>({
        queryKey: usersKeys.list(filters as Record<string, unknown>),
        queryFn: async () => {
            const response = await userManagementApi.list(filters);
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch users');
            }
            return {
                users: response.data.data || [],
                pagination: {
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    limit: response.data.limit,
                    total: response.data.total,
                },
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: enabled,
    });
}

/**
 * Hook to get deleted users with optional filters
 * Returns full response including pagination metadata
 */
export function useDeletedUsers(filters: UsersFilters = {}, enabled = true) {
    return useQuery<PaginatedUsersData>({
        queryKey: usersKeys.deleted(filters as Record<string, unknown>),
        queryFn: async () => {
            const response = await userManagementApi.listDeleted(filters);
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch deleted users');
            }
            return {
                users: response.data.data || [],
                pagination: {
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    limit: response.data.limit,
                    total: response.data.total,
                },
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: enabled,
    });
}

/**
 * Hook to get user details by username
 */
export function useUserByUsername(username?: string) {
    return useQuery<User | null>({
        queryKey: usersKeys.detail(username!),
        queryFn: async () => {
            const response = await userManagementApi.getByUsername(username!);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch user');
            }
            return response.data || null;
        },
        enabled: !!username,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to get detailed user information by username
 */
export function useUserDetails(username?: string) {
    return useQuery<User | null>({
        queryKey: usersKeys.detail(`details-${username}`),
        queryFn: async () => {
            const response = await userManagementApi.getUserDetails(username!);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch user details');
            }
            return response.data || null;
        },
        enabled: !!username,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to get users statistics
 */
export function useUsersStatistics() {
    return useQuery({
        queryKey: usersKeys.statistics(),
        queryFn: async () => {
            const response = await userManagementApi.statistics();
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch users statistics');
            }
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000, // 2 minutes - statistics might change more frequently
    });
}