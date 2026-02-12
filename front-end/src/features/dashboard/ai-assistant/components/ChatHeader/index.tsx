"use client";

import React from "react";
import { ModelSelectorSection } from "./components/ModelSelectorSection";
import { HeaderActions } from "./components/HeaderActions";
import type { ChatHeaderProps } from "./types";

export default function ChatHeader({
  providers,
  models,
  selectedModel,
  onModelChange,
  onHistoryClick,
  onNewChatClick,
  isLoading = false,
  modelsLoading = false,
  historyLabel,
  newChatLabel,
}: ChatHeaderProps) {
  return (
    <div className="sticky bg-[var(--surface)] lg:bg-transparent rounded-2xl top-21 w-full left-0 right-0 z-10 flex flex-wrap items-center justify-between gap-3 min-h-12 px-4">
      <ModelSelectorSection
        providers={providers}
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        disabled={isLoading}
        loading={modelsLoading}
      />
      <HeaderActions
        historyLabel={historyLabel}
        newChatLabel={newChatLabel}
        onHistoryClick={onHistoryClick}
        onNewChatClick={onNewChatClick}
      />
    </div>
  );
}
