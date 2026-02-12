import { ConversationEmptyState } from "@/features/dashboard/ai-assistant/ui-elements/conversation";

interface EmptyStateProps {
  title: string;
  show: boolean;
}

export function EmptyState({ title, show }: EmptyStateProps) {
  if (!show) return null;

  return <ConversationEmptyState title={title} description="" />;
}
