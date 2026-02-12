"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { SettingsHeader } from "@/layouts/dashboard/settings";
import { IconSettings } from "@tabler/icons-react";
import {
  useAppSettingsList,
  useUpdateAppSetting,
  useDeleteAppSetting,
  type AppSetting,
} from "@/services/appSettings";
import AppSettingsTable from "./AppSettingsTable";
import Alert from "@/components/ui/Alert";

interface AppSettingsContentProps {
  className?: string;
}

export default function AppSettingsContent({
  className = "",
}: AppSettingsContentProps) {
  const t = useTranslations("dashboard/settings/appsettings");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
  }>({});

  // Use TanStack Query for app settings list with pagination
  const settingsQuery = useAppSettingsList({
    page: currentPage,
    page_count: 6,
    ...filters,
  });

  // Use TanStack Query for updating and deleting app settings
  const updateSettingMutation = useUpdateAppSetting();
  const deleteSettingMutation = useDeleteAppSetting();

  // Handle errors
  React.useEffect(() => {
    if (settingsQuery.error && !settingsQuery.data) {
      console.error("Error fetching app settings:", settingsQuery.error);
      toast.error(t("messages.fetchError"));
    }
  }, [settingsQuery.data, settingsQuery.error, t]);

  const handleEdit = (setting: AppSetting) => {
    setEditingId(setting.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (setting: AppSetting, value: string) => {
    if (!value.trim()) {
      toast.error(t("messages.valueRequired"));
      return;
    }

    try {
      await updateSettingMutation.mutateAsync({
        key: setting.key,
        value: value.trim(),
      });

      setEditingId(null);
    } catch (error) {
      // Service layer handles error toasts
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (setting: AppSetting) => {
    try {
      await Alert.confirmAction(
        t("table.actions.delete"),
        t("messages.confirmDelete", { name: setting.key }),
        t("table.actions.delete"),
        async () => {
          await deleteSettingMutation.mutateAsync(setting.key);
        }
      );
    } catch (error) {
      // Error message is handled by the mutation hook
      console.error("Delete error:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setEditingId(null); // Cancel any editing when changing pages
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters({
      search: newFilters.search as string | undefined,
      category: newFilters.category as string | undefined,
    });
    setCurrentPage(1); // Reset to first page when filtering
    setEditingId(null); // Cancel any editing when filtering
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setEditingId(null);
  };

  // Get pagination values with defaults
  const paginationData = {
    currentPage: settingsQuery.data?.page || currentPage,
    totalPages: settingsQuery.data?.totalPages || 1,
    totalItems: settingsQuery.data?.total || 0,
    pageSize: settingsQuery.data?.limit || 6,
  };

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-6 ${className}`}
    >
      <SettingsHeader
        translationNamespace="dashboard/settings/appsettings"
        titleKey="title"
        descriptionKey="description"
        icon={IconSettings}
        showIconBackground
      />

      <AppSettingsTable
        data={settingsQuery.data?.data || null}
        loading={settingsQuery.isFetching}
        editingId={editingId}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        currentPage={paginationData.currentPage}
        totalPages={paginationData.totalPages}
        totalItems={paginationData.totalItems}
        pageSize={paginationData.pageSize}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
