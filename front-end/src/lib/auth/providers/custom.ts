import type {
    AuthProvider,
    AuthResponse,
    SignInCredentials,
    SignUpCredentials,
    AuthSession,
    AuthUser,
    ResetPasswordRequest,
    AuthStateChangeCallback
} from '../types';
import { authApi } from '../../api/auth';
import { setAuthData } from '../../auth/utils';
import type { AuthUser as CustomAuthUser, AuthSession as CustomAuthSession } from '../../api/auth';

/**
 * Custom API Authentication Provider
 */
export class CustomAuthProvider implements AuthProvider {
    readonly providerName = 'custom-api';
    readonly isConfigured = true;

    private authStateCallbacks: AuthStateChangeCallback[] = [];

    constructor() {
        // Listen for storage changes to detect login/logout from other tabs
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', this.handleStorageChange.bind(this));
        }
    }

    private handleStorageChange(event: StorageEvent) {
        if (event.key === 'auth_token' || event.key === 'auth_session') {
            // Notify all callbacks about the auth state change
            this.getSession().then(result => {
                const event_type = result.data ? 'SIGNED_IN' : 'SIGNED_OUT';
                this.notifyAuthStateCallbacks(event_type, result.data);
            });
        }
    }

    private notifyAuthStateCallbacks(event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', session: AuthSession | null) {
        this.authStateCallbacks.forEach(callback => {
            callback(event, session);
        });
    }

    private mapCustomUserToAuthUser(customUser: CustomAuthUser): AuthUser {
        return {
            id: customUser.id.toString(),
            email: customUser.email,
            name: customUser.name || `${customUser.first_name} ${customUser.last_name}`.trim(),
            avatar: customUser.avatar || customUser.profile_picture || undefined,
            emailVerified: true, // Assume verified for admin users
            roles: customUser.roles,
            permissions: customUser.permissions,
            metadata: {
                username: customUser.username,
                first_name: customUser.first_name,
                last_name: customUser.last_name,
                phone: customUser.phone,
                country_id: customUser.country_id,
                created_at: customUser.created_at,
                updated_at: customUser.updated_at,
            },
        };
    }

    private mapCustomSessionToAuthSession(customSession: CustomAuthSession): AuthSession {
        return {
            accessToken: customSession.accessToken,
            user: this.mapCustomUserToAuthUser(customSession.user),
            expiresAt: customSession.expiresAt,
        };
    }

    async signIn(credentials: SignInCredentials): Promise<AuthResponse<AuthSession>> {
        try {
            const result = await authApi.login(credentials);

            if (!result.success) {
                return {
                    data: null,
                    error: {
                        code: 'LOGIN_FAILED',
                        message: result.message || 'Login failed',
                        details: result.errors,
                    },
                };
            }

            if (result.data && result.success) {
                // Create auth session from the login response (already normalized)
                const { token, user } = result.data;

                const authSession: CustomAuthSession = {
                    accessToken: token,
                    user: {
                        ...user,
                        name: `${user.first_name} ${user.last_name}`.trim(),
                        full_name: `${user.first_name} ${user.last_name}`.trim(),
                        avatar: user.profile_picture,
                    },
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                };

                // Store auth data in localStorage only (no cookies for Safari compatibility)
                if (typeof window !== "undefined") {
                    setAuthData(token, authSession.user, authSession);
                }

                const mappedSession = this.mapCustomSessionToAuthSession(authSession);
                this.notifyAuthStateCallbacks('SIGNED_IN', mappedSession);
                return { data: mappedSession, error: null };
            }

            return { data: null, error: { code: 'UNKNOWN_ERROR', message: 'Unknown error occurred' } };
        } catch (error) {
            const parsedError = error as Error & { errors?: Record<string, string[]> };
            const message = parsedError.message || 'Login failed';
            const isNetworkIssue = message.toLowerCase().includes('network');

            return {
                data: null,
                error: {
                    code: isNetworkIssue ? 'NETWORK_ERROR' : 'LOGIN_FAILED',
                    message,
                    details: parsedError.errors ? { validation: parsedError.errors } : { originalError: error },
                },
            };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signUp(_credentials: SignUpCredentials): Promise<AuthResponse<AuthSession>> {
        // Sign up not supported for admin users - redirect to login
        return {
            data: null,
            error: {
                code: 'SIGNUP_NOT_SUPPORTED',
                message: 'Sign up is not supported for admin users. Please contact your administrator.',
            },
        };
    }

    async signOut(): Promise<AuthResponse<void>> {
        try {
            await authApi.logout();
            this.notifyAuthStateCallbacks('SIGNED_OUT', null);
            return { data: null, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    code: 'SIGNOUT_ERROR',
                    message: 'Error occurred during sign out',
                    details: { originalError: error },
                },
            };
        }
    }

    async getSession(): Promise<AuthResponse<AuthSession>> {
        try {
            const result = await authApi.getSession();

            if (!result.success) {
                return {
                    data: null,
                    error: {
                        code: 'SESSION_ERROR',
                        message: result.message || 'Error retrieving session',
                        details: result.errors,
                    },
                };
            }

            if (result.data) {
                return { data: this.mapCustomSessionToAuthSession(result.data), error: null };
            }

            return { data: null, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    code: 'SESSION_ERROR',
                    message: 'Error retrieving session',
                    details: { originalError: error },
                },
            };
        }
    }

    async refreshSession(): Promise<AuthResponse<AuthSession>> {
        // Just return current session since we don't have a refresh endpoint
        return this.getSession();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async resetPassword(_request: ResetPasswordRequest): Promise<AuthResponse<void>> {
        // Password reset not supported for admin users
        return {
            data: null,
            error: {
                code: 'PASSWORD_RESET_NOT_SUPPORTED',
                message: 'Password reset is not supported for admin users. Please contact your administrator.',
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updatePassword(_newPassword: string): Promise<AuthResponse<void>> {
        // Password update not supported yet
        return {
            data: null,
            error: {
                code: 'PASSWORD_UPDATE_NOT_SUPPORTED',
                message: 'Password update is not supported yet. Please contact your administrator.',
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateUser(_updates: Partial<AuthUser>): Promise<AuthResponse<AuthUser>> {
        // User update not supported yet
        return {
            data: null,
            error: {
                code: 'USER_UPDATE_NOT_SUPPORTED',
                message: 'User profile update is not supported yet.',
            },
        };
    }

    onAuthStateChange(callback: AuthStateChangeCallback): () => void {
        this.authStateCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.authStateCallbacks.indexOf(callback);
            if (index > -1) {
                this.authStateCallbacks.splice(index, 1);
            }
        };
    }
}