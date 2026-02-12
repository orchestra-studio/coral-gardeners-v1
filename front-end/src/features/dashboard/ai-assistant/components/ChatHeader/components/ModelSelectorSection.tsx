"use client";

import ModelSelector from "@/features/dashboard/ai-assistant/ui-elements/ModelSelector";
import Skeleton from "@/components/ui/Skeleton";
import { usePermission } from "@/hooks/permissions";
import type { LLMModel, LLMProvider } from "@/types/ai-chat";

interface ModelSelectorSectionProps {
  providers: LLMProvider[];
  models: LLMModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ModelSelectorSection({
  providers,
  models,
  selectedModel,
  onModelChange,
  disabled = false,
  loading = false,
}: ModelSelectorSectionProps) {
  const { hasPermission } = usePermission();
  const canViewModels = hasPermission("ai_chat.view_models");

  if (loading) {
    return (
      <Skeleton
        width="176px"
        height="27px"
        className="rounded-2xl mt-2"
        rounded="lg"
      />
    );
  }

  // Don't show model selector if user doesn't have permission
  if (!canViewModels || models.length === 0) {
    return null;
  }

  return (
    <ModelSelector
      providers={providers}
      models={models}
      selectedModel={selectedModel}
      onModelChange={onModelChange}
      disabled={disabled}
    />
  );
}
