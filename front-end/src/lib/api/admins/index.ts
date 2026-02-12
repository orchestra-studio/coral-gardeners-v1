/**
 * Admins API - Admins Management Only
 */

// Export admins management
export { adminsManagementApi } from "./adminsManagement";

// Export types
export * from "../types";

// Export the admins API object (keeping adminApi name for backward compatibility)
import { adminsManagementApi } from "./adminsManagement";

export const adminApi = adminsManagementApi;
export const adminsApi = adminsManagementApi;

export default adminApi;
