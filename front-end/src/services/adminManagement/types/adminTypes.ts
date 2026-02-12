/**
 * Admin Management Types
 */

import { PaginatedResponse, AdminUser as BaseAdminUser, Country } from '@/lib/api/types';

// Re-export AdminUser from lib/api for consistency
export type AdminUser = BaseAdminUser;
export type { Country };

export type AdminsListResponse = PaginatedResponse<AdminUser>;

export interface AdminsListResponseBackend {
  success: boolean;
  data: AdminsListResponse;
  message: string;
}
