"use client";

import React from "react";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconShield,
  IconEye,
} from "@tabler/icons-react";
import { Column } from "@/components/Table";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import UserName from "@/components/ui/UserName";
import { usePermission } from "@/hooks/permissions";
import type { AdminUser } from "@/services/adminManagement";
import { formatDate } from "../../utils";

// Component: Admin Actions
function AdminActions({
  admin,
  onView,
  onEdit,
  onDelete,
  onAssignRoles,
  t,
}: {
  admin: AdminUser;
  onView?: (admin: AdminUser) => void;
  onEdit?: (admin: AdminUser) => void;
  onDelete?: (admin: AdminUser) => void;
  onAssignRoles?: (admin: AdminUser) => void;
  t: (key: string) => string;
}) {
  const { hasPermission } = usePermission();
  const canView = hasPermission("admins.view");
  const canEdit = hasPermission("admins.edit");
  const canDelete = hasPermission("admins.delete");
  const canAssignRoles = hasPermission("admins.assign_roles");

  const menuItems = [];

  if (onEdit && canEdit) {
    menuItems.push({
      icon: <IconEdit size={16} />,
      label: t("actions.edit"),
      onClick: () => onEdit(admin),
    });
  }

  if (onAssignRoles && canAssignRoles) {
    menuItems.push({
      icon: <IconShield size={16} />,
      label: t("actions.assignRoles"),
      onClick: () => onAssignRoles(admin),
    });
  }

  if (onDelete && canDelete) {
    menuItems.push({
      icon: <IconTrash size={16} />,
      label: t("actions.delete"),
      onClick: () => onDelete(admin),
    });
  }

  // Don't render actions if user has no permissions
  if (!canView && !canEdit && !canDelete && !canAssignRoles) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Button */}
      {onView && canView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(admin)}
          startIcon={<IconEye size={16} />}
        >
          {t("actions.view")}
        </Button>
      )}

      {/* Actions Menu */}
      {menuItems.length > 0 && (
        <DropdownMenu
          portal
          menuClassName="min-w-[180px]"
          trigger={({ toggle }) => (
            <IconButton variant="ghost" size="md" onClick={toggle}>
              <IconDots size={16} className="rotate-90" />
            </IconButton>
          )}
          items={menuItems}
        />
      )}
    </div>
  );
}

// Create columns function
export function createAdminColumns(
  t: (key: string) => string,
  onView?: (admin: AdminUser) => void,
  onEdit?: (admin: AdminUser) => void,
  onDelete?: (admin: AdminUser) => void,
  onAssignRoles?: (admin: AdminUser) => void
): Column<AdminUser>[] {
  return [
    {
      header: t("table.columns.name"),
      accessor: (admin) => (
        <UserName
          profile_image={admin.profile_picture || admin.profile_image}
          first_name={admin.first_name}
          last_name={admin.last_name}
          roles={admin.roles?.map((r) => r.name) || []}
          className="min-w-[210px]"
        />
      ),
    },
    {
      header: t("table.columns.email"),
      accessor: (admin) => admin.email,
    },
    {
      header: t("table.columns.phone"),
      accessor: (admin) => <span dir="ltr">{admin.phone || "—"}</span>,
    },
    {
      header: t("table.columns.createdAt"),
      accessor: (admin) => formatDate(admin.created_at),
    },
    {
      header: t("table.columns.actions"),
      accessor: (admin) => (
        <AdminActions
          admin={admin}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAssignRoles={onAssignRoles}
          t={t}
        />
      ),
      align: "right",
    },
  ];
}
