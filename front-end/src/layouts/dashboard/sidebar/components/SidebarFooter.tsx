"use client";

import React from "react";
import { IconLogout } from "@tabler/icons-react";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useLocale } from "@/hooks/locale/useLocale";
import { BRAND_CONFIG } from "../config/navigationData";
import type { MultilingualText } from "../config/navigationData";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export default function SidebarFooter({
  isCollapsed = false,
}: SidebarFooterProps) {
  const { navigateTo } = useAppNavigation();
  const locale = useLocale() as "en" | "ar";

  // Create multilingual text object for logout
  const logoutTitle: MultilingualText = {
    en: BRAND_CONFIG.logout.en,
    ar: BRAND_CONFIG.logout.ar,
  };

  const handleLogout = async () => {
    try {
      // Clear the session using the auth provider
      const { getAuthProvider } = await import("@/lib/auth/factory");
      const authProvider = getAuthProvider();
      await authProvider.signOut();

      // Redirect to login page
      navigateTo("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, redirect to login to be safe
      navigateTo("/auth/login");
    }
  };

  if (isCollapsed) {
    return (
      <div className="rounded-bl-sm pt-3 border-t border-[var(--border)]">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-[11px] py-2.5 text-sm cursor-pointer transition-none border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] font-normal hover:bg-[var(--surface-hover)] hover:text-[var(--errorColor)] rounded-md flex items-center justify-center gap-2"
        >
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <IconLogout size={18} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-bl-sm pt-2 border-t border-[var(--border)]">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full px-[11px] py-2.5 text-sm cursor-pointer transition-none border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] font-normal hover:bg-[var(--surface-hover)] hover:text-[var(--errorColor)] rounded-md flex items-center gap-2"
      >
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          <IconLogout size={20} />
        </span>
        <span className="flex-1 whitespace-nowrap break-words leading-snug overflow-hidden text-start">
          {logoutTitle[locale]}
        </span>
      </button>
    </div>
  );
}
