import { notFound } from "next/navigation";
import ProjectViewContent from "@/features/dashboard/projects/view";

interface PageProps {
  params: Promise<{
    locale: string;
    id?: string;
  }>;
}

export default async function ProjectViewPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <ProjectViewContent projectId={id} />;
}
