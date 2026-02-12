import { useCallback } from "react";
import { useChangePassword } from "@/services/security";
import { SecurityFormData } from "../types";

/**
 * Hook for managing security form submission
 */
export const useSecurity = () => {
    const changePasswordMutation = useChangePassword();

    const changePassword = useCallback(async (data: SecurityFormData, onSuccess: () => void) => {
        try {
            await changePasswordMutation.mutateAsync({
                current_password: data.currentPassword,
                password: data.newPassword,
                password_confirmation: data.confirmPassword,
            });

            onSuccess();
        } catch (error) {
            console.error("Password change error:", error);
            // Error toast is now handled by the service layer mutation
        }
    }, [changePasswordMutation]);

    return {
        changePassword,
        isChangingPassword: changePasswordMutation.isPending,
    };
};