"use client";

import React from "react";
import { Tabs } from "@/components/ui/Tabs";
import { IconLanguage, IconCircleCheck } from "@tabler/icons-react";

export interface Language {
  code: string;
  label: string;
  required?: boolean;
}

export interface TranslatableFormSectionProps {
  languages: Language[];
  activeLanguage: string;
  onLanguageChange: (language: string) => void;
  isLanguageComplete?: (language: string) => boolean;
  title?: string;
  requiredLanguageMessage?: string;
  optionalLanguageMessage?: string;
  children: React.ReactNode;
  completionIndicator?: boolean;
}

/**
 * TranslatableFormSection - A reusable component for forms with multi-language support
 *
 * @example
 * ```tsx
 * <TranslatableFormSection
 *   languages={[
 *     { code: 'en', label: 'English', required: true },
 *     { code: 'ar', label: 'Arabic' }
 *   ]}
 *   activeLanguage={activeTab}
 *   onLanguageChange={setActiveTab}
 *   isLanguageComplete={(lang) => lang === 'en' ? !!formData.name_en : false}
 *   title="Translations"
 * >
 *   {activeTab === 'en' ? <EnglishFields /> : <ArabicFields />}
 * </TranslatableFormSection>
 * ```
 */
export default function TranslatableFormSection({
  languages,
  activeLanguage,
  onLanguageChange,
  isLanguageComplete,
  title = "Translations",
  requiredLanguageMessage = "Required fields",
  optionalLanguageMessage = "Optional fields (will fallback to primary language)",
  children,
  completionIndicator = true,
}: TranslatableFormSectionProps) {
  const activeLanguageConfig = languages.find(
    (lang) => lang.code === activeLanguage
  );

  const languageTabs = languages.map((lang) => ({
    id: lang.code,
    label: lang.label,
    icon: IconLanguage,
  }));

  const showCompletionIndicator =
    completionIndicator &&
    !activeLanguageConfig?.required &&
    isLanguageComplete &&
    isLanguageComplete(languages.find((l) => l.required)?.code || "");

  return (
    <div className="border-b border-[var(--border)] pb-4">
      {/* Header with title and completion indicator */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {activeLanguageConfig?.required
              ? requiredLanguageMessage
              : optionalLanguageMessage}
          </p>
        </div>

        {showCompletionIndicator && (
          <div className="flex items-center gap-2 text-xs text-[var(--trend-growth)]">
            <IconCircleCheck size={16} />
            <span>Primary Language Complete</span>
          </div>
        )}
      </div>

      {/* Language Tabs */}
      <Tabs
        items={languageTabs}
        value={activeLanguage}
        onValueChange={onLanguageChange}
        variant="pill"
        size="sm"
        containerClassName="justify-start"
      />

      {/* Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
