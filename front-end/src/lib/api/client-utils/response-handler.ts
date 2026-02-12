import { AxiosResponse } from "axios";
import { ApiResponse, ServerEnvelope } from "./types";

/**
 * Handle API response and normalize to ApiResponse format
 */
export const handleApiResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
    const payload = response.data as ServerEnvelope<T> | undefined;

    // Handle error status codes
    if (response.status >= 400) {
        return {
            success: false,
            data: undefined as T,
            message: (payload?.message as string) || `HTTP ${response.status}: ${response.statusText}`,
            errors: payload?.errors as Record<string, string[]>,
        };
    }

    // Handle wrapped responses
    if (payload && Object.prototype.hasOwnProperty.call(payload, "success")) {
        const success = Boolean(payload.success as boolean | undefined);
        const message = (typeof payload.message === 'string' ? payload.message : undefined);
        const errors = (payload.errors as Record<string, string[]> | undefined);
        const data = (payload.data ?? (payload as unknown as T));

        return {
            success,
            data: data as T,
            message,
            errors: success ? undefined : errors,
        };
    }

    // Fallback: treat raw payload as data
    return {
        success: true,
        data: payload as T,
        message: undefined,
    };
};
