"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FormSheet, FormField } from "@/components/Form";
import { useProjectForm } from "./hooks/useProjectForm";
import { useFormOptions } from "./config";
import ImageUploader from "@/components/ImageUploader";
import MultiLanguageInput from "@/components/ui/input/MultiLanguageInput";
import MultiLanguageTextArea from "@/components/ui/input/MultiLanguageTextArea";
import StatusEnvironmentFields from "./components/StatusEnvironmentFields";
import { IconPhoto } from "@tabler/icons-react";
import type { CreateProjectFormProps } from "./types";

export default function CreateProjectForm({
  open,
  onClose,
  project,
}: CreateProjectFormProps) {
  const t = useTranslations("dashboard/projects");
  const tCommon = useTranslations("common");
  const { environmentOptions, statusOptions } = useFormOptions();

  const {
    formData,
    errors,
    handleInputChange,
    handleMultiLanguageChange,
    handleSubmit,
    handleClose,
    isSubmitting,
    isEditMode,
  } = useProjectForm(onClose, project);

  return (
    <FormSheet
      open={open}
      onClose={handleClose}
      title={isEditMode ? t("form.title.edit") : t("form.title.create")}
      onSubmit={handleSubmit}
      submitLabel={
        isEditMode ? t("form.actions.update") : t("form.actions.create")
      }
      cancelLabel={t("form.actions.cancel")}
      isSubmitting={isSubmitting}
      submitLoadingText={
        isEditMode ? t("form.actions.update") : t("form.actions.create")
      }
    >
      {/* Project Image */}
      <FormField label={t("form.fields.image.label")}>
        <ImageUploader
          value={formData.image}
          onChange={(url) => handleInputChange("image", url)}
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

      {/* Project Name - Multi-language */}
      <MultiLanguageInput
        label={t("form.fields.name.label")}
        value={{
          en: formData.name_en,
          ar: formData.name_ar,
        }}
        onChange={(value) => handleMultiLanguageChange("name", value)}
        placeholder={{
          en: t("form.fields.name.placeholder"),
          ar: t("form.fields.name.placeholder"),
        }}
        error={errors.name_en}
        required
      />

      {/* Description - Multi-language */}
      <MultiLanguageTextArea
        label={t("form.fields.description.label")}
        value={{
          en: formData.description_en,
          ar: formData.description_ar,
        }}
        onChange={(value) => handleMultiLanguageChange("description", value)}
        placeholder={{
          en: t("form.fields.description.placeholder"),
          ar: t("form.fields.description.placeholder"),
        }}
        error={errors.description_en}
        required
      />

      {/* Status and Environment Row */}
      <StatusEnvironmentFields
        status={formData.status}
        environment={formData.environment_en}
        statusOptions={statusOptions}
        environmentOptions={environmentOptions}
        onChange={handleInputChange}
        error={errors.environment_en}
      />
    </FormSheet>
  );
}
