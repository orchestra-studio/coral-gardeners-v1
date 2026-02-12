"use client";

import React from "react";
import { IconTrash, IconEdit, IconDots } from "@tabler/icons-react";
import { usePermission } from "@/hooks/permissions";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import type { Project } from "@/services/projects";

interface ProjectViewActionsProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  t: (key: string) => string;
}

export default function ProjectViewActions({
  project,
  onEdit,
  onDelete,
  t,
}: ProjectViewActionsProps) {
  const { hasPermission } = usePermission();

  // Permission checks
  const canEdit = hasPermission("projects.edit");
  const canDelete = hasPermission("projects.delete");

  const menuItems = [];

  if (onEdit && canEdit) {
    menuItems.push({
      icon: <IconEdit size={16} />,
      label: t("actions.edit"),
      onClick: () => onEdit(project),
    });
  }

  if (onDelete && canDelete) {
    menuItems.push({
      icon: <IconTrash size={16} />,
      label: t("actions.delete"),
      onClick: () => onDelete(project),
    });
  }

  // Don't render if no actions available
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
