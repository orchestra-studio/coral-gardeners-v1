import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/features/dashboard/ai-assistant/ui-elements/message";
import { PulsingDot } from "@/features/dashboard/ai-assistant/ui-elements/pulsing-dot";

interface PendingResponseProps {
  thinkingLabel: string;
  show: boolean;
}

/**
 * Shows a pulsing dot while waiting for AI response
 * Displayed from message submission until first character arrives from stream
 */
export function PendingResponse({ thinkingLabel, show }: PendingResponseProps) {
  if (!show) return null;

  return (
    <Message from="assistant" key="pending-response">
      <MessageContent variant="contained">
        <PulsingDot ariaLabel={thinkingLabel} />
      </MessageContent>
      <MessageAvatar variant="assistant" name="AI" />
    </Message>
  );
}
