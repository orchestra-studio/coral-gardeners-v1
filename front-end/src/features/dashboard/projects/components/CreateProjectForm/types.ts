import type { Project } from "@/services/projects";

export interface ProjectFormData extends Record<string, unknown> {
    // English (required)
    name_en: string;
    description_en: string;
    environment_en: string;

    // Arabic (optional)
    name_ar: string;
    description_ar: string;
    environment_ar: string;

    // Common fields
    status: "ready" | "in-progress" | "blocked";
    image: string | null;
}

export interface CreateProjectFormProps {
    open: boolean;
    onClose: () => void;
    project?: Project; // Optional project for edit mode
}
