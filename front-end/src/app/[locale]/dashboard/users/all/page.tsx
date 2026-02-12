"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import UsersHeader from "@/features/dashboard/users/components/UsersHeader";
import UsersContent from "@/features/dashboard/users/UsersContent";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function AllUsersPage() {
  const t = useTranslations("dashboard/users");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  return (
    <>
      <UsersHeader
        type="all"
        actions={
          <Button
            onClick={() => setIsCreateFormOpen(true)}
            startIcon={<IconPlus size={16} />}
            size="sm"
          >
            {t("actions.create")}
          </Button>
        }
      />
      <UsersContent
        type="all"
        isCreateFormOpen={isCreateFormOpen}
        setIsCreateFormOpen={setIsCreateFormOpen}
      />
    </>
  );
}
