/**
 * Helper API Functions
 * API calls for helper data like countries, etc.
 */

import { apiClient } from "../client";
import type { CountriesResponse, CountriesSelectResponse } from "@/services/helpers/types/helperTypes";

/**
 * Get all countries
 */
export const getCountries = async (): Promise<CountriesResponse> => {
    const { data } = await apiClient.get<CountriesResponse>("/admins/countries");
    return data;
};

/**
 * Get countries for select options (simplified format)
 */
export const getCountriesForSelect = async (): Promise<CountriesSelectResponse> => {
    const { data } = await apiClient.get<CountriesSelectResponse>("/helpers/countries");
    return data;
};

/**
 * Upload file chunk
 */
export const uploadChunk = async (
    formData: FormData,
    onProgress?: (loaded: number) => void
): Promise<unknown> => {
    const { data } = await apiClient.post("/helpers/upload-chunk", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const loaded = progressEvent.loaded;
                onProgress(loaded);
            }
        },
    });
    return data;
};

/**
 * Upload file
 */
export const uploadFile = async (formData: FormData): Promise<{ success: boolean; message: string; data: { url: string; path: string } }> => {
    const { data } = await apiClient.post("/helpers/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};