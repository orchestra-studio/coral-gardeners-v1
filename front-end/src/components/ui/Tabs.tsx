"use client";

import { cn } from "../../lib/utils";
import { JSX, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string; // Optional className for individual tab styling
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  containerClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  countClassName?: string;
  variant?: "pill" | "underline" | "minimal" | "sidebar";
  size?: "xs" | "sm" | "md" | "lg";
  showToggleButton?: boolean;
  toggleButtonText?: {
    show: string;
    hide: string;
  };
  isToggled?: boolean;
  onToggle?: () => void;
  // URL persistence feature
  persistInUrl?: boolean;
  urlParamName?: string;
  basePath?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onValueChange,
  className,
  containerClassName,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  countClassName,
  variant = "pill",
  size = "md",
  showToggleButton = false,
  toggleButtonText = { show: "Show", hide: "Hide" },
  isToggled = false,
  onToggle,
  persistInUrl = false,
  urlParamName = "tab",
  basePath,
}: TabsProps<T>): JSX.Element {
  // Always call hooks unconditionally (React rules)
  const router = useRouter();
  const searchParams = useSearchParams();
  const [internalValue, setInternalValue] = useState<T>(value);

  // Sync internal value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Initialize from URL on mount if persistInUrl is enabled
  useEffect(() => {
    if (!persistInUrl) return;

    const urlTab = searchParams.get(urlParamName) as T | null;
    if (urlTab && items.some((item) => item.id === urlTab)) {
      if (urlTab !== internalValue) {
        setInternalValue(urlTab);
        onValueChange(urlTab);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when tab changes via searchParams (for external changes)
  useEffect(() => {
    if (!persistInUrl) return;

    const urlTab = searchParams.get(urlParamName) as T | null;
    if (
      urlTab &&
      items.some((item) => item.id === urlTab) &&
      urlTab !== internalValue
    ) {
      setInternalValue(urlTab);
      onValueChange(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, persistInUrl, urlParamName]);

  const handleTabChange = (tabId: T) => {
    setInternalValue(tabId);
    onValueChange(tabId);

    if (persistInUrl) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(urlParamName, tabId);

      const path = basePath || window.location.pathname;
      router.replace(`${path}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    }
  };
  // Size variants
  const sizeClasses = {
    xs: "text-[11px] px-2 h-8 py-0.5",
    sm: "text-xs px-2.5 h-10 py-1",
    md: "text-sm px-3 h-13 inline-flex items-center",
    lg: "text-base px-4 h-13 py-2",
  };

  // Count badge size
  const countSizeClasses = {
    xs: "ms-1 w-3.5 h-3.5 text-[9px]",
    sm: "ms-1 w-4 h-4 text-[10px]",
    md: "ms-1.5 w-5 h-5 text-xs",
    lg: "ms-2 w-6 h-6 text-sm",
  };

  // Variants
  const variantClasses = {
    pill: {
      container: "flex flex-wrap gap-2 justify-start",
      tab: (isSelected: boolean) =>
        cn(
          "rounded-full whitespace-nowrap cursor-pointer",
          isSelected
            ? "bg-[var(--selected-bg)] text-[var(--selected-text)] border border-[var(--primaryColor)]"
            : "bg-transparent text-[var(--text)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
        ),
      count: (isSelected: boolean) =>
        cn(
          "inline-flex items-center justify-center rounded-full ",
          isSelected
            ? "text-[var(--surface)] bg-[var(--primaryColor)]"
            : "text-[var(--text-muted)] bg-[var(--surface-hover)]"
        ),
    },
    underline: {
      container: "flex w-full bg-[var(--surface)] rounded-none overflow-hidden",
      tab: (isSelected: boolean) =>
        cn(
          // Use an inner pseudo-element underline so it isn't clipped by overflow-hidden on the container
          "relative whitespace-nowrap bg-[var(--surface)] rounded-none after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full",
          isSelected
            ? "text-[var(--text)] font-medium after:bg-[var(--primaryColor)]"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--primaryColorHover)]/2 after:bg-transparent hover:after:bg-[var(--neutralLight)]/40"
        ),
      count: (isSelected: boolean) =>
        cn(
          "inline-flex items-center justify-center rounded-full ",
          isSelected
            ? "text-[var(--surface)] bg-[var(--primaryColor)]"
            : "text-[var(--text-muted)] bg-[var(--surface-hover)]"
        ),
    },
    minimal: {
      container: "flex flex-wrap gap-1",
      tab: (isSelected: boolean) =>
        cn(
          "rounded whitespace-nowrap",
          isSelected
            ? "bg-[var(--selected-bg)] text-[var(--selected-text)] font-medium"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
        ),
      count: (isSelected: boolean) =>
        cn(
          "inline-flex items-center justify-center rounded-full ",
          isSelected
            ? "text-[var(--surface)] bg-[var(--primaryColor)]"
            : "text-[var(--text-muted)] bg-[var(--surface-hover)]"
        ),
    },
    sidebar: {
      container: "flex flex-col gap-1 w-full",
      tab: (isSelected: boolean) =>
        cn(
          "w-full flex items-center gap-3 px-4 py-3 text-start justify-start rounded-lg transition-[border-color,background-color] duration-0 min-h-[48px] border-s-4",
          isSelected
            ? "bg-[var(--selected-bg)] text-[var(--selected-text)] border-[var(--primaryColor)]"
            : "text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--primaryColor)] border-transparent"
        ),
      count: (isSelected: boolean) =>
        cn(
          "inline-flex items-center justify-center rounded-full ",
          isSelected
            ? "text-[var(--surface)] bg-[var(--primaryColor)]"
            : "text-[var(--text-muted)] bg-[var(--surface-hover)]"
        ),
    },
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {showToggleButton && (
        <Button
          variant="link"
          size="sm"
          onClick={onToggle}
          className="text-sm text-[var(--text-muted)] underline underline-offset-2 mb-4 hover:text-[var(--text)]"
        >
          {isToggled ? toggleButtonText.hide : toggleButtonText.show}
        </Button>
      )}

      {(!showToggleButton || isToggled) && (
        <div
          className={cn(variantClasses[variant].container, containerClassName)}
        >
          {items.map((item) => {
            const isActive = value === item.id;

            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size={size === "md" ? "default" : size === "xs" ? "sm" : size}
                onMouseDown={(e) => {
                  // Prevent the button from stealing focus from the input
                  e.preventDefault();
                }}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  variantClasses[variant].tab(isActive),
                  sizeClasses[size],
                  tabClassName,
                  item.className, // Individual tab className
                  isActive ? activeTabClassName : inactiveTabClassName,
                  // Override button styles for sidebar variant
                  variant === "sidebar" &&
                    "!w-full !justify-start !text-start !p-0"
                )}
                contentClassName={
                  variant === "sidebar"
                    ? "w-full justify-start px-4 py-3"
                    : undefined
                }
                startIcon={
                  item.icon && variant === "sidebar" ? (
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  ) : undefined
                }
              >
                <span className={variant === "sidebar" ? "font-medium" : ""}>
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span
                    className={cn(
                      variantClasses[variant].count(isActive),
                      countSizeClasses[size],
                      countClassName
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
