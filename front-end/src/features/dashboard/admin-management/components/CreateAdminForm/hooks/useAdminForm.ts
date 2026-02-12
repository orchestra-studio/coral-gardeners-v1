import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFormValidation } from "@/components/Form";
import { useCreateAdmin, useUpdateAdmin } from "@/services/adminManagement";
import type { AdminUser } from "@/services/adminManagement";
import type { AdminFormData } from "../types";
import { INITIAL_FORM_DATA } from "../constants";

export const useAdminForm = (onClose: () => void, admin?: AdminUser) => {
    const t = useTranslations("dashboard/settings/adminmanagement");
    const createAdmin = useCreateAdmin();
    const updateAdmin = useUpdateAdmin();

    const isEditMode = !!admin;

    const [formData, setFormData] = useState<AdminFormData>(INITIAL_FORM_DATA);

    // Update form data when admin changes
    useEffect(() => {
        if (admin) {
            setFormData({
                first_name: admin.first_name || "",
                last_name: admin.last_name || "",
                email: admin.email || "",
                password: "", // Password not required for edit
                password_confirmation: "",
                phone: admin.phone || "",
                profile_picture: admin.profile_picture || null,
                country_id: admin.country_id || null,
            });
        } else {
            setFormData(INITIAL_FORM_DATA);
        }
    }, [admin]);

    const { errors, validateForm, clearError, clearAllErrors } =
        useFormValidation<AdminFormData>({
            first_name: {
                required: t("form.validation.firstNameRequired"),
            },
            last_name: {
                required: t("form.validation.lastNameRequired"),
            },
            email: {
                required: t("form.validation.emailRequired"),
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("form.validation.emailInvalid"),
                },
            },
            password: {
                required: !isEditMode ? t("form.validation.passwordRequired") : undefined,
                minLength: !isEditMode
                    ? {
                        value: 6,
                        message: t("form.validation.passwordMinLength"),
                    }
                    : undefined,
            },
        });

    // Custom validation for password confirmation
    useEffect(() => {
        if (!isEditMode && formData.password && formData.password_confirmation) {
            if (formData.password !== formData.password_confirmation) {
                // Password mismatch - error will be shown
            }
        }
    }, [formData.password, formData.password_confirmation, isEditMode]);

    const handleInputChange = (
        field: keyof AdminFormData,
        value: string | number | null
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const handleSubmit = async () => {
        if (!validateForm(formData)) {
            return;
        }

        // Check password confirmation manually
        if (!isEditMode && formData.password !== formData.password_confirmation) {
            return;
        }

        if (isEditMode && admin) {
            // Update existing admin
            const updateData: Record<string, unknown> = {};

            if (formData.first_name !== admin.first_name) {
                updateData.first_name = formData.first_name.trim();
            }
            if (formData.last_name !== admin.last_name) {
                updateData.last_name = formData.last_name.trim();
            }
            if (formData.email !== admin.email) {
                updateData.email = formData.email.trim();
            }
            if (formData.phone !== admin.phone) {
                updateData.phone = formData.phone.trim() || undefined;
            }
            if (formData.profile_picture !== admin.profile_picture) {
                updateData.profile_picture = formData.profile_picture || undefined;
            }
            if (formData.country_id !== admin.country_id) {
                updateData.country_id = formData.country_id ? Number(formData.country_id) : undefined;
            }
            if (formData.password && formData.password_confirmation) {
                updateData.password = formData.password;
                updateData.password_confirmation = formData.password_confirmation;
            }

            // Only update if there are changes
            if (Object.keys(updateData).length > 0) {
                updateAdmin.mutate(
                    { id: admin.username, adminData: updateData },
                    {
                        onSuccess: () => {
                            handleClose();
                        },
                    }
                );
            } else {
                handleClose();
            }
        } else {
            // Create new admin
            const adminData = {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                phone: formData.phone.trim() || null,
                profile_picture: formData.profile_picture || null,
                country_id: formData.country_id ? Number(formData.country_id) : null,
            };

            createAdmin.mutate(adminData, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_DATA);
        clearAllErrors();
        onClose();
    };

    return {
        formData,
        errors,
        handleInputChange,
        handleSubmit,
        handleClose,
        isSubmitting: createAdmin.isPending || updateAdmin.isPending,
        isEditMode,
    };
};
