import { useState, useCallback } from "react";

export type ValidationRule<T = string> = {
    required?: boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    custom?: (value: T) => string | undefined;
};

export type ValidationRules<T> = {
    [K in keyof T]?: ValidationRule<T[K]>;
};

/**
 * useFormValidation - A custom hook for form validation
 * 
 * @example
 * ```tsx
 * const { errors, validateField, validateForm, clearError, setError } = useFormValidation<FormData>({
 *   name_en: { 
 *     required: "Name is required",
 *     minLength: { value: 3, message: "Name must be at least 3 characters" }
 *   },
 *   email: {
 *     required: true,
 *     pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
 *   }
 * });
 * 
 * const isValid = validateForm(formData);
 * ```
 */
export function useFormValidation<T extends Record<string, unknown>>(
    rules: ValidationRules<T>
) {
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const validateField = useCallback(
        (fieldName: keyof T, value: unknown): string | undefined => {
            const rule = rules[fieldName];
            if (!rule) return undefined;

            // Required validation
            if (rule.required) {
                const isEmpty =
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    (typeof value === "string" && value.trim() === "");

                if (isEmpty) {
                    return typeof rule.required === "string"
                        ? rule.required
                        : `${String(fieldName)} is required`;
                }
            }

            // Skip other validations if value is empty and not required
            if (!value) return undefined;

            // Min length validation
            if (rule.minLength && typeof value === "string") {
                if (value.length < rule.minLength.value) {
                    return rule.minLength.message;
                }
            }

            // Max length validation
            if (rule.maxLength && typeof value === "string") {
                if (value.length > rule.maxLength.value) {
                    return rule.maxLength.message;
                }
            }

            // Pattern validation
            if (rule.pattern && typeof value === "string") {
                if (!rule.pattern.value.test(value)) {
                    return rule.pattern.message;
                }
            }

            // Custom validation
            if (rule.custom) {
                return rule.custom(value as T[keyof T]);
            }

            return undefined;
        },
        [rules]
    );

    const validateForm = useCallback(
        (formData: T): boolean => {
            const newErrors: Partial<Record<keyof T, string>> = {};

            Object.keys(rules).forEach((key) => {
                const fieldName = key as keyof T;
                const error = validateField(fieldName, formData[fieldName]);
                if (error) {
                    newErrors[fieldName] = error;
                }
            });

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [rules, validateField]
    );

    const clearError = useCallback((fieldName: keyof T) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    const setError = useCallback((fieldName: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [fieldName]: message }));
    }, []);

    return {
        errors,
        validateField,
        validateForm,
        clearError,
        clearAllErrors,
        setError,
    };
}
