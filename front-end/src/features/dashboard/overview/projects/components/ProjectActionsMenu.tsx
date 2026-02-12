"use client";

import React from "react";
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import type { ProjectDisplay } from "../types";

interface ProjectActionsMenuProps {
  deployment: ProjectDisplay;
  translations: {
    openActionsMenu: string;
    viewDetails: string;
    edit: string;
    delete: string;
    viewProjectDetails: string;
    editProject: string;
    deleteProject: string;
  };
}

export function ProjectActionsMenu({
  deployment,
  translations,
}: ProjectActionsMenuProps) {
  const { navigateTo } = useAppNavigation();

  const handleViewDetails = () => {
    navigateTo(`/dashboard/projects/all/${deployment.id}`);
  };

  const handleEdit = () => {
    console.log("Edit project:", deployment.id);
  };

  const handleDelete = () => {
    console.log("Delete project:", deployment.id);
  };

  return (
    <DropdownMenu
      align="right"
      trigger={({ toggle }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-[var(--text-muted)] hover:text-[var(--text)] whitespace-nowrap"
          onClick={toggle}
          aria-label={translations.openActionsMenu}
          aria-haspopup="menu"
        >
          <IconDotsVertical size={16} />
        </Button>
      )}
      items={[
        {
          label: translations.viewDetails,
          icon: <IconEye size={14} />,
          onClick: handleViewDetails,
          ariaLabel: translations.viewProjectDetails,
        },
        {
          label: translations.edit,
          icon: <IconEdit size={14} />,
          onClick: handleEdit,
          ariaLabel: translations.editProject,
        },
        {
          label: translations.delete,
          icon: <IconTrash size={14} />,
          danger: true,
          onClick: handleDelete,
          ariaLabel: translations.deleteProject,
        },
      ]}
    />
  );
}
