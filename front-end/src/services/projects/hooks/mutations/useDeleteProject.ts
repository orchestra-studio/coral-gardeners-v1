/**
 * Project Delete Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { projectManagementApi } from '@/lib/api/projects';
import { projectKeys } from '../../keys/projectKeys';
import { ApiResponse } from '@/lib/api/client';

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<void>, Error, number>({
        mutationFn: async (id: number) => {
            const response = await projectManagementApi.delete(id);

            if (!response.success) {
                throw new Error(response.message || 'Failed to delete project');
            }

            return response;
        },
        onSuccess: (response) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate all project queries to refresh data
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
            toast.error(errorMessage);
        },
    });
}
