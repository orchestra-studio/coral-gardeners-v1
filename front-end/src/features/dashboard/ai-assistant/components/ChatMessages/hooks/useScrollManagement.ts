import { useEffect, useRef, useState } from "react";

interface ScrollAnchor {
    element: Element | null;
    offsetTop: number;
}

interface UseScrollManagementParams {
    scrollElement: HTMLElement | null;
    messages: unknown[];
    streamingMessage: unknown;
    scrollToBottom: (behavior?: "auto" | "instant" | "smooth") => void;
    onCheckAutoLoad?: () => void;
}

/**
 * Manages scroll behavior for chat messages
 * - Auto-scrolls on new messages
 * - Preserves scroll position when loading history
 * - Tracks user scroll state
 */
export function useScrollManagement({
    scrollElement,
    messages,
    streamingMessage,
    scrollToBottom,
    onCheckAutoLoad,
}: UseScrollManagementParams) {
    const previousMessageCountRef = useRef(0);
    const lastMessageIdRef = useRef<string | null>(null);
    const userScrolledUpRef = useRef(false);
    const scrollAnchorRef = useRef<ScrollAnchor | null>(null);
    const canAutoLoadRef = useRef(false);
    const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

    // Reset state when messages are cleared
    useEffect(() => {
        if (messages.length === 0) {
            previousMessageCountRef.current = 0;
            lastMessageIdRef.current = null;
            userScrolledUpRef.current = false;
            scrollAnchorRef.current = null;
            canAutoLoadRef.current = false;
        }
    }, [messages.length]);

    // Handle scroll to bottom on new messages or restore position on history load
    useEffect(() => {
        if (messages.length === 0) {
            return;
        }

        const previousCount = previousMessageCountRef.current;
        const previousLastId = lastMessageIdRef.current;
        const currentLastId =
            (messages[messages.length - 1] as { id?: string })?.id ?? null;

        const countIncreased = messages.length > previousCount;
        const countDecreased = messages.length < previousCount;
        const lastIdChanged = currentLastId !== previousLastId;

        const isInitialLoad = previousLastId === null && currentLastId !== null;
        const isSessionChange = countDecreased;
        const appendedNewMessage = countIncreased && lastIdChanged;
        const historyPrepended = countIncreased && !lastIdChanged;

        previousMessageCountRef.current = messages.length;
        lastMessageIdRef.current = currentLastId;

        if (historyPrepended) {
            // Restore scroll position after history was prepended
            if (scrollAnchorRef.current && scrollElement) {
                const { element, offsetTop } = scrollAnchorRef.current;
                if (element) {
                    // Use multiple frames to ensure DOM has updated
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
                            const newOffsetTop = element.getBoundingClientRect().top + currentScrollTop;
                            const scrollDelta = newOffsetTop - offsetTop;
                            const targetScroll = currentScrollTop + scrollDelta;
                            window.scrollTo(0, targetScroll);

                            // Keep retrying until scroll position sticks
                            let retryCount = 0;
                            const maxRetries = 5;
                            const checkAndRetry = () => {
                                const actualScroll = window.scrollY || document.documentElement.scrollTop;

                                if (Math.abs(actualScroll - targetScroll) > 10 && retryCount < maxRetries) {
                                    retryCount++;
                                    window.scrollTo(0, targetScroll);
                                    setTimeout(checkAndRetry, 50);
                                }
                            };

                            setTimeout(checkAndRetry, 50);

                            scrollAnchorRef.current = null;
                        });
                    });
                }
            }
            return;
        }

        if (!isInitialLoad && !isSessionChange && !appendedNewMessage) {
            return;
        }

        requestAnimationFrame(() => {
            scrollToBottom("instant");

            if (isSessionChange || isInitialLoad) {
                setTimeout(() => scrollToBottom("instant"), 120);
                setTimeout(() => {
                    scrollToBottom("instant");
                    setIsInitialScrollDone(true);
                }, 240);
            } else {
                setIsInitialScrollDone(true);
            }
        });
    }, [messages, scrollToBottom, scrollElement]);

    // Track user scroll position
    useEffect(() => {
        if (!scrollElement) {
            return;
        }

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            const isAtBottom = distanceFromBottom <= 32;
            const isNearTop = scrollTop < 50;

            if (!isAtBottom) {
                userScrolledUpRef.current = true;
                const wasAutoLoadDisabled = !canAutoLoadRef.current;
                canAutoLoadRef.current = isNearTop;

                // Trigger auto-load check if it just became enabled
                if (wasAutoLoadDisabled && isNearTop && onCheckAutoLoad) {
                    onCheckAutoLoad();
                }
            } else {
                userScrolledUpRef.current = false;
                canAutoLoadRef.current = false;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollElement]);

    // Auto-scroll during streaming
    useEffect(() => {
        if (!streamingMessage) {
            return;
        }

        requestAnimationFrame(() => {
            scrollToBottom("instant");
        });
    }, [streamingMessage, scrollToBottom]);

    const saveScrollAnchor = () => {
        if (scrollElement && messages.length > 0) {
            const firstMessageElement = document.querySelector("[data-message-id]");
            if (firstMessageElement) {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                scrollAnchorRef.current = {
                    element: firstMessageElement,
                    offsetTop: firstMessageElement.getBoundingClientRect().top + scrollTop,
                };
            }
        }
    };

    return {
        userScrolledUpRef,
        scrollAnchorRef,
        canAutoLoadRef,
        saveScrollAnchor,
        isInitialScrollDone,
    };
}
