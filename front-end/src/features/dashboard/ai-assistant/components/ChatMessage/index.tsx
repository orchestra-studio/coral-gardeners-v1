"use client";

import { useAuth } from "@/store/useAuth";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/features/dashboard/ai-assistant/ui-elements/message";
import { AssistantMessage, UserMessage } from "./components";
import { useStreamingContent } from "./hooks";
import type { ChatMessageProps } from "./types";

export default function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const { user } = useAuth();
  const from = message.role === "user" ? "user" : "assistant";
  const chartBlocks = (message.blocks || []).filter(
    (block): block is Extract<typeof block, { type: "chart" }> =>
      block.type === "chart"
  );

  const { displayContent, cleanedContent } = useStreamingContent(
    message.content
  );

  const rawContent = cleanedContent;
  const hasContent = Boolean(rawContent);
  const hasChartBlocks = chartBlocks.length > 0;
  const assistantChartWidthClass =
    from === "assistant" && hasChartBlocks
      ? "group-[.is-assistant]:w-full group-[.is-assistant]:max-w-full sm:group-[.is-assistant]:max-w-3xl"
      : undefined;

  // For completed messages, split content intelligently
  // Intro is typically: "I'll create a chart..." (1-2 sentences)
  // Trailing is the analysis: "The chart shows..." (rest of content)
  let introContent = "";
  let trailingContent = "";

  if (rawContent && hasChartBlocks) {
    // Split by sentences to find intro vs analysis
    const sentences = rawContent.match(/[^.!?]+[.!?]+/g) || [rawContent];

    // Check if first sentence(s) mention creating/generating the chart
    const introPattern =
      /\b(I'll|I will|creating|generating|create|show|display)\b.*\b(chart|graph|visualization)\b/i;

    if (sentences.length > 0 && introPattern.test(sentences[0])) {
      // First sentence is intro
      introContent = sentences[0].trim();
      trailingContent = sentences.slice(1).join(" ").trim();
    } else {
      // No clear intro pattern, put everything as trailing (below chart)
      introContent = "";
      trailingContent = rawContent;
    }
  } else {
    // No chart blocks, use all content as is
    introContent = rawContent;
    trailingContent = "";
  }

  return (
    <Message from={from} messageId={message.id}>
      <MessageContent variant="contained" className={assistantChartWidthClass}>
        {from === "assistant" ? (
          <AssistantMessage
            isStreaming={isStreaming}
            hasContent={hasContent}
            displayContent={displayContent}
            cleanedContent={cleanedContent}
            chartBlocks={chartBlocks}
            introContent={introContent}
            trailingContent={trailingContent}
            messageContent={message.content}
          />
        ) : (
          <UserMessage content={message.content} />
        )}
      </MessageContent>
      <MessageAvatar
        variant={from === "user" ? "user" : "assistant"}
        name={from === "user" ? user?.name || "You" : "AI"}
        src={from === "user" ? user?.avatar || undefined : undefined}
      />
    </Message>
  );
}
