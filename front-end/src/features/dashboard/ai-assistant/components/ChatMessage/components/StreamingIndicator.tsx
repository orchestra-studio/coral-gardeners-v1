interface StreamingIndicatorProps {
  hasChartContent: boolean;
  hasContent: boolean;
}

export function StreamingIndicator({
  hasChartContent,
  hasContent,
}: StreamingIndicatorProps) {
  if (hasChartContent) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <span className="inline-flex h-4 w-1 animate-pulse bg-[var(--primaryColor)]" />
        <span>{"Generating chart..."}</span>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <span className="inline-flex h-4 w-1 animate-pulse bg-[var(--primaryColor)]" />
    );
  }

  return null;
}
