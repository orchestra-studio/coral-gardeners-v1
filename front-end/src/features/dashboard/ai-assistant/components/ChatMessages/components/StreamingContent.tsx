import ChatMessage from "../../ChatMessage";
import { MessageWithReasoning } from "./MessageWithReasoning";
import type {
  ChatMessage as ChatMessageType,
  ReasoningMessage,
} from "@/types/ai-chat";

interface StreamingContentProps {
  streamingMessage: ChatMessageType | null;
  reasoning: ReasoningMessage | null;
  shouldShowReasoning: boolean;
  reasoningText: string;
  thinkingLabel: string;
  reasoningInserted: boolean;
}

export function StreamingContent({
  streamingMessage,
  reasoning,
  shouldShowReasoning,
  reasoningText,
  thinkingLabel,
  reasoningInserted,
}: StreamingContentProps) {
  if (!streamingMessage) return null;

  if (shouldShowReasoning && !reasoningInserted) {
    return (
      <MessageWithReasoning
        key="reasoning-streaming"
        message={streamingMessage}
        reasoningId={reasoning?.id}
        reasoningText={reasoningText}
        thinkingLabel={thinkingLabel}
        isStreaming
      />
    );
  }

  return (
    <ChatMessage
      key={streamingMessage.id}
      message={streamingMessage}
      isStreaming
    />
  );
}
