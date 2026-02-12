/**
 * User Creation Mutation Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userManagementApi, CreateUserPayload } from '@/lib/api/users';
import { usersKeys } from '../../keys/userKeys';

/**
 * Hook to create a new user
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserPayload) => userManagementApi.create(data),
        onSuccess: (data: unknown) => {
            const response = data as { message?: string };
            if (response?.message) {
                toast.success(response.message);
            }
            // Invalidate all user queries to refresh data
            queryClient.invalidateQueries({ queryKey: usersKeys.all });
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
            toast.error(errorMessage);
        },
    });
}
