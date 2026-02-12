/**
 * Upload File Mutation Hook
 * Mutation hook for uploading files
 */

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api/helpers";
import type { UploadResponse } from "../types/helperTypes";

/**
 * Hook for uploading files
 */
export const useUploadFile = (): UseMutationResult<
    UploadResponse,
    Error,
    FormData
> => {
    return useMutation({
        mutationFn: uploadFile,
    });
};