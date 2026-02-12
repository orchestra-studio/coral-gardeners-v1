"use client";

import React from "react";
import { IconMenu2 } from "@tabler/icons-react";
import { useLocale } from "@/hooks/locale/useLocale";
import { BRAND_CONFIG } from "../../sidebar/config/navigationData";
import type { MultilingualText } from "../../sidebar/config/navigationData";
import IconButton from "@/components/ui/iconButton";

interface HeaderBrandProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function HeaderBrand({
  isCollapsed,
  onToggleCollapse,
}: HeaderBrandProps) {
  const locale = useLocale();

  const handleToggle = () => {
    onToggleCollapse();
  };

  return (
    <div className="w-full h-16 flex items-center px-3">
      {/* Sidebar Toggle Button */}
      <IconButton
        onClick={handleToggle}
        size="sm"
        className="min-h-8 min-w-8 p-0 me-2"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <IconMenu2 size={16} className="text-[var(--text-muted)]" />
      </IconButton>

      {/* Brand/Logo - visual only */}
      <div className="flex items-center gap-1.5 font-normal flex-1">
        {BRAND_CONFIG.customBrand ? (
          BRAND_CONFIG.customBrand
        ) : (
          <>
            <div className="h-6 w-6 rounded-sm flex items-center justify-center">
              <span className="text-[var(--text)] text-sm">
                {BRAND_CONFIG.icon}
              </span>
            </div>
            <h1 className="font-semibold text-[var(--text)] text-sm hidden sm:inline">
              {BRAND_CONFIG.name[locale as keyof MultilingualText] ||
                BRAND_CONFIG.name.en}
            </h1>
          </>
        )}
      </div>
    </div>
  );
}
