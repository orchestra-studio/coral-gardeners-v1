/**
 * Projects API - Main Export
 * Centralized exports for project API operations
 */

// Export the main API object
export { projectsManagementApi } from "./projectsManagement";

// Create aliases for backward compatibility
import { projectsManagementApi } from "./projectsManagement";
export const projectsApi = projectsManagementApi;
export const projectManagementApi = projectsManagementApi;

// Export individual functions for convenience
export {
    listProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "./projectsManagement";

// Export types
export * from "./types";
