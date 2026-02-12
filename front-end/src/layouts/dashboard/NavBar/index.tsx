"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { useLocale } from "@/hooks/locale/useLocale";
import HeaderLeft from "./components/headerLeft";
import HeaderActions from "./components/headerActions";
import type { AppHeaderProps } from "./types";
import SearchModal from "@/components/SearchModal";
import RaysLighting from "@/components/RaysLighting";

export default function AppHeader({
  currentRoute,
  showBack = false,
  onBack,
  isCollapsed,
  onToggleCollapse,
}: AppHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { isSearchOpen, openSearch, closeSearch } = useSearchShortcut();

  return (
    <>
      <div className="h-22" />
      <div className="fixed h-21 w-screen top-0 left-0 z-19  bg-[var(--background)]" />
      <header className="fixed ms-[15px] top-2.5 mb-3.5 z-99 w-[calc(100%-30px)] ">
        <div className="h-16 flex items-center bg-[var(--surface)]/95 backdrop-blur-[5px] rounded-2xl w-full border-1 border-[var(--border-subtle)]">
          <RaysLighting
            position={"top-left"}
            width={2800}
            height={900}
            intensity={0.04}
            zIndex={20}
          />
          {/* Brand section - fixed width, always shows full brand */}
          <div className="flex items-center min-w-[90px] md:w-[240px]">
            <HeaderLeft
              currentRoute={currentRoute}
              showBack={showBack}
              onBack={onBack}
              isCollapsed={isCollapsed}
              onToggleCollapse={onToggleCollapse}
            />
          </div>

          {/* Rest of header - takes remaining space */}
          <div className="flex-1 flex items-center justify-end px-3 sm:px-6">
            <HeaderActions onSearchOpen={openSearch} />
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        locale={locale}
        translations={{
          placeholder: t("dashboard.search.modal.placeholder"),
          noResultsText: t("dashboard.search.modal.noResults"),
          startTypingText: t("dashboard.search.modal.startTyping"),
          poweredByText: t("dashboard.search.modal.poweredBy"),
          navigationKeys: {
            navigate: t("dashboard.search.modal.navigation.navigate"),
            select: t("dashboard.search.modal.navigation.select"),
            close: t("dashboard.search.modal.navigation.close"),
          },
        }}
      />
    </>
  );
}
