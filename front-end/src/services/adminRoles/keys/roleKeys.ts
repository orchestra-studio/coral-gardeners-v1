/**
 * Cache Key Generators for Role Management
 * Following TanStack Query best practices for hierarchical keys
 */

export const roleKeys = {
    all: ['roles'] as const,
    list: (params?: { page?: number; page_count?: number; name?: string }) =>
        ['roles', 'list', params] as const,
    select: () => ['roles', 'select'] as const,
    statistics: () => ['roles', 'statistics'] as const,
    detail: (id: string | number) => ['roles', 'detail', id] as const,
    permissions: () => ['permissions'] as const,
    rolePermissions: (roleId: string | number) => ['roles', 'permissions', roleId] as const,
};