/**
 * Admin Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { adminKeys } from '../../keys/adminKeys';

export function useUpdateAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, adminData }: { id: string | number; adminData: Parameters<typeof adminApi.update>[1] }) => {
            const response = await adminApi.update(id, adminData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update admin');
            }
            return response;
        },
        onSuccess: (response, { id }) => {
            // Invalidate all admin queries and specific admin detail
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(String(id)) });

            toast.success(response.message || 'Admin updated successfully');
        },
        onError: (error: Error) => {
            console.error('Update admin error:', error);
            toast.error(error.message || 'Failed to update admin');
        },
    });
}