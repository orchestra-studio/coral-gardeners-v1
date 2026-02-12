"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, containerClassName, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text)] mb-2"
          >
            {label}
          </LabelPrimitive.Root>
        )}

        <textarea
          id={inputId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          aria-required={props.required ? "true" : undefined}
          className={cn(
            // Base textarea styles using theme variables with fallbacks
            "flex min-h-[120px] w-full rounded-md border",
            "bg-[var(--input-bg)]",
            "border-[var(--input-border)]/30",
            "text-[var(--text)]",
            "placeholder:text-[var(--text-muted)]",
            "text-sm px-3 py-2 focus:outline-none",
            "focus:border-[var(--primaryColor)]",
            "focus:ring-[var(--primaryColor)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "disabled:bg-[var(--surface-hover)]",
            "resize-y",
            // Error state with theme variables
            error && [
              "border-[var(--errorColor)]",
              "focus:ring-1 focus:ring-[var(--errorColor)]",
            ],
            className
          )}
          ref={ref}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-[var(--errorColor)]"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
