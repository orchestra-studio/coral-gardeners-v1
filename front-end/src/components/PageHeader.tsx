"use client";

import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import IconButton from "@/components/ui/iconButton";

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  backUrl?: string;
  className?: string;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
  sticky?: boolean;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumb,
  actions = [],
  backUrl,
  className,
  containerClassName,
  size = "md",
  children,
}: PageHeaderProps) {
  const { navigateTo } = useAppNavigation();

  const handleBack = () => {
    if (backUrl) {
      navigateTo(backUrl);
    }
  };

  const sizeClasses = {
    sm: {
      container: "py-4",
      title: "text-xl font-bold",
      description: "text-sm",
      spacing: "gap-2",
    },
    md: {
      container: "py-6 pt-2",
      title: "text-2xl font-bold",
      description: "text-base",
      spacing: "gap-3",
    },
    lg: {
      container: "py-8",
      title: "text-3xl font-bold",
      description: "text-lg",
      spacing: "gap-4",
    },
  };

  const sizeConfig = sizeClasses[size];
  return (
    <header className={cn("page-header", className)}>
      <div
        className={cn("mb-3 px-1", sizeConfig.container, containerClassName)}
      >
        {/* Breadcrumb */}
        {breadcrumb && <div className="mb-4">{breadcrumb}</div>}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Title and Description */}
          <div className={cn("flex-1 text-start", sizeConfig.spacing)}>
            <div className="flex items-center gap-2">
              {/* Back button before title */}
              {backUrl && (
                <div className="flex-shrink-0">
                  <IconButton
                    onClick={handleBack}
                    variant="ghost"
                    size="md"
                    className="text-[var(--text-muted)] bg-[var(--text-muted)]/4 hover:text-[var(--text)]"
                  >
                    <IconArrowLeft size={20} className="rtl:rotate-180" />
                  </IconButton>
                </div>
              )}

              <h1
                className={cn(
                  "font-bold text-[var(--text)] text-start",
                  sizeConfig.title
                )}
              >
                {title}
              </h1>
            </div>

            {description && (
              <p
                className={cn(
                  "max-w-2xl mt-2 text-[var(--text-muted)] text-start",
                  sizeConfig.description
                )}
              >
                {description}
              </p>
            )}

            {/* Custom children content */}
            {children && <div className="mt-4">{children}</div>}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:ms-auto justify-start">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
