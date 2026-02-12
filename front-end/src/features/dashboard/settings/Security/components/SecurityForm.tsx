import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/Notice";
import { SecurityFormData } from "../types";

interface SecurityFormProps {
  errors: FieldErrors<SecurityFormData>;
  register: UseFormRegister<SecurityFormData>;
  isSubmitting: boolean;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({
  errors,
  register,
  isSubmitting,
}) => {
  const t = useTranslations("dashboard/settings/security");

  return (
    <>
      {/* Password Form */}
      <div className="flex flex-col gap-6">
        {/* Current Password - Half Width on its own row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("currentPassword")}
            type="password"
            label={t("currentPassword")}
            placeholder={t("currentPasswordPlaceholder")}
            error={errors.currentPassword?.message}
          />
        </div>

        {/* New Password and Confirm Password - Half Width Each */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("newPassword")}
            type="password"
            label={t("newPassword")}
            placeholder={t("newPasswordPlaceholder")}
            error={errors.newPassword?.message}
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

      {/* Security Notice */}
      <div className="grid grid-cols-1">
        <Notice variant="warning" title={t("securityNotice")}>
          <p className="text-sm">{t("securityNoticeDescription")}</p>
        </Notice>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="min-w-32"
          size="sm"
        >
          {t("changePassword")}
        </Button>
      </div>
    </>
  );
};
