"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ArrayInput from "@/components/ui/input/ArrayInput";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface ArrayInputDemoProps {
  className?: string;
}

export default function ArrayInputDemo({ className }: ArrayInputDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [tags, setTags] = useState<string[]>(["React", "TypeScript"]);
  const [emails, setEmails] = useState<string[]>([]);

  return (
    <DemoCard
      title={t("components.arrayInput.title")}
      description={t("components.arrayInput.description")}
      className={className}
    >
      <div className="flex flex-col gap-4 max-w-md">
        <ArrayInput
          label={t("components.arrayInput.labels.tags")}
          value={tags}
          onChange={setTags}
          placeholder={t("components.arrayInput.placeholders.addTag")}
          maxItems={5}
        />

        <ArrayInput
          label={t("components.arrayInput.labels.emails")}
          value={emails}
          onChange={setEmails}
          placeholder={t("components.arrayInput.placeholders.addEmail")}
          validateItem={(item) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(item) || "Please enter a valid email";
          }}
          allowDuplicates={false}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [tags, setTags] = useState<string[]>(["React", "TypeScript"]);

<ArrayInput
  label="Tags"
  value={tags}
  onChange={setTags}
  placeholder="Add tag..."
  maxItems={5}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
