import { notFound } from "next/navigation";
import AdminViewContent from "@/features/dashboard/admin-management/view";

interface PageProps {
  params: Promise<{
    locale: string;
    username?: string;
  }>;
}

export default async function AdminViewPage({ params }: PageProps) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  return <AdminViewContent username={username} />;
}
