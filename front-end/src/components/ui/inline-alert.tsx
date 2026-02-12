"use client";

import React from "react";
import { cn } from "../../lib/utils";
import {
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";

export interface InlineAlertProps {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    container:
      "bg-[var(--alert-success-bg,rgb(240,253,244))] border-[var(--alert-success-border,rgb(34,197,94))]",
    icon: "text-[var(--alert-success-icon,rgb(34,197,94))]",
    title: "text-[var(--alert-success-text,rgb(22,101,52))]",
    message: "text-[var(--alert-success-text,rgb(22,101,52))]",
    dismissButton:
      "text-[var(--alert-success-icon,rgb(34,197,94))] hover:text-[var(--alert-success-hover,rgb(21,128,61))]",
  },
  error: {
    container:
      "bg-[var(--alert-error-bg,rgb(254,242,242))] border-[var(--alert-error-border,rgb(239,68,68))]",
    icon: "text-[var(--alert-error-icon,rgb(239,68,68))]",
    title: "text-[var(--alert-error-text,rgb(153,27,27))]",
    message: "text-[var(--alert-error-text,rgb(153,27,27))]",
    dismissButton:
      "text-[var(--alert-error-icon,rgb(239,68,68))] hover:text-[var(--alert-error-hover,rgb(220,38,38))]",
  },
  warning: {
    container:
      "bg-[var(--alert-warning-bg,rgb(254,252,232))] border-[var(--alert-warning-border,rgb(245,158,11))]",
    icon: "text-[var(--alert-warning-icon,rgb(245,158,11))]",
    title: "text-[var(--alert-warning-text,rgb(146,64,14))]",
    message: "text-[var(--alert-warning-text,rgb(146,64,14))]",
    dismissButton:
      "text-[var(--alert-warning-icon,rgb(245,158,11))] hover:text-[var(--alert-warning-hover,rgb(217,119,6))]",
  },
  info: {
    container:
      "bg-[var(--alert-info-bg,rgb(219,234,254))] border-[var(--alert-info-border,rgb(59,130,246))]",
    icon: "text-[var(--alert-info-icon,rgb(59,130,246))]",
    title: "text-[var(--alert-info-text,rgb(30,58,138))]",
    message: "text-[var(--alert-info-text,rgb(30,58,138))]",
    dismissButton:
      "text-[var(--alert-info-icon,rgb(59,130,246))] hover:text-[var(--alert-info-hover,rgb(37,99,235))]",
  },
};

const iconMap = {
  success: IconCheck,
  error: IconExclamationMark,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
};

export const InlineAlert: React.FC<InlineAlertProps> = ({
  variant = "info",
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const styles = variantStyles[variant];
  const IconComponent = iconMap[variant];

  return (
    <div
      className={cn("rounded-md border p-4", styles.container, className)}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={cn("h-5 w-5", styles.icon)} />
        </div>
        <div className="ms-3 flex-1">
          {title && (
            <h3 className={cn("text-sm font-medium", styles.title)}>{title}</h3>
          )}
          <div className={cn("text-sm", title ? "mt-1" : "", styles.message)}>
            {message}
          </div>
        </div>
        {dismissible && onDismiss && (
          <div className="ms-auto ps-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={cn(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  styles.dismissButton
                )}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <IconX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineAlert;
