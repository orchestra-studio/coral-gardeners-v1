/**
 * Cache Key Generators for AI Chat
 * Following TanStack Query best practices for hierarchical keys
 */

export const aiChatKeys = {
    all: ['aiChat'] as const,
    models: () => ['aiChat', 'models'] as const,
    config: () => ['aiChat', 'config'] as const,
    sessions: () => ['aiChat', 'sessions'] as const,
    session: (id: number) => ['aiChat', 'session', id] as const,
    sessionMessages: (id: number) => ['aiChat', 'session', id, 'messages'] as const,
};
