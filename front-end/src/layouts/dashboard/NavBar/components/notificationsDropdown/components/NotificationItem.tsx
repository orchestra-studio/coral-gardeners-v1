import { IconCheck, IconX } from "@tabler/icons-react";
import { Notification, NotificationItemTranslations } from "../types";
import { getTypeColor } from "../data";
import IconButton from "@/components/ui/iconButton";

interface NotificationItemProps {
  notification: Notification;
  locale: string;
  translations: NotificationItemTranslations;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function NotificationItem({
  notification,
  locale,
  translations,
  onMarkAsRead,
  onRemove,
}: NotificationItemProps) {
  return (
    <div
      className={`p-3 sm:p-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors ${
        !notification.isRead ? "bg-[var(--surface-hover)]/50" : ""
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Type indicator */}
        <div
          className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${getTypeColor(
            notification.type
          )}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--text)] text-xs sm:text-sm leading-tight text-start">
            {notification.title[locale as keyof typeof notification.title]}
          </h4>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-0.5 sm:mt-1 leading-relaxed text-start">
            {notification.message[locale as keyof typeof notification.message]}
          </p>
          <p className="text-[var(--text-muted)] text-[10px] sm:text-xs mt-1 sm:mt-2 text-start">
            {notification.time}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {!notification.isRead && (
            <IconButton
              onClick={() => onMarkAsRead(notification.id)}
              size="sm"
              className="text-[var(--text-muted)] hover:text-[var(--text)]"
              title={translations.markAsRead}
            >
              <IconCheck className="w-3 h-3" />
            </IconButton>
          )}
          <IconButton
            onClick={() => onRemove(notification.id)}
            size="sm"
            className="text-[var(--text-muted)] hover:text-[var(--errorColor)]"
            title={translations.remove}
          >
            <IconX className="w-3 h-3" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
