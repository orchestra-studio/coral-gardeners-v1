"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function AvatarDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.avatar.title")}
      description={t("components.avatar.description")}
    >
      {/* Fallback Avatars */}
      <div>
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.avatar.sections.fallback")}
        </p>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* With Images */}
      <div>
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.avatar.sections.withImage")}
        </p>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
              alt="Alice Brown"
            />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
              alt="Bob Smith"
            />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Fallback Avatar
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With Image
<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User Name" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
