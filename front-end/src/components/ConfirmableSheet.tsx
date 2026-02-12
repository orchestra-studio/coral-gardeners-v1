"use client";

import React, { useCallback } from "react";
import Sheet, { SheetProps } from "@/components/ui/Sheet";
import { Alert } from "@/components/ui/Alert";

export interface ConfirmableSheetProps extends Omit<SheetProps, "onClose"> {
  /**
   * Called when user confirms to close (or there are no unsaved changes)
   */
  onClose: () => void;
  /**
   * Whether there are unsaved changes in the form
   */
  hasUnsavedChanges?: boolean;
  /**
   * Confirmation dialog messages
   */
  confirmationMessages?: {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  };
  /**
   * If true, always show confirmation (regardless of hasUnsavedChanges)
   */
  alwaysConfirm?: boolean;
}

/**
 * Sheet component with built-in confirmation dialog for unsaved changes
 * Shows a confirmation alert when user tries to close the sheet with unsaved data
 */
export default function ConfirmableSheet({
  onClose,
  hasUnsavedChanges = false,
  confirmationMessages,
  alwaysConfirm = false,
  ...sheetProps
}: ConfirmableSheetProps) {
  const handleClose = useCallback(async () => {
    // Show confirmation if there are unsaved changes or alwaysConfirm is true
    if (hasUnsavedChanges || alwaysConfirm) {
      const result = await Alert.confirm({
        title: confirmationMessages?.title || "Discard unsaved changes?",
        text:
          confirmationMessages?.text ||
          "You have unsaved changes. Are you sure you want to close without saving?",
        icon: "warning",
        confirmButtonText: confirmationMessages?.confirmButtonText || "Discard",
        cancelButtonText:
          confirmationMessages?.cancelButtonText || "Keep Editing",
        confirmButtonColor: "var(--destructive, #ef4444)",
      });

      if (result.isConfirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, alwaysConfirm, confirmationMessages, onClose]);

  return <Sheet {...sheetProps} onClose={handleClose} />;
}
