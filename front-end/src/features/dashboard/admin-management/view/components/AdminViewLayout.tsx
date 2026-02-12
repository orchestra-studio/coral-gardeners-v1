"use client";

import React, { useState } from "react";
import { IconMail, IconShieldCheck, IconFileText } from "@tabler/icons-react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import type { AdminIdentityMeta } from "../hooks/useAdminViewData";
import type { AdminUser } from "@/lib/api/types";
import { AdminAvatar } from "./AdminAvatar";
import { AdminHeaderInfo } from "./AdminHeaderInfo";
import { InfoSection } from "./InfoSection";
import CreateAdminForm from "../../components/CreateAdminForm";
import { AdminHeaderActions } from "./AdminHeaderActions";

export interface LayoutInfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface AdminViewLayoutProps {
  identity: AdminIdentityMeta & { statusLabel: string };
  contactTitle: string;
  contactItems: LayoutInfoItem[];
  accountTitle: string;
  accountItems: LayoutInfoItem[];
  admin: AdminUser;
  isEditMode: boolean;
  activeTab: "basic-info" | "logs";
  onTabChange: (tab: "basic-info" | "logs") => void;
  onToggleEdit: () => void;
  onDelete?: () => void;
  onManageRoles?: () => void;
  t: (key: string) => string;
}

const cardClass = "bg-[var(--surface)]";

export function AdminViewLayout({
  identity,
  contactTitle,
  contactItems,
  accountTitle,
  accountItems,
  admin,
  isEditMode,
  activeTab,
  onTabChange,
  onToggleEdit,
  onDelete,
  onManageRoles,
  t,
}: AdminViewLayoutProps) {
  const [hasImageError, setHasImageError] = useState(false);

  // Tab items with same styling as UsersTabs
  const tabItems = [
    {
      id: "basic-info" as const,
      label: t("view.tabs.basicInfo"),
    },
    {
      id: "logs" as const,
      label: t("view.tabs.logs"),
    },
  ];

  return (
    <div className="flex flex-col gap-4 ">
      <div
        className={`rounded-lg overflow-hidden bg-[var(--surface)] ${cardClass}`}
      >
        <div className="px-6 pb-6 mt-18 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <AdminAvatar
              identity={identity}
              hasImageError={hasImageError}
              onImageError={() => setHasImageError(true)}
            />

            <AdminHeaderInfo identity={identity} />

            {/* Actions positioned on the right */}
            <div className="sm:mb-4">
              <AdminHeaderActions
                admin={admin}
                onEdit={onToggleEdit}
                onDelete={onDelete}
                onManageRoles={onManageRoles}
                t={t}
              />
            </div>
          </div>

          {/* Roles Display */}
          {admin.roles && admin.roles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <IconShieldCheck
                  size={16}
                  className="text-[var(--text-muted)]"
                />
                <span className="text-sm font-medium text-[var(--text-muted)]">
                  {t("view.labels.roles")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {admin.roles.map((role, index) => (
                  <Badge key={index} variant="default" size="md">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Tabs - Using Tabs component with underline variant like UsersTabs */}
      <Tabs
        items={tabItems}
        value={activeTab}
        onValueChange={onTabChange}
        variant="underline"
        size="md"
        className="w-full"
        containerClassName={` rounded-lg`}
      />

      {/* Tab Content */}
      {activeTab === "basic-info" && (
        <>
          {/* Edit Form Modal */}
          <CreateAdminForm
            open={isEditMode}
            onClose={onToggleEdit}
            admin={admin}
          />

          {/* Info Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoSection
              title={accountTitle}
              icon={<IconShieldCheck size={20} />}
              items={accountItems}
            />

            <InfoSection
              title={contactTitle}
              icon={<IconMail size={20} />}
              items={contactItems}
            />
          </div>
        </>
      )}

      {activeTab === "logs" && (
        <div className={`rounded-lg p-6 ${cardClass}`}>
          <div className="flex items-center gap-2 mb-6">
            <IconFileText size={20} />
            <h2 className="text-lg font-semibold">{t("view.tabs.logs")}</h2>
          </div>
          <div className="text-center py-12 text-[var(--text-muted)]">
            <IconFileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t("view.logs.placeholder")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
