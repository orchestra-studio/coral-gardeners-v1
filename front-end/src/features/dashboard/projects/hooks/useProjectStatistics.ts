/**
 * Project Statistics Hook
 * Fetches and manages project statistics data
 */

import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";

export function useProjectStatistics() {
    return useQuery({
        queryKey: ["projects", "statistics"],
        queryFn: async () => {
            const response = await projectsApi.getStatistics();
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch project statistics");
            }
            return response.data;
        },
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: false,
    });
}
