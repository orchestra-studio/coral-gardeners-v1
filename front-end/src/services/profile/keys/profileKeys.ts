/**
 * Cache Key Generators for Profile Management
 * Following TanStack Query best practices for hierarchical keys
 */

export const profileKeys = {
    all: ['profile'] as const,
    profile: () => ['profile', 'current'] as const,
};