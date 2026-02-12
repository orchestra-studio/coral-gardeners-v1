/**
 * Change Password Mutation Hook
 */

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import type { PasswordChangeRequest } from '@/lib/api/profile/types';
import { toast } from 'react-toastify';

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: PasswordChangeRequest) => {
            const response = await profileApi.changePassword(data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to change password');
            }
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Password changed successfully');
        },
        onError: (error) => {
            console.error('Change password error:', error);
            toast.error(error.message || 'Failed to change password');
        },
    });
}
