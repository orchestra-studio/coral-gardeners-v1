export const INITIAL_FORM_DATA = {
    name_en: "",
    description_en: "",
    environment_en: "",
    name_ar: "",
    description_ar: "",
    environment_ar: "",
    status: "in-progress" as const,
    image: null,
};

export const LANGUAGES = [
    {
        code: "en",
        required: true,
    },
    {
        code: "ar",
        required: false,
    },
] as const;
