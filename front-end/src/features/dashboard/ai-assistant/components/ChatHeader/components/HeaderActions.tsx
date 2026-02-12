"use client";

import { IconHistory, IconPlus } from "@tabler/icons-react";
import IconButton from "@/components/ui/iconButton";

interface HeaderActionsProps {
  historyLabel: string;
  newChatLabel: string;
  onHistoryClick: () => void;
  onNewChatClick: () => void;
}

export function HeaderActions({
  historyLabel,
  newChatLabel,
  onHistoryClick,
  onNewChatClick,
}: HeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton
        aria-label={historyLabel}
        title={historyLabel}
        onClick={onHistoryClick}
      >
        <IconHistory className="h-4 w-4" />
      </IconButton>
      <IconButton
        aria-label={newChatLabel}
        title={newChatLabel}
        onClick={onNewChatClick}
      >
        <IconPlus className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
