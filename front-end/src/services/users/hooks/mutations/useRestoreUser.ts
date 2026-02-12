/**
 * User Restore Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userManagementApi } from '@/lib/api/users';
import { usersKeys } from '../../keys/userKeys';

/**
 * Hook to restore a deleted user
 */
export function useRestoreUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => userManagementApi.restore(username),
        onSuccess: (data: unknown) => {
            const response = data as { message?: string };
            if (response?.message) {
                toast.success(response.message);
            }
            // Invalidate all user queries to refresh data
            queryClient.invalidateQueries({ queryKey: usersKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to restore user';
            toast.error(errorMessage);
        },
    });
}
