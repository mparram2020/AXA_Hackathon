export type ClaimStatus = 'draft' | 'submitted' | 'under_review' | 'information_needed' | 'approved' | 'rejected' | 'paid';

export type ClaimEventType = 
  | 'agricultural_vehicle_accident' 
  | 'theft' 
  | 'fire' 
  | 'natural_events' 
  | 'material_damages'
  | 'hydraulic_mechanism_failure'
  | 'liability_coverage'
  | 'other';

export type MediaItem = {
  id: string;
  uri: string;
  type: 'photo' | 'video' | 'document';
  fileName?: string;
};

export type ThirdParty = {
  id: string;
  name: string;
  contact: string;
  insuranceInfo?: string;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  identifier: string; // License plate or serial number
  type: string;
};

export type Claim = {
  id: string;
  userId: string;
  policyId: string;
  createdAt: string;
  submittedAt?: string;
  status: ClaimStatus;
  reference?: string; // Claim reference number once submitted
  eventType: ClaimEventType;
  eventDate: string;
  eventLocation: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  description: string;
  vehicles: Vehicle[];
  thirdParties: ThirdParty[];
  mediaItems: MediaItem[];
  policeReport: {
    filed: boolean;
    reportNumber?: string;
    policeStation?: string;
  };
  isSubmittable: boolean; // Whether all required fields are filled
};