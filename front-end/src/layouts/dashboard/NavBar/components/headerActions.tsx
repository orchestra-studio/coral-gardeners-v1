import React from "react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/layouts/app/NavBar/components/ThemeToggle";
import NotificationsDropdown from "./notificationsDropdown";
import UserDropdown from "./userDropdown";
import { useLocale } from "@/hooks/locale/useLocale";
import type { HeaderActionsProps } from "../types";
import { SearchInput } from "@/components/ui";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HeaderActions({ onSearchOpen }: HeaderActionsProps) {
  const t = useTranslations();
  const currentLocale = useLocale();

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="hidden sm:block">
        <SearchInput
          placeholder={t("dashboard.header.search.placeholder")}
          ariaLabel={t("dashboard.header.search.ariaLabel")}
          onOpenModal={onSearchOpen}
          className="md:w-52"
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <div className="hidden sm:block">
          <LanguageSwitcher
            currentLocale={currentLocale}
            variant="ghost"
            triggerClassName="px-3 sm:ps-3 sm:pe-2"
          />
        </div>
        <ThemeToggle />

        <NotificationsDropdown
          translations={{
            title: t("dashboard.header.notifications.title"),
            markAllRead: t("dashboard.header.notifications.markAllRead"),
            noNotifications: t(
              "dashboard.header.notifications.noNotifications"
            ),
            notificationSettings: t(
              "dashboard.header.notifications.notificationSettings"
            ),
            ariaLabel: t("dashboard.header.notifications.ariaLabel"),
            itemActions: {
              markAsRead: t(
                "dashboard.header.notifications.itemActions.markAsRead"
              ),
              remove: t("dashboard.header.notifications.itemActions.remove"),
            },
          }}
        />
        <UserDropdown />
      </div>
    </div>
  );
}
