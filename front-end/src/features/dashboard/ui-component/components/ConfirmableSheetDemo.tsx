"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ConfirmableSheet from "@/components/ConfirmableSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface ConfirmableSheetDemoProps {
  className?: string;
}

export default function ConfirmableSheetDemo({
  className,
}: ConfirmableSheetDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (value: string) => {
    setFormData(value);
    setHasUnsavedChanges(value.length > 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData("");
    setHasUnsavedChanges(false);
  };

  return (
    <DemoCard
      title={t("components.confirmableSheet.title")}
      description={t("components.confirmableSheet.description")}
      className={className}
    >
      <div className="flex justify-center">
        <Button onClick={() => setIsOpen(true)}>
          {t("components.confirmableSheet.labels.openSheet")}
        </Button>
      </div>

      <ConfirmableSheet
        open={isOpen}
        onClose={handleClose}
        title={t("components.confirmableSheet.labels.editForm")}
        side="end"
        hasUnsavedChanges={hasUnsavedChanges}
        confirmationMessages={{
          title: t("components.confirmableSheet.messages.discardTitle"),
          text: t("components.confirmableSheet.messages.discardText"),
          confirmButtonText: t(
            "components.confirmableSheet.labels.discardButton"
          ),
          cancelButtonText: t(
            "components.confirmableSheet.labels.cancelButton"
          ),
        }}
      >
        <div className="p-6">
          <Input
            label={t("components.confirmableSheet.labels.name")}
            value={formData}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t(
              "components.confirmableSheet.placeholders.enterName"
            )}
          />

          <p className="text-xs text-[var(--text-muted)] mt-4">
            {t("components.confirmableSheet.messages.tryClosing")}
          </p>
        </div>
      </ConfirmableSheet>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

<ConfirmableSheet
  open={isOpen}
  onClose={handleClose}
  title="Edit Form"
  hasUnsavedChanges={hasUnsavedChanges}
  confirmationMessages={{
    title: "Discard changes?",
    text: "You have unsaved changes. Continue?",
    confirmButtonText: "Discard",
    cancelButtonText: "Cancel"
  }}
>
  <div className="p-6">
    <Input
      value={formData}
      onChange={(e) => setFormData(e.target.value)}
    />
  </div>
</ConfirmableSheet>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
