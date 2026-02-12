"use client";

import React from "react";
import {
  IconEdit,
  IconTrash,
  IconUsers,
  IconRefresh,
  IconDots,
} from "@tabler/icons-react";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import { usePermission } from "@/hooks/permissions";
import type { AdminUser } from "@/services/adminManagement/types/adminTypes";

interface AdminHeaderActionsProps {
  admin: AdminUser;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onManageRoles?: (admin: AdminUser) => void;
  isLoading?: boolean;
  t: (key: string) => string;
}

export function AdminHeaderActions({
  admin,
  onEdit,
  onDelete,
  onRestore,
  onManageRoles,
  isLoading = false,
  t,
}: AdminHeaderActionsProps) {
  const isDeleted = !!admin.deleted_at;
  const { hasPermission } = usePermission();

  // Permission checks
  const canEdit = hasPermission("admins.edit");
  const canDelete = hasPermission("admins.delete");
  const canAssignRoles = hasPermission("admins.assign_roles");

  const menuItems = [];

  if (!isDeleted) {
    // Actions for active admins
    if (onEdit && canEdit) {
      menuItems.push({
        icon: <IconEdit size={16} />,
        label: t("view.actions.edit"),
        onClick: onEdit,
      });
    }

    if (onManageRoles && canAssignRoles) {
      menuItems.push({
        icon: <IconUsers size={16} />,
        label: t("table.actions.roles"),
        onClick: () => onManageRoles(admin),
      });
    }

    if (onDelete && canDelete) {
      menuItems.push({
        icon: <IconTrash size={16} />,
        label: t("view.actions.delete"),
        onClick: onDelete,
      });
    }
  } else {
    // Actions for deleted admins - restore requires edit permission
    if (onRestore && canEdit) {
      menuItems.push({
        icon: <IconRefresh size={16} />,
        label: t("view.actions.restore"),
        onClick: onRestore,
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
        <IconButton
          variant="ghost"
          size="md"
          onClick={toggle}
          disabled={isLoading}
        >
          <IconDots size={16} />
        </IconButton>
      )}
      items={menuItems}
    />
  );
}

export default AdminHeaderActions;
