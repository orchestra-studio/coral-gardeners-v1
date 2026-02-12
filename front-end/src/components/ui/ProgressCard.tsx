"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ProgressCardProps {
  title: string;
  progress: number; // 0-100
  value?: string | number;
  target?: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  description?: string;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
};

const backgroundColorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/20",
  green: "bg-emerald-100 dark:bg-emerald-900/20",
  yellow: "bg-amber-100 dark:bg-amber-900/20",
  red: "bg-red-100 dark:bg-red-900/20",
  purple: "bg-purple-100 dark:bg-purple-900/20",
  indigo: "bg-indigo-100 dark:bg-indigo-900/20",
};

export default function ProgressCard({
  title,
  progress,
  value,
  target,
  icon,
  color = "blue",
  description,
  className,
  showPercentage = true,
  animated = true,
}: ProgressCardProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  type IconProps = { className?: string; size?: number; color?: string };
  const iconElement = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<IconProps>, {
        size: (icon as React.ReactElement<IconProps>).props.size ?? 20,
        color:
          (icon as React.ReactElement<IconProps>).props.color ?? "currentColor",
        className: cn(
          "h-6 w-6 text-neutral-900 dark:text-neutral-100",
          (icon as React.ReactElement<IconProps>).props.className
        ),
      })
    : icon;

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 md:p-6",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  backgroundColorClasses[color]
                )}
              >
                {iconElement}
              </div>
            )}

            <div className="flex flex-col">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {title}
              </p>

              {(value || target) && (
                <div className="flex flex-wrap items-baseline gap-2">
                  {value && (
                    <span className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {value}
                    </span>
                  )}
                  {target && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      of {target}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {showPercentage && (
            <div className="mt-1 text-right">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {clampedProgress.toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
            <motion.div
              className={cn("h-2.5 rounded-full", colorClasses[color])}
              initial={{ width: 0 }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{
                duration: animated ? 1.5 : 0,
                ease: "easeOut",
                delay: 0.2,
              }}
            />
          </div>
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}
