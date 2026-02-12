/**
 * Projects API Types
 */

export type ProjectStatus = 'in-progress' | 'ready' | 'blocked';

// Translation structure for a single language
export interface ProjectTranslation {
    name: string;
    description: string;
    environment: string;
}

// Supported languages
export type SupportedLanguage = 'en' | 'ar';

// Translations object mapping language codes to their translations
export type ProjectTranslations = {
    [K in SupportedLanguage]: ProjectTranslation;
};

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

// Simpler pagination response to match users module
export interface ProjectsListResponse {
    data: Project[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProjectsListResponseBackend {
    success: boolean;
    data: ProjectsListResponse;
    message: string;
}

export interface CreateProjectDto {
    translations: ProjectTranslations;
    status: ProjectStatus;
    version: string;
    image?: string;
    icon_name?: string;
}

export interface UpdateProjectDto {
    translations?: ProjectTranslations;
    status?: ProjectStatus;
    version?: string;
    image?: string;
    icon_name?: string;
}

// Filters for project queries
export interface ProjectsFilters {
    name?: string;
    status?: ProjectStatus;
    environment?: string;
    page?: number;
    page_count?: number;
}
