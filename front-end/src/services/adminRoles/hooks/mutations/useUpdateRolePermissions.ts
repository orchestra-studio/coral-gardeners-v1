/**
 * Role Permissions Update Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { rolesApi } from '@/lib/api/roles';
import { roleKeys } from '../../keys/roleKeys';

export function useUpdateRolePermissions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ roleId, permissions }: { roleId: string | number; permissions: string[] }) => {
            const response = await rolesApi.updateRolePermissions(roleId, { permissions });
            if (!response.success) {
                throw new Error(response.message || 'Failed to update permissions');
            }
            return response;
        },
        onSuccess: (response, { roleId }) => {
            // Show server response message
            if (response.message) {
                toast.success(response.message);
            }
            // Invalidate role queries and specific role permissions
            queryClient.invalidateQueries({ queryKey: roleKeys.all });
            queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
            queryClient.invalidateQueries({ queryKey: roleKeys.rolePermissions(roleId) });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update role permissions';
            toast.error(errorMessage);
        },
    });
}