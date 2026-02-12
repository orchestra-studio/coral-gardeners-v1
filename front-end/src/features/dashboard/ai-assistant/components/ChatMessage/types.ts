import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

export interface ChatMessageProps {
    message: ChatMessageType;
    isStreaming?: boolean;
}

export type ChartBlock = Extract<
    NonNullable<ChatMessageType["blocks"]>[number],
    { type: "chart" }
>;
