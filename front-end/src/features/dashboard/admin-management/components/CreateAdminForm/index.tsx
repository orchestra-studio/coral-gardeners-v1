"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FormSheet, FormField } from "@/components/Form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import ImageUploader from "@/components/ImageUploader";
import { IconPhoto } from "@tabler/icons-react";
import { useCountriesForSelect } from "@/services/helpers";
import { useAdminForm } from "./hooks/useAdminForm";
import type { CreateAdminFormProps } from "./types";

export default function CreateAdminForm({
  open,
  onClose,
  admin,
}: CreateAdminFormProps) {
  const t = useTranslations("dashboard/settings/adminmanagement");
  const tCommon = useTranslations("common");
  const { data: countries } = useCountriesForSelect();

  const {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    handleClose,
    isSubmitting,
    isEditMode,
  } = useAdminForm(onClose, admin);

  // Format countries for select options
  const countryOptions = React.useMemo(() => {
    if (!countries) return [];
    return countries.map((country) => ({
      value: String(country.value),
      label: country.label,
    }));
  }, [countries]);

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
        isEditMode ? t("form.actions.updating") : t("form.actions.creating")
      }
    >
      {/* Profile Picture */}
      <FormField label={t("form.fields.profileImage.label")}>
        <ImageUploader
          value={formData.profile_picture}
          onChange={(url) => handleInputChange("profile_picture", url)}
          path="admins/profiles"
          sizePreset="profile"
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

      {/* First Name & Last Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("form.fields.firstName.label")}
          error={errors.first_name}
          required
        >
          <Input
            placeholder={t("form.fields.firstName.placeholder")}
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
        </FormField>

        <FormField
          label={t("form.fields.lastName.label")}
          error={errors.last_name}
          required
        >
          <Input
            placeholder={t("form.fields.lastName.placeholder")}
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
          />
        </FormField>
      </div>

      {/* Email */}
      <FormField
        label={t("form.fields.email.label")}
        error={errors.email}
        required
      >
        <Input
          type="email"
          placeholder={t("form.fields.email.placeholder")}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </FormField>

      {/* Password & Confirm Password Row */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label={t("form.fields.password.label")}
          error={errors.password}
          required={!isEditMode}
        >
          <Input
            type="password"
            placeholder={
              isEditMode
                ? t("form.fields.password.hint")
                : t("form.fields.password.placeholder")
            }
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
        </FormField>

        <FormField
          label={t("form.fields.passwordConfirmation.label")}
          error={errors.password_confirmation}
          required={!isEditMode}
        >
          <Input
            type="password"
            placeholder={t("form.fields.passwordConfirmation.placeholder")}
            value={formData.password_confirmation}
            onChange={(e) =>
              handleInputChange("password_confirmation", e.target.value)
            }
          />
        </FormField>
      </div>

      {/* Phone & Country Row */}
      <div className="grid grid-cols-1 gap-4">
        <PhoneInput
          label={t("form.fields.phone.label")}
          placeholder={t("form.fields.phone.placeholder")}
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value || "")}
          defaultCountry="US"
        />

        <Select
          label={t("form.fields.country.label")}
          placeholder={t("form.fields.country.placeholder")}
          options={countryOptions}
          value={formData.country_id ? String(formData.country_id) : ""}
          onChange={(value) =>
            handleInputChange("country_id", value ? Number(value) : null)
          }
          searchable
          usePortal={false}
        />
      </div>
    </FormSheet>
  );
}
