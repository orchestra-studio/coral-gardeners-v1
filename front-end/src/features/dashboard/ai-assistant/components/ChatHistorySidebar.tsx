"use client";

import React from "react";
import Sheet from "@/components/ui/Sheet";
import SessionList from "@/features/dashboard/ai-assistant/ui-elements/SessionList";
import { ChatSession } from "@/types/ai-chat";

interface ChatHistorySidebarProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sessions: ChatSession[];
  onSelectSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
  onArchiveSession: (sessionId: number) => void;
  onRenameSession?: (sessionId: number, newTitle: string) => void;
}

export default function ChatHistorySidebar({
  open,
  onClose,
  title,
  sessions,
  onSelectSession,
  onDeleteSession,
  onArchiveSession,
  onRenameSession,
}: ChatHistorySidebarProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={320}
      contentClassName="p-3 "
    >
      <SessionList
        sessions={sessions}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onArchiveSession={onArchiveSession}
        onRenameSession={onRenameSession}
      />
    </Sheet>
  );
}
