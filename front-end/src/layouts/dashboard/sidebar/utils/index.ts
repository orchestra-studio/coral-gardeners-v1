import { Route, configHelpers } from "../config/navigation";

/**
 * Gets the URL path for a given route identifier
 */
export const getPathForRoute = (route: Route): string => {
    return configHelpers.getPathForRoute(route);
};

/**
 * Gets the route identifier from a URL path (without locale prefix)
 */
export const getRouteFromPath = (pathWithoutLocale: string): Route => {
    return configHelpers.getRouteFromPath(pathWithoutLocale);
};

/**
 * Builds a complete navigation path including locale prefix
 * @param route - The route identifier
 * @param locale - The locale code (e.g., 'en', 'ar', 'fr')
 * @returns Complete path like '/en/dashboard/projects'
 */
export const buildNavigationPath = (route: Route, locale: string): string => {
    const path = getPathForRoute(route);
    return `/${locale}${path}`;
};

/**
 * Calculates the back navigation route from current path
 */
export const getBackRoute = (currentPath: string): Route => {
    return configHelpers.getBackRoute(currentPath);
};

/**
 * Determines if back button should be shown for current route
 */
export const shouldShowBackButton = (currentRoute: Route): boolean => {
    return configHelpers.shouldShowBackButton(currentRoute);
};

// Re-export types and helpers for convenience
export type { Route };
export { configHelpers };