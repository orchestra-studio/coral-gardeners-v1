import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { type AdminUser } from "@/lib/api";
import { useRolesSelect, type Role } from "@/services/adminRoles";
import { useUpdateAdminRoles } from "@/services/adminManagement";
import { RoleItem } from "./types";

type TranslationFunction = (key: string) => string;

// Helper function to normalize role data from different API formats
const normalizeRoleData = (role: Role): RoleItem => ({
    id: role.value ?? role.id,
    name: role.label ?? role.name,
});

export const useRoleManagement = (admin: AdminUser | null, isOpen: boolean, t?: TranslationFunction) => {
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    // Use TanStack Query to fetch roles
    const { data: rolesData, error } = useRolesSelect();

    // Use TanStack Query mutation for updating roles
    const updateRolesMutation = useUpdateAdminRoles();

    // Transform API response to internal format - API returns { value, label } but we need { id, name }
    const availableRoles: RoleItem[] = useMemo(() => {
        return rolesData ? (rolesData as Role[]).map(normalizeRoleData) : [];
    }, [rolesData]);



    // Handle fetch errors
    useEffect(() => {
        if (error && isOpen) {
            console.error("Error fetching roles:", error);
            toast.error(t?.("fetchRolesError") || "An error occurred while fetching roles");
        }
    }, [error, isOpen, t]);

    // Initialize selected roles from admin data
    useEffect(() => {
        if (!admin?.roles) {
            setSelectedRoles([]);
            return;
        }

        // Extract role IDs from admin's current roles
        const currentRoleIds = admin.roles
            .map((role: { id?: number; value?: number } | number) => {
                if (typeof role === "number") return role;
                if (typeof role === "object" && role !== null) {
                    return role.id || role.value || 0;
                }
                return 0;
            })
            .filter((id: number) => id > 0);

        setSelectedRoles(currentRoleIds);
    }, [admin]);

    // Handle role selection toggle
    const toggleRole = (roleId: number) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId]
        );
    };

    // Update admin roles
    const updateRoles = async (): Promise<boolean> => {
        if (!admin) return false;

        try {
            await updateRolesMutation.mutateAsync({
                adminUsername: admin.username,
                roleIds: selectedRoles,
            });

            // Success toast is handled by the mutation's onSuccess callback
            return true;
        } catch (error) {
            console.error("Error updating roles:", error);
            toast.error(t?.("rolesError") || "An error occurred while updating roles");
            return false;
        }
    };

    return {
        availableRoles,
        selectedRoles,
        loading: updateRolesMutation.isPending,
        toggleRole,
        updateRoles,
    };
};