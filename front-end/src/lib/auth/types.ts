/**
 * Custom API Authentication Types
 */

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    emailVerified?: boolean;
    roles?: Array<{
        id: number;
        name: string;
        guard_name: string;
    }>;
    permissions?: string[];
    metadata?: Record<string, unknown>;
}

export interface AuthSession {
    accessToken: string;
    refreshToken?: string;
    user: AuthUser;
    expiresAt?: number;
}

export interface AuthError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface AuthResponse<T = unknown> {
    data: T | null;
    error: AuthError | null;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends SignInCredentials {
    name?: string;
    metadata?: Record<string, unknown>;
}

export interface ResetPasswordRequest {
    email: string;
    redirectUrl?: string;
}

export interface AuthStateChangeCallback {
    (event: AuthEvent, session: AuthSession | null): void;
}

export type AuthEvent =
    | 'SIGNED_IN'
    | 'SIGNED_OUT'
    | 'TOKEN_REFRESHED'
    | 'USER_UPDATED'
    | 'PASSWORD_RECOVERY';

/**
 * Authentication Provider Interface
 */
export interface AuthProvider {
    // Core authentication methods
    signIn(credentials: SignInCredentials): Promise<AuthResponse<AuthSession>>;
    signUp(credentials: SignUpCredentials): Promise<AuthResponse<AuthSession>>;
    signOut(): Promise<AuthResponse<void>>;

    // Session management
    getSession(): Promise<AuthResponse<AuthSession>>;
    refreshSession(): Promise<AuthResponse<AuthSession>>;

    // Password management
    resetPassword(request: ResetPasswordRequest): Promise<AuthResponse<void>>;
    updatePassword(newPassword: string): Promise<AuthResponse<void>>;

    // User management
    updateUser(updates: Partial<AuthUser>): Promise<AuthResponse<AuthUser>>;

    // Event handling
    onAuthStateChange(callback: AuthStateChangeCallback): () => void;

    // Provider info
    readonly providerName: string;
    readonly isConfigured: boolean;
}

/**
 * Authentication error codes
 */
export const AUTH_ERROR_CODES = {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
    WEAK_PASSWORD: 'WEAK_PASSWORD',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    NETWORK_ERROR: 'NETWORK_ERROR',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    PROVIDER_ERROR: 'PROVIDER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
