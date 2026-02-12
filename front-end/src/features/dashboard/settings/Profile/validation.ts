import * as yup from "yup";

/**
 * Create profile validation schema with translated messages
 */
export const createProfileValidationSchema = (t: (key: string) => string) => {
    return yup.object().shape({
        first_name: yup
            .string()
            .required(t("firstNameRequired"))
            .max(150, "First name must be 150 characters or less"),
        last_name: yup
            .string()
            .required(t("lastNameRequired"))
            .max(150, "Last name must be 150 characters or less"),
        email: yup
            .string()
            .required(t("emailRequired"))
            .email(t("emailInvalid")),
        phone: yup.string().optional(),
        country_id: yup.number().nullable().optional(),
        profile_picture: yup.string().optional(),
        password: yup
            .string()
            .optional()
            .test(
                "password-length",
                t("passwordTooShort"),
                function (value) {
                    if (!value || value.trim() === "") return true;
                    return value.length >= 8;
                }
            ),
        password_confirmation: yup
            .string()
            .optional()
            .test("passwords-match", t("passwordsDoNotMatch"), function (value) {
                const { password } = this.parent;
                if (!password || password.trim() === "") return true;
                return value === password;
            }),
    });
};

/**
 * Profile validation schema (fallback for components that don't have translation access)
 */
export const profileValidationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required("First name is required")
        .max(150, "First name must be 150 characters or less"),
    last_name: yup
        .string()
        .required("Last name is required")
        .max(150, "Last name must be 150 characters or less"),
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    phone: yup.string().optional(),
    country_id: yup.number().nullable().optional(),
    profile_picture: yup.string().optional(),
    password: yup
        .string()
        .optional()
        .test(
            "password-length",
            "Password must be at least 8 characters",
            function (value) {
                if (!value || value.trim() === "") return true;
                return value.length >= 8;
            }
        ),
    password_confirmation: yup
        .string()
        .optional()
        .test("passwords-match", "Passwords must match", function (value) {
            const { password } = this.parent;
            if (!password || password.trim() === "") return true;
            return value === password;
        }),
});