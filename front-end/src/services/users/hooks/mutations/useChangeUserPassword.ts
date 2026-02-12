/**
 * Change User Password Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userManagementApi, ChangePasswordPayload } from '@/lib/api/users';
import { usersKeys } from '../../keys/userKeys';

/**
 * Hook to change user password
 */
export function useChangeUserPassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ username, data }: { username: string; data: ChangePasswordPayload }) =>
            userManagementApi.changePassword(username, data),
        onSuccess: (data: unknown) => {
            const response = data as { message?: string };
            if (response?.message) {
                toast.success(response.message);
            }
            // Invalidate user details to refresh data
            queryClient.invalidateQueries({ queryKey: usersKeys.details() });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
            toast.error(errorMessage);
        },
    });
}
