import React from "react";
import ProfileContent from "@/features/dashboard/settings/Profile/ProfileContent";
import SecurityContent from "@/features/dashboard/settings/Security/SecurityContent";
import AppSettingsContent from "@/features/dashboard/settings/AppSettings/AppSettingsContent";
import type { SettingsTab } from "@/features/dashboard/settings/types";

interface SettingsContentRendererProps {
  activeTab: SettingsTab;
  className?: string;
}

export default function SettingsContentRenderer({
  activeTab,
  className = "",
}: SettingsContentRendererProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "security":
        return <SecurityContent />;
      case "app-settings":
        return <AppSettingsContent />;
      default:
        return <ProfileContent />;
    }
  };

  return <div className={className}>{renderContent()}</div>;
}
