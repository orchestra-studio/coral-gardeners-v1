import React from "react";
import {
  FieldErrors,
  UseFormRegister,
  Controller,
  Control,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import { useCountriesForSelect } from "@/services/helpers";
import { ProfileFormData } from "../types";

interface ProfileFormProps {
  isEditing: boolean;
  errors: FieldErrors<ProfileFormData>;
  register: UseFormRegister<ProfileFormData>;
  control: Control<ProfileFormData>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  isEditing,
  errors,
  register,
  control,
}) => {
  const t = useTranslations("dashboard/settings/profile");

  // Get countries for dropdown
  const { data: countriesData, isLoading: countriesLoading } =
    useCountriesForSelect();

  // Prepare country options
  const countryOptions = [
    { value: "", label: t("form.country.none") },
    ...(countriesData || []).map((country) => ({
      value: country.value, // Keep as number - Select component handles both types
      label: country.label,
    })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          {...register("first_name")}
          label={t("form.firstName.label")}
          placeholder={t("form.firstName.placeholder")}
          disabled={!isEditing}
          error={errors.first_name?.message}
        />
      </div>

      <div>
        <Input
          {...register("last_name")}
          label={t("form.lastName.label")}
          placeholder={t("form.lastName.placeholder")}
          disabled={!isEditing}
          error={errors.last_name?.message}
        />
      </div>

      <div>
        <Input
          {...register("email")}
          type="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          disabled={!isEditing}
          error={errors.email?.message}
        />
      </div>

      <div>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              label={t("form.phone.label")}
              placeholder={t("form.phone.placeholder")}
              disabled={!isEditing}
              error={errors.phone?.message}
              value={field.value}
              onChange={field.onChange}
              defaultCountry="US"
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="country_id"
          control={control}
          render={({ field }) => (
            <Select
              label={t("form.country.label")}
              placeholder={
                countriesLoading
                  ? "Loading countries..."
                  : t("form.country.placeholder")
              }
              options={countryOptions}
              value={field.value || ""}
              onChange={(value: string | number) => {
                // Select component handles both string and number values properly
                field.onChange(value === "" ? null : value);
              }}
              error={errors.country_id?.message}
              disabled={!isEditing || countriesLoading}
            />
          )}
        />
      </div>
    </div>
  );
};
