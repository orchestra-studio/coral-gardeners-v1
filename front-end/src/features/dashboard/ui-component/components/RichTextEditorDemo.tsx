"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import RichTextEditor from "@/components/ui/input/RichTextEditor";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface RichTextEditorDemoProps {
  className?: string;
}

export default function RichTextEditorDemo({
  className,
}: RichTextEditorDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [content, setContent] = useState<Record<string, string>>({
    en: "<p>Enter your content here...</p>",
    ar: "<p>أدخل المحتوى الخاص بك هنا...</p>",
  });

  return (
    <DemoCard
      title={t("components.richTextEditor.title")}
      description={t("components.richTextEditor.description")}
      className={className}
    >
      <RichTextEditor
        label={t("components.richTextEditor.labels.editor")}
        value={content}
        onChange={setContent}
        placeholder={{
          en: "Enter text in English...",
          ar: "أدخل النص بالعربية...",
        }}
      />

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [content, setContent] = useState({
  en: "<p>Enter your content...</p>",
  ar: "<p>أدخل المحتوى...</p>"
});

<RichTextEditor
  label="Content"
  value={content}
  onChange={setContent}
  placeholder={{
    en: "Enter text in English...",
    ar: "أدخل النص بالعربية..."
  }}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
