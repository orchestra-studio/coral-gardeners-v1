"use client";

import React from "react";
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
} from "@tabler/icons-react";

export interface InfoBoxProps {
  type?: "info" | "warning" | "success";
  title?: string;
  message: string;
  className?: string;
}

/**
 * InfoBox - A reusable component for displaying informational messages
 *
 * @example
 * ```tsx
 * <InfoBox
 *   type="info"
 *   title="Note"
 *   message="Complete English fields first"
 * />
 * ```
 */
export default function InfoBox({
  type = "info",
  title,
  message,
  className = "",
}: InfoBoxProps) {
  const icons = {
    info: IconInfoCircle,
    warning: IconAlertTriangle,
    success: IconCircleCheck,
  };

  const Icon = icons[type];

  return (
    <div
      className={`bg-[var(--surface-hover)] border border-[var(--border)] rounded-md p-4 flex items-start gap-3 ${className}`}
    >
      <Icon
        size={20}
        className="text-[var(--text-muted)] flex-shrink-0 mt-0.5"
      />
      <div className="flex-1">
        {title && (
          <p className="text-sm font-medium text-[var(--text)] mb-1">{title}</p>
        )}
        <p className="text-xs text-[var(--text-muted)]">{message}</p>
      </div>
    </div>
  );
}
