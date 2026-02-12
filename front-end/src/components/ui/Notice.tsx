"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconAlertTriangle,
  IconInfoCircle,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";

const noticeVariants = cva(
  "rounded-lg border border-[var(--border)] p-4 transition-[border-color,background-color] duration-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-hover)]",
        warning: "bg-[var(--pending,rgb(245,158,11))] bg-opacity-10",
        info: "bg-[var(--info,rgb(59,130,246))] bg-opacity-10",
        success: "bg-[var(--accepted,rgb(34,197,94))] bg-opacity-10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const variantStyles = {
  default: {
    icon: "text-[var(--text-muted)]",
    title: "text-[var(--text)]",
    content: "text-[var(--text-muted)]",
  },
  warning: {
    icon: "text-[var(--pending,rgb(245,158,11))]",
    title: "text-[var(--pending,rgb(245,158,11))]",
    content: "text-[var(--pending,rgb(217,119,6))]",
  },
  info: {
    icon: "text-[var(--info,rgb(59,130,246))]",
    title: "text-[var(--info,rgb(59,130,246))]",
    content: "text-[var(--info,rgb(37,99,235))]",
  },
  success: {
    icon: "text-[var(--accepted,rgb(34,197,94))]",
    title: "text-[var(--accepted,rgb(34,197,94))]",
    content: "text-[var(--accepted,rgb(21,128,61))]",
  },
};

const defaultIcons = {
  default: IconInfoCircle,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
  success: IconCheck,
};

export interface NoticeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof noticeVariants> {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  (
    {
      className,
      variant = "info",
      title,
      children,
      icon,
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const currentVariant = variant || "info";
    const styles = variantStyles[currentVariant];
    const IconComponent = defaultIcons[currentVariant];

    return (
      <div
        ref={ref}
        className={cn(noticeVariants({ variant: currentVariant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
              {icon || <IconComponent className="w-5 h-5" />}
            </div>
          )}
          <div className="flex-1">
            <h4 className={cn("font-medium mb-2", styles.title)}>{title}</h4>
            <div className={cn("text-sm", styles.content)}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Notice.displayName = "Notice";

export { noticeVariants };
