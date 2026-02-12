/**
 * Admin Roles Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { adminKeys } from '../../keys/adminKeys';
import { roleKeys } from '@/services/adminRoles';

export function useUpdateAdminRoles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ adminUsername, roleIds }: { adminUsername: string; roleIds: number[] }) => {
            const response = await adminApi.updateRoles(adminUsername, { role_ids: roleIds });
            if (!response.success) {
                throw new Error(response.message || 'Failed to update admin roles');
            }
            return response;
        },
        onSuccess: (response, { adminUsername }) => {
            // Invalidate all admin and role queries to reflect changes
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            queryClient.invalidateQueries({ queryKey: roleKeys.all });

            // If the API returns the updated admin, use its username for cache invalidation
            if (response.data?.username) {
                queryClient.invalidateQueries({ queryKey: adminKeys.detail(response.data.username) });
            } else {
                // Fallback to using the provided username
                queryClient.invalidateQueries({ queryKey: adminKeys.detail(adminUsername) });
            }

            toast.success(response.message || 'Admin roles updated successfully');
        },
        onError: (error) => {
            console.error('Update admin roles error:', error);
            toast.error(error.message || 'Failed to update admin roles');
        },
    });
}