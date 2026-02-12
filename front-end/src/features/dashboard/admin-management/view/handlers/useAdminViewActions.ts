import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/services/adminManagement/keys/adminKeys";
import type { UpdateAdminRequest } from "@/lib/api/types";

interface UseAdminViewActionsProps {
    t: (key: string) => string;
    onUpdateSuccess?: () => void;
}

export function useAdminViewActions({ onUpdateSuccess }: UseAdminViewActionsProps) {
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleUpdateAdmin = async (username: string, data: UpdateAdminRequest) => {
        setIsUpdateLoading(true);
        try {
            const response = await adminApi.update(username, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update admin');
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(username) });

            onUpdateSuccess?.();
            return response;
        } catch (error) {
            console.error("Failed to update admin:", error);
            throw error;
        } finally {
            setIsUpdateLoading(false);
        }
    };

    const handleDeleteAdmin = async (username: string) => {
        try {
            const response = await adminApi.delete(username);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete admin');
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(username) });

            return response;
        } catch (error) {
            console.error("Failed to delete admin:", error);
            throw error;
        }
    };

    const handleRestoreAdmin = async (username: string) => {
        try {
            // Note: This endpoint might not exist yet, implementing as placeholder
            const response = await adminApi.get(username); // Placeholder for restore

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: adminKeys.all });
            queryClient.invalidateQueries({ queryKey: adminKeys.detail(username) });

            return response;
        } catch (error) {
            console.error("Failed to restore admin:", error);
            throw error;
        }
    };

    return {
        isUpdateLoading,
        handleUpdateAdmin,
        handleDeleteAdmin,
        handleRestoreAdmin,
    };
}