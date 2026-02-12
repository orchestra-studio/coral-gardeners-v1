import { useMemo } from "react";

/**
 * Formats error messages into user-friendly strings
 */
export function useErrorFormatter(error: unknown) {
    return useMemo(() => {
        if (!error) {
            return null;
        }

        if (typeof error === "string") {
            return error;
        }

        if (error instanceof Error && typeof error.message === "string") {
            // Try to parse if it's a JSON string with message/error fields
            try {
                const parsed = JSON.parse(error.message);
                if (parsed && typeof parsed === 'object') {
                    return parsed.message || parsed.error || error.message;
                }
            } catch {
                // Not JSON, return as-is
                return error.message;
            }
        }

        // Handle error objects with message/error properties
        if (typeof error === 'object' && error !== null) {
            const err = error as Record<string, unknown>;

            // Check for message field first
            if (typeof err.message === "string") {
                return err.message;
            }

            // Check for error field
            if (typeof err.error === "string") {
                return err.error;
            }

            // Check nested data.message or data.error
            if (err.data && typeof err.data === 'object') {
                const data = err.data as Record<string, unknown>;
                if (typeof data.message === "string") {
                    return data.message;
                }
                if (typeof data.error === "string") {
                    return data.error;
                }
            }
        }

        try {
            return JSON.stringify(error);
        } catch {
            return "An unexpected error occurred.";
        }
    }, [error]);
}
