import ChatMessage from "../../ChatMessage";
import { MessageWithReasoning } from "./MessageWithReasoning";
import type {
  ChatMessage as ChatMessageType,
  ReasoningMessage,
} from "@/types/ai-chat";

interface MessagesWithReasoningProps {
  messages: ChatMessageType[];
  reasoning: ReasoningMessage | null;
  shouldShowReasoning: boolean;
  reasoningText: string;
  thinkingLabel: string;
}

export function MessagesWithReasoning({
  messages,
  reasoning,
  shouldShowReasoning,
  reasoningText,
  thinkingLabel,
}: MessagesWithReasoningProps) {
  let reasoningInserted = false;

  return (
    <>
      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;
        const shouldPrependReasoning =
          shouldShowReasoning &&
          !reasoningInserted &&
          isLastMessage &&
          msg.role === "assistant";

        if (shouldPrependReasoning) {
          reasoningInserted = true;
          return (
            <MessageWithReasoning
              key={`${reasoning?.id ?? "active-reasoning"}-${msg.id}`}
              message={msg}
              reasoningId={reasoning?.id}
              reasoningText={reasoningText}
              thinkingLabel={thinkingLabel}
              isStreaming={false}
            />
          );
        }

        return <ChatMessage key={msg.id} message={msg} />;
      })}
    </>
  );
}
