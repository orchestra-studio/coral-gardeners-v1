/**
 * Resend Verification Email Mutation Hook
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userManagementApi } from '@/lib/api/users';

/**
 * Hook to resend verification email
 */
export function useResendVerificationEmail() {
    return useMutation({
        mutationFn: (username: string) => userManagementApi.resendVerificationEmail(username),
        onSuccess: (data: unknown) => {
            const response = data as { message?: string };
            if (response?.message) {
                toast.success(response.message);
            }
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
            toast.error(errorMessage);
        },
    });
}
