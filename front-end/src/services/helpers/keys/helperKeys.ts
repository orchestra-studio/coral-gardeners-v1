/**
 * Helper Query Keys
 * Organized query key factory for helper data caching
 */

export const helperKeys = {
    // Base key for all helper queries
    all: ['helpers'] as const,

    // Countries
    countries: () => [...helperKeys.all, 'countries'] as const,
    countriesForSelect: () => [...helperKeys.all, 'countries', 'select'] as const,
};