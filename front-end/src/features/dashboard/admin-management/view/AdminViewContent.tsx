"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/locale/useLocale";
import AdminViewHeader from "./AdminViewHeader";
import { AdminViewLayout } from "./components/AdminViewLayout";
import AdminViewSkeleton from "../components/AdminViewSkeleton";
import { useAdminViewData } from "./hooks/useAdminViewData";
import { useUpdateAdmin, useDeleteAdmin } from "@/services/adminManagement";
import type { UpdateAdminRequest } from "@/lib/api/types";
import { toast } from "react-toastify";
import {
  IconMail,
  IconPhone,
  IconUser,
  IconCalendar,
  IconShieldCheck,
} from "@tabler/icons-react";
import type { LayoutInfoItem } from "./components/AdminViewLayout";
import Alert from "@/components/ui/Alert";
import CreateAdminForm from "../components/CreateAdminForm";
import AdminRolesForm from "../components/AdminRolesForm";
import type { AdminUser } from "@/services/adminManagement/types/adminTypes";

interface AdminViewContentProps {
  username: string;
}

export default function AdminViewContent({ username }: AdminViewContentProps) {
  const t = useTranslations("dashboard/settings/adminmanagement");
  const { admin, computed, isLoading } = useAdminViewData(username);
  const { mutateAsync: updateAdmin, isPending: isUpdateLoading } =
    useUpdateAdmin();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();
  const router = useRouter();
  const locale = useLocale();

  // State
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic-info" | "logs">(
    "basic-info"
  );
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [adminRolesForm, setAdminRolesForm] = useState<{
    open: boolean;
    admin: AdminUser | null;
  }>({
    open: false,
    admin: null,
  });

  // Handlers
  const handleToggleEdit = () => {
    if (admin) {
      setIsEditFormOpen(true);
    }
  };

  const handleUpdate = async (
    username: string,
    data: UpdateAdminRequest
  ): Promise<void> => {
    try {
      await updateAdmin({ id: username, adminData: data });
      toast.success(t("messages.updateSuccess"));
      setIsEditMode(false);
    } catch (error) {
      toast.error(t("messages.updateFailed"));
      throw error;
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/dashboard/admins-management`);
  };

  const handleDelete = async () => {
    if (!admin) return;

    await Alert.confirmAction(
      t("table.deleteConfirm.title"),
      t("table.deleteConfirm.message"),
      t("table.actions.delete"),
      async () => {
        await deleteAdmin(admin.username);
        toast.success(t("messages.deleteSuccess"));
        router.push(`/${locale}/dashboard/admins-management`);
      },
      t("table.deleteConfirm.cancel")
    );
  };

  const handleManageRoles = () => {
    if (admin) {
      setAdminRolesForm({ open: true, admin });
    }
  };

  // Loading state
  if (isLoading && !computed) {
    return (
      <div className="flex flex-col">
        <AdminViewHeader username={username} isLoading identity={null} />
        <AdminViewSkeleton onBack={handleBack} />
      </div>
    );
  }

  // Empty state
  if (!computed || !admin) {
    return (
      <div className="flex flex-col">
        <AdminViewHeader
          username={username}
          isLoading={false}
          identity={null}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
              {t("view.empty.title")}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {t("view.empty.description")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Build contact items
  const contactItems: LayoutInfoItem[] = [
    {
      label: t("view.labels.email"),
      value: admin.email || t("view.labels.notProvided"),
      icon: <IconMail size={16} />,
    },
    {
      label: t("view.labels.phone"),
      value: admin.phone || t("view.labels.notProvided"),
      icon: <IconPhone size={16} />,
    },
  ];

  // Build account items
  const accountItems: LayoutInfoItem[] = [
    {
      label: t("view.labels.username"),
      value: admin.username,
      icon: <IconUser size={16} />,
    },
    {
      label: t("view.labels.fullName"),
      value:
        `${admin.first_name} ${admin.last_name}`.trim() ||
        t("view.labels.notProvided"),
      icon: <IconUser size={16} />,
    },
    {
      label: t("view.labels.roles"),
      value:
        admin.roles?.map((r) => r.name).join(", ") || t("view.labels.noRoles"),
      icon: <IconShieldCheck size={16} />,
    },
    {
      label: t("view.labels.createdAt"),
      value: admin.created_at
        ? new Date(admin.created_at).toLocaleDateString()
        : t("view.labels.notProvided"),
      icon: <IconCalendar size={16} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <AdminViewHeader
        username={username}
        identity={{
          ...computed.identity,
          statusLabel: t(computed.identity.statusLabelKey),
        }}
        isLoading={isLoading}
      />

      <AdminViewLayout
        identity={{
          ...computed.identity,
          statusLabel: t(computed.identity.statusLabelKey),
        }}
        contactTitle={t("view.sections.contact")}
        contactItems={contactItems}
        accountTitle={t("view.sections.account")}
        accountItems={accountItems}
        admin={admin}
        isEditMode={isEditMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleEdit={handleToggleEdit}
        onDelete={handleDelete}
        onManageRoles={handleManageRoles}
        t={t}
      />

      {/* Edit Admin Form */}
      {admin && (
        <CreateAdminForm
          open={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          admin={admin}
        />
      )}

      {/* Assign Roles Form */}
      {adminRolesForm.open && adminRolesForm.admin && (
        <AdminRolesForm
          adminRolesForm={adminRolesForm}
          setAdminRolesForm={setAdminRolesForm}
          getData={() => {
            // Refresh data if needed
          }}
        />
      )}
    </div>
  );
}
