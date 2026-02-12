/* eslint-disable @typescript-eslint/no-explicit-any */
import { NAV_CONFIG_RAW, NAVIGATION_CONSTANTS } from './navigationData';
import type { ExtractRoutes, NavElement } from '../types';

// Generate Route type from config - this is completely programmatic!
export type Route = ExtractRoutes<typeof NAV_CONFIG_RAW>;

// Export the properly typed navigation config
export const NAV_CONFIG: NavElement<Route>[] =
    NAV_CONFIG_RAW as unknown as NavElement<Route>[];

// Navigation helper functions that interact with the config
export const configHelpers = {
    /**
     * Returns the URL path for a given route by looking up the config
     * @param route - The route identifier (e.g., 'overview', 'users/all')
     * @returns The corresponding URL path (e.g., '/dashboard', '/dashboard/users/all')
     */
    getPathForRoute: (route: Route): string => {
        // Check for external URLs first
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "item" && item.route === route && 'externalUrl' in item) {
                return (item as any).externalUrl;
            }
            if (item.type === "parent") {
                for (const child of item.children) {
                    if (child.route === route && 'externalUrl' in child) {
                        return (child as any).externalUrl;
                    }
                }
            }
        }

        // Generate internal paths dynamically
        return NAVIGATION_CONSTANTS.generatePath(route);
    },

    /**
     * Returns the route identifier for a given URL path by looking up the config
     * @param path - The URL path (e.g., '/dashboard/users/all', '/dashboard/courses/live')
     * @returns The corresponding route identifier (e.g., 'users/all', 'courses/live')
     */
    getRouteFromPath: (path: string): Route => {
        // Special case for settings routes (handled in sidebar footer)
        if (path.includes('/settings')) {
            return 'settings' as Route;
        }

        // Extract route from path using the navigation constants
        const extractedRoute = NAVIGATION_CONSTANTS.extractRoute(path);

        // PHASE 1: Try exact matches for all configured routes (both parent and child)
        // This ensures that static routes like /dashboard/users/all work correctly
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "item") {
                // Check for external URLs
                if ('externalUrl' in item && (item as any).externalUrl === path) {
                    return item.route as Route;
                }
                // Check for exact internal route matches
                if (item.route === extractedRoute) {
                    return item.route as Route;
                }
            }
            if (item.type === "parent") {
                // Check parent route exact match
                if (item.route === extractedRoute) {
                    return item.route as Route;
                }
                // Check all children for exact matches
                for (const child of item.children) {
                    if ('externalUrl' in child && (child as any).externalUrl === path) {
                        return child.route as Route;
                    }
                    if (child.route === extractedRoute) {
                        return child.route as Route;
                    }
                }
            }
        }

        // PHASE 2: Handle deep nested dynamic routes (4+ segments)
        // Pattern: /dashboard/{parent}/{child}/[dynamicId] should map to the child route
        // This handles: /dashboard/users/all/john-doe → "users/all" (keeps "All" tab active)
        const pathSegments = path.split('/').filter(Boolean);
        if (pathSegments.length === 4 && pathSegments[0] === 'dashboard') {
            const parentSegment = pathSegments[1];
            const childSegment = pathSegments[2];
            const potentialChildRoute = `${parentSegment}/${childSegment}`;

            // Check if this combined route exists as a child in our navigation config
            for (const item of NAV_CONFIG_RAW) {
                if (item.type === "parent" && item.route === parentSegment) {
                    for (const child of item.children) {
                        if (child.route === potentialChildRoute) {
                            return child.route as Route;
                        }
                    }
                }
            }
        }

        // PHASE 3: Handle dynamic routes (detail pages) - unified logic for ALL navigation structures
        // Pattern: /dashboard/{route}/[dynamicId] should map to the base route
        // This works for:
        // - Parent routes: /dashboard/users/john-doe → "users", /dashboard/courses/123 → "courses"  
        // - Single routes: /dashboard/categories/dfgdg → "categories"
        if (pathSegments.length === 3 && pathSegments[0] === 'dashboard') {
            const baseSegment = pathSegments[1];

            // Check if this base segment exists in our navigation config (parent OR single item)
            for (const item of NAV_CONFIG_RAW) {
                // Check for parent routes (like users, courses)
                if (item.type === "parent" && item.route === baseSegment) {
                    return item.route as Route;
                }
                // Check for single-item routes (like categories)
                if (item.type === "item" && item.route === baseSegment) {
                    return item.route as Route;
                }
            }
        }

        // PHASE 4: Fallback to default route
        return NAVIGATION_CONSTANTS.getDefaultFallbackRoute() as Route;
    },

    /**
     * Finds the parent route for a given child route
     * Used for sidebar expansion - when a child is active, expand its parent
     * This works universally for ALL parent-child structures (users, courses, future structures)
     * @param route - The child route to find the parent for
     * @returns The parent route identifier, or null if the route is not a child
     */
    getParentOfRoute: (route: Route): Route | null => {
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "parent") {
                for (const child of item.children) {
                    if (child.route === route) {
                        return item.route as Route;
                    }
                }
            }
        }
        return null;
    },

    /**
     * Calculates the back route by removing the last segment from the current path
     * Example: '/dashboard/data-visualization/tables' -> '/dashboard/data-visualization'
     * @param currentPath - The current URL path without locale prefix
     * @returns The route identifier for the parent level
     */
    getBackRoute: (currentPath: string): Route => {
        const pathSegments = currentPath.split('/').filter(Boolean);
        if (pathSegments.length > 1) {
            pathSegments.pop(); // Remove last segment
            const backPath = '/' + pathSegments.join('/');
            return configHelpers.getRouteFromPath(backPath);
        }
        return NAVIGATION_CONSTANTS.getDefaultFallbackRoute() as Route;
    },

    /**
     * Determines whether to show the back button in the UI
     * Back button is shown on all pages except the main overview page
     * @param currentRoute - The current active route
     * @returns True if back button should be visible, false otherwise
     */
    shouldShowBackButton: (currentRoute: Route): boolean => {
        return currentRoute !== NAVIGATION_CONSTANTS.getDefaultFallbackRoute();
    },

    /**
     * Returns all child routes for a given parent route
     * This works universally for ALL parent-child structures
     * @param parentRoute - The parent route identifier
     * @returns Array of child route identifiers
     */
    getChildRoutes: (parentRoute: Route): Route[] => {
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "parent" && item.route === parentRoute) {
                return item.children.map((child: any) => child.route as Route);
            }
        }
        return [];
    },

    /**
     * Checks if a route is a parent route (has children)
     * This works universally for ALL parent structures in the navigation
     * @param route - The route identifier to check
     * @returns True if the route is a parent, false otherwise
     */
    isParentRoute: (route: Route): boolean => {
        return NAV_CONFIG_RAW.some((item: any) =>
            item.type === "parent" && item.route === route
        );
    },

    /**
     * Checks if a route is a child of any parent structure
     * This works universally for ALL parent-child structures
     * @param route - The route identifier to check
     * @returns True if the route is a child, false otherwise
     */
    isChildRoute: (route: Route): boolean => {
        return configHelpers.getParentOfRoute(route) !== null;
    },

    /**
     * Gets all parent routes that have children
     * This works universally for ALL parent structures in the navigation
     * @returns Array of parent route identifiers
     */
    getAllParentRoutes: (): Route[] => {
        return NAV_CONFIG_RAW
            .filter((item: any) => item.type === "parent")
            .map((item: any) => item.route as Route);
    },

    /**
     * Gets the navigation item (parent or child) for a given route
     * @param route - The route identifier
     * @returns The navigation item, or null if not found
     */
    getNavItem: (route: Route) => {
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "item" || item.type === "parent") {
                if (item.route === route) return item;
            }
            if (item.type === "parent") {
                for (const child of item.children) {
                    if (child.route === route) return child;
                }
            }
        }
        return null;
    },

    /**
     * Checks if a route represents an external URL
     * @param route - The route identifier
     * @returns True if the route is an external link, false otherwise
     */
    isExternalRoute: (route: Route): boolean => {
        const item = configHelpers.getNavItem(route);
        return item ? 'externalUrl' in item : false;
    },

    /**
     * Gets the target attribute for a route
     * @param route - The route identifier
     * @returns The target attribute (_blank, _self) or undefined
     */
    getTargetForRoute: (route: Route): string | undefined => {
        const item = configHelpers.getNavItem(route);
        return (item as any)?.target;
    },
};