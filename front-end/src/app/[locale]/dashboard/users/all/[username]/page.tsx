import { notFound } from "next/navigation";
import UserViewContent from "@/features/dashboard/users/view";

interface PageProps {
  params: Promise<{
    locale: string;
    username?: string;
  }>;
}

export default async function UserViewPage({ params }: PageProps) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  return <UserViewContent username={username} />;
}
