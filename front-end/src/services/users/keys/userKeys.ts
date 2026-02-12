/**
 * Users Query Keys
 * Organized query key factory for users caching
 */

export const usersKeys = {
    // Base key for all users queries
    all: ['users'] as const,

    // Lists with various filters
    lists: () => [...usersKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) =>
        [...usersKeys.lists(), filters] as const,

    // Deleted users lists
    deletedLists: () => [...usersKeys.all, 'deleted'] as const,
    deleted: (filters: Record<string, unknown> = {}) =>
        [...usersKeys.deletedLists(), filters] as const,

    // Specific user detail
    details: () => [...usersKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...usersKeys.details(), id] as const,

    // User statistics
    statistics: () => [...usersKeys.all, 'statistics'] as const,
};