"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocale } from "@/hooks/locale/useLocale";

export default function UsersPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Redirect to the first tab by default
    router.replace(`/${locale}/dashboard/users/all`);
  }, [router, locale]);

  return null;
}
