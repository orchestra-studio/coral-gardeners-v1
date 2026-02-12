import ChatMessage from "../../ChatMessage";
import {
  Reasoning,
  ReasoningTrigger,
} from "@/features/dashboard/ai-assistant/ui-elements/reasoning";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

interface MessageWithReasoningProps {
  message: ChatMessageType;
  reasoningId?: string;
  reasoningText: string;
  thinkingLabel: string;
  isStreaming?: boolean;
}

export function MessageWithReasoning({
  message,
  reasoningId,
  reasoningText,
  thinkingLabel,
  isStreaming = false,
}: MessageWithReasoningProps) {
  return (
    <div
      key={`${reasoningId ?? "active-reasoning"}-${message.id}`}
      className="flex flex-col gap-2"
    >
      <Reasoning isStreaming={isStreaming} className="px-4">
        <ReasoningTrigger
          thinkingLabel={thinkingLabel}
          reasoningText={reasoningText}
        />
      </Reasoning>
      <ChatMessage message={message} isStreaming={isStreaming} />
    </div>
  );
}
