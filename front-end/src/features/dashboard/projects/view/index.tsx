"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import Alert from "@/components/ui/Alert";
import { useDeleteProject } from "@/services/projects";
import {
  IconCalendar,
  IconFolder,
  IconHash,
  IconServer,
} from "@tabler/icons-react";
import { useProjectData } from "./hooks/useProjectData";
import ProjectViewHeader from "./components/ProjectViewHeader";
import ProjectViewLayout from "./components/ProjectViewLayout";
import ProjectViewSkeleton from "./components/ProjectViewSkeleton";
import ProjectViewEmptyState from "./components/ProjectViewEmptyState";
import CreateProjectForm from "../components/CreateProjectForm";
import type { ProjectInfoItem } from "./components/ProjectInfoSection";

interface ProjectViewContentProps {
  projectId: string;
}

export default function ProjectViewContent({
  projectId,
}: ProjectViewContentProps) {
  const t = useTranslations("dashboard/projects");
  const locale = useLocale() as "en" | "ar";
  const { navigateTo } = useAppNavigation();
  const deleteProject = useDeleteProject();

  // State for edit modal
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Fetch project data
  const { project, isLoading } = useProjectData(projectId);

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle edit (open edit modal)
  const handleEdit = () => {
    if (!project) return;
    setIsEditFormOpen(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (!project) return;

    Alert.confirm({
      title: t("messages.deleteConfirm"),
      text: t("messages.deleteWarning"),
      icon: "warning",
      confirmButtonText: t("actions.delete"),
      cancelButtonText: t("actions.cancel"),
      confirmButtonColor: "var(--rejected, #ef4444)",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject.mutate(project.id, {
          onSuccess: () => {
            navigateTo(`/dashboard/projects/all`);
          },
        });
      }
    });
  };

  // Loading state
  if (isLoading && !project) {
    return (
      <div className="flex flex-col">
        <ProjectViewHeader project={undefined} isLoading={true} />
        <ProjectViewSkeleton />
      </div>
    );
  }

  // Empty state
  if (!project) {
    return (
      <div className="flex flex-col">
        <ProjectViewHeader project={undefined} isLoading={false} />
        <ProjectViewEmptyState
          title={t("view.empty.title")}
          description={t("view.empty.description")}
        />
      </div>
    );
  }

  // Extract translated values
  const name =
    project.translations[locale]?.name || project.translations.en.name;
  const description =
    project.translations[locale]?.description ||
    project.translations.en.description;
  const environment =
    project.translations[locale]?.environment ||
    project.translations.en.environment;
  const statusKey =
    statusMapping[project.status as keyof typeof statusMapping] || "ready";
  const statusLabel = t(`table.status.${statusKey}`);

  // Build details items
  const detailsItems: ProjectInfoItem[] = [
    {
      label: t("view.labels.projectId"),
      value: `#${project.id}`,
      icon: <IconHash size={18} />,
    },
    {
      label: t("view.labels.environment"),
      value: environment,
      icon: <IconServer size={18} />,
    },
    {
      label: t("view.labels.version"),
      value: project.version || "N/A",
      icon: <IconFolder size={18} />,
    },
    {
      label: t("view.labels.status"),
      value: statusLabel,
    },
    {
      label: t("view.labels.createdAt"),
      value: formatDate(project.created_at),
      icon: <IconCalendar size={18} />,
    },
    {
      label: t("view.labels.updatedAt"),
      value: formatDate(project.updated_at),
      icon: <IconCalendar size={18} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <ProjectViewHeader project={project} isLoading={isLoading} />

      <ProjectViewLayout
        project={project}
        name={name}
        description={description}
        status={project.status as "ready" | "in-progress" | "blocked"}
        statusLabel={statusLabel}
        detailsTitle={t("view.sections.details")}
        detailsItems={detailsItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />

      {/* Edit Project Form */}
      {project && (
        <CreateProjectForm
          open={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          project={project}
        />
      )}
    </div>
  );
}
