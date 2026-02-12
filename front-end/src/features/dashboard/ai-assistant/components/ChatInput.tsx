"use client";

import React from "react";
import { UseFormRegister } from "react-hook-form";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/features/dashboard/ai-assistant/ui-elements/prompt-input";

interface ChatFormData {
  message: string;
}

interface ChatInputProps {
  register: UseFormRegister<ChatFormData>;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  disabled?: boolean;
  hasContent?: boolean;
  status?: "ready" | "submitted" | "streaming" | "error";
  centered?: boolean;
  onStop?: () => void;
}

export default function ChatInput({
  register,
  onSubmit,
  placeholder,
  disabled = false,
  hasContent = false,
  status = "ready",
  centered = false,
  onStop,
}: ChatInputProps) {
  // When streaming, button should be enabled to allow stopping
  // Otherwise, button is disabled if no text or explicitly disabled
  const isButtonDisabled =
    status === "streaming" ? false : disabled || !hasContent;

  return (
    <PromptInput
      onSubmit={onSubmit}
      className="mx-auto w-full bg-[var(--surface)] shadow-none z-1"
    >
      <PromptInputTextarea
        {...register("message")}
        placeholder={placeholder}
        disabled={disabled}
        autoFocusOnMount
      />
      <PromptInputSubmit
        disabled={isButtonDisabled}
        status={status}
        onClick={status === "streaming" ? onStop : undefined}
      />
    </PromptInput>
  );
}
