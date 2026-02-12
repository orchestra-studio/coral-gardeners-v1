/**
 * Custom Authentication Utilities
 * 
 * Utilities for managing authentication state in a client-side application
 * using localStorage only (no cookies for better Safari compatibility)
 */

// Set auth data in localStorage only
export function setAuthData(token: string, user: object, session: object): void {
    if (typeof window === 'undefined') return;

    // Set in localStorage for client-side access
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_session', JSON.stringify(session));
}

// Clear auth data from localStorage
export function clearAuthData(): void {
    if (typeof window === 'undefined') return;

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
}

// Get auth data from localStorage
export function getAuthData() {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    const sessionStr = localStorage.getItem('auth_session');

    if (!token || !userStr || !sessionStr) return null;

    try {
        return {
            token,
            user: JSON.parse(userStr),
            session: JSON.parse(sessionStr),
        };
    } catch (error) {
        console.error('Error parsing auth data:', error);
        return null;
    }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    const authData = getAuthData();
    if (!authData) return false;

    // Check if session is expired
    const { session } = authData;
    if (session.expiresAt && Date.now() > session.expiresAt) {
        clearAuthData();
        return false;
    }

    return true;
}

// Sync auth state on page load (call this in your app initialization)
export function syncAuthState(): void {
    if (typeof window === 'undefined') return;

    const authData = getAuthData();
    if (authData) {
        // Ensure auth data is properly set in localStorage
        setAuthData(authData.token, authData.user, authData.session);
    }
}