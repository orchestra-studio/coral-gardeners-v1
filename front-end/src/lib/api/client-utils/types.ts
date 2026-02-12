import { AxiosRequestConfig } from "axios";

/**
 * API Response interface
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

/**
 * Extended Axios Request Config
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
    showLoading?: boolean;
    acceptLanguage?: string;
}

/**
 * Server response envelope type
 */
export type ServerEnvelope<TData = unknown> = {
    success?: unknown;
    message?: unknown;
    errors?: unknown;
    data?: TData;
} & Record<string, unknown>;
