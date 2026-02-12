import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormValidation } from "@/components/Form";
import { useCreateUser } from "@/services/users";
import type { CreateUserPayload } from "@/lib/api/users";
import type { User } from "@/services/users";
import type { UserFormData } from "../types";
import { INITIAL_FORM_DATA } from "../constants";

export const useUserForm = (onClose: () => void, user?: User) => {
    const t = useTranslations("dashboard/users");
    const createUser = useCreateUser();

    const isEditMode = !!user;

    const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);

    const { errors, validateForm, clearError, clearAllErrors } =
        useFormValidation<UserFormData>({
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
                required: t("form.validation.passwordRequired"),
                minLength: {
                    value: 6,
                    message: t("form.validation.passwordMinLength"),
                },
            },
        });

    const handleInputChange = (field: keyof UserFormData, value: string | number | null) => {
        const stringValue = value !== null ? String(value) : null;
        setFormData((prev) => ({ ...prev, [field]: stringValue }));
        clearError(field);
    };

    const handleSubmit = async () => {
        if (!validateForm(formData)) {
            return;
        }

        // Create new user (username will be auto-generated on backend)
        const userData: CreateUserPayload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim() || undefined,
            profile_picture: formData.profile_picture || undefined,
            country_id: formData.country_id ? Number(formData.country_id) : undefined,
        };

        createUser.mutate(userData, {
            onSuccess: () => {
                handleClose();
            },
        });
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
        isSubmitting: createUser.isPending,
        isEditMode,
    };
};
