"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { IconLock } from "@tabler/icons-react";

// Local imports
import { SecurityFormData } from "./types";
import { createSecurityValidationSchema } from "./validation";
import { useSecurity } from "./hooks/useSecurity";
import { SecurityForm } from "./components";
import { SettingsHeader } from "@/layouts/dashboard/settings";

interface SecurityContentProps {
  className?: string;
}

export default function SecurityContent({
  className = "",
}: SecurityContentProps) {
  const tSecurity = useTranslations("dashboard/settings/security");
  const { changePassword, isChangingPassword } = useSecurity();

  const methods = useForm<SecurityFormData>({
    resolver: yupResolver(createSecurityValidationSchema(tSecurity)) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = methods;

  const onSubmit = async (data: SecurityFormData) => {
    await changePassword(data, () => reset());
  };

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl  p-6 ${className}`}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <SettingsHeader
            translationNamespace="dashboard/settings/security"
            titleKey="changePassword"
            descriptionKey="changePasswordDescription"
            icon={IconLock}
            showIconBackground={true}
          />

          <SecurityForm
            errors={errors}
            register={register}
            isSubmitting={isChangingPassword}
          />
        </form>
      </FormProvider>
    </div>
  );
}
