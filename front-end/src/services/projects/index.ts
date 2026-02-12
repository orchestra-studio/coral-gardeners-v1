/**
 * Projects Service - Main Export
 * Centralized exports for cleaner imports across the app
 * 
 * Usage Examples:
 * 
 * // Import queries and mutations from main module
 * import { useProjectsList, useCreateProject, projectKeys, Project } from '@/services/projects';
 * 
 * // Import only mutations
 * import { useCreateProject, useDeleteProject } from '@/services/projects/hooks/mutations';
 * 
 * // Import only queries  
 * import { useProjectsList, useRecentProjects } from '@/services/projects/hooks';
 * 
 * // Import specific types
 * import type { ProjectsListResponse, Project } from '@/services/projects';
 * 
 * // Use cache keys for manual cache operations
 * import { projectKeys } from '@/services/projects';
 * queryClient.invalidateQueries({ queryKey: projectKeys.all });
 */

// Types
export * from './types/projectTypes';

// All Hooks (queries + mutations)
export * from './hooks';

// Cache Keys
export * from './keys/projectKeys';
