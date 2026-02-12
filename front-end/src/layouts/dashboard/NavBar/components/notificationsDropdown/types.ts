export interface NotificationText {
  ar: string;
  en: string;
}

export interface Notification {
  id: string;
  title: NotificationText;
  message: NotificationText;
  time: string;
  isRead: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface NotificationItemTranslations {
  markAsRead: string;
  remove: string;
}

export interface NotificationDropdownTranslations {
  title: string;
  markAllRead: string;
  noNotifications: string;
  notificationSettings: string;
  ariaLabel: string;
  itemActions: NotificationItemTranslations;
}

export interface NotificationDropdownProps {
  translations: NotificationDropdownTranslations;
  className?: string;
}
