"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { FormSheet, FormField } from "@/components/Form";
import { Input } from "@/components/ui/input";
import { UserChangePasswordFormData } from "./types";
import { createUserChangePasswordValidationSchema } from "./validation";
import type { User } from "@/services/users";

interface UserChangePasswordModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string, data: UserChangePasswordFormData) => void;
  isLoading?: boolean;
}

export const UserChangePasswordModal: React.FC<
  UserChangePasswordModalProps
> = ({ user, isOpen, onClose, onSubmit, isLoading = false }) => {
  const t = useTranslations("dashboard/users");

  const validationSchema = createUserChangePasswordValidationSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = (data: UserChangePasswordFormData) => {
    onSubmit(user.username, data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const fullName = `${user.first_name} ${user.last_name}`.trim();

  // Wrapper function to handle setValue with proper typing
  const handleSetValue = (name: string, value: string) => {
    if (name === "newPassword" || name === "confirmPassword") {
      setValue(name as keyof UserChangePasswordFormData, value);
    }
  };

  return (
    <FormSheet
      open={isOpen}
      onClose={handleClose}
      title={`${t("changePassword.title")} - ${fullName}`}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitLabel={t("changePassword.actions.submit")}
      cancelLabel={t("changePassword.actions.cancel")}
      isSubmitting={isLoading}
      submitLoadingText={t("changePassword.actions.submitting")}
    >
      {/* New Password */}
      <FormField
        label={t("changePassword.newPassword.label")}
        error={errors.newPassword?.message}
        required
      >
        <Input
          {...register("newPassword")}
          type="password"
          placeholder={t("changePassword.newPassword.placeholder")}
          showPasswordGenerator={true}
          setValue={handleSetValue}
          confirmationFieldName="confirmPassword"
        />
      </FormField>

      {/* Confirm Password */}
      <FormField
        label={t("changePassword.confirmPassword.label")}
        error={errors.confirmPassword?.message}
        required
      >
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder={t("changePassword.confirmPassword.placeholder")}
        />
      </FormField>
    </FormSheet>
  );
};
