export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...taskKeys.lists(), filters || {}] as const,
    history: () => [...taskKeys.all, 'history'] as const,
    stats: () => [...taskKeys.all, 'stats'] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
};
