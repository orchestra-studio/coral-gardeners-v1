/**
 * Chat Sessions Query Keys
 * Organized query key factory for chat sessions caching
 */

export const chatSessionsKeys = {
    // Base key for all chat sessions queries
    all: ['chat-sessions'] as const,

    // Lists with various filters
    lists: () => [...chatSessionsKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) =>
        [...chatSessionsKeys.lists(), filters] as const,

    // Specific session detail with messages
    details: () => [...chatSessionsKeys.all, 'detail'] as const,
    detail: (id: number) => [...chatSessionsKeys.details(), id] as const,
};
