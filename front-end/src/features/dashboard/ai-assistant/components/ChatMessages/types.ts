import type {
    ChatMessage as ChatMessageType,
    ReasoningMessage,
} from "@/types/ai-chat";

export interface ChatMessagesProps {
    messages: ChatMessageType[];
    streamingMessage: ChatMessageType | null;
    reasoning: ReasoningMessage | null;
    status: "ready" | "submitted" | "streaming" | "error";
    errorMessage?: string;
    emptyStateTitle: string;
    thinkingLabel: string;
    errorLabel: string;
    hasMoreMessages?: boolean;
    remainingCount?: number;
    onLoadOlder?: () => void;
    onLoadAll?: () => void;
    isLoadingOlder?: boolean;
    isInitialLoading?: boolean;
    showInitialSkeleton?: boolean;
}

export type MessageStatus = "ready" | "submitted" | "streaming" | "error";
