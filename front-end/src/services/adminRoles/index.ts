/**
 * Admin Roles Service - Main exports
 * Centralized role management with TanStack Query
 */

// Types
export type {
    Role,
    Permission,
    RoleFormData,
    RolesListResponse,
    RolesListParams,
    CreateRoleRequest,
    UpdateRoleRequest,
    UpdateRolePermissionsRequest
} from './types/roleTypes';

// Cache Keys
export { roleKeys } from './keys/roleKeys';

// Hooks
export * from './hooks';