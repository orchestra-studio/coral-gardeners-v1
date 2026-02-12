/**
 * Users Service - Main Export
 * Centralized exports for cleaner imports across the app
 * 
 * Usage Examples:
 * 
 * // Import queries and mutations from main module
 * import { useUsers, useCreateUser, usersKeys, User } from '@/services/users';
 * 
 * // Import only mutations
 * import { useCreateUser, useUpdateUser } from '@/services/users/hooks/mutations';
 * 
 * // Import only queries  
 * import { useUsers } from '@/services/users/hooks';
 * 
 * // Import specific types
 * import type { UsersListResponse, User } from '@/services/users';
 * 
 * // Use cache keys for manual cache operations
 * import { usersKeys } from '@/services/users';
 * queryClient.invalidateQueries({ queryKey: usersKeys.all });
 */

// Types
export * from './types/userTypes';

// All Hooks (queries + mutations)
export * from './hooks';

// Cache Keys
export * from './keys/userKeys';