import ChatMessage from "../../ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

interface MessageListProps {
  messages: ChatMessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <>
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </>
  );
}
