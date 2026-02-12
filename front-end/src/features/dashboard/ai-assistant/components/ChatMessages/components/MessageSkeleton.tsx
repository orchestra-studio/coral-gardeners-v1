"use client";

import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

interface MessageSkeletonProps {
  show?: boolean;
  count?: number;
}

const PLACEHOLDER_WIDTHS = [
  "w-4/5 sm:w-3/5",
  "w-3/4 sm:w-2/3",
  "w-3/5 sm:w-1/2",
];

export function MessageSkeleton({
  show = false,
  count = 4,
}: MessageSkeletonProps) {
  if (!show) {
    return null;
  }

  const placeholders = Array.from({ length: count }, (_, index) => ({
    alignment: index % 2 === 0 ? "left" : "right",
    width: PLACEHOLDER_WIDTHS[index % PLACEHOLDER_WIDTHS.length],
  }));

  return (
    <div
      className="flex flex-col gap-5 py-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {placeholders.map(({ alignment, width }, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full items-end gap-3",
            alignment === "right" ? "justify-end" : "justify-start"
          )}
        >
          {alignment === "left" && (
            <Skeleton width="36px" height="36px" rounded="full" />
          )}

          <div
            className={cn(
              "rounded-2xl border border-[var(--border)] px-4 py-3",
              alignment === "right"
                ? "bg-[var(--control-bg)] text-[var(--text)]"
                : "bg-[var(--surface)] text-[var(--text)]",
              "flex flex-col gap-2",
              width
            )}
          >
            <Skeleton width="75%" height="12px" rounded="md" />
            <Skeleton width="50%" height="12px" rounded="md" />
          </div>

          {alignment === "right" && (
            <Skeleton width="36px" height="36px" rounded="full" />
          )}
        </div>
      ))}
    </div>
  );
}
