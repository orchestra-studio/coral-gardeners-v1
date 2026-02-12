import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * Manages URL synchronization for session IDs
 */
export function useSessionUrl(
    currentSessionId: number | null,
    onSessionIdFromUrl: (sessionId: number | null) => void
) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const previousSessionIdRef = useRef<string | null>(null);
    const initialSessionIdRef = useRef<string | null | undefined>(undefined);

    if (initialSessionIdRef.current === undefined) {
        initialSessionIdRef.current = searchParams.get('session');
    }

    // Load session from URL on mount and when URL changes
    useEffect(() => {
        const sessionIdFromUrl = searchParams.get('session');

        // Check if URL parameter changed
        if (sessionIdFromUrl !== previousSessionIdRef.current) {
            previousSessionIdRef.current = sessionIdFromUrl;

            if (sessionIdFromUrl) {
                const sessionId = parseInt(sessionIdFromUrl, 10);
                if (!isNaN(sessionId) && sessionId !== currentSessionId) {
                    onSessionIdFromUrl(sessionId);
                }
            } else {
                // URL parameter was removed, notify parent to clear session
                if (currentSessionId !== null) {
                    onSessionIdFromUrl(null);
                }
            }
        }
    }, [searchParams, currentSessionId, onSessionIdFromUrl]);

    // Update URL when current session changes
    useEffect(() => {
        if (currentSessionId) {
            const currentUrl = new URL(window.location.href);
            const urlSessionId = currentUrl.searchParams.get('session');

            if (urlSessionId !== currentSessionId.toString()) {
                currentUrl.searchParams.set('session', currentSessionId.toString());
                router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
            }
        }
    }, [currentSessionId, router]);

    return {
        updateUrl: (sessionId: number | null) => {
            const currentUrl = new URL(window.location.href);
            if (sessionId) {
                currentUrl.searchParams.set('session', sessionId.toString());
            } else {
                currentUrl.searchParams.delete('session');
            }
            router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
        },
        initialSessionId: initialSessionIdRef.current ?? null,
    };
}
