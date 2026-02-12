"use client";

import React from "react";
import { useTranslations } from "next-intl";
import UserName from "@/components/ui/UserName";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface UserNameDemoProps {
  className?: string;
}

export default function UserNameDemo({ className }: UserNameDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.userName.title")}
      description={t("components.userName.description")}
      className={className}
    >
      <div className="flex flex-col gap-10">
        <UserName
          first_name="John"
          last_name="Doe"
          email="john.doe@example.com"
          roles={["Admin"]}
          isTrusted={true}
          avatarSize="md"
        />

        <UserName
          first_name="Jane"
          last_name="Smith"
          email="jane.smith@example.com"
          roles={["Developer", "Designer"]}
          avatarSize="lg"
        />

        <UserName first_name="Mike" last_name="Johnson" avatarSize="sm" />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<UserName
  first_name="John"
  last_name="Doe"
  email="john.doe@example.com"
  roles={["Admin"]}
  isTrusted={true}
  avatarSize="md"
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
