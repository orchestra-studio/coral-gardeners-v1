/**
 * Project API Types
 */

export interface ProjectTranslation {
    name: string;
    description: string;
    environment: string;
}

export interface ProjectTranslations {
    en: ProjectTranslation;
    ar: ProjectTranslation;
}

export type ProjectStatus = "ready" | "in-progress" | "blocked";

export interface Project {
    id: number;
    translations: ProjectTranslations;
    status: ProjectStatus;
    version: string;
    image: string | null;
    icon_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectPayload {
    translations: ProjectTranslations;
    status: ProjectStatus;
    version: string;
    image?: string;
    icon_name?: string;
}

export interface UpdateProjectPayload {
    translations?: ProjectTranslations;
    status?: ProjectStatus;
    version?: string;
    image?: string;
    icon_name?: string;
}

export interface ProjectsListParams {
    name?: string;
    status?: ProjectStatus;
    environment?: string;
    page?: number;
    page_count?: number;
}
