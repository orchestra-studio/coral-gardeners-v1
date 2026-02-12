"use client";

import React from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { UserChangePasswordFormData } from "./types";

interface UserChangePasswordFormProps {
  errors: FieldErrors<UserChangePasswordFormData>;
  register: UseFormRegister<UserChangePasswordFormData>;
  watch: UseFormWatch<UserChangePasswordFormData>;
  setValue: UseFormSetValue<UserChangePasswordFormData>;
}

export const UserChangePasswordForm: React.FC<UserChangePasswordFormProps> = ({
  errors,
  register,
  setValue,
}) => {
  const t = useTranslations("dashboard/settings/security");

  // Wrapper function to handle setValue with proper typing
  const handleSetValue = (name: string, value: string) => {
    if (name === "newPassword" || name === "confirmPassword") {
      setValue(name as keyof UserChangePasswordFormData, value);
    }
  };

  return (
    <>
      {/* Password Form */}
      <div className="flex flex-col gap-6">
        {/* New Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("newPassword")}
            type="password"
            label={t("newPassword")}
            placeholder={t("newPasswordPlaceholder")}
            error={errors.newPassword?.message}
            showPasswordGenerator={true}
            setValue={handleSetValue}
            confirmationFieldName="confirmPassword"
          />

          <Input
            {...register("confirmPassword")}
            type="password"
            label={t("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>
    </>
  );
};
