"use client";

import React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface PulsingDotProps {
  ariaLabel?: string;
  className?: string;
  dotClassName?: string;
}

/**
 * Animated pulsing dot indicator
 * Single dot that scales up and down while waiting for response
 */
const PulsingDot = ({
  ariaLabel = "Loading",
  className,
  dotClassName,
}: PulsingDotProps) => {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <motion.span
        className={cn(
          "h-2.5 w-2.5 rounded-full bg-[var(--primaryColor)]",
          dotClassName
        )}
        animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
};

export { PulsingDot };
