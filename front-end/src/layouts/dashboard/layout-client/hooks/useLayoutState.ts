import { useState } from "react";
import { MOBILE_BREAKPOINT } from "../constants";
import { getSidebarCollapsedFromStorage } from "../utils/storage-helpers";

/**
 * Custom hook to manage layout state (mobile, collapsed, initialized)
 */
export function useLayoutState() {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < MOBILE_BREAKPOINT;
    });

    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
        if (initialIsMobile) return true;
        return getSidebarCollapsedFromStorage();
    });

    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    return {
        isMobile,
        setIsMobile,
        isCollapsed,
        setIsCollapsed,
        isInitialized,
        setIsInitialized,
    };
}
