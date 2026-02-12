/**
 * Chunked File Upload Hook
 * Custom hook for uploading large files in chunks with progress tracking
 */

import { useState, useCallback } from "react";
import { uploadChunk } from "@/lib/api/helpers";

const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

interface ChunkedUploadOptions {
    path: string;
    type?: "image" | "video" | "file";
    sizePreset?: string;
    onProgress?: (progress: number) => void;
}

interface ChunkedUploadResult {
    uploadFile: (file: File) => Promise<string | null>;
    progress: number;
    isUploading: boolean;
    error: string | null;
}

/**
 * Extract URL from upload response
 */
function extractUrlFromResponse(
    response: unknown,
    preset?: string
): string | null {
    if (!response || typeof response !== "object") {
        return typeof response === "string" ? response : null;
    }

    const obj = response as Record<string, unknown>;

    // Try to get data object first
    const data = obj.data;

    if (typeof data === "string") {
        return data;
    }

    if (data && typeof data === "object") {
        const dataObj = data as Record<string, unknown>;

        // Check for direct URL
        if (typeof dataObj.url === "string") {
            return dataObj.url;
        }

        // Check for original
        if (typeof dataObj.original === "string") {
            return dataObj.original;
        }

        // Check for preset-specific URLs
        if (preset === "profile") {
            const sizes = ["250x250", "150x150", "50x50"];
            for (const size of sizes) {
                if (typeof dataObj[size] === "string") {
                    return dataObj[size];
                }
            }
        }

        // Try to get any available image URL
        const possibleKeys = ["250x250", "150x150", "50x50", "original"];
        for (const key of possibleKeys) {
            if (typeof dataObj[key] === "string") {
                return dataObj[key];
            }
        }
    }

    // Fallback to top-level url
    if (typeof obj.url === "string") {
        return obj.url;
    }

    return null;
}

/**
 * Hook for uploading files in chunks with progress tracking
 */
export const useChunkedUpload = ({
    path,
    type = "file",
    sizePreset = "default",
    onProgress,
}: ChunkedUploadOptions): ChunkedUploadResult => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(
        async (file: File): Promise<string | null> => {
            try {
                setIsUploading(true);
                setProgress(0);
                setError(null);

                const uid = crypto.randomUUID();
                const chunkSize = DEFAULT_CHUNK_SIZE;
                const totalChunks = Math.ceil(file.size / chunkSize);
                let uploadedBytes = 0;
                let finalUrl: string | null = null;

                for (let i = 0; i < totalChunks; i++) {
                    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
                    const formData = new FormData();

                    formData.append("file", chunk, file.name);
                    formData.append("path", path);
                    formData.append("type", type);
                    formData.append("for", sizePreset);
                    formData.append("isGlobal", "1");
                    formData.append("uid", uid);
                    formData.append("chunkNumber", String(i + 1));
                    formData.append("totalChunks", String(totalChunks));

                    const response = await uploadChunk(formData, (loaded) => {
                        const currentChunkSize = chunk.size;
                        const safeLoaded = Math.min(loaded, currentChunkSize);
                        const totalLoaded = uploadedBytes + safeLoaded;
                        const percentage = (totalLoaded / file.size) * 100;
                        const roundedProgress = Math.min(99, Math.max(1, Math.round(percentage)));

                        setProgress(roundedProgress);
                        onProgress?.(roundedProgress);
                    });

                    // Get URL from last chunk response
                    if (i + 1 === totalChunks) {
                        finalUrl = extractUrlFromResponse(response, sizePreset);
                    }

                    uploadedBytes += chunk.size;
                    const fallbackPercentage = ((i + 1) / totalChunks) * 100;
                    setProgress((prev) => {
                        const newProgress = prev < fallbackPercentage
                            ? Math.min(99, Math.round(fallbackPercentage))
                            : prev;
                        onProgress?.(newProgress);
                        return newProgress;
                    });
                }

                setProgress(100);
                onProgress?.(100);

                return finalUrl;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload failed";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setIsUploading(false);
                setProgress(0);
            }
        },
        [path, type, sizePreset, onProgress]
    );

    return {
        uploadFile,
        progress,
        isUploading,
        error,
    };
};
