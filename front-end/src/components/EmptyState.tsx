"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconSearch,
  IconFile,
  IconChartBar,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  illustration?: "search" | "files" | "data" | "users" | "settings" | "custom";
}

const illustrations = {
  search: <IconSearch className="w-full h-full text-[var(--text-muted)]" />,
  files: <IconFile className="w-full h-full text-[var(--text-muted)]" />,
  data: <IconChartBar className="w-full h-full text-[var(--text-muted)]" />,
  users: <IconUsers className="w-full h-full text-[var(--text-muted)]" />,
  settings: <IconSettings className="w-full h-full text-[var(--text-muted)]" />,
  custom: null,
};

const sizeClasses = {
  sm: {
    container: "p-6",
    icon: "w-12 h-12 mb-4",
    title: "text-lg font-semibold",
    description: "text-sm",
    spacing: "gap-3",
  },
  md: {
    container: "p-8",
    icon: "w-16 h-16 mb-6",
    title: "text-xl font-semibold",
    description: "text-base",
    spacing: "gap-4",
  },
  lg: {
    container: "p-12",
    icon: "w-20 h-20 mb-8",
    title: "text-2xl font-semibold",
    description: "text-lg",
    spacing: "gap-6",
  },
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
  illustration = "files",
}: EmptyStateProps) {
  const sizeConfig = sizeClasses[size];

  const renderIcon = () => {
    if (icon) return icon;
    if (illustration === "custom") return null;
    return illustrations[illustration];
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center text-center bg-[var(--surface)] rounded-md border border-[var(--border)]",
        sizeConfig.container,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(sizeConfig.spacing)}>
        {/* Icon/Illustration */}
        <motion.div
          className={cn(
            "mx-auto flex items-center justify-center",
            sizeConfig.icon
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderIcon()}
        </motion.div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <motion.h3
            className={cn("text-[var(--text)]", sizeConfig.title)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h3>

          {description && (
            <motion.p
              className={cn(
                "text-[var(--text-muted)] max-w-md mx-auto",
                sizeConfig.description
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors focus:ring-2 focus:ring-offset-2",
                  action.variant === "secondary"
                    ? "bg-[var(--surface-hover)] text-[var(--text)] hover:bg-[var(--border)] focus:ring-[var(--primaryColor)]"
                    : "bg-[var(--primaryColor)] text-white hover:bg-[var(--primaryColorHover)] focus:ring-[var(--primaryColor)]"
                )}
              >
                {action.label}
              </button>
            )}

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
