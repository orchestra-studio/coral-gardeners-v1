/**
 * User Delete Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userManagementApi } from '@/lib/api/users';
import { usersKeys } from '../../keys/userKeys';

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => userManagementApi.delete(username),
        onSuccess: (data: unknown) => {
            const response = data as { message?: string };
            if (response?.message) {
                toast.success(response.message);
            }
            // Invalidate all user queries to refresh data
            queryClient.invalidateQueries({ queryKey: usersKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
            toast.error(errorMessage);
        },
    });
}
