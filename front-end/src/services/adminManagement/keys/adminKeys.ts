/**
 * Cache Key Generators for Admin Management
 * Following TanStack Query best practices for hierarchical keys
 */

export const adminKeys = {
  all: ['admins'] as const,
  list: (filters?: { name?: string; email?: string; phone?: string }, page?: number, pageCount?: number) =>
    ['admins', 'list', { filters, page, pageCount }] as const,
  detail: (username: string) => ['admins', 'detail', username] as const,
  statistics: () => ['admins', 'statistics'] as const,
};