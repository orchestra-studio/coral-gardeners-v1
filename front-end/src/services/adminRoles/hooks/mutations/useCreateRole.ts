/**
 * Role Creation Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { rolesApi } from '@/lib/api/roles';
import { roleKeys } from '../../keys/roleKeys';
import { CreateRoleRequest } from '../../types/roleTypes';

export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roleData: CreateRoleRequest) => {
            const response = await rolesApi.create(roleData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create role');
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
            const errorMessage = error instanceof Error ? error.message : 'Failed to create role';
            toast.error(errorMessage);
        },
    });
}