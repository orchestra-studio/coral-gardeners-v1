"use client";

import React from "react";
import { usePermission } from "@/hooks/permissions";
import AIAssistantPage from "@/features/dashboard/ai-assistant/AIAssistantPage";
import EmptyState from "@/components/EmptyState";
import { IconLock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const { hasPermission } = usePermission();
  const t = useTranslations("ai-assistant");
  const canUseAI = hasPermission("ai_chat.use");

  if (!canUseAI) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={<IconLock className="w-full h-full text-[var(--text-muted)]" />}
          title={t("no_permission_title") || "Access Denied"}
          description={
            t("no_permission_description") ||
            "You don't have permission to access the AI Assistant."
          }
        />
      </div>
    );
  }

  return <AIAssistantPage />;
}
