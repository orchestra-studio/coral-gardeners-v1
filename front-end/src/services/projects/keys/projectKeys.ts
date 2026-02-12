/**
 * Projects Query Keys
 * Centralized cache keys for TanStack Query
 */

export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...projectKeys.lists(), filters] as const,
    deletedLists: () => [...projectKeys.all, 'deleted'] as const,
    deleted: (filters: Record<string, unknown>) => [...projectKeys.deletedLists(), filters] as const,
    recent: (limit?: number) => [...projectKeys.all, 'recent', limit] as const,
    details: () => [...projectKeys.all, 'detail'] as const,
    detail: (id: number) => [...projectKeys.details(), id] as const,
};
