import { ReasoningOnly } from "./ReasoningOnly";
import type { ReasoningMessage } from "@/types/ai-chat";

interface StandaloneReasoningProps {
  reasoning: ReasoningMessage | null;
  shouldShowReasoning: boolean;
  reasoningText: string;
  thinkingLabel: string;
  reasoningInserted: boolean;
  hasStreamingMessage: boolean;
}

export function StandaloneReasoning({
  reasoning,
  shouldShowReasoning,
  reasoningText,
  thinkingLabel,
  reasoningInserted,
  hasStreamingMessage,
}: StandaloneReasoningProps) {
  if (!shouldShowReasoning || reasoningInserted || hasStreamingMessage) {
    return null;
  }

  return (
    <ReasoningOnly
      key={reasoning?.id ?? "active-reasoning"}
      reasoningId={reasoning?.id}
      reasoningText={reasoningText}
      thinkingLabel={thinkingLabel}
    />
  );
}
