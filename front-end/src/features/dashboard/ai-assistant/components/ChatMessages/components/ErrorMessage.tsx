import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/features/dashboard/ai-assistant/ui-elements/message";

interface ErrorMessageProps {
  errorLabel: string;
  errorMessage?: string;
  show: boolean;
}

export function ErrorMessage({
  errorLabel,
  errorMessage,
  show,
}: ErrorMessageProps) {
  if (!show) return null;

  return (
    <Message from="assistant" key="error-message">
      <MessageContent variant="contained">
        <div role="alert" className="text-sm text-red-500">
          {errorLabel}
          {errorMessage && (
            <span className="mt-1 block text-xs text-[var(--text-muted)]">
              {errorMessage}
            </span>
          )}
        </div>
      </MessageContent>
      <MessageAvatar variant="assistant" name="AI" />
    </Message>
  );
}
