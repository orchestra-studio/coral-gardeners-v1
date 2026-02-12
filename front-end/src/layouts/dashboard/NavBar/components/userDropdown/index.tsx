import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useLocale } from "@/hooks/locale/useLocale";
import {
  IconChevronDown,
  IconUser,
  IconMail,
  IconSettings2,
  IconLogout,
} from "@tabler/icons-react";
import { UserAvatar, UserProfile, MenuItem } from "./components";
import { handleLogout } from "./utils";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import DropdownMenu from "@/components/ui/DropdownMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function UserDropdown() {
  const t = useTranslations();
  const { navigateTo } = useAppNavigation();
  const currentLocale = useLocale();

  const { user } = useAuth();

  const userData = useMemo(() => {
    const name = user?.name || (user?.email ? user.email.split("@")[0] : "");
    const email = user?.email || "";
    const avatar = user?.avatar || null;
    const initialsFromName = name
      ? name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("")
      : "";
    const initialsFromEmail =
      !initialsFromName && email ? email[0].toUpperCase() : "";
    const initials = initialsFromName || initialsFromEmail || "?";

    return {
      name: name || email || "",
      email,
      initials,
      avatar,
    };
  }, [user]);

  const handleMenuItemClick = (path: string, close: () => void) => {
    navigateTo(path);
    close();
  };

  const onLogout = (close: () => void) => {
    handleLogout(navigateTo);
    close();
  };

  return (
    <DropdownMenu
      className="relative"
      backdrop
      align="right"
      trigger={({ open, toggle }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="px-2 py-1 bg-[var(--control-bg)] border border-[var(--border-subtle)] rounded-full hover:bg-[var(--surface-hover)] transition-none flex items-center gap-2"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={t("dashboard.header.userMenu.ariaLabels.userAccountMenu")}
          contentClassName="gap-0 md:gap-2"
        >
          <UserAvatar userData={userData} />
          <span className="text-sm font-medium text-[var(--text)] hidden sm:block">
            {userData.name.split(" ")[0] || userData.email.split("@")[0]}
          </span>
          <IconChevronDown
            size={16}
            className={`transition-transform text-[var(--text-muted)] ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </Button>
      )}
      menuClassName="w-52 py-1"
      content={({ close }) => (
        <div>
          {/* User Profile Section */}
          <UserProfile userData={userData} />

          {/* Language Switcher - Mobile Only */}
          <div
            className="sm:hidden px-2 py-2 border-b border-[var(--border-subtle)]"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <LanguageSwitcher
              currentLocale={currentLocale}
              variant="default"
              className="w-full"
            />
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <MenuItem
              icon={IconUser}
              label={t("dashboard.header.userMenu.profile")}
              ariaLabel={t("dashboard.header.userMenu.ariaLabels.viewProfile")}
              onClick={() => handleMenuItemClick("/dashboard/settings", close)}
            />

            <MenuItem
              icon={IconMail}
              label={t("dashboard.header.userMenu.messages")}
              ariaLabel={t("dashboard.header.userMenu.ariaLabels.openMessages")}
              onClick={() => close()}
            />

            <MenuItem
              icon={IconSettings2}
              label={t("dashboard.header.userMenu.settings")}
              ariaLabel={t("dashboard.header.userMenu.ariaLabels.openSettings")}
              onClick={() => handleMenuItemClick("/dashboard/settings", close)}
            />
          </div>

          {/* Logout Section */}
          <div className="border-t border-[var(--border-subtle)] py-1">
            <MenuItem
              icon={IconLogout}
              label={t("dashboard.header.userMenu.logout")}
              ariaLabel={t("dashboard.header.userMenu.ariaLabels.logOut")}
              onClick={() => onLogout(close)}
              variant="danger"
            />
          </div>
        </div>
      )}
    />
  );
}
