import * as yup from "yup";
import { useTranslations } from "next-intl";

/**
 * Security validation schema for password change
 */
export const createSecurityValidationSchema = (t: ReturnType<typeof useTranslations>) =>
    yup.object().shape({
        currentPassword: yup.string().required(t("validation.currentPasswordRequired")),
        newPassword: yup
            .string()
            .required(t("validation.newPasswordRequired"))
            .min(8, t("validation.passwordTooShort"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                t("validation.passwordComplexity")
            ),
        confirmPassword: yup
            .string()
            .required(t("validation.confirmPasswordRequired"))
            .oneOf([yup.ref("newPassword")], t("validation.passwordsDoNotMatch")),
    });

// Keep the legacy export for compatibility
export const securityValidationSchema = yup.object().shape({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    confirmPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});