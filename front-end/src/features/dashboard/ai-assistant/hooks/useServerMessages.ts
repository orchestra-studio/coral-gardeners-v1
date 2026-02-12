import { useMemo } from "react";
import type { ChatMessage as ApiChatMessage } from "@/lib/api/aiChat/chatSessionsTypes";

/**
 * Deduplicates and processes server messages for display
 */
export function useServerMessages(messagesData: {
    pages?: Array<{ data?: ApiChatMessage[] }>;
} | undefined) {
    return useMemo(() => {
        if (!messagesData?.pages) {
            return [];
        }

        const deduped = new Map<number | string, ApiChatMessage>();

        for (const page of messagesData.pages) {
            for (const message of page.data ?? []) {
                if (!message || !message.content) {
                    continue;
                }

                const key = message.id ?? `${message.role}-${message.createdAt}`;
                if (!deduped.has(key)) {
                    deduped.set(key, message);
                }
            }
        }

        // Backend returns DESC (newest first), sort to ASC (oldest first) for chat display
        // Sort by createdAt to ensure correct chronological order
        return Array.from(deduped.values()).sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
        });
    }, [messagesData]);
}
