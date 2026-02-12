interface TipCardProps {
  content: string;
}

export default function TipCard({ content }: TipCardProps) {
  return (
    <div className="mt-4 rounded-md border border-[var(--border-table)] p-3">
      <p className="text-sm leading-relaxed text-[var(--text-muted)] line-clamp-4">
        {content}
      </p>
    </div>
  );
}
