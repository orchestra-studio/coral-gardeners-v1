"use client";

import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import {
    ApiRequestConfig,
    ApiResponse,
    getCurrentLocale,
    handleUnauthorized,
    isUnauthorizedResponse,
    handleApiResponse,
    handleApiError,
    createErrorWithValidation,
    getLoadingCallbacks,
    shouldShowLoading,
} from "./client-utils";

/**
 * Create and configure axios instance
 */
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        withCredentials: false,
        validateStatus: (status) => status < 500,
    });

    // Request interceptor - Add auth token and locale
    instance.interceptors.request.use(
        (config) => {
            const apiConfig = config as ApiRequestConfig;
            const callbacks = getLoadingCallbacks();

            // Handle loading state
            if (shouldShowLoading(config.method, apiConfig.showLoading)) {
                callbacks.showLoading();
            }

            // Add locale header
            const locale = apiConfig.acceptLanguage || getCurrentLocale();
            if (config.headers) {
                (config.headers as Record<string, unknown>)["Accept-Language"] = locale;
            }

            // Add auth token
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("auth_token");
                if (token && config.headers) {
                    (config.headers as Record<string, unknown>)["Authorization"] = `Bearer ${token}`;
                }
            }

            return config;
        },
        (error: AxiosError) => {
            getLoadingCallbacks().hideLoading();
            return Promise.reject(error);
        }
    );

    // Response interceptor - Handle unauthorized and errors
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            getLoadingCallbacks().hideLoading();

            // Check for unauthorized responses
            if (isUnauthorizedResponse(response)) {
                const result = handleApiResponse(response);
                const error = new Error(result.message || 'Unauthorized');
                (error as Error & { errors?: Record<string, string[]> }).errors = result.errors;
                handleUnauthorized();
                return Promise.reject(error);
            }

            return response;
        },
        (error: AxiosError) => {
            getLoadingCallbacks().hideLoading();

            // Handle 401 errors
            if (error.response?.status === 401) {
                const result = handleApiError(error);
                const unauthorizedError = new Error(result.message || 'Unauthorized') as Error & { errors?: Record<string, string[]> };
                unauthorizedError.errors = result.errors;
                handleUnauthorized();
                return Promise.reject(unauthorizedError);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

/**
 * Axios instance
 */
export const apiClient = createAxiosInstance();

/**
 * API methods with automatic response handling
 */
export const api = {
    get: <T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
        return apiClient
            .get(url, { showLoading: false, ...config })
            .then(handleApiResponse<T>)
            .then((result) => {
                if (!result.success) {
                    throw new Error(result.message || 'Request failed');
                }
                return result;
            })
            .catch((error) => {
                const result = handleApiError(error);
                throw new Error(result.message || 'Request failed');
            });
    },

    post: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
        return apiClient
            .post(url, data, { showLoading: true, ...config })
            .then(handleApiResponse<T>)
            .then((result) => {
                if (!result.success) {
                    throw createErrorWithValidation(result.message || 'Request failed', result.errors);
                }
                return result;
            })
            .catch((error) => {
                if (error.errors) throw error;
                const result = handleApiError(error);
                throw createErrorWithValidation(result.message || 'Request failed', result.errors);
            });
    },

    put: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
        return apiClient
            .put(url, data, { showLoading: true, ...config })
            .then(handleApiResponse<T>)
            .then((result) => {
                if (!result.success) {
                    throw createErrorWithValidation(result.message || 'Request failed', result.errors);
                }
                return result;
            })
            .catch((error) => {
                if (error.errors) throw error;
                const result = handleApiError(error);
                throw createErrorWithValidation(result.message || 'Request failed', result.errors);
            });
    },

    patch: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
        return apiClient
            .patch(url, data, { showLoading: true, ...config })
            .then(handleApiResponse<T>)
            .then((result) => {
                if (!result.success) {
                    throw createErrorWithValidation(result.message || 'Request failed', result.errors);
                }
                return result;
            })
            .catch((error) => {
                if (error.errors) throw error;
                const result = handleApiError(error);
                throw createErrorWithValidation(result.message || 'Request failed', result.errors);
            });
    },

    delete: <T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
        return apiClient
            .delete(url, { showLoading: true, ...config })
            .then(handleApiResponse<T>)
            .catch(handleApiError);
    },
};

// Re-export utilities for backward compatibility
export { setLoadingCallbacks, handleApiError, createErrorWithValidation } from "./client-utils";
export type { ApiResponse, ApiRequestConfig } from "./client-utils";
export { getCurrentLocale as detectCurrentLocale } from "./client-utils";

export default api;
