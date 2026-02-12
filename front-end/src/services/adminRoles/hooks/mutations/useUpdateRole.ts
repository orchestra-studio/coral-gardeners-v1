/**
 * Role Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { rolesApi } from '@/lib/api/roles';
import { roleKeys } from '../../keys/roleKeys';
import { UpdateRoleRequest } from '../../types/roleTypes';

export function useUpdateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...roleData }: UpdateRoleRequest & { id: string | number }) => {
            const response = await rolesApi.update(id, roleData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update role');
            }
            return response;
        },
        onSuccess: (response, { id }) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate all role queries and specific role detail
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
            queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
            toast.error(errorMessage);
        },
    });
}
