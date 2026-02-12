"use client";

import React from "react";
import {
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconPhoto,
} from "@tabler/icons-react";
import { Column } from "@/components/Table";
import Status from "@/components/ui/Status";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/permissions";
import Image from "next/image";
import type { Project } from "@/services/projects";

interface ProjectImageCellProps {
  project: Project;
  name: string;
}

interface ProjectNameCellProps {
  project: Project;
  name: string;
  description: string;
}

interface ProjectActionsProps {
  project: Project;
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onRestore?: (project: Project) => void;
  t: (key: string) => string;
}

// Component: Project Image
function ProjectImageCell({ project, name }: ProjectImageCellProps) {
  return (
    <div className="w-12 h-12 rounded-md overflow-hidden bg-[var(--surface-hover)] flex-shrink-0 border border-[var(--border)]">
      {project.image ? (
        <Image
          src={project.image}
          alt={name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconPhoto size={24} className="text-[var(--text-muted)]" />
        </div>
      )}
    </div>
  );
}

// Component: Project Name Cell
function ProjectNameCell({ project, name, description }: ProjectNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <ProjectImageCell project={project} name={name} />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-[var(--text)]">{name}</div>
        <div
          className="text-sm text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ maxWidth: "270px" }}
          title={description}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

// Component: Project Actions
function ProjectActions({
  project,
  onView,
  onEdit,
  onDelete,
  onRestore,
  t,
}: ProjectActionsProps) {
  const { hasPermission } = usePermission();

  // Permission checks
  const canView = hasPermission("projects.view");
  const canEdit = hasPermission("projects.edit");
  const canDelete = hasPermission("projects.delete");
  const canRestore = hasPermission("projects.restore") || canDelete;

  // Determine if this is a deleted project based on available actions
  const isDeleted = !!onRestore;
  const menuItems = [];
  if (!isDeleted) {
    // Actions for active projects
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
  } else {
    // Actions for deleted projects
    if (onRestore && canRestore) {
      menuItems.push({
        icon: <IconRefresh size={16} />,
        label: t("actions.restore"),
        onClick: () => onRestore(project),
      });
    }
  }

  // Don't render actions if user has no permissions at all
  if (!canView && !canEdit && !canDelete && !canRestore) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Button */}
      {onView && canView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(project)}
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
export function createProjectColumns(
  locale: "en" | "ar",
  onView?: (project: Project) => void,
  onEdit?: (project: Project) => void,
  onDelete?: (project: Project) => void,
  onRestore?: (project: Project) => void,
  t?: (key: string) => string
): Column<Project>[] {
  // Status mapping for translation
  const statusMapping = {
    ready: "ready",
    "in-progress": "inProgress",
    blocked: "blocked",
  } as const;

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Get translated values
  const getTranslatedName = (project: Project): string => {
    return project.translations[locale]?.name || project.translations.en.name;
  };

  const getTranslatedDescription = (project: Project): string => {
    return (
      project.translations[locale]?.description ||
      project.translations.en.description
    );
  };

  const getTranslatedEnvironment = (project: Project): string => {
    return (
      project.translations[locale]?.environment ||
      project.translations.en.environment
    );
  };

  return [
    {
      header: t?.("table.columns.name") || "Name",
      accessor: (project) => (
        <ProjectNameCell
          project={project}
          name={getTranslatedName(project)}
          description={getTranslatedDescription(project)}
        />
      ),
    },
    {
      header: t?.("table.columns.status") || "Status",
      accessor: (project) => {
        const statusKey =
          statusMapping[project.status as keyof typeof statusMapping] ||
          "ready";
        return (
          <Status
            variant={project.status as "ready" | "blocked" | "in-progress"}
            label={t?.(`table.status.${statusKey}`) || project.status}
          />
        );
      },
    },
    {
      header: t?.("table.columns.environment") || "Environment",
      accessor: (project) => (
        <span className="text-[var(--text)]">
          {getTranslatedEnvironment(project)}
        </span>
      ),
    },
    {
      header: t?.("table.columns.lastUpdated") || "Last Updated",
      accessor: (project) => (
        <span className="text-[var(--text-muted)]">
          {formatDate(project.updated_at)}
        </span>
      ),
    },
    {
      header: t?.("table.columns.actions") || "Actions",
      accessor: (project) => (
        <ProjectActions
          project={project}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
          t={t || (() => "")}
        />
      ),
      align: "right",
    },
  ];
}
