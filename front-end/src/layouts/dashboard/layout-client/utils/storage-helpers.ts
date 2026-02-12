import { STORAGE_KEY } from "../constants";

/**
 * Get sidebar collapsed state from localStorage
 */
export function getSidebarCollapsedFromStorage(): boolean {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === "1" || saved === "true" ? true : false;
    } catch {
        return false;
    }
}

/**
 * Save sidebar collapsed state to localStorage
 */
export function saveSidebarCollapsedToStorage(collapsed: boolean): void {
    try {
        localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
        // Silently fail if localStorage is not available
    }
}
