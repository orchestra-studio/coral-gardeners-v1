import * as yup from "yup";
import { useTranslations } from "next-intl";

/**
 * User change password validation schema (without current password)
 */
export const createUserChangePasswordValidationSchema = (t: ReturnType<typeof useTranslations>) =>
    yup.object().shape({
        newPassword: yup
            .string()
            .required(t("changePassword.validation.newPasswordRequired"))
            .min(8, t("changePassword.validation.passwordTooShort"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                t("changePassword.validation.passwordComplexity")
            ),
        confirmPassword: yup
            .string()
            .required(t("changePassword.validation.confirmPasswordRequired"))
            .oneOf([yup.ref("newPassword")], t("changePassword.validation.passwordsDoNotMatch")),
    });