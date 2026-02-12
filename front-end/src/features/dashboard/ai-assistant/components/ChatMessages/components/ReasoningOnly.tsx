import {
  Reasoning,
  ReasoningTrigger,
} from "@/features/dashboard/ai-assistant/ui-elements/reasoning";

interface ReasoningOnlyProps {
  reasoningId?: string;
  reasoningText: string;
  thinkingLabel: string;
}

export function ReasoningOnly({
  reasoningId,
  reasoningText,
  thinkingLabel,
}: ReasoningOnlyProps) {
  return (
    <Reasoning
      key={reasoningId ?? "active-reasoning"}
      isStreaming
      className="px-4"
    >
      <ReasoningTrigger
        thinkingLabel={thinkingLabel}
        reasoningText={reasoningText}
      />
    </Reasoning>
  );
}
