"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface ShineBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const variantStyles = {
  default:
    "bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)] text-[var(--surface)] border border-[var(--border)]",
  outline: "bg-transparent border-2 border-[var(--border)] text-[var(--text)]",
  secondary:
    "bg-gradient-to-r from-[var(--surface)] to-[var(--surface-hover)] text-[var(--text)] border border-[var(--border)]",
};

export function ShineBadge({
  children,
  className,
  variant = "default",
  size = "md",
}: ShineBadgeProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(300%) skewX(-12deg);
            }
          }
          .animate-shine {
            animation: shine 3s ease-in-out infinite;
          }
        `,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-medium",
          "overflow-hidden group cursor-default",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 animate-shine"
        />

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </motion.div>
    </>
  );
}
