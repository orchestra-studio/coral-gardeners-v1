/**
 * Greeting Service Query Keys
 * Following TanStack Query key management best practices
 */

export const greetingKeys = {
    all: ['greeting'] as const,
    location: () => [...greetingKeys.all, 'location'] as const,
    weather: (city?: string) => [...greetingKeys.all, 'weather', city || 'auto'] as const,
};
