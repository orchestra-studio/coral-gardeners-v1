"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { FormField, Textarea, InfoBox } from "@/components/Form";
import type { ProjectFormData } from "../types";

interface ArabicFieldsProps {
  formData: ProjectFormData;
  isEnglishComplete: boolean;
  onInputChange: (field: keyof ProjectFormData, value: string | null) => void;
}

export default function ArabicFields({
  formData,
  isEnglishComplete,
  onInputChange,
}: ArabicFieldsProps) {
  const t = useTranslations("dashboard/projects");

  return (
    <div className="space-y-4">
      {!isEnglishComplete && (
        <InfoBox
          type="info"
          title="Complete English fields first"
          message="English translations are required before adding Arabic translations."
        />
      )}

      <FormField label={t("form.fields.name.label") + " (عربي)"} dir="rtl">
        <Input
          placeholder={t("form.fields.name.placeholder")}
          value={formData.name_ar}
          onChange={(e) => onInputChange("name_ar", e.target.value)}
          disabled={!isEnglishComplete}
          dir="rtl"
        />
      </FormField>

      <FormField
        label={t("form.fields.description.label") + " (عربي)"}
        dir="rtl"
      >
        <Textarea
          placeholder={t("form.fields.description.placeholder")}
          value={formData.description_ar}
          onChange={(e) => onInputChange("description_ar", e.target.value)}
          rows={4}
          disabled={!isEnglishComplete}
          dir="rtl"
        />
      </FormField>

      {isEnglishComplete && (
        <InfoBox
          type="info"
          message="Leave empty to use English translations as fallback"
        />
      )}
    </div>
  );
}
