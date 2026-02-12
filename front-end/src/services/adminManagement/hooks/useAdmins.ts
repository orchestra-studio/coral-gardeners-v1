/**
 * Admin TanStack Query Hooks - Queries Only
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { AdminsListResponse, AdminUser } from '../types/adminTypes';
import { adminKeys } from '../keys/adminKeys';

/**
 * Hook to get paginated list of admins with filters
 */
export function useAdminsList(
  params: { name?: string; email?: string; phone?: string; page?: number; page_count?: number } = {}
) {
  const { name, email, phone, page = 1, page_count = 10 } = params;
  const filters = { name, email, phone };

  return useQuery<AdminsListResponse>({
    queryKey: adminKeys.list(filters, page, page_count),
    queryFn: async () => {
      const response = await adminApi.list({
        ...filters,
        page,
        page_count,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch admins');
      }

      // The API returns the pagination object in response.data
      return response.data as AdminsListResponse;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - admin data doesn't change frequently
  });
}

/**
 * Hook to get single admin details
 */
export function useAdminDetail(id?: string | number) {
  return useQuery<AdminUser>({
    queryKey: adminKeys.detail(String(id)),
    queryFn: async () => {
      const response = await adminApi.get(id!);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch admin details');
      }

      return response.data as AdminUser;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get admin statistics
 */
export function useAdminsStatistics() {
  return useQuery({
    queryKey: adminKeys.statistics(),
    queryFn: async () => {
      const response = await adminApi.getStatistics();

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch admin statistics');
      }

      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes - statistics might change more frequently
  });
}