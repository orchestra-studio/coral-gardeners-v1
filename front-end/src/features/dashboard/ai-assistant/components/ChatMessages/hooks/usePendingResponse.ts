import type {
    ChatMessage as ChatMessageType,
    ReasoningMessage,
} from "@/types/ai-chat";
import type { MessageStatus } from "../types";

interface UsePendingResponseProps {
    status: MessageStatus;
    streamingMessage: ChatMessageType | null;
    reasoning: ReasoningMessage | null;
    messages: ChatMessageType[];
}

/**
 * Manages pending response indicator visibility
 * Shows a pulsing dot while waiting for actual response content to arrive
 */
export function usePendingResponse({
    status,
    streamingMessage,
    reasoning,
    messages,
}: UsePendingResponseProps) {
    const hasContent = Boolean(streamingMessage?.content?.trim());
    const hasReasoning = Boolean(reasoning?.content?.trim());

    // Check if there's a recent assistant message (last message is from assistant and is being streamed)
    const lastMessage = messages[messages.length - 1];
    const hasAssistantMessage = lastMessage?.role === "assistant";

    // Show pending only when status is submitted or streaming AND no content has arrived
    // Hide when: we have streaming content, reasoning, OR an assistant message appeared
    const showPending =
        (status === "submitted" || status === "streaming") &&
        !hasContent &&
        !hasReasoning &&
        !hasAssistantMessage;

    return showPending;
}