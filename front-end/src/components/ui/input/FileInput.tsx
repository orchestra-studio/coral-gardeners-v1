"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../button";
import IconButton from "../iconButton";
import { IconUpload, IconX, IconPhoto, IconVideo } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useLoading } from "@/store/useLoading";
import { useChunkedUpload } from "@/services/helpers";
import * as LabelPrimitive from "@radix-ui/react-label";

export interface FileInputProps {
  value?: string;
  onChange?: (url: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  accept?: string;
  path?: string;
  type?: "image" | "video" | "file";
  sizePreset?: "profile" | "cover" | "logo" | "default";
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
  showPreview?: boolean;
  canEnterExternalUrl?: boolean;
  variant?: "default" | "dropzone";
  previewInline?: boolean; // Show preview inside dropzone instead of below
  id?: string; // Optional ID for accessibility
  browseButtonText?: string; // Custom text for browse button
}

export default function FileInput({
  value,
  onChange,
  label,
  placeholder,
  error,
  accept,
  path = "uploads",
  type = "file",
  sizePreset = "default",
  disabled = false,
  required = false,
  containerClassName,
  showPreview = true,
  canEnterExternalUrl = false,
  variant = "default",
  previewInline = false,
  id,
  browseButtonText = "Browse",
}: FileInputProps) {
  const [urlInput, setUrlInput] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const { showLoading, hideLoading } = useLoading();

  // Generate ID at top level (hooks must be called unconditionally)
  const generatedId = React.useId();
  const componentId = id || generatedId;
  const errorId = `${componentId}-error`;

  // Use the chunked upload hook
  const { uploadFile, progress, isUploading } = useChunkedUpload({
    path,
    type,
    sizePreset,
  });

  // Sync internal state with external value prop
  useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEnterExternalUrl) return;
    const newValue = e.target.value;
    setUrlInput(newValue);
    onChange?.(newValue || null);
  };

  const handleClear = () => {
    setUrlInput("");
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;

    try {
      showLoading();
      const url = await uploadFile(file);

      if (url) {
        setUrlInput(url);
        onChange(url);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      hideLoading();
    }
  };

  // Drag and Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropzoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading || !onChange) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      showLoading();
      const url = await uploadFile(file);

      if (url) {
        setUrlInput(url);
        onChange(url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      hideLoading();
    }
  };

  const getAcceptType = () => {
    if (accept) return accept;
    switch (type) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      default:
        return "*/*";
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (canEnterExternalUrl) {
      return `Enter URL or ${browseButtonText.toLowerCase()} to upload`;
    }
    return `Click ${browseButtonText.toLowerCase()} to upload file`;
  };

  const getDropzoneText = () => {
    if (type === "image") {
      return {
        main: "Drag and drop a image, or",
        sub: "Maximum 1400px * 1600px",
      };
    }
    if (type === "video") {
      return {
        main: "Drag and drop a video, or",
        sub: "Videos ( mp4, h3, 60 secs)",
      };
    }
    return {
      main: "Drag and drop a file, or",
      sub: "Maximum file size",
    };
  };

  const renderPreview = () => {
    if (!showPreview || !urlInput) return null;

    if (type === "image" && urlInput) {
      return (
        <div className={cn("mt-3", previewInline && "mt-0 w-full h-full")}>
          <div
            className={cn(
              "relative group",
              previewInline ? "w-full h-full" : "w-[150px]"
            )}
          >
            <Image
              src={urlInput}
              alt="Preview"
              width={previewInline ? 500 : 150}
              height={previewInline ? 280 : 84}
              className={cn(
                "w-full object-cover rounded-lg border border-[var(--border)]",
                previewInline ? "h-full aspect-video" : "h-auto aspect-video"
              )}
            />
            <IconButton
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
              className="absolute top-2 end-2 shadow-lg"
            >
              <IconX size={14} />
            </IconButton>
          </div>
        </div>
      );
    }

    if (type === "video" && urlInput) {
      return (
        <div className={cn("mt-3", previewInline && "mt-0 w-full h-full")}>
          <div
            className={cn(
              "relative group",
              previewInline ? "w-full h-full" : "w-[150px]"
            )}
          >
            <video
              src={urlInput}
              controls
              className={cn(
                "w-full object-cover rounded-lg border border-[var(--border)]",
                previewInline ? "h-full aspect-video" : "h-auto aspect-video"
              )}
            >
              Your browser does not support the video tag.
            </video>
            <IconButton
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={disabled}
              className="absolute top-2 end-2 shadow-lg"
            >
              <IconX size={14} />
            </IconButton>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render dropzone variant for image and video
  if (variant === "dropzone") {
    const dropzoneText = getDropzoneText();
    const Icon =
      type === "image" ? IconPhoto : type === "video" ? IconVideo : IconUpload;

    return (
      <div className={cn("flex flex-col gap-2", containerClassName)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={componentId}
            className="text-sm font-medium text-[var(--text)]"
          >
            {label}
            {required && (
              <span className="text-[var(--errorColor)] ms-1">*</span>
            )}
          </LabelPrimitive.Root>
        )}

        <div
          ref={dropzoneRef}
          onDragEnter={!urlInput ? handleDragEnter : undefined}
          onDragOver={!urlInput ? handleDragOver : undefined}
          onDragLeave={!urlInput ? handleDragLeave : undefined}
          onDrop={!urlInput ? handleDrop : undefined}
          onClick={
            !disabled && !isUploading && !urlInput
              ? handleFileSelect
              : undefined
          }
          className={cn(
            "relative flex flex-col items-center justify-center",
            "transition-all duration-200",
            "h-[280px]", // Fixed height for consistency
            urlInput ? "cursor-not-allowed" : "cursor-pointer",
            // Conditional styling based on whether preview is inline
            urlInput && previewInline
              ? [
                  // Preview inline: no borders, no padding, no opacity
                  "p-0",
                ]
              : [
                  // Default dropzone styling
                  "px-6 py-8",
                  "border-2 border-dashed rounded-lg",
                  isDragging && !urlInput
                    ? "border-[var(--primaryColor)] bg-[var(--selected-bg)]"
                    : "border-[var(--border)] bg-[var(--surface)]",
                  !disabled &&
                    !isUploading &&
                    !urlInput &&
                    "hover:border-[var(--primaryColor)] hover:bg-[var(--surface-hover)]",
                  (disabled || isUploading || urlInput) && "opacity-50",
                ],
            error && !urlInput && "border-[var(--errorColor)]"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptType()}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading || !!urlInput}
          />

          {/* Upload Progress or Preview */}
          {isUploading ? (
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text)] mb-2">
                Uploading... {Math.round(progress)}%
              </p>
              <div className="w-48 h-2 bg-[var(--control-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primaryColor)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : urlInput && previewInline ? (
            // Show preview inside dropzone when previewInline is true
            renderPreview()
          ) : urlInput ? (
            // Show success state when file is uploaded (non-inline mode)
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text)]">
                File uploaded successfully
              </p>
            </div>
          ) : (
            // Default state
            <>
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-full mb-4",
                  "bg-[var(--control-bg)]",
                  isDragging && "bg-[var(--selected-bg)]"
                )}
              >
                <Icon
                  size={32}
                  className={cn(
                    "text-[var(--text-muted)]",
                    isDragging && "text-[var(--primaryColor)]"
                  )}
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-[var(--text)] mb-1">
                  {dropzoneText.main}{" "}
                  <span className="text-[var(--primaryColor)] font-medium hover:underline">
                    {browseButtonText}
                  </span>
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {dropzoneText.sub}
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-[var(--errorColor)]"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Preview outside dropzone (only when previewInline is false) */}
        {!previewInline && renderPreview()}
      </div>
    );
  }

  // Default variant (original style)
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <LabelPrimitive.Root
          htmlFor={componentId}
          className="text-sm font-medium text-[var(--text)]"
        >
          {label}
          {required && <span className="text-[var(--errorColor)] ms-1">*</span>}
        </LabelPrimitive.Root>
      )}

      <div className="relative flex-1">
        <input
          ref={inputRef}
          id={componentId}
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder={getPlaceholder()}
          disabled={disabled || isUploading}
          readOnly={!canEnterExternalUrl}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border bg-[var(--control-bg)] text-[var(--text)]",
            "placeholder:text-[var(--text-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primaryColor)] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--errorColor)] focus:ring-[var(--errorColor)]"
              : "border-[var(--border)]",
            !canEnterExternalUrl && "cursor-pointer pe-32",
            canEnterExternalUrl && "pe-24"
          )}
          onClick={!canEnterExternalUrl ? handleFileSelect : undefined}
        />

        {/* Buttons inside input */}
        <div className="absolute inset-y-0 end-0 flex items-center gap-1 pe-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptType()}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileSelect}
            disabled={disabled || isUploading}
            className="shrink-0 h-7 px-2 text-xs"
          >
            {isUploading ? (
              <span>{Math.round(progress)}%</span>
            ) : (
              <>
                <IconUpload size={14} className="me-1" />
                {browseButtonText}
              </>
            )}
          </Button>

          {urlInput && !isUploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="shrink-0 h-7 w-7 p-0"
            >
              <IconX size={14} />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-[var(--errorColor)]"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {renderPreview()}
    </div>
  );
}
