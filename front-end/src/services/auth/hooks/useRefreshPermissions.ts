/**
 * Auth Hook - Refresh Permissions
 */

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/store/hooks';
import { updateUserPermissions } from '@/store/slices/authSlice';
import type { AuthUser } from '@/lib/api/auth';

/**
 * Hook to refresh current user permissions
 * Updates the user in the auth store with fresh permissions from the server
 */
export function useRefreshPermissions() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async () => {
            const response = await authApi.refreshPermissions();

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to refresh permissions');
            }

            return response.data;
        },
        onSuccess: (updatedUser: AuthUser) => {
            // Update Redux store
            dispatch(updateUserPermissions({
                permissions: updatedUser.permissions || [],
                roles: updatedUser.roles,
            }));

            // Update localStorage with new user data
            if (typeof window !== 'undefined') {
                const currentUser = localStorage.getItem('auth_user');
                if (currentUser) {
                    try {
                        const parsedUser = JSON.parse(currentUser);
                        const mergedUser = {
                            ...parsedUser,
                            permissions: updatedUser.permissions,
                            roles: updatedUser.roles,
                        };
                        localStorage.setItem('auth_user', JSON.stringify(mergedUser));

                        // Also update the session object
                        const sessionStr = localStorage.getItem('auth_session');
                        if (sessionStr) {
                            const session = JSON.parse(sessionStr);
                            session.user = mergedUser;
                            localStorage.setItem('auth_session', JSON.stringify(session));
                        }
                    } catch (error) {
                        console.error('Failed to update user in localStorage:', error);
                    }
                }
            }
        },
    });
}