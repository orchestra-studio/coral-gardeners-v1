"use client";

import React from "react";
import { IconMenu2 } from "@tabler/icons-react";
import { useLocale } from "@/hooks/locale/useLocale";
import { BRAND_CONFIG } from "../config/navigationData";
import type { MultilingualText } from "../config/navigationData";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/Link";

interface SidebarBrandProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarBrand({
  isCollapsed,
  onToggleCollapse,
}: SidebarBrandProps) {
  const locale = useLocale();

  return (
    <div className="h-16 flex items-center px-3 w-full bg-[var(--surface)]">
      {/* Collapse/Expand Toggle Button - always shown first */}
      <Button
        onClick={onToggleCollapse}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[var(--surface-hover)] transition-colors mie-2"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <IconMenu2 size={16} className="text-[var(--text-muted)]" />
      </Button>

      {/* Brand/Logo - always shown with fixed width */}
      <Link
        href="/"
        variant="ghost"
        className="flex items-center gap-3 hover:bg-transparent font-normal flex-1"
      >
        {BRAND_CONFIG.customBrand ? (
          BRAND_CONFIG.customBrand
        ) : (
          <>
            <div className="h-6 w-6 rounded-sm bg-[var(--surface-hover)] flex items-center justify-center">
              <span className="text-[var(--text)] text-sm">
                {BRAND_CONFIG.icon}
              </span>
            </div>
            <h1 className="font-semibold text-[var(--text)] text-sm">
              {BRAND_CONFIG.name[locale as keyof MultilingualText] ||
                BRAND_CONFIG.name.en}
            </h1>
          </>
        )}
      </Link>
    </div>
  );
}
