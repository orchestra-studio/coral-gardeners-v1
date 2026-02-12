"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { InlineEdit } from "@/components/ui/InlineEdit";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface InlineEditDemoProps {
  className?: string;
}

export default function InlineEditDemo({ className }: InlineEditDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userName, setUserName] = useState("John Doe");

  return (
    <DemoCard
      title={t("components.inlineEdit.title")}
      description={t("components.inlineEdit.description")}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <div className="group">
          <label className="text-sm font-medium text-[var(--text)] block mb-2">
            {t("components.inlineEdit.labels.userName")}
          </label>
          <InlineEdit
            value={userName}
            isEditing={editingId === "userName"}
            onEdit={() => setEditingId("userName")}
            onSave={(value) => {
              setUserName(value);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
            placeholder={t("components.inlineEdit.placeholders.enterName")}
          />
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [editing, setEditing] = useState(false);
const [value, setValue] = useState("John Doe");

<InlineEdit
  value={value}
  isEditing={editing}
  onEdit={() => setEditing(true)}
  onSave={(newValue) => {
    setValue(newValue);
    setEditing(false);
  }}
  onCancel={() => setEditing(false)}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
