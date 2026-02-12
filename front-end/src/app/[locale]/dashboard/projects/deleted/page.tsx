import { ProjectsHeader, ProjectsContent } from "@/features/dashboard/projects";

export default function DeletedProjectsPage() {
  return (
    <>
      <ProjectsHeader type="deleted" />
      <ProjectsContent type="deleted" />
    </>
  );
}
