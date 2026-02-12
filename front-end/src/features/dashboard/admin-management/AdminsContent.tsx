"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/locale/useLocale";
import Alert from "@/components/ui/Alert";
import AdminsTable from "./components/AdminsTable";
import CreateAdminForm from "./components/CreateAdminForm";
import AdminRolesForm from "./components/AdminRolesForm";
import { useDeleteAdmin } from "@/services/adminManagement";
import type { AdminUser } from "@/services/adminManagement";

interface AdminsContentProps {
  isCreateFormOpen?: boolean;
  setIsCreateFormOpen?: (open: boolean) => void;
}

export default function AdminsContent({
  isCreateFormOpen = false,
  setIsCreateFormOpen,
}: AdminsContentProps) {
  const t = useTranslations("dashboard/settings/adminmanagement");
  const router = useRouter();
  const locale = useLocale();

  // Modal state - simplified to match Users pattern
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [adminRolesForm, setAdminRolesForm] = useState<{
    open: boolean;
    admin: AdminUser | null;
  }>({
    open: false,
    admin: null,
  });

  // Mutations
  const deleteAdmin = useDeleteAdmin();

  // Sync isCreateFormOpen with form state
  React.useEffect(() => {
    if (isCreateFormOpen) {
      setSelectedAdmin(null);
      setIsFormOpen(true);
    }
  }, [isCreateFormOpen]);

  const handleDeleteAdmin = useCallback(
    (admin: AdminUser) => {
      Alert.confirm({
        title: t("messages.deleteConfirm"),
        text: t("messages.deleteWarning"),
        icon: "warning",
        confirmButtonText: t("actions.delete"),
        cancelButtonText: t("actions.cancel"),
        confirmButtonColor: "var(--rejected, #ef4444)",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAdmin.mutate(admin.username);
        }
      });
    },
    [deleteAdmin, t]
  );

  const handleEditAdmin = useCallback((admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  }, []);

  const handleViewAdmin = useCallback(
    (admin: AdminUser) => {
      // Navigate to admin view page
      router.push(`/${locale}/dashboard/admins-management/${admin.username}`);
    },
    [router, locale]
  );

  const handleAssignRoles = useCallback((admin: AdminUser) => {
    setAdminRolesForm({ open: true, admin });
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedAdmin(null);
    if (setIsCreateFormOpen) {
      setIsCreateFormOpen(false);
    }
  }, [setIsCreateFormOpen]);

  return (
    <div className="space-y-6">
      <AdminsTable
        onView={handleViewAdmin}
        onDelete={handleDeleteAdmin}
        onEdit={handleEditAdmin}
        onAssignRoles={handleAssignRoles}
      />

      {/* Admin Form (Create/Edit) */}
      <CreateAdminForm
        open={isFormOpen || isCreateFormOpen}
        onClose={handleCloseForm}
        admin={selectedAdmin || undefined}
      />

      {/* Assign Roles Form */}
      {adminRolesForm.open && (
        <AdminRolesForm
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          adminRolesForm={adminRolesForm as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAdminRolesForm={setAdminRolesForm as any}
          getData={() => {
            // Refresh data if needed
          }}
        />
      )}
    </div>
  );
}
