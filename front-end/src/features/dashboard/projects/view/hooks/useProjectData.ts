import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "@/services/projects";
import { projectManagementApi } from "@/lib/api/projects";
import type { Project } from "@/services/projects";

export function useProjectData(projectId: string) {
    const {
        data: project,
        isLoading,
        error,
    } = useQuery<Project>({
        queryKey: projectKeys.detail(Number(projectId)),
        queryFn: async () => {
            const response = await projectManagementApi.getById(Number(projectId));
            if (!response.success || !response.data) {
                throw new Error("Project not found");
            }
            return response.data;
        },
    });

    return {
        project,
        isLoading,
        error,
    };
}
