"use client";

import React from "react";
import {
  IconTrash,
  IconRefresh,
  IconMail,
  IconCheck,
  IconDots,
  IconLock,
} from "@tabler/icons-react";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import { usePermission } from "@/hooks/permissions";
import type { User } from "@/services/users";

interface UserViewActionsProps {
  user: User;
  onDelete?: (user: User) => void;
  onRestore?: (user: User) => void;
  onResendVerification?: (user: User) => void;
  onMarkVerified?: (user: User) => void;
  onChangePassword?: (user: User) => void;
  t: (key: string) => string;
}

export default function UserViewActions({
  user,
  onDelete,
  onRestore,
  onResendVerification,
  onMarkVerified,
  onChangePassword,
  t,
}: UserViewActionsProps) {
  const isDeleted = !!user.deleted_at;
  const isVerified = !!user.email_verified_at;

  // Permission checks
  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("users.update");
  const canDelete = hasPermission("users.delete");

  const menuItems = [];

  if (!isDeleted) {
    // Actions for active users
    if (onChangePassword && canUpdate) {
      menuItems.push({
        icon: <IconLock size={16} />,
        label: t("actions.changePassword"),
        onClick: () => onChangePassword(user),
      });
    }

    if (!isVerified && onResendVerification && canUpdate) {
      menuItems.push({
        icon: <IconMail size={16} />,
        label: t("actions.resendVerification"),
        onClick: () => onResendVerification(user),
      });
    }

    if (!isVerified && onMarkVerified && canUpdate) {
      menuItems.push({
        icon: <IconCheck size={16} />,
        label: t("actions.markVerified"),
        onClick: () => onMarkVerified(user),
      });
    }

    if (onDelete && canDelete) {
      menuItems.push({
        icon: <IconTrash size={16} />,
        label: t("actions.delete"),
        onClick: () => onDelete(user),
      });
    }
  } else {
    // Actions for deleted users - restore requires update permission
    if (onRestore && canUpdate) {
      menuItems.push({
        icon: <IconRefresh size={16} />,
        label: t("actions.restore"),
        onClick: () => onRestore(user),
      });
    }
  }

  // Don't render menu if no actions are available
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <DropdownMenu
      portal
      menuClassName="min-w-[180px]"
      trigger={({ toggle }) => (
        <IconButton variant="ghost" size="md" onClick={toggle}>
          <IconDots size={16} />
        </IconButton>
      )}
      items={menuItems}
    />
  );
}
