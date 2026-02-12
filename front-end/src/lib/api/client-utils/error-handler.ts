import { AxiosError } from "axios";
import { ApiResponse } from "./types";

/**
 * Handle API errors and normalize to ApiResponse format
 */
export const handleApiError = (error: AxiosError): ApiResponse<never> => {
    // Handle CORS/Network errors
    if (!error.response && error.message.includes('Network Error')) {
        return {
            success: false,
            message: "Unable to connect to the server. Please check if the API is running.",
        };
    }

    // Handle error responses
    if (error.response?.data) {
        const errorData = error.response.data as Record<string, unknown>;
        return {
            success: false,
            message: (errorData.message as string) || `HTTP ${error.response.status}: ${error.response.statusText}`,
            errors: errorData.errors as Record<string, string[]>,
        };
    }

    return {
        success: false,
        message: error.message || "Network error occurred",
    };
};

/**
 * Create an error with optional validation errors
 */
export const createErrorWithValidation = (message: string, errors?: Record<string, string[]>) => {
    const error: Error & { errors?: Record<string, string[]> } = new Error(message);
    if (errors) {
        error.errors = errors;
    }
    return error;
};
