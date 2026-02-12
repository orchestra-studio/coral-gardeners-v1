import { useMemo } from "react";
import { useAdminDetail } from "@/services/adminManagement/hooks/useAdmins";

export interface AdminIdentityMeta {
    displayName: string;
    avatar?: string | null;
    statusLabelKey: string;
}

export interface AdminComputedData {
    identity: AdminIdentityMeta;
    stats: {
        totalRoles: number;
        lastLogin: string | null;
        accountStatus: string;
    };
}

export function useAdminViewData(username: string) {
    const { data: admin, isLoading, isError, error } = useAdminDetail(username);

    const computed = useMemo(() => {
        if (!admin) return null;

        const identity: AdminIdentityMeta = {
            displayName: `${admin.first_name} ${admin.last_name}`.trim() || admin.username,
            avatar: admin.profile_picture || null,
            statusLabelKey: admin.deleted_at ? "status.deleted" : "status.active",
        };

        const stats = {
            totalRoles: admin.roles?.length || 0,
            lastLogin: admin.updated_at || null, // Using updated_at as proxy for last activity
            accountStatus: admin.deleted_at ? "Deleted" : "Active",
        };

        return {
            identity,
            stats,
        };
    }, [admin]);

    return {
        admin,
        computed,
        isLoading,
        isError,
        error,
    };
}