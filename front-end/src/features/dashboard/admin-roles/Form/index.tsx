"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { FormSheet, FormField } from "@/components/Form";
import { Input } from "@/components/ui/input";
import { useCreateRole, useUpdateRole, type Role } from "@/services/adminRoles";

interface FormValues {
  name: string;
}

interface RoleFormProps {
  roleForm: {
    open: boolean;
    role: Role | null;
  };
  setRoleForm: React.Dispatch<
    React.SetStateAction<{ open: boolean; role: Role | null }>
  >;
}

export default function AdminRoleForm({
  roleForm,
  setRoleForm,
}: RoleFormProps) {
  const t = useTranslations("dashboard/settings/adminroles");

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  // Populate form fields when editing
  useEffect(() => {
    if (roleForm.role && roleForm.open) {
      const role = roleForm.role;
      reset({
        name: role.name || "",
      });
    } else if (roleForm.open && !roleForm.role) {
      // Reset for new role
      reset({
        name: "",
      });
    }
  }, [roleForm.role, roleForm.open, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Validation for required fields
      if (!values.name?.trim()) {
        toast.error(t("form.validation.nameRequired"));
        return;
      }

      if (roleForm.role) {
        // Update existing role
        await updateRoleMutation.mutateAsync({
          id: roleForm.role.id,
          name: values.name.trim(),
        });
      } else {
        // Create new role
        await createRoleMutation.mutateAsync({
          name: values.name.trim(),
        });
      }

      handleClose();
    } catch (error) {
      // Service layer handles error toasts
      console.error("Form submission error:", error);
    }
  };

  const isLoading =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  const handleClose = () => {
    reset();
    setRoleForm({ open: false, role: null });
  };

  return (
    <FormSheet
      open={roleForm.open}
      onClose={handleClose}
      title={roleForm.role ? t("form.title.edit") : t("form.title.create")}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={
        roleForm.role ? t("form.actions.update") : t("form.actions.create")
      }
      cancelLabel={t("form.actions.cancel")}
      isSubmitting={isLoading}
      submitLoadingText={
        roleForm.role ? t("form.actions.updating") : t("form.actions.creating")
      }
      maxWidth={500}
    >
      <FormField
        label={t("form.fields.name")}
        error={errors.name?.message}
        required
      >
        <Input
          {...register("name", {
            required: t("form.validation.nameRequired"),
          })}
          placeholder={t("form.fields.namePlaceholder")}
        />
      </FormField>
    </FormSheet>
  );
}
