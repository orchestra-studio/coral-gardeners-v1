import React from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between z-1 relative">
      <div>
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
