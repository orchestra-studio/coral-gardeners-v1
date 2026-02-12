/**
 * Admin Creation Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { adminKeys } from '../../keys/adminKeys';

export function useCreateAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (adminData: Parameters<typeof adminApi.create>[0]) => {
            const response = await adminApi.create(adminData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create admin');
            }
            return response;
        },
        onSuccess: (response) => {
            // Invalidate all admin list queries to refresh data
            queryClient.invalidateQueries({ queryKey: adminKeys.all });

            toast.success(response.message || 'Admin created successfully');
        },
        onError: (error: Error) => {
            console.error('Create admin error:', error);
            toast.error(error.message || 'Failed to create admin');
        },
    });
}