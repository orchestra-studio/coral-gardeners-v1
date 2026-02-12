/**
 * Admin Management Service - Main Export
 * Centralized exports for cleaner imports across the app
 * 
 * Usage Examples:
 * 
 * // Import queries and mutations from main module
 * import { useAdminsList, useCreateAdmin, adminKeys, AdminUser } from '@/services/adminManagement';
 * 
 * // Import only mutations
 * import { useCreateAdmin, useDeleteAdmin } from '@/services/adminManagement/hooks/mutations';
 * 
 * // Import only queries  
 * import { useAdminsList } from '@/services/adminManagement/hooks';
 * 
 * // Import specific types
 * import type { AdminsListResponse, AdminUser } from '@/services/adminManagement';
 * 
 * // Use cache keys for manual cache operations
 * import { adminKeys } from '@/services/adminManagement';
 * queryClient.invalidateQueries({ queryKey: adminKeys.all });
 * 
 * // For role management, use the dedicated service:
 * import { useRolesSelect, useCreateRole } from '@/services/adminRoles';
 */

// Types
export * from './types/adminTypes';

// All Hooks (queries + mutations)
export * from './hooks';

// Cache Keys
export * from './keys/adminKeys';