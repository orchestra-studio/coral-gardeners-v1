"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SmoothTabs, SmoothTabItem } from "@/components/ui/SmoothTabs";
import { User, Settings, Bell } from "lucide-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface SmoothTabsDemoProps {
  className?: string;
}

export default function SmoothTabsDemo({ className }: SmoothTabsDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [activeTab, setActiveTab] = useState("profile");

  const tabs: SmoothTabItem[] = [
    {
      id: "profile",
      title: t("components.smoothTabs.labels.profile"),
      icon: User,
      content: (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            {t("components.smoothTabs.labels.profile")}
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {t("components.smoothTabs.messages.profileContent")}
          </p>
        </div>
      ),
    },
    {
      id: "settings",
      title: t("components.smoothTabs.labels.settings"),
      icon: Settings,
      content: (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            {t("components.smoothTabs.labels.settings")}
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {t("components.smoothTabs.messages.settingsContent")}
          </p>
        </div>
      ),
    },
    {
      id: "notifications",
      title: t("components.smoothTabs.labels.notifications"),
      icon: Bell,
      content: (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            {t("components.smoothTabs.labels.notifications")}
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {t("components.smoothTabs.messages.notificationsContent")}
          </p>
        </div>
      ),
    },
  ];

  return (
    <DemoCard
      title={t("components.smoothTabs.title")}
      description={t("components.smoothTabs.description")}
      className={className}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <SmoothTabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          showCardContent={false}
          cardHeight="auto"
          tabsPosition="top"
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const tabs = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
    content: <div>Profile content</div>
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    content: <div>Settings content</div>
  }
];

<SmoothTabs
  items={tabs}
  value={activeTab}
  onValueChange={setActiveTab}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
