/**
 * Roles API - Combined exports
 */

export { roleManagementApi } from "./roleManagement";
export { permissionManagementApi } from "./permissionManagement";

// Export combined API for convenience
import { roleManagementApi } from "./roleManagement";
import { permissionManagementApi } from "./permissionManagement";

export const rolesApi = {
    ...roleManagementApi,

    // Permission methods
    getPermissions: permissionManagementApi.getAll,
    getRolePermissions: permissionManagementApi.getForRole,
    updateRolePermissions: permissionManagementApi.updateForRole,
};

export default rolesApi;
