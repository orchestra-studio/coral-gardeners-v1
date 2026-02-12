"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocale } from "@/hooks/locale/useLocale";

export default function ProjectsPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Redirect to the first tab by default
    router.replace(`/${locale}/dashboard/projects/all`);
  }, [router, locale]);

  return null;
}
