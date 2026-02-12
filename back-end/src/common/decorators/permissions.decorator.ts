import { SetMetadata } from '@nestjs/common';

/**
 * Permissions decorator
 * Use this to protect routes with specific permissions
 * 
 * @example
 * @Permissions('users.view')
 * @Permissions('users.update', 'users.delete')
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
