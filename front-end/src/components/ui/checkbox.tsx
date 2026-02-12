"use client";

import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
  indeterminate?: boolean;
  labelClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  error?: string;
  required?: boolean;
  name?: string;
}

/**
 * Custom checkbox component with theme variables
 * Supports indeterminate (partial) state
 * Built on Radix UI for better accessibility
 */
export default function Checkbox({
  checked,
  onChange,
  className,
  disabled = false,
  label,
  id,
  indeterminate = false,
  labelClassName,
  size = "sm",
  variant = "default",
  error,
  required = false,
  name,
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;

  const sizeStyles: Record<"sm" | "md" | "lg", { box: string; icon: number }> =
    {
      sm: { box: "w-4 h-4", icon: 12 },
      md: { box: "w-5 h-5", icon: 14 },
      lg: { box: "w-6 h-6", icon: 16 },
    };

  const { box, icon } = sizeStyles[size];

  const variantStyles: Record<
    NonNullable<CheckboxProps["variant"]>,
    { base: string; checked: string; indeterminate: string }
  > = {
    default: {
      base: cn(
        "bg-[var(--primaryColor)]/15 border border-[var(--border)]",
        "hover:bg-[var(--surface-hover)]"
      ),
      checked: "bg-[var(--primaryColor)]/15",
      indeterminate: "bg-[var(--primaryColor)]/15",
    },
    outline: {
      base: cn(
        "bg-[var(--primaryColor)]/15 border border-[var(--border)]",
        "hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)]"
      ),
      checked: "bg-[var(--primaryColor)]/15 border-[var(--primaryColor)]",
      indeterminate: "bg-[var(--primaryColor)]/15 border-[var(--primaryColor)]",
    },
    ghost: {
      base: cn(
        "bg-[var(--primaryColor)]/15 border-0",
        "hover:bg-[var(--surface-hover)]"
      ),
      checked: "bg-transparent",
      indeterminate: "bg-transparent",
    },
  };

  const variantConfig = variantStyles[variant];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <CheckboxPrimitive.Root
          id={checkboxId}
          name={name}
          checked={indeterminate ? "indeterminate" : checked}
          onCheckedChange={(checkedState) => {
            // Only call onChange if it's actually changing state
            if (
              (checkedState === true && !checked) ||
              (checkedState === false && checked) ||
              (checkedState === "indeterminate" && !indeterminate)
            ) {
              onChange();
            }
          }}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          aria-required={required ? "true" : undefined}
          className={cn(
            "appearance-none rounded",
            "flex items-center justify-center",
            box,
            variantConfig.base,
            checked && variantConfig.checked,
            indeterminate && !checked && variantConfig.indeterminate,
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primaryColor)] focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "cursor-pointer",
            error && "border-[var(--errorColor)]",
            className
          )}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center translate-y-[-2px]">
            {indeterminate ? (
              <IconMinus
                size={icon}
                stroke={2.5}
                className="text-[var(--text)] translate-y-[2px]"
              />
            ) : (
              <IconCheck
                size={icon}
                stroke={2}
                className="text-[var(--text)] translate-y-[2px]"
              />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <LabelPrimitive.Root
            htmlFor={checkboxId}
            className={cn(
              "text-sm text-[var(--text)] cursor-pointer select-none",
              labelClassName
            )}
          >
            {label}
          </LabelPrimitive.Root>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          className="text-sm text-[var(--errorColor)]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
