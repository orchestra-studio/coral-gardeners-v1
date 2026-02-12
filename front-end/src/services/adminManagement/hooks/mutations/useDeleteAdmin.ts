/**
 * Admin Deletion Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { adminKeys } from '../../keys/adminKeys';

export function useDeleteAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | number) => {
            const response = await adminApi.delete(id);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete admin');
            }
            return response;
        },
        onSuccess: (response) => {
            // Invalidate all admin queries to refresh data
            queryClient.invalidateQueries({ queryKey: adminKeys.all });

            toast.success(response.message || 'Admin deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Delete admin error:', error);
            toast.error(error.message || 'Failed to delete admin');
        },
    });
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use useDeleteAdmin hook instead
 */
export async function deleteAdminWithMutation(username: string) {
    try {
        const response = await adminApi.delete(username);
        return response;
    } catch (error) {
        console.error('Delete admin error:', error);
        throw error;
    }
}