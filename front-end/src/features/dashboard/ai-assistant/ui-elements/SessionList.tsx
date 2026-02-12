"use client";

import React, { useState } from "react";
import { ChatSession } from "@/types/ai-chat";
import { cn } from "@/lib/utils";
import {
  IconMessageCircle,
  IconTrash,
  IconArchive,
  IconDots,
  IconEdit,
} from "@tabler/icons-react";
import IconButton from "@/components/ui/iconButton";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { useTranslations } from "next-intl";
import { useLocaleDateFormatter } from "@/hooks/formatting/useLocaleDateFormatter";

const SESSION_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId?: number;
  onSelectSession: (sessionId: number) => void | Promise<void>;
  onDeleteSession: (sessionId: number) => void;
  onArchiveSession: (sessionId: number) => void;
  onRenameSession?: (sessionId: number, newTitle: string) => void;
}

export default function SessionList({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onArchiveSession,
  onRenameSession,
}: SessionListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const t = useTranslations("ai-assistant");
  const { formatDate: formatSessionDate } = useLocaleDateFormatter({
    options: SESSION_DATE_FORMAT,
  });

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-[var(--text-muted)]">
        {t("no_sessions")}
      </div>
    );
  }

  const handleRename = (sessionId: number, newTitle: string) => {
    if (onRenameSession && newTitle.trim()) {
      onRenameSession(sessionId, newTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-1 p-2 px-0">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
            editingId !== session.id &&
              "cursor-pointer hover:bg-[var(--surface-hover)]",
            activeSessionId === session.id &&
              "bg-[var(--selected-bg)] text-[var(--selected-text)]"
          )}
          onClick={async () => {
            if (editingId !== session.id) {
              await onSelectSession(session.id);
            }
          }}
        >
          <IconMessageCircle className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 overflow-hidden min-w-0">
            {onRenameSession ? (
              <InlineEdit
                value={session.title?.trim() || t("untitled_session")}
                isEditing={editingId === session.id}
                onEdit={() => setEditingId(session.id)}
                onSave={(newTitle) => handleRename(session.id, newTitle)}
                onCancel={() => setEditingId(null)}
                placeholder={t("rename_session_placeholder")}
                maxLength={100}
                renderEditTrigger={() => null}
              />
            ) : (
              <p className={cn("truncate text-sm font-medium text-start")}>
                {session.title?.trim() || t("untitled_session")}
              </p>
            )}
            {editingId !== session.id && (
              <p className={cn("text-xs text-[var(--text-muted)] text-start")}>
                {formatSessionDate(session.updated_at)}
              </p>
            )}
          </div>
          {editingId !== session.id && (
            <div className="opacity-0 group-hover:opacity-100">
              <DropdownMenu
                portal
                align="right"
                menuClassName="min-w-[160px] text-start"
                trigger={({ toggle }) => (
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                  >
                    <IconDots size={16} className="rotate-90" />
                  </IconButton>
                )}
                items={[
                  ...(onRenameSession
                    ? [
                        {
                          icon: <IconEdit size={16} />,
                          label: t("rename_session"),
                          onClick: () => setEditingId(session.id),
                        },
                      ]
                    : []),
                  {
                    icon: <IconArchive size={16} />,
                    label: t("archive_session"),
                    onClick: () => onArchiveSession(session.id),
                  },
                  {
                    icon: <IconTrash size={16} />,
                    label: t("delete_session"),
                    onClick: () => onDeleteSession(session.id),
                    danger: true,
                  },
                ]}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
