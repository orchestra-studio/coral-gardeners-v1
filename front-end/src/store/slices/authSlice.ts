import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthSession, AuthError } from '../../lib/auth/types';
import { getAuthProvider } from '../../lib/auth/factory';

/**
 * Professional Authentication State
 * 
 * Clean, extensible state management for any authentication provider
 * No more messy if-else chains!
 */
export interface AuthState {
    user: AuthUser | null;
    session: AuthSession | null;
    loading: boolean;
    actionLoading: boolean;
    error: AuthError | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    session: null,
    loading: true,
    actionLoading: false,
    error: null,
    isInitialized: false,
};

/**
 * Initialize authentication state
 */
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.getSession();

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error) {
            return rejectWithValue({
                code: 'INITIALIZATION_ERROR',
                message: 'Failed to initialize authentication',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Sign in with email and password
 */
export const signIn = createAsyncThunk(
    'auth/signIn',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.signIn(credentials);

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error) {
            return rejectWithValue({
                code: 'SIGNIN_ERROR',
                message: 'Sign in failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Sign up with email and password
 */
export const signUp = createAsyncThunk(
    'auth/signUp',
    async (credentials: { email: string; password: string; name?: string; metadata?: Record<string, unknown> }, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.signUp(credentials);

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error) {
            return rejectWithValue({
                code: 'SIGNUP_ERROR',
                message: 'Sign up failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Sign out
 */
export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.signOut();

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return null;
        } catch (error) {
            return rejectWithValue({
                code: 'SIGNOUT_ERROR',
                message: 'Sign out failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (request: { email: string; redirectUrl?: string }, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.resetPassword(request);

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return { success: true };
        } catch (error) {
            return rejectWithValue({
                code: 'RESET_PASSWORD_ERROR',
                message: 'Password reset failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Update user profile
 */
export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (updates: Partial<AuthUser>, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.updateUser(updates);

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error) {
            return rejectWithValue({
                code: 'UPDATE_USER_ERROR',
                message: 'User update failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Refresh session
 */
export const refreshSession = createAsyncThunk(
    'auth/refreshSession',
    async (_, { rejectWithValue }) => {
        try {
            const provider = getAuthProvider();
            const result = await provider.refreshSession();

            if (result.error) {
                return rejectWithValue(result.error);
            }

            return result.data;
        } catch (error) {
            return rejectWithValue({
                code: 'REFRESH_SESSION_ERROR',
                message: 'Session refresh failed',
                details: { originalError: error },
            });
        }
    }
);

/**
 * Clean Authentication Slice
 * 
 * Professional state management with consistent patterns
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<{ user: AuthUser | null; session: AuthSession | null }>) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.loading = false;
            state.error = null;
            state.isInitialized = true;
        },
        updateUserPermissions: (state, action: PayloadAction<{ permissions: string[]; roles?: Array<{ id: number; name: string; guard_name: string }> }>) => {
            if (state.user) {
                state.user.permissions = action.payload.permissions;
                if (action.payload.roles) {
                    state.user.roles = action.payload.roles;
                }
            }
            if (state.session?.user) {
                state.session.user.permissions = action.payload.permissions;
                if (action.payload.roles) {
                    state.session.user.roles = action.payload.roles;
                }
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Initialize Auth
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                const session = action.payload;
                state.user = session?.user || null;
                state.session = session;
                state.loading = false;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as AuthError;
                state.isInitialized = true;
            });

        // Sign In
        builder
            .addCase(signIn.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                const session = action.payload;
                state.user = session?.user || null;
                state.session = session;
                state.actionLoading = false;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as AuthError;
                state.isInitialized = true; // avoid perpetual spinner
            });

        // Sign Up
        builder
            .addCase(signUp.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                const session = action.payload;
                state.user = session?.user || null;
                state.session = session;
                state.actionLoading = false;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as AuthError;
                state.isInitialized = true;
            });

        // Sign Out
        builder
            .addCase(signOut.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
                state.session = null;
                state.actionLoading = false;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(signOut.rejected, (state, action) => {
                // Even if sign out fails, clear the local state
                state.user = null;
                state.session = null;
                state.actionLoading = false;
                state.error = action.payload as AuthError;
                state.isInitialized = true;
            });

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.actionLoading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as AuthError;
            });

        // Update User
        builder
            .addCase(updateUser.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    if (state.session) {
                        state.session.user = action.payload;
                    }
                }
                state.actionLoading = false;
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload as AuthError;
            });

        // Refresh Session
        builder
            .addCase(refreshSession.pending, (state) => {
                state.error = null;
            })
            .addCase(refreshSession.fulfilled, (state, action) => {
                const session = action.payload;
                state.user = session?.user || null;
                state.session = session;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(refreshSession.rejected, (state, action) => {
                state.error = action.payload as AuthError;
                state.isInitialized = true;
            });
    },
});

// Export actions
export const { setAuthState, updateUserPermissions, clearError, setLoading } = authSlice.actions;

// Selectors
import type { RootState } from '../index';

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth?.user;
export const selectSession = (state: RootState) => state.auth?.session;
export const selectAuthLoading = (state: RootState) => state.auth?.loading ?? true;
export const selectAuthActionLoading = (state: RootState) => state.auth?.actionLoading ?? false;
export const selectAuthError = (state: RootState) => state.auth?.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth?.session;
export const selectIsInitialized = (state: RootState) => state.auth?.isInitialized ?? false;

// Export reducer
export default authSlice.reducer;
