import { useEffect, useRef } from "react";
import type { ChatMessage as ApiChatMessage } from "@/lib/api/aiChat/chatSessionsTypes";

interface HydrationState {
    sessionId?: number;
    count: number;
}

interface UseSessionHydrationParams {
    activeSessionId: number | undefined;
    serverMessages: ApiChatMessage[];
    isLoadingMessages: boolean;
    isFetchingMessages: boolean;
    isFetchingNextPage: boolean;
    selectedSessionId: number | undefined;
    loadSession: (sessionId: number, messages: ApiChatMessage[]) => void;
    selectedSessionModel?: string;
    currentModel: string;
    setSelectedModel: (model: string) => void;
    onHydrationComplete?: () => void;
}

/**
 * Handles session hydration - loading server messages into the chat UI
 */
export function useSessionHydration({
    activeSessionId,
    serverMessages,
    isLoadingMessages,
    isFetchingMessages,
    isFetchingNextPage,
    selectedSessionId,
    loadSession,
    selectedSessionModel,
    currentModel,
    setSelectedModel,
    onHydrationComplete,
}: UseSessionHydrationParams) {
    const hydrationStateRef = useRef<HydrationState>({
        sessionId: undefined,
        count: 0,
    });

    useEffect(() => {
        if (!activeSessionId) {
            return;
        }

        if (isLoadingMessages || isFetchingMessages || isFetchingNextPage) {
            return;
        }

        const serverCount = serverMessages.length;
        const previous = hydrationStateRef.current;
        const sessionChanged = previous.sessionId !== activeSessionId;
        const countChanged = previous.count !== serverCount;

        if (!sessionChanged && !countChanged) {
            return;
        }

        if (
            sessionChanged &&
            serverCount === 0 &&
            selectedSessionId !== activeSessionId
        ) {
            hydrationStateRef.current = {
                sessionId: activeSessionId,
                count: serverCount,
            };
            return;
        }

        loadSession(activeSessionId, serverMessages);
        hydrationStateRef.current = {
            sessionId: activeSessionId,
            count: serverCount,
        };

        if (sessionChanged && selectedSessionModel && selectedSessionModel !== currentModel) {
            setSelectedModel(selectedSessionModel);
        }

        if (selectedSessionId === activeSessionId && onHydrationComplete) {
            onHydrationComplete();
        }
    }, [
        activeSessionId,
        serverMessages,
        isLoadingMessages,
        isFetchingMessages,
        isFetchingNextPage,
        loadSession,
        selectedSessionModel,
        currentModel,
        setSelectedModel,
        selectedSessionId,
        onHydrationComplete,
    ]);

    return {
        resetHydration: () => {
            hydrationStateRef.current = { sessionId: undefined, count: 0 };
        }
    };
}
