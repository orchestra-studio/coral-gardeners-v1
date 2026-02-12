import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useAllPermissions, useRolePermissionsList, type Role } from "@/services/adminRoles";
import { PermissionGroup, UsePermissionsReturn } from "../types";

// Stable empty array to prevent re-renders
const EMPTY_ARRAY: string[] = [];

export function usePermissions(role: Role | null): UsePermissionsReturn {
    const t = useTranslations("dashboard/settings/adminroles.permissions");
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup>({});
    const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
    const [rolePermissions, setRolePermissions] = useState<string[]>(EMPTY_ARRAY);

    // Use TanStack Query hooks
    const permissionsQuery = useAllPermissions();
    const rolePermissionsQuery = useRolePermissionsList(role?.id);

    // Toggle group expansion
    const toggleGroupExpansion = (groupName: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    // Process permissions data when loaded
    useEffect(() => {
        if (permissionsQuery.data) {
            // Data is already grouped by module from the backend with full permission objects
            const groupedData = permissionsQuery.data as Record<string, {
                name: string;
                display_name: { ar: string; en: string };
                description?: { ar: string; en: string }
            }[]>;

            // Keep the full permission objects
            setPermissionGroups(groupedData);

            // Initialize expanded state for all groups
            const initialExpanded: { [key: string]: boolean } = {};
            Object.keys(groupedData).forEach((group) => {
                initialExpanded[group] = false;
            });
            setExpandedGroups(initialExpanded);
        }
    }, [permissionsQuery.data]);

    // Update role permissions when data changes
    useEffect(() => {
        if (rolePermissionsQuery.data) {
            setRolePermissions(rolePermissionsQuery.data);
        } else {
            setRolePermissions(EMPTY_ARRAY);
        }
    }, [rolePermissionsQuery.data]);

    // Handle errors
    useEffect(() => {
        if (permissionsQuery.error) {
            console.error("Error fetching permissions:", permissionsQuery.error);
            toast.error(t("messages.fetchError"));
        }
        if (rolePermissionsQuery.error) {
            console.error("Error fetching role permissions:", rolePermissionsQuery.error);
            toast.error(t("messages.fetchError"));
        }
    }, [permissionsQuery.error, rolePermissionsQuery.error, t]);

    return {
        loading: permissionsQuery.isLoading || rolePermissionsQuery.isLoading,
        permissionGroups,
        rolePermissions,
        expandedGroups,
        toggleGroupExpansion,
    };
}