/**
 * Role Deletion Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { rolesApi } from '@/lib/api/roles';
import { roleKeys } from '../../keys/roleKeys';

export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roleId: string | number) => {
            const response = await rolesApi.delete(roleId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete role');
            }
            return response;
        },
        onSuccess: (response) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate all role queries to refresh data
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
            toast.error(errorMessage);
        },
    });
}