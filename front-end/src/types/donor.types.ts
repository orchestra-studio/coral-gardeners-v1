/**
 * Frontend Donor types - mirrors backend DonorProfile.
 * Used in components and API response typing.
 */
export interface Donor {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  country?: { name: string; code: string };
  lifetimeGiving?: number;
  lastDonationDate?: string;
  adoptionCount?: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface DonorListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  lifetimeGiving: number;
  adoptionCount: number;
  isActive: boolean;
  joinedDate: string;
}
