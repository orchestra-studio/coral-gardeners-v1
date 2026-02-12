"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IconUpload, IconX, IconUser } from "@tabler/icons-react";

export interface ImageUploaderProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  path?: string; // e.g., "users/avatars"
  sizePreset?: "profile" | "cover" | "logo" | "default";
  accept?: string; // e.g., "image/*"
  disabled?: boolean;
  showUploadButton?: boolean; // controls visibility of upload/clear buttons
  className?: string;
  previewSize?: number; // px
  placeholderIcon?: React.ReactNode; // custom icon for empty state
  uploadLabel?: string; // label for the upload button
}

/**
 * Upload file with real-time progress tracking
 * Uses XHR to monitor actual bytes transferred for accurate progress
 * Caps at 99% until server processing completes
 */
async function uploadFile(
  endpoint: string,
  formData: FormData,
  onProgress?: (percent: number) => void
) {
  const json = await new Promise<unknown>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (e: ProgressEvent<EventTarget>) => {
      if (e.lengthComputable && onProgress) {
        // Cap at 99% during upload - 100% only when server responds
        const uploadPercent = Math.round((e.loaded / e.total) * 100);
        const percent = Math.min(99, uploadPercent);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const body =
          xhr.response ??
          (xhr.responseText ? JSON.parse(xhr.responseText) : null);
        resolve(body);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("Upload aborted"));

    xhr.send(formData);
  });

  return json;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const getStringProp = (
  obj: Record<string, unknown>,
  key: string
): string | null => {
  const v = obj[key];
  return typeof v === "string" && v ? v : null;
};

function pickUrlFromResponse(
  json: unknown,
  preset: ImageUploaderProps["sizePreset"]
): string | null {
  // Common shapes supported:
  // 1) { data: { original: string, "250x250": string, ... } }
  // 2) { data: { url: string } } or { url: string }
  // 3) { data: string } or plain string
  let data: unknown = null;
  if (isObject(json)) {
    data = json["data"] ?? null;
    const urlTop = getStringProp(json, "url");
    if (urlTop) return urlTop;
  }

  const takeFirstString = (obj: Record<string, unknown>, keys: string[]) => {
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v) return v;
    }
    return null;
  };

  if (typeof data === "string") return data;
  if (isObject(data)) {
    // direct url
    const direct = getStringProp(data, "url");
    if (direct) return direct;

    // handle versions map
    const rec = data as Record<string, unknown>;
    const original = getStringProp(rec, "original");

    if (preset === "profile") {
      // Prefer square avatar sizes when present, else fallback to original
      return takeFirstString(rec, ["250x250", "150x150", "50x50"]) || original;
    }

    // default/cover/logo -> original preferred, else first available value
    if (original) return original;
    return takeFirstString(rec, ["250x250", "150x150", "50x50"]);
  }

  if (isObject(json)) {
    const top = getStringProp(json, "url");
    if (top) return top;
  }
  if (typeof json === "string") return json;
  return null;
}

export default function ImageUploader({
  value,
  onChange,
  path = "uploads",
  sizePreset = "default",
  accept = "image/*",
  disabled,
  showUploadButton = true,
  className,
  previewSize = 64,
  placeholderIcon,
  uploadLabel = "Choose Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const preview = useMemo(() => value || null, [value]);

  const handlePick = () => inputRef.current?.click();

  const handleClear = () => {
    onChange?.(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);
      formData.append("type", "image");
      formData.append("for", sizePreset);
      formData.append("isGlobal", "1");

      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/helpers/upload`;

      const json = await uploadFile(endpoint, formData, (percent) => {
        setProgress(percent);
      });

      // Server responded successfully - set to 100%
      setProgress(100);

      const url = pickUrlFromResponse(json, sizePreset);
      if (url) {
        onChange?.(url);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setProgress(0);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        {preview ? (
          <div
            style={{ width: previewSize, height: previewSize }}
            className="rounded-full overflow-hidden border border-[var(--border)] flex-shrink-0"
          >
            <Image
              src={preview}
              alt="Preview"
              width={previewSize}
              height={previewSize}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            style={{ width: previewSize, height: previewSize }}
            className="rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex-shrink-0 flex items-center justify-center"
          >
            {placeholderIcon || (
              <IconUser
                size={previewSize * 0.5}
                className="text-[var(--text-muted)]"
                stroke={1.5}
              />
            )}
          </div>
        )}
        {showUploadButton && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              startIcon={<IconUpload size={16} />}
              onClick={handlePick}
              disabled={disabled || uploading}
            >
              {uploading ? `Uploading ${Math.round(progress)}%` : uploadLabel}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={disabled || uploading}
              >
                <IconX size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
