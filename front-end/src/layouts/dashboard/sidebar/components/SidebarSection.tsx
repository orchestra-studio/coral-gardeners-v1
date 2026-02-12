"use client";

import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import type { MultilingualText } from "../config/navigationData";

interface SidebarSectionProps {
  title: MultilingualText;
  isCollapsed?: boolean;
}

export default function SidebarSection({
  title,
  isCollapsed = false,
}: SidebarSectionProps) {
  const locale = useLocale();
  const [showText, setShowText] = React.useState(!isCollapsed);

  // Delay showing text until after sidebar expansion animation completes
  React.useEffect(() => {
    if (!isCollapsed) {
      // Show text after 150ms (matching sidebar animation duration)
      const timer = setTimeout(() => {
        setShowText(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Hide text immediately when collapsing
      setShowText(false);
    }
  }, [isCollapsed]);

  if (isCollapsed) {
    // Show as a divider when collapsed, maintaining min-height to prevent layout shift
    return (
      <div
        className="mx-3 min-h-[27px] flex items-center justify-center"
        title={title[locale as keyof MultilingualText] || title.en}
      >
        <div className="w-full h-[1px] rounded-[3px] bg-[var(--surface-hover)]" />
      </div>
    );
  }

  return (
    <div className="ps-1 pe-3 pt-3 min-h-[27px] text-[10px] whitespace-nowrap font-medium uppercase tracking-wider bg-[var(--surface)] text-[var(--text-muted)]">
      {showText && (
        <span className="animate-fade-in-fast">
          {title[locale as keyof MultilingualText] || title.en}
        </span>
      )}
    </div>
  );
}
