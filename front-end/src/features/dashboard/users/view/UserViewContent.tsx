"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import UserViewHeader from "@/features/dashboard/users/view/UserViewHeader";
import UserViewLayout from "./components/UserViewLayout";
import UserViewSkeleton from "./components/UserViewSkeleton";
import UserViewEmptyState from "./components/UserViewEmptyState";
import { UserChangePasswordModal } from "../components/UserChangePassword";
import { useUserViewData } from "./hooks/useUserViewData";
import {
  buildQuickStats,
  buildContactItems,
  buildAccountItems,
  useDateTimeFormatter,
  useUserViewActions,
} from "./constants";

interface UserViewContentProps {
  username: string;
}

export default function UserViewContent({ username }: UserViewContentProps) {
  const t = useTranslations("dashboard/users");
  const { computed, isLoading, user } = useUserViewData(username);
  const { formatDateTime } = useDateTimeFormatter();

  // Modal state
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // Action handlers
  const {
    isChangePasswordLoading,
    handleChangePasswordSubmit,
    handleDeleteUser,
    handleRestoreUser,
    handleResendVerification,
    handleMarkVerified,
  } = useUserViewActions({
    t,
    onPasswordChangeSuccess: () => setIsChangePasswordModalOpen(false),
  });

  // Loading state
  if (isLoading && !computed) {
    return (
      <div className="flex flex-col  ">
        <UserViewHeader username={username} isLoading identity={null} />
        <UserViewSkeleton />
      </div>
    );
  }

  // Empty state
  if (!computed || !user) {
    return (
      <div className="flex flex-col  ">
        <UserViewHeader username={username} isLoading={false} identity={null} />
        <UserViewEmptyState
          title={t("view.empty.title")}
          description={t("view.empty.description")}
        />
      </div>
    );
  }

  // Build data with utilities
  const formatDateTimeWithFallback = (value: string | null) =>
    formatDateTime(value, t("view.labels.notProvided"));

  const quickStats = buildQuickStats({ computed, t });
  const contactItems = buildContactItems({
    computed,
    t,
    formatDateTime: formatDateTimeWithFallback,
  });
  const accountItems = buildAccountItems({
    computed,
    t,
    formatDateTime: formatDateTimeWithFallback,
  });

  const verificationLabel = t(computed.verification.labelKey);

  return (
    <div className="flex flex-col">
      <UserViewHeader
        username={username}
        identity={computed.identity}
        isLoading={isLoading}
      />

      <UserViewLayout
        identity={computed.identity}
        verification={{
          ...computed.verification,
          label: verificationLabel,
        }}
        quickStats={quickStats}
        contactTitle={t("view.sections.contact")}
        contactItems={contactItems}
        accountTitle={t("view.sections.account")}
        accountItems={accountItems}
        user={user}
        onChangePassword={() => setIsChangePasswordModalOpen(true)}
        onDelete={!user.deleted_at ? handleDeleteUser : undefined}
        onRestore={user.deleted_at ? handleRestoreUser : undefined}
        onResendVerification={handleResendVerification}
        onMarkVerified={handleMarkVerified}
        t={t}
      />

      {/* Change Password Modal */}
      {user && (
        <UserChangePasswordModal
          user={user}
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSubmit={handleChangePasswordSubmit}
          isLoading={isChangePasswordLoading}
        />
      )}
    </div>
  );
}
