import { useEffect, useRef, useCallback } from "react";

interface UseAutoLoadMessagesParams {
    hasMoreMessages: boolean;
    isLoadingOlder: boolean;
    scrollElement: HTMLElement | null;
    topSentinelRef: React.RefObject<HTMLDivElement | null>;
    canAutoLoadRef: React.MutableRefObject<boolean>;
    messagesLength: number;
    onLoadOlder?: () => void;
    saveScrollAnchor: () => void;
}

/**
 * Manages automatic loading of older messages when scrolling to top
 */
export function useAutoLoadMessages({
    hasMoreMessages,
    isLoadingOlder,
    scrollElement,
    topSentinelRef,
    canAutoLoadRef,
    messagesLength,
    onLoadOlder,
    saveScrollAnchor,
}: UseAutoLoadMessagesParams) {
    const loadTriggerRef = useRef(false);
    const canAutoLoadInternalRef = useRef(canAutoLoadRef);
    const saveScrollAnchorInternalRef = useRef(saveScrollAnchor);

    // Update internal refs
    canAutoLoadInternalRef.current = canAutoLoadRef;
    saveScrollAnchorInternalRef.current = saveScrollAnchor;

    // Manual trigger function to check and load if conditions are met
    const checkAndLoad = useCallback(() => {
        const sentinel = topSentinelRef.current;
        if (!sentinel || !canAutoLoadRef.current || isLoadingOlder || loadTriggerRef.current || !hasMoreMessages || !onLoadOlder) {
            return;
        }

        // Check if sentinel is currently in viewport
        const rect = sentinel.getBoundingClientRect();
        const isInViewport = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;

        if (isInViewport) {
            loadTriggerRef.current = true;
            saveScrollAnchorInternalRef.current();
            onLoadOlder();
        }
    }, [hasMoreMessages, isLoadingOlder, onLoadOlder, topSentinelRef, canAutoLoadRef, saveScrollAnchor]);

    useEffect(() => {
        if (!hasMoreMessages || !onLoadOlder) {
            return;
        }

        const sentinel = topSentinelRef.current;
        const root = scrollElement;

        if (!sentinel || !root) {
            return;
        }

        // When scrolling the body/document, we need to use null as root
        // and check viewport intersection
        const isBodyScroll =
            root === document.body ||
            root === document.documentElement ||
            root === document.scrollingElement;

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (
                entry?.isIntersecting &&
                canAutoLoadRef.current &&
                !isLoadingOlder &&
                !loadTriggerRef.current
            ) {
                loadTriggerRef.current = true;
                saveScrollAnchorInternalRef.current();
                onLoadOlder();
            }
        }; const observer = new IntersectionObserver(handleIntersection, {
            root: isBodyScroll ? null : root,
            rootMargin: "100px 0px 0px 0px", // Trigger 100px before reaching top
            threshold: 0,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [
        hasMoreMessages,
        onLoadOlder,
        scrollElement,
        isLoadingOlder,
        topSentinelRef,
        canAutoLoadRef,
        messagesLength,
        saveScrollAnchor,
    ]);

    useEffect(() => {
        if (!isLoadingOlder) {
            loadTriggerRef.current = false;
        }
    }, [isLoadingOlder]);

    return { checkAndLoad };
}
