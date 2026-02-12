"use client";

import React from "react";
import Sheet from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormSheetAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}

export interface FormSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitLoadingText?: string;
  maxWidth?: number;
  customActions?: FormSheetAction[];
  contentClassName?: string;
}

/**
 * FormSheet - A reusable form container component with Sheet
 *
 * @example
 * ```tsx
 * <FormSheet
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Create Project"
 *   onSubmit={handleSubmit}
 *   submitLabel="Create"
 *   cancelLabel="Cancel"
 *   isSubmitting={isPending}
 * >
 *   <FormField label="Name" error={errors.name}>
 *     <Input value={name} onChange={setName} />
 *   </FormField>
 * </FormSheet>
 * ```
 */
export default function FormSheet({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isSubmitting = false,
  submitLoadingText,
  maxWidth = 450,
  customActions,
  contentClassName = "",
}: FormSheetProps) {
  const renderActions = () => {
    if (customActions) {
      return (
        <div className="flex items-center justify-end gap-3 w-full">
          {customActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              onClick={action.onClick}
              loading={action.loading}
              loadingText={action.loadingText}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-3 w-full">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
        {onSubmit && (
          <Button
            onClick={onSubmit}
            loading={isSubmitting}
            loadingText={submitLoadingText || submitLabel}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      actions={renderActions()}
      contentClassName={cn("flex flex-col gap-6 pb-10!", contentClassName)}
    >
      {children}
    </Sheet>
  );
}
