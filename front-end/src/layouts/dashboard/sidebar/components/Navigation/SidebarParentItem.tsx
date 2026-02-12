"use client";

import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { Route } from "../../config/navigation";
import { SidebarItem } from "../../types";
import type { MultilingualText } from "../../config/navigationData";
import SidebarNavItem from "./SidebarNavItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SidebarParentItemProps {
  icon: React.ReactNode;
  title: MultilingualText;
  route: Route;
  badge?: string;
  items: SidebarItem<Route>[];
  isExpanded: boolean;
  currentRoute: Route;
  onToggle: () => void;
  isCollapsed?: boolean;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export default function SidebarParentItem({
  icon,
  title,
  route,
  badge,
  items,
  isExpanded,
  currentRoute,
  onToggle,
  isCollapsed = false,
  isMobile = false,
  onMobileClose,
}: SidebarParentItemProps) {
  const locale = useLocale();
  const displayTitle = title[locale as keyof MultilingualText] || title.en;

  const hasActiveChild = items.some(
    (child: SidebarItem) => currentRoute === child.route
  );
  const isActive = currentRoute === route || hasActiveChild;

  const activeClasses = isActive
    ? "bg-[var(--selected-bg)] text-[var(--selected-text)] font-medium hover:bg-[var(--selected-bg)]"
    : "bg-[var(--surface)] text-[var(--text-muted)] font-normal hover:bg-[var(--surface-hover)] hover:text-[var(--text)]";

  const iconElement = (
    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
      {icon}
    </span>
  );

  const chevronElement = (
    <span className="shrink-0 flex items-center">
      {isExpanded ? (
        <IconChevronDown size={16} />
      ) : (
        <IconChevronRight size={16} className="rtl:rotate-180" />
      )}
    </span>
  );

  const content = (
    <div className="flex justify-center w-full">
      <Button
        onClick={onToggle}
        variant="ghost"
        startIcon={iconElement}
        endIcon={!isCollapsed ? chevronElement : undefined}
        className={cn(
          "relative px-[11px] py-2.5 text-sm w-full cursor-pointer transition-none border-[var(--border)]",
          activeClasses,
          "text-start h-auto font-normal rounded-md"
        )}
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
          <span className="absolute top-1 inset-inline-end-1 h-2 w-2 bg-[var(--selected-bg)] rounded-full" />
        )}
      </Button>
    </div>
  );

  if (isCollapsed) {
    return (
      <div>
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="px-2">
              {displayTitle}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div>
      {content}

      {/* Children */}
      {isExpanded && !isCollapsed && (
        <div className="ms-8 border-s border-[var(--border)] py-2 ">
          {items.map((child) => {
            const childActive = currentRoute === child.route;
            return (
              <div key={child.route} className="relative ps-0.5">
                {childActive && (
                  <div className="absolute -start-px h-[80%] top-1/2 -translate-y-1/2 w-[1px] bg-[var(--selected-text)]" />
                )}
                <div className="relative ps-0">
                  <SidebarNavItem
                    icon={child.icon}
                    title={child.title}
                    route={child.route}
                    badge={child.badge}
                    isActive={childActive}
                    isChild
                    isCollapsed={isCollapsed}
                    contentClassName="justify-start"
                    isMobile={isMobile}
                    onMobileClose={onMobileClose}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
