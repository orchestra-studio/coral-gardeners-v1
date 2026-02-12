import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { useAppNavigation } from '../hooks/navigation/useAppNavigation';
import { getAuthProvider } from '../lib/auth/factory';
import {
    initializeAuth,
    signIn as signInAction,
    signOut as signOutAction,
    setAuthState,
    selectUser,
    selectSession,
    selectAuthLoading,
    selectAuthActionLoading,
    selectAuthError,
    selectIsAuthenticated,
    selectIsInitialized,
} from './slices/authSlice';

/**
 * Simplified Authentication Hook
 * 
 * Clean authentication management with only login and logout functionality
 */
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { navigateTo } = useAppNavigation();

    // Selectors
    const user = useAppSelector(selectUser);
    const session = useAppSelector(selectSession);
    const loading = useAppSelector(selectAuthLoading);
    const actionLoading = useAppSelector(selectAuthActionLoading);
    const error = useAppSelector(selectAuthError);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsInitialized);

    // Initialize auth state
    useEffect(() => {
        if (!isInitialized) {
            dispatch(initializeAuth());
        }
    }, [dispatch, isInitialized]);

    // Set up provider listeners
    useEffect(() => {
        const provider = getAuthProvider();

        const unsubscribe = provider.onAuthStateChange((event, session) => {
            dispatch(setAuthState({
                user: session?.user ?? null,
                session,
            }));

            // Handle sign out redirect
            if (event === 'SIGNED_OUT') {
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
                if (!currentPath.includes('/auth/') && !session?.user) {
                    navigateTo('/auth/login');
                }
            }
        });

        return unsubscribe;
    }, [dispatch, navigateTo]);

    // Login action
    const signIn = useCallback(async (email: string, password: string) => {
        const result = await dispatch(signInAction({ email, password }));

        if (signInAction.fulfilled.match(result)) {
            return { data: result.payload, error: null };
        } else {
            return { data: null, error: result.payload };
        }
    }, [dispatch]);

    // Logout action
    const signOut = useCallback(async () => {
        const result = await dispatch(signOutAction());

        if (signOutAction.fulfilled.match(result)) {
            return { error: null };
        } else {
            return { error: result.payload };
        }
    }, [dispatch]);

    return {
        // State
        user,
        session,
        loading,
        actionLoading,
        error,
        isAuthenticated,
        isInitialized,

        // Actions - only login and logout
        signIn,
        signOut,
    };
};
