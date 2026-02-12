import { useMemo } from "react";
import { createChatTransport } from "@/lib/api/aiChat";

/**
 * Provide a memoized NestJS chat transport instance configured via the API layer.
 */
export function useChatTransport() {
    return useMemo(() => createChatTransport(), []);
}
