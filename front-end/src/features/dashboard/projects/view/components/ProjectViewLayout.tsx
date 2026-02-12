"use client";

import React from "react";
import type { Project } from "@/services/projects";
import ProjectImage from "./ProjectImage";
import ProjectHeaderInfo from "./ProjectHeaderInfo";
import ProjectInfoSection, { type ProjectInfoItem } from "./ProjectInfoSection";
import ProjectViewActions from "./ProjectViewActions";

interface ProjectViewLayoutProps {
  project: Project;
  name: string;
  description: string;
  status: "ready" | "in-progress" | "blocked";
  statusLabel: string;
  detailsTitle: string;
  detailsItems: ProjectInfoItem[];
  detailsIcon?: React.ReactNode;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  t: (key: string) => string;
}

const cardClass = "bg-[var(--surface)]";

export default function ProjectViewLayout({
  project,
  name,
  description,
  status,
  statusLabel,
  detailsTitle,
  detailsItems,
  detailsIcon,
  onEdit,
  onDelete,
  t,
}: ProjectViewLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Main project card */}
      <div className={`rounded-lg ${cardClass} p-6`}>
        <div className="flex items-start gap-4">
          <ProjectImage image={project.image} name={name} />

          <div className="flex-1">
            <ProjectHeaderInfo
              name={name}
              description={description}
              status={status}
              statusLabel={statusLabel}
            />
          </div>

          {/* Actions positioned on the right */}
          <ProjectViewActions
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            t={t}
          />
        </div>
      </div>

      {/* Technical Details */}
      <ProjectInfoSection
        title={detailsTitle}
        items={detailsItems}
        icon={detailsIcon}
      />
    </div>
  );
}
