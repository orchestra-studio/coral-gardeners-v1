/**
 * Custom API Authentication System
 */

// Core types and interfaces
export type {
    AuthProvider,
    AuthUser,
    AuthSession,
    AuthError,
    AuthResponse,
    SignInCredentials,
    SignUpCredentials,
    ResetPasswordRequest,
    AuthStateChangeCallback,
    AuthEvent,
} from './types';

// Factory and provider
export {
    AuthFactory,
    getAuthProvider,
} from './factory';

// Custom API provider
export { CustomAuthProvider } from './providers/custom';

// Auth utilities
export {
    setAuthData,
    clearAuthData,
    getAuthData,
    isAuthenticated,
    syncAuthState,
} from './utils';

// Error handling
export {
    handleLoginError,
    handleRegistrationError,
    handlePasswordResetError,
    handlePasswordUpdateError,
    handleUnexpectedError,
    AUTH_ERRORS,
    AUTH_SUCCESS,
    showSuccess,
    showError,
} from './errors';

// Hook (re-export for convenience)
export { useAuth } from '../../store/useAuth';
