import { MOBILE_BREAKPOINT, LARGE_SCREEN_BREAKPOINT } from "../constants";

/**
 * Calculate padding based on screen size and sidebar state
 * Using padding-start instead of margin-start for better width control
 */
export function getMainContentMargin(isCollapsed: boolean): string {
    if (typeof window === "undefined") return "ps-0";

    const width = window.innerWidth;

    // Mobile: no padding (overlay sidebar)
    if (width < MOBILE_BREAKPOINT) return "ps-0";

    // Large screens: center content
    if (width > LARGE_SCREEN_BREAKPOINT) return "mx-auto ps-0";

    // Desktop: padding based on sidebar collapse state
    return isCollapsed ? "ps-[0px]" : "ps-[160px]";
}
