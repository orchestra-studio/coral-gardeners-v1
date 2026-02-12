"use client";

/**
 * Loading callbacks interface
 */
interface LoadingCallbacks {
    showLoading: () => void;
    hideLoading: () => void;
}

/**
 * Global loading state
 */
let loadingCallbacks: LoadingCallbacks = {
    showLoading: () => { },
    hideLoading: () => { },
};

/**
 * Set loading callbacks from component
 */
export const setLoadingCallbacks = (callbacks: LoadingCallbacks): void => {
    loadingCallbacks = callbacks;
};

/**
 * Get current loading callbacks
 */
export const getLoadingCallbacks = (): LoadingCallbacks => {
    return loadingCallbacks;
};

/**
 * Check if loading should be shown for a request
 */
export const shouldShowLoading = (method: string | undefined, showLoading?: boolean): boolean => {
    if (showLoading === false) return false;
    if (showLoading === true) return true;

    const mutatingMethods = ["post", "put", "patch", "delete"];
    return mutatingMethods.includes(method?.toLowerCase() || "");
};
