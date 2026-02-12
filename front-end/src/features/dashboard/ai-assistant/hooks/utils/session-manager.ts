import { useCallback, useRef, useState } from "react";
import type { UIMessage } from "ai";
import type { ChatMessage as ApiChatMessage } from "@/lib/api/aiChat/chatSessionsTypes";

/**
 * Hook for managing chat session state and operations
 */
export function useSessionManager(setMessages: (messages: UIMessage[]) => void) {
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
    const sessionIdRef = useRef<number | null>(null);
    const lastMessageCountRef = useRef(0);
    const isSavingRef = useRef(false);

    const startNewSession = useCallback(() => {
        setCurrentSessionId(null);
        sessionIdRef.current = null;
        lastMessageCountRef.current = 0;
    }, []);

    const loadSession = useCallback((sessionId: number, sessionMessages: ApiChatMessage[]) => {
        // Set session ID first
        setCurrentSessionId(sessionId);
        sessionIdRef.current = sessionId;

        // Filter out any invalid messages before processing
        const validMessages = sessionMessages.filter(msg => msg && msg.content);

        // Convert ChatMessage[] to UIMessage[] format with proper parts structure
        const uiMessages = validMessages.map((msg) => {
            const parts: Array<{ type: string; text?: string; data?: unknown }> = [
                {
                    type: 'text',
                    text: msg.content,
                }
            ];

            // Add chart blocks as data-chart parts if they exist
            if (msg.blocks && Array.isArray(msg.blocks)) {
                msg.blocks.forEach((block) => {
                    if (block && typeof block === 'object' && 'type' in block && block.type === 'chart') {
                        parts.push({
                            type: 'data-chart',
                            data: block,
                        });
                    }
                });
            }

            return {
                id: msg.id?.toString() || `${msg.role}-${Date.now()}-${Math.random()}`,
                role: msg.role,
                content: msg.content,
                parts,
            };
        });

        // Set messages directly without clearing first
        setMessages(uiMessages as unknown as UIMessage[]);
        lastMessageCountRef.current = validMessages.length;
    }, [setMessages, setCurrentSessionId, sessionIdRef, lastMessageCountRef]);

    return {
        currentSessionId,
        setCurrentSessionId,
        sessionIdRef,
        lastMessageCountRef,
        isSavingRef,
        startNewSession,
        loadSession,
    };
}
