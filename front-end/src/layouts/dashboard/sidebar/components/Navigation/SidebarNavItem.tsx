"use client";

import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import { Route, configHelpers } from "../../config/navigation";
import type { MultilingualText } from "../../config/navigationData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  icon: React.ReactNode;
  title: MultilingualText;
  route: Route;
  badge?: string;
  isActive: boolean;
  // When true, applies compact left padding for nested (child) items
  isChild?: boolean;
  // When true, shows only icon (for collapsed sidebar)
  isCollapsed?: boolean;
  // Additional CSS classes for button customization
  className?: string;
  // Additional CSS classes for content wrapper customization
  contentClassName?: string;
  // Whether the screen is mobile size
  isMobile?: boolean;
  // Callback to close sidebar on mobile when clicking nav item
  onMobileClose?: () => void;
}

export default function SidebarNavItem({
  icon,
  title,
  route,
  badge,
  isActive,
  isChild = false,
  isCollapsed = false,
  className = "",
  contentClassName = "",
  isMobile = false,
  onMobileClose,
}: SidebarNavItemProps) {
  const locale = useLocale();
  const displayTitle = title[locale as keyof MultilingualText] || title.en;

  // Get the URL path for this route
  const href = configHelpers.getPathForRoute(route);

  const activeClasses = isActive
    ? isChild
      ? "bg-[var(--surface)] text-[var(--selected-text)] font-medium hover:bg-[var(--surface-hover)]"
      : "bg-[var(--selected-bg)] text-[var(--selected-text)] font-medium hover:bg-[var(--selected-bg)]"
    : "bg-[var(--surface)] text-[var(--text-muted)] font-normal hover:bg-[var(--surface-hover)] hover:text-[var(--text)]";

  const handleClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const content = (
    <div className={`flex justify-center w-full ${contentClassName}`}>
      <Button
        href={href}
        variant="ghost"
        onClick={handleClick}
        startIcon={
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
        }
        className={`relative px-[11px] py-2.5 text-sm cursor-pointer transition-none border-[var(--border)] ${activeClasses} w-full text-start h-auto font-normal ${
          isChild ? "rounded-none" : "rounded-md"
        } ${
          isChild ? "hover:bg-transparent hover:text-current" : ""
        } ${className}`}
        contentClassName={cn("w-full justify-start")}
      >
        <span
          className={cn(
            "flex-1 whitespace-nowrap break-words leading-snug overflow-hidden transition-opacity duration-200",
            isCollapsed && "opacity-0 w-0"
          )}
        >
          {displayTitle}
        </span>
        {badge && (
          <span
            className={cn(
              "rounded-full text-xs font-medium transition-opacity duration-200",
              isActive
                ? "bg-[var(--surface)] text-[var(--text)]"
                : "bg-[var(--surface-hover)] text-[var(--text-muted)]",
              isCollapsed
                ? "opacity-0 w-0 px-0 py-0"
                : "opacity-100 px-2 py-0.5"
            )}
          >
            {badge}
          </span>
        )}
        {badge && isCollapsed && (
          <span className="absolute top-1 inset-inline-end-1 h-2 w-2 bg-[var(--primaryColor)] rounded-full" />
        )}
      </Button>
    </div>
  );

  if (!isCollapsed) return content;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="px-2">
          {displayTitle}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
