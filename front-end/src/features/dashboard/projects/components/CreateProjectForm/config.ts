import { useTranslations } from "next-intl";

export const useFormOptions = () => {
    const t = useTranslations("dashboard/projects");

    const environmentOptions = [
        {
            value: "Production",
            label: t("form.fields.environment.options.production"),
        },
        {
            value: "Staging",
            label: t("form.fields.environment.options.staging"),
        },
        {
            value: "Development",
            label: t("form.fields.environment.options.development"),
        },
    ];

    const statusOptions = [
        {
            value: "ready",
            label: t("form.fields.status.options.ready"),
        },
        {
            value: "in-progress",
            label: t("form.fields.status.options.inProgress"),
        },
        {
            value: "blocked",
            label: t("form.fields.status.options.blocked"),
        },
    ];

    const languages = [
        {
            code: "en",
            label: t("form.fields.translations.english"),
            required: true,
        },
        {
            code: "ar",
            label: t("form.fields.translations.arabic"),
            required: false,
        },
    ];

    return {
        environmentOptions,
        statusOptions,
        languages,
    };
};
