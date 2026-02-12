import { User } from '../entities/user.entity';

/**
 * Semantic alias: Donor is a User in the Coral Gardeners NGO context.
 * Use Donor in business logic and API responses.
 * Use User only when interacting with the database layer directly.
 */
export type Donor = User;

/**
 * Donor with computed NGO-specific fields.
 * Used in API responses that include aggregated data.
 */
export interface DonorProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  country_id?: number;
  country?: { name: string; code: string };
  lifetimeGiving: number;
  lastDonationDate?: Date;
  adoptionCount: number;
  engagementScore?: number;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lightweight DTO for donor list views.
 */
export interface DonorListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  lifetimeGiving: number;
  adoptionCount: number;
  isActive: boolean;
  joinedDate: Date;
}
