"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import MultiLanguageInput from "@/components/ui/input/MultiLanguageInput";
import MultiLanguageTextArea from "@/components/ui/input/MultiLanguageTextArea";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface MultiLanguageInputDemoProps {
  className?: string;
}

export default function MultiLanguageInputDemo({
  className,
}: MultiLanguageInputDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [title, setTitle] = useState<Record<string, string>>({
    en: "",
    ar: "",
  });
  const [description, setDescription] = useState<Record<string, string>>({
    en: "",
    ar: "",
  });

  return (
    <DemoCard
      title={t("components.multiLanguageInput.title")}
      description={t("components.multiLanguageInput.description")}
      className={className}
    >
      {/* Multi-Language Input */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
          {t("components.multiLanguageInput.sections.input")}
        </h4>
        <MultiLanguageInput
          label={t("components.multiLanguageInput.labels.title")}
          value={title}
          onChange={setTitle}
          placeholder={{
            en: "Enter title in English...",
            ar: "أدخل العنوان بالعربية...",
          }}
        />
      </div>

      {/* Multi-Language TextArea */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
          {t("components.multiLanguageInput.sections.textarea")}
        </h4>
        <MultiLanguageTextArea
          label={t("components.multiLanguageInput.labels.description")}
          value={description}
          onChange={setDescription}
          placeholder={{
            en: "Enter description in English...",
            ar: "أدخل الوصف بالعربية...",
          }}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Multi-Language Input
<MultiLanguageInput
  label="Title"
  value={title}
  onChange={setTitle}
  placeholder={{
    en: "Enter title in English...",
    ar: "أدخل العنوان بالعربية..."
  }}
/>

// Multi-Language TextArea
<MultiLanguageTextArea
  label="Description"
  value={description}
  onChange={setDescription}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
