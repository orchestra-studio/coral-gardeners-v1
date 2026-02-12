/**
 * Security Cache Keys
 * TanStack Query cache key factory for security-related queries
 */

export const securityKeys = {
    all: ['security'] as const,
    passwordChange: () => [...securityKeys.all, 'password-change'] as const,
};