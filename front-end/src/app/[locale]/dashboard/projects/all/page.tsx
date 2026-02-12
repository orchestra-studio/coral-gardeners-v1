"use client";

import React, { useState } from "react";
import { ProjectsHeader, ProjectsContent } from "@/features/dashboard/projects";

export default function AllProjectsPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  return (
    <>
      <ProjectsHeader
        type="all"
        onCreateClick={() => setIsCreateFormOpen(true)}
      />
      <ProjectsContent
        type="all"
        isCreateFormOpen={isCreateFormOpen}
        setIsCreateFormOpen={setIsCreateFormOpen}
      />
    </>
  );
}
