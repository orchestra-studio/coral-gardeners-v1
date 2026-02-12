"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { FormField, Textarea } from "@/components/Form";
import ImageUploader from "@/components/ImageUploader";
import { IconPhoto } from "@tabler/icons-react";
import type { ProjectFormData } from "../types";

interface EnglishFieldsProps {
  formData: ProjectFormData;
  errors: Partial<Record<keyof ProjectFormData, string>>;
  onInputChange: (field: keyof ProjectFormData, value: string | null) => void;
}

export default function EnglishFields({
  formData,
  errors,
  onInputChange,
}: EnglishFieldsProps) {
  const t = useTranslations("dashboard/projects");
  const tCommon = useTranslations("common");

  return (
    <div className="space-y-4">
      <FormField label={t("form.fields.image.label")}>
        <ImageUploader
          value={formData.image}
          onChange={(url) => onInputChange("image", url)}
          path="projects/images"
          sizePreset="cover"
          previewSize={80}
          uploadLabel={tCommon("ImageUploader.chooseImage")}
          placeholderIcon={
            <IconPhoto
              size={40}
              className="text-[var(--text-muted)]"
              stroke={1.5}
            />
          }
        />
      </FormField>

      <FormField
        label={t("form.fields.name.label")}
        error={errors.name_en}
        required
      >
        <Input
          placeholder={t("form.fields.name.placeholder")}
          value={formData.name_en}
          onChange={(e) => onInputChange("name_en", e.target.value)}
        />
      </FormField>

      <FormField
        label={t("form.fields.description.label")}
        error={errors.description_en}
        required
      >
        <Textarea
          placeholder={t("form.fields.description.placeholder")}
          value={formData.description_en}
          onChange={(e) => onInputChange("description_en", e.target.value)}
          rows={4}
        />
      </FormField>
    </div>
  );
}
