/**
 * Users API - Main Export
 * Centralized exports for user management API functions
 */

// Export the main API object
export { usersManagementApi } from './usersManagement';

// Create aliases for backward compatibility
import { usersManagementApi } from './usersManagement';
export const usersApi = usersManagementApi;
export const userManagementApi = usersManagementApi;

// Export types
export * from './types';
