"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import Alert from "@/components/ui/Alert";
import ProjectsTable from "./components/ProjectsTable";
import ProjectStats from "./components/ProjectStats";
import CreateProjectForm from "./components/CreateProjectForm";
import { useDeleteProject, useRestoreProject } from "@/services/projects";
import { useProjectStatistics } from "./hooks/useProjectStatistics";
import type { Project } from "@/services/projects";

interface ProjectsContentProps {
  type: "all" | "deleted";
  isCreateFormOpen?: boolean;
  setIsCreateFormOpen?: (open: boolean) => void;
}

export default function ProjectsContent({
  type,
  isCreateFormOpen = false,
  setIsCreateFormOpen,
}: ProjectsContentProps) {
  const t = useTranslations("dashboard/projects");
  const { navigateTo } = useAppNavigation();

  // Fetch statistics (only for "all" type)
  const statisticsQuery = useProjectStatistics();
  const stats = statisticsQuery.data;

  // State for edit form
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );

  // Mutations
  const deleteProject = useDeleteProject();
  const restoreProject = useRestoreProject();

  const handleViewProject = (project: Project) => {
    // Only allow viewing for "all" projects, not deleted projects
    if (type === "all") {
      navigateTo(`/dashboard/projects/${type}/${project.id}`);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditFormOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    Alert.confirm({
      title: t("messages.deleteConfirm"),
      text: t("messages.deleteWarning"),
      icon: "warning",
      confirmButtonText: t("actions.delete"),
      cancelButtonText: t("actions.cancel"),
      confirmButtonColor: "var(--rejected, #ef4444)",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject.mutate(project.id);
      }
    });
  };

  const handleRestoreProject = (project: Project) => {
    Alert.confirm({
      title: t("messages.restoreConfirm"),
      text: t("messages.restoreWarning"),
      icon: "question",
      confirmButtonText: t("actions.restore"),
      cancelButtonText: t("actions.cancel"),
      confirmButtonColor: "var(--success, #22c55e)",
    }).then((result) => {
      if (result.isConfirmed) {
        restoreProject.mutate(project.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics - shown for both "all" and "deleted" types */}
      <ProjectStats
        totalCount={stats?.total || 0}
        inProgressCount={stats?.inProgress || 0}
        readyCount={stats?.ready || 0}
        blockedCount={stats?.blocked || 0}
        loading={statisticsQuery.isLoading}
      />

      <ProjectsTable
        type={type}
        onView={type === "all" ? handleViewProject : undefined}
        onEdit={type === "all" ? handleEditProject : undefined}
        onDelete={type === "all" ? handleDeleteProject : undefined}
        onRestore={type === "deleted" ? handleRestoreProject : undefined}
      />

      {/* Create Project Form - only for "all" type */}
      {type === "all" && setIsCreateFormOpen && (
        <CreateProjectForm
          open={isCreateFormOpen}
          onClose={() => setIsCreateFormOpen(false)}
        />
      )}

      {/* Edit Project Form - only for "all" type */}
      {type === "all" && (
        <CreateProjectForm
          open={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedProject(undefined);
          }}
          project={selectedProject}
        />
      )}
    </div>
  );
}
