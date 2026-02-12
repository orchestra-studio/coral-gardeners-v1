"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import TextArea from "./TextArea";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { useLocale } from "@/hooks/locale/useLocale";
import * as LabelPrimitive from "@radix-ui/react-label";

export interface MultiLanguageTextAreaProps {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: Record<string, string>;
  error?: string | Record<string, string | undefined>;
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
  maxLength?: number;
  textareaClassName?: string;
  id?: string; // Optional ID for accessibility
}

const languageTabs: TabItem<"en" | "ar">[] = [
  {
    id: "en",
    label: "ENGLISH",
    className:
      "flex-1 max-w-[90px] rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-none border-e! border-b!",
  },
  {
    id: "ar",
    label: "عربي",
    className:
      "flex-1 max-w-[90px] rounded-tr-md rounded-tl-none rounded-br-none rounded-bl-none border-s-0! border-b!",
  },
];

export default function MultiLanguageTextArea({
  value = {},
  onChange,
  onBlur,
  label,
  placeholder = {},
  error,
  disabled = false,
  required = false,
  containerClassName,
  maxLength,
  textareaClassName,
  id,
}: MultiLanguageTextAreaProps) {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"en" | "ar">(
    (locale as "en" | "ar") || "en"
  );

  // Generate ID at top level
  const generatedId = React.useId();
  const labelId = id || generatedId;
  const enErrorId = `${labelId}-en-error`;
  const arErrorId = `${labelId}-ar-error`;

  // Update active tab when locale changes
  useEffect(() => {
    if (locale === "en" || locale === "ar") {
      setActiveTab(locale);
    }
  }, [locale]);

  // Reorder tabs based on locale - active locale first
  const orderedTabs =
    locale === "ar" ? [...languageTabs].reverse() : languageTabs;

  // Ensure value is always an object
  const objectValue =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};

  const handleLanguageChange = (
    lang: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({
      ...objectValue,
      [lang]: e.target.value,
    });
  };

  // Get error for specific language or use general error
  const getErrorForLanguage = (lang: "en" | "ar"): string | undefined => {
    if (!error) return undefined;

    // If error is an object with language-specific errors
    if (typeof error === "object" && error[lang]) {
      return error[lang];
    }

    // If error is a string, show it for all languages
    if (typeof error === "string") {
      return error;
    }

    return undefined;
  };

  const enError = getErrorForLanguage("en");
  const arError = getErrorForLanguage("ar");

  // Calculate character count
  const enLength = objectValue.en?.length || 0;
  const arLength = objectValue.ar?.length || 0;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <LabelPrimitive.Root
          htmlFor={labelId}
          className="block text-sm font-medium text-[var(--text)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--destructive)]"> *</span>}
        </LabelPrimitive.Root>
      )}

      {/* Language Tabs */}
      <Tabs
        items={orderedTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        variant="minimal"
        size="xs"
        containerClassName="gap-0 justify-start"
        tabClassName="border border-[var(--border)]"
        activeTabClassName="border-b-2! border-b-[var(--primaryColor)]! bg-[var(--primaryColor)]/5"
        inactiveTabClassName="border-b-2! border-b-[var(--border)]! hover:border-b-[var(--primaryColor)]/50"
      />

      {/* Tab Content - Pass error only for border styling, not for message display */}
      <div className="-mt-px">
        {activeTab === "en" && (
          <div className="relative">
            {/* Hide textarea top border under both tabs to avoid double border */}
            <div className="absolute top-0 start-0 w-[180px] h-px bg-[var(--surface)] z-10" />
            <TextArea
              value={objectValue.en || ""}
              onChange={(e) => handleLanguageChange("en", e)}
              onBlur={onBlur}
              placeholder={placeholder.en || "Enter text..."}
              disabled={disabled}
              error={enError ? " " : undefined}
              className={cn(
                "rounded-tl-none rounded-tr-md rounded-b-md",
                textareaClassName
              )}
              maxLength={maxLength}
            />
            {maxLength && (
              <div
                className="absolute end-3 bottom-3 text-xs"
                style={{
                  color:
                    maxLength && enLength > maxLength * 0.9
                      ? "var(--errorColor)"
                      : "var(--text-muted)",
                }}
              >
                {enLength} / {maxLength}
              </div>
            )}
          </div>
        )}
        {activeTab === "ar" && (
          <div className="relative" dir="rtl">
            {/* Hide textarea top border under both tabs to avoid double border */}
            <div className="absolute top-0 end-0 w-[180px] h-px bg-[var(--surface)] z-10" />
            <TextArea
              value={objectValue.ar || ""}
              onChange={(e) => handleLanguageChange("ar", e)}
              onBlur={onBlur}
              placeholder={placeholder.ar || "أدخل النص..."}
              disabled={disabled}
              error={arError ? " " : undefined}
              dir="rtl"
              className={cn(
                "rounded-tl-none rounded-tr-md rounded-b-md",
                textareaClassName
              )}
              maxLength={maxLength}
            />
            {maxLength && (
              <div
                className="absolute start-3 bottom-3 text-xs"
                style={{
                  color:
                    maxLength && arLength > maxLength * 0.9
                      ? "var(--errorColor)"
                      : "var(--text-muted)",
                }}
                dir="rtl"
              >
                {arLength} / {maxLength}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show all errors below the input */}
      {(enError || arError) && (
        <div className="mt-1 space-y-1">
          {enError && (
            <p
              id={enErrorId}
              className="text-sm text-[var(--errorColor)] flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <span className="font-medium">EN:</span> {enError}
            </p>
          )}
          {arError && (
            <p
              id={arErrorId}
              className="text-sm text-[var(--errorColor)] flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <span className="font-medium">AR:</span> {arError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
