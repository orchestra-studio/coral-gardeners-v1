import type { AuthProvider } from './types';
import { CustomAuthProvider } from './providers/custom';

/**
 * Custom API Authentication Factory
 */
export class AuthFactory {
    private static instance: AuthProvider | null = null;

    /**
     * Create custom authentication provider
     */
    static createProvider(): AuthProvider {
        return new CustomAuthProvider();
    }

    /**
     * Get or create a singleton instance of the custom auth provider
     */
    static getInstance(): AuthProvider {
        if (!this.instance) {
            this.instance = this.createProvider();
        }

        return this.instance;
    }

    /**
     * Reset the singleton instance
     */
    static resetInstance(): void {
        this.instance = null;
    }
}

/**
 * Get the current custom authentication provider instance
 */
export function getAuthProvider(): AuthProvider {
    return AuthFactory.getInstance();
}
