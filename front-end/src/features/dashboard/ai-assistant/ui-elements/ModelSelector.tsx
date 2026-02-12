"use client";

import { Select, SelectOption } from "@/components/ui/input";
import { LLMModel, LLMProvider } from "@/types/ai-chat";
import { IconCpu } from "@tabler/icons-react";

interface ModelSelectorProps {
  providers: LLMProvider[];
  models: LLMModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  // Convert models to select options
  const modelOptions: SelectOption[] = models.map((model) => ({
    value: model.id,
    label: model.name,
    description: `${model.contextWindow.toLocaleString()} tokens`,
    icon: <IconCpu className="h-4 w-4" />,
  }));

  return (
    <Select
      options={modelOptions}
      value={selectedModel}
      onChange={(value) => onModelChange(value as string)}
      disabled={disabled}
      usePortal={false}
      placeholder="Select a model..."
      variant="ghost"
      triggerClassName="border-none "
    />
  );
}
