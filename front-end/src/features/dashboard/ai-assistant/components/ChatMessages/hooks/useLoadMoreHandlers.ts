import { useCallback } from "react";

interface UseLoadMoreHandlersParams {
    onLoadOlder?: () => void;
    onLoadAll?: () => void;
    saveScrollAnchor: () => void;
}

/**
 * Provides handlers for manual load more actions
 */
export function useLoadMoreHandlers({
    onLoadOlder,
    onLoadAll,
    saveScrollAnchor,
}: UseLoadMoreHandlersParams) {
    const handleLoadMore = useCallback(() => {
        saveScrollAnchor();
        if (onLoadOlder) {
            onLoadOlder();
        }
    }, [onLoadOlder, saveScrollAnchor]);

    const handleLoadAll = useCallback(() => {
        saveScrollAnchor();
        if (onLoadAll) {
            onLoadAll();
        }
    }, [onLoadAll, saveScrollAnchor]);

    return {
        handleLoadMore,
        handleLoadAll,
    };
}
