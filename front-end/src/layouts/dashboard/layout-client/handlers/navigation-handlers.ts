import {
    Route,
    configHelpers,
} from "@/layouts/dashboard/sidebar/config/navigation";

/**
 * Navigate to a route using the navigation configuration
 */
export function createNavigateHandler(
    navigateTo: (path: string) => void
): (route: Route) => void {
    return (route: Route) => {
        const basePath = configHelpers.getPathForRoute(route);

        // Check if this is an external link
        if (configHelpers.isExternalRoute(route)) {
            const target = configHelpers.getTargetForRoute(route);
            window.open(basePath, target || "_blank");
            return;
        }

        // Handle internal navigation
        navigateTo(basePath);
    };
}
