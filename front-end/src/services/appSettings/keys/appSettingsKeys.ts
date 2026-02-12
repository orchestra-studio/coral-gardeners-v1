/**
 * App Settings Query Keys
 */

export const appSettingsKeys = {
    all: ['appSettings'] as const,
    lists: () => [...appSettingsKeys.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...appSettingsKeys.lists(), { filters }] as const,
    details: () => [...appSettingsKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...appSettingsKeys.details(), id] as const,
};