import type {
    ChatMessage as ChatMessageType,
    ReasoningMessage,
} from "@/types/ai-chat";
import type { MessageStatus } from "../types";
import { usePendingResponse } from "./usePendingResponse";

interface UseMessagesLogicProps {
    messages: ChatMessageType[];
    streamingMessage: ChatMessageType | null;
    reasoning: ReasoningMessage | null;
    status: MessageStatus;
}

export function useMessagesLogic({
    messages,
    streamingMessage,
    reasoning,
    status,
}: UseMessagesLogicProps) {
    const reasoningText = reasoning?.content?.trim() ?? "";
    const shouldShowReasoning = status === "streaming" && Boolean(reasoningText);

    const hasMessages =
        messages.length > 0 || Boolean(streamingMessage) || shouldShowReasoning;

    const showEmptyState =
        messages.length === 0 && !streamingMessage && !shouldShowReasoning;

    const showPendingResponse = usePendingResponse({
        status,
        streamingMessage,
        reasoning,
        messages,
    });

    const showError = status === "error";

    return {
        reasoningText,
        shouldShowReasoning,
        hasMessages,
        showEmptyState,
        showPendingResponse,
        showError,
    };
}
