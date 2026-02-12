"use client";
import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const variantStyles = {
  default:
    "bg-[var(--surface-hover)] text-[var(--text)] border border-[var(--border)]",
  outline: "bg-transparent border border-[var(--border)] text-[var(--text)]",
  secondary:
    "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]",
  success:
    "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
  warning:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
  error:
    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
};

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
