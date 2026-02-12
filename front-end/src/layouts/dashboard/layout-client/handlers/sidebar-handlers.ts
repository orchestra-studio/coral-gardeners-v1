import { applyDomFlags } from "../utils/dom-helpers";
import { saveSidebarCollapsedToStorage } from "../utils/storage-helpers";

/**
 * Create handler for sidebar collapse state change
 */
export function createCollapseChangeHandler(
    setIsCollapsed: (value: boolean) => void
): (collapsed: boolean) => void {
    return (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        applyDomFlags(collapsed);
        saveSidebarCollapsedToStorage(collapsed);
    };
}

/**
 * Create handler for toggling sidebar collapse state
 */
export function createToggleSidebarHandler(
    isCollapsed: boolean,
    handleCollapseChange: (collapsed: boolean) => void
): () => void {
    return () => {
        handleCollapseChange(!isCollapsed);
    };
}

/**
 * Create handler for mobile overlay close
 */
export function createOverlayCloseHandler(
    isMobile: boolean,
    isCollapsed: boolean,
    setIsCollapsed: (value: boolean) => void
): () => void {
    return () => {
        if (isMobile && !isCollapsed) {
            setIsCollapsed(true);
        }
    };
}
