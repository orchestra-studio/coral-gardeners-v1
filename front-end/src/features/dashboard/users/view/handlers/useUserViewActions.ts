import { useCallback } from "react";
import Alert from "@/components/ui/Alert";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import type { User } from "@/services/users";
import type { UserChangePasswordFormData } from "../../components/UserChangePassword";
import {
    useDeleteUser,
    useRestoreUser,
    useChangeUserPassword,
    useResendVerificationEmail,
    useMarkEmailVerified,
} from "@/services/users";

interface UseUserViewActionsParams {
    t: (key: string) => string;
    onPasswordChangeSuccess: () => void;
}

export function useUserViewActions({
    t,
    onPasswordChangeSuccess,
}: UseUserViewActionsParams) {
    // Mutations
    const deleteUser = useDeleteUser();
    const restoreUser = useRestoreUser();
    const changePassword = useChangeUserPassword();
    const resendVerification = useResendVerificationEmail();
    const markVerified = useMarkEmailVerified();

    // Navigation
    const { navigateTo } = useAppNavigation();

    const handleChangePasswordSubmit = useCallback(
        (username: string, data: UserChangePasswordFormData) => {
            changePassword.mutate(
                { username, data: { new_password: data.newPassword } },
                {
                    onSuccess: onPasswordChangeSuccess,
                }
            );
        },
        [changePassword, onPasswordChangeSuccess]
    );

    const handleDeleteUser = useCallback(
        (user: User) => {
            Alert.confirm({
                title: t("messages.deleteConfirm"),
                text: t("messages.deleteWarning"),
                icon: "warning",
                confirmButtonText: t("actions.delete"),
                cancelButtonText: t("actions.cancel"),
                confirmButtonColor: "var(--rejected, #ef4444)",
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteUser.mutate(user.username, {
                        onSuccess: () => {
                            // Navigate back to "All" users page after successful deletion
                            navigateTo("/dashboard/users/all");
                        }
                    });
                }
            });
        },
        [deleteUser, navigateTo, t]
    );

    const handleRestoreUser = useCallback(
        (user: User) => {
            Alert.confirm({
                title: t("messages.restoreConfirm"),
                text: t("messages.restoreWarning"),
                icon: "question",
                confirmButtonText: t("actions.restore"),
                cancelButtonText: t("actions.cancel"),
                confirmButtonColor: "var(--success, #22c55e)",
            }).then((result) => {
                if (result.isConfirmed) {
                    restoreUser.mutate(user.username);
                }
            });
        },
        [restoreUser, t]
    );

    const handleResendVerification = useCallback(
        (user: User) => {
            resendVerification.mutate(user.username);
        },
        [resendVerification]
    );

    const handleMarkVerified = useCallback(
        (user: User) => {
            markVerified.mutate(user.username);
        },
        [markVerified]
    );

    return {
        // Mutation states
        isChangePasswordLoading: changePassword.isPending,

        // Action handlers
        handleChangePasswordSubmit,
        handleDeleteUser,
        handleRestoreUser,
        handleResendVerification,
        handleMarkVerified,
    };
}