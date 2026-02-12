"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import Alert from "@/components/ui/Alert";
import UsersTable from "./components/UsersTable";
import CreateUserForm from "./components/CreateUserForm";
import {
  useDeleteUser,
  useRestoreUser,
  useChangeUserPassword,
  useResendVerificationEmail,
  useMarkEmailVerified,
  useMarkEmailUnverified,
} from "@/services/users";
import {
  UserChangePasswordModal,
  UserChangePasswordFormData,
} from "./components/UserChangePassword";
import type { User } from "@/services/users";

interface UsersContentProps {
  type: "all" | "deleted";
  isCreateFormOpen?: boolean;
  setIsCreateFormOpen?: (open: boolean) => void;
}

export default function UsersContent({
  type,
  isCreateFormOpen = false,
  setIsCreateFormOpen,
}: UsersContentProps) {
  const t = useTranslations("dashboard/users");
  const { navigateTo } = useAppNavigation();

  // Modal state
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mutations
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();
  const changePassword = useChangeUserPassword();
  const resendVerification = useResendVerificationEmail();
  const markVerified = useMarkEmailVerified();
  const markUnverified = useMarkEmailUnverified();

  // Form state management - removed create functionality

  const handleViewUser = (user: User) => {
    // Only allow viewing for "all" users, not deleted users
    if (type === "all") {
      navigateTo(`/dashboard/users/${type}/${user.username}`);
    }
  };

  const handleChangePassword = useCallback((user: User) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  }, []);

  const handleChangePasswordSubmit = useCallback(
    (username: string, data: UserChangePasswordFormData) => {
      changePassword.mutate(
        { username, data: { new_password: data.newPassword } },
        {
          onSuccess: () => {
            setIsChangePasswordModalOpen(false);
            setSelectedUser(null);
          },
        }
      );
    },
    [changePassword]
  );

  const handleDeleteUser = (user: User) => {
    Alert.confirm({
      title: t("messages.deleteConfirm"),
      text: t("messages.deleteWarning"),
      icon: "warning",
      confirmButtonText: t("actions.delete"),
      cancelButtonText: t("actions.cancel"),
      confirmButtonColor: "var(--rejected, #ef4444)",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(user.username);
      }
    });
  };

  const handleRestoreUser = (user: User) => {
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
  };

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

  const handleMarkUnverified = useCallback(
    (user: User) => {
      markUnverified.mutate(user.username);
    },
    [markUnverified]
  );

  // No header actions since users are created through registration
  // Header is now handled at the page level

  return (
    <div className="space-y-6">
      <UsersTable
        type={type}
        onView={type === "all" ? handleViewUser : undefined}
        onDelete={type === "all" ? handleDeleteUser : undefined}
        onRestore={type === "deleted" ? handleRestoreUser : undefined}
        onChangePassword={handleChangePassword}
        onResendVerification={handleResendVerification}
        onMarkVerified={handleMarkVerified}
        onMarkUnverified={handleMarkUnverified}
      />

      {/* Create User Form - only for "all" type */}
      {type === "all" && setIsCreateFormOpen && (
        <CreateUserForm
          open={isCreateFormOpen}
          onClose={() => setIsCreateFormOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {selectedUser && (
        <UserChangePasswordModal
          user={selectedUser}
          isOpen={isChangePasswordModalOpen}
          onClose={() => {
            setIsChangePasswordModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleChangePasswordSubmit}
          isLoading={changePassword.isPending}
        />
      )}
    </div>
  );
}
