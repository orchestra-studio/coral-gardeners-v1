"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

/**
 * Textarea - A reusable textarea component matching the design system
 *
 * @example
 * ```tsx
 * <Textarea
 *   placeholder="Enter description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   rows={4}
 *   dir="rtl"
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md border bg-[var(--surface)] border-[var(--input-border)] text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm px-3 py-2",
          "focus:outline-none focus:ring-1 focus:border-transparent focus:ring-[var(--primaryColor)]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-hover)]",
          "resize-y min-h-[80px]",
          error && "border-[var(--errorColor)] focus:ring-[var(--errorColor)]",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
