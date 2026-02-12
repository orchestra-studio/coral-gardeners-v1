"use client";

import { useState } from "react";
import { IconBell, IconSettings } from "@tabler/icons-react";
import IconButton from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { useLocale } from "@/hooks/locale/useLocale";
import { Notification, NotificationDropdownProps } from "./types";
import { mockNotifications } from "./data";
import NotificationItem from "./components/NotificationItem";

export default function NotificationsDropdown({
  translations,
}: NotificationDropdownProps) {
  const locale = useLocale();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // DropdownMenu handles open/close and outside clicks

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu
      className="relative"
      backdrop
      align="right"
      trigger={({ toggle }) => (
        <IconButton onClick={toggle} aria-label={translations.ariaLabel}>
          <IconBell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -end-1 rtl:-start-1 rtl:end-auto z-[2] bg-[var(--errorColor)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </IconButton>
      )}
      menuClassName="w-72 sm:w-80 max-h-[448px] sm:max-h-[538px] overflow-hidden p-0"
      content={() => (
        <div className="max-w-[calc(100vw-2rem)]">
          <div className="p-3 sm:p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text)] text-sm sm:text-base">
                {translations.title}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs sm:text-sm text-[var(--primaryColor)] hover:underline"
                >
                  {translations.markAllRead}
                </button>
              )}
            </div>
          </div>
          <div className="max-h-[269px] sm:max-h-[358px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-3 sm:p-4 text-center text-[var(--text-muted)] text-sm">
                {translations.noNotifications}
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  locale={locale}
                  translations={translations.itemActions}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))
            )}
          </div>
          <div className="p-3 sm:p-4 border-t border-[var(--border)] bg-[var(--control-bg)]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-[var(--text)] hover:bg-[var(--control-bg)] text-xs sm:text-sm"
              onClick={() => {
                /* Navigate to notifications page */
              }}
            >
              <IconSettings className="w-3 h-3 sm:w-4 sm:h-4 me-1 sm:me-2 rtl:ml-1 rtl:sm:ml-2 rtl:me-0 rtl:sm:me-0" />
              {translations.notificationSettings}
            </Button>
          </div>
        </div>
      )}
    />
  );
}
