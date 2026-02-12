/**
 * Helper Types
 * TypeScript interfaces for helper data like countries, etc.
 */

// Country data from API response
export interface Country {
    id: number;
    code: string;
    name: {
        ar: string;
        en: string;
    };
    phone_code: string;
    created_at: string | null;
    updated_at: string | null;
}

// Country option for select components
export interface CountryOption {
    value: number;
    label: string;
    code: string;
    phone_code: string;
}

// Countries response from API
export interface CountriesResponse {
    success: boolean;
    message: string;
    data: Country[];
}

// Countries select response (for simplified country options)
export interface CountriesSelectResponse {
    success: boolean;
    message: string;
    data: CountryOption[];
}

// Upload file request
export interface UploadFileRequest {
    file: File;
    path?: string;
    type?: string;
}

// Upload response
export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
        path: string;
    };
}