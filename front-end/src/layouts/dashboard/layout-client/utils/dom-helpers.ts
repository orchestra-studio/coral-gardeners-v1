/**
 * Apply DOM flags for sidebar collapsed state
 */
export function applyDomFlags(collapsed: boolean): void {
    const root = document.getElementById("dashboard-root");
    if (root) root.dataset.sidebarCollapsed = String(collapsed);
    document.documentElement.classList.toggle(
        "sidebar-collapsed-html",
        collapsed
    );
}

/**
 * Add overflow-hidden to body element
 */
export function addBodyOverflowHidden(): void {
    document.body.classList.add("overflow-hidden");
}

/**
 * Remove overflow-hidden from body element
 */
export function removeBodyOverflowHidden(): void {
    document.body.classList.remove("overflow-hidden");
}
