/**
 * Frontend Adoption types - mirrors backend AdoptionDetails.
 * Used in components and API response typing.
 */
export interface CoralAdoption {
  id: number;
  coralName: string;
  description: string;
  status: 'in-progress' | 'ready' | 'blocked';
  restorationSite: string;
  donorId?: number;
  donorName?: string;
  fulfillment: AdoptionFulfillment;
  image?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AdoptionFulfillment {
  isNamed: boolean;
  coralName?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  siteAssigned: boolean;
  siteName?: string;
}

export interface AdoptionListItem {
  id: number;
  coralName: string;
  restorationSite: string;
  status: string;
  donorName?: string;
  isFulfilled: boolean;
  adoptionDate: string;
}
