"use client";

import Swal from "sweetalert2";

export interface AlertOptions {
  title?: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

export class Alert {
  static success(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--primaryColor, #10b981)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
        cancelButton: "alert-button-cancel",
      },
    });
  }

  static error(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--rejected, #ef4444)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
      },
    });
  }

  static warning(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--pending, #f59e0b)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
      },
    });
  }

  static info(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--primaryColor, #3b82f6)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
      },
    });
  }

  static confirm(options: AlertOptions) {
    return Swal.fire({
      title: options.title || "Are you sure?",
      text: options.text,
      icon: options.icon || "question",
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Yes",
      cancelButtonText: options.cancelButtonText || "Cancel",
      confirmButtonColor:
        options.confirmButtonColor || "var(--primaryColor, #3b82f6)",
      cancelButtonColor:
        options.cancelButtonColor || "var(--neutralMedium, #6b7280)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
        cancelButton: "alert-button-cancel",
      },
    });
  }

  static async confirmAction(
    title: string,
    text: string,
    confirmText: string = "Yes, continue",
    action: () => Promise<void> | void,
    cancelText: string = "Cancel"
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "var(--primaryColor, #3b82f6)",
      cancelButtonColor: "var(--neutralMedium, #6b7280)",
      background: "var(--alert-bg)",
      color: "var(--alert-text)",
      customClass: {
        popup: "alert-popup",
        title: "alert-title",
        htmlContainer: "alert-text",
        confirmButton: "alert-button-confirm",
        cancelButton: "alert-button-cancel",
      },
    });

    if (result.isConfirmed) {
      try {
        await action();
        return true;
      } catch (error) {
        console.error("Action failed:", error);
        Alert.error(
          "Action Failed",
          "An error occurred while performing the action."
        );
        return false;
      }
    }
    return false;
  }
}

export default Alert;
