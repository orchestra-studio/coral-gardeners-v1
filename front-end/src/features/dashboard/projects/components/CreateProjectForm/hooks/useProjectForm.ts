import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFormValidation } from "@/components/Form";
import { useCreateProject, useUpdateProject } from "@/services/projects";
import type { CreateProjectDto, UpdateProjectDto, Project } from "@/services/projects";
import type { ProjectFormData } from "../types";
import { INITIAL_FORM_DATA } from "../constants";

export const useProjectForm = (onClose: () => void, project?: Project) => {
    const t = useTranslations("dashboard/projects");
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const isEditMode = !!project;

    const [activeTab, setActiveTab] = useState<"en" | "ar">("en");
    const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);

    // Initialize form data when project is provided (edit mode)
    useEffect(() => {
        if (project) {
            setFormData({
                name_en: project.translations.en.name,
                description_en: project.translations.en.description,
                environment_en: project.translations.en.environment,
                name_ar: project.translations.ar?.name || "",
                description_ar: project.translations.ar?.description || "",
                environment_ar: project.translations.ar?.environment || "",
                status: project.status as "ready" | "in-progress" | "blocked",
                image: project.image || null,
            });
        }
    }, [project]);

    const { errors, validateForm, clearError, clearAllErrors } =
        useFormValidation<ProjectFormData>({
            name_en: {
                required: t("form.validation.nameRequired"),
            },
            description_en: {
                required: t("form.validation.descriptionRequired"),
            },
            environment_en: {
                required: t("form.validation.environmentRequired"),
            },
        });

    const handleInputChange = (field: keyof ProjectFormData, value: string | number | null) => {
        const stringValue = value !== null ? String(value) : null;
        setFormData((prev) => ({ ...prev, [field]: stringValue }));
        clearError(field);
    };

    const handleMultiLanguageChange = (
        fieldBase: "name" | "description" | "environment",
        value: Record<string, string>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [`${fieldBase}_en`]: value.en || "",
            [`${fieldBase}_ar`]: value.ar || "",
        }));
        clearError(`${fieldBase}_en` as keyof ProjectFormData);
    };

    const isEnglishComplete =
        formData.name_en && formData.description_en && formData.environment_en;

    const handleSubmit = async () => {
        if (!validateForm(formData)) {
            setActiveTab("en");
            return;
        }

        if (isEditMode && project) {
            // Update existing project
            const updateData: UpdateProjectDto = {
                translations: {
                    en: {
                        name: formData.name_en.trim(),
                        description: formData.description_en.trim(),
                        environment: formData.environment_en.trim(),
                    },
                    ar: {
                        name: formData.name_ar.trim() || formData.name_en.trim(),
                        description:
                            formData.description_ar.trim() || formData.description_en.trim(),
                        environment:
                            formData.environment_ar.trim() || formData.environment_en.trim(),
                    },
                },
                status: formData.status,
                image: formData.image || undefined,
            };

            updateProject.mutate(
                { id: project.id, data: updateData },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                }
            );
        } else {
            // Create new project
            const projectData: CreateProjectDto = {
                translations: {
                    en: {
                        name: formData.name_en.trim(),
                        description: formData.description_en.trim(),
                        environment: formData.environment_en.trim(),
                    },
                    ar: {
                        name: formData.name_ar.trim() || formData.name_en.trim(),
                        description:
                            formData.description_ar.trim() || formData.description_en.trim(),
                        environment:
                            formData.environment_ar.trim() || formData.environment_en.trim(),
                    },
                },
                status: formData.status,
                version: "1.0.0",
                image: formData.image || undefined,
            };

            createProject.mutate(projectData, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    const handleClose = () => {
        // Only reset form data if not in edit mode
        // In edit mode, keep the data so it's available when reopening
        if (!isEditMode) {
            setFormData(INITIAL_FORM_DATA);
        }
        clearAllErrors();
        setActiveTab("en");
        onClose();
    };

    return {
        activeTab,
        setActiveTab,
        formData,
        errors,
        handleInputChange,
        handleMultiLanguageChange,
        handleSubmit,
        handleClose,
        isEnglishComplete,
        isSubmitting: createProject.isPending || updateProject.isPending,
        isEditMode,
    };
};
