import {
    Route,
    getRouteFromPath,
    getBackRoute,
} from "@/layouts/dashboard/sidebar/utils";

/**
 * Extract current route from pathname, removing locale prefix
 */
export function getCurrentRoute(pathname: string): Route {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    const route = getRouteFromPath(pathWithoutLocale);
    return route;
}

/**
 * Create handler for back navigation
 */
export function createBackHandler(
    pathname: string,
    handleNavigate: (route: Route) => void
): () => void {
    return () => {
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
        const backRoute = getBackRoute(pathWithoutLocale);
        handleNavigate(backRoute);
    };
}
