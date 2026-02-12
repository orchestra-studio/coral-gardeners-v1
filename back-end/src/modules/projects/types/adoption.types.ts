import { Project } from '../entities/project.entity';

/**
 * Semantic alias: CoralAdoption is a Project in the Coral Gardeners NGO context.
 * Use CoralAdoption in business logic and API responses.
 * Use Project only when interacting with the database layer directly.
 */
export type CoralAdoption = Project;

/**
 * Adoption fulfillment tracking.
 * Each adoption goes through: naming -> certificate -> site assignment.
 */
export interface AdoptionFulfillment {
  isNamed: boolean;
  coralName?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  siteAssigned: boolean;
  siteName?: string;
  siteCoordinates?: { lat: number; lng: number };
}

/**
 * Full adoption details for detail views.
 */
export interface AdoptionDetails {
  id: number;
  coralName: string;
  description: string;
  status: 'in-progress' | 'ready' | 'blocked';
  restorationSite: string;
  donorId?: number;
  donorName?: string;
  fulfillment: AdoptionFulfillment;
  adoptionDate: Date;
  image?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lightweight DTO for adoption list views.
 */
export interface AdoptionListItem {
  id: number;
  coralName: string;
  restorationSite: string;
  status: string;
  donorName?: string;
  isFulfilled: boolean;
  adoptionDate: Date;
}
