// Core types for AFH Renovator Pro

export interface PropertyData {
  mlsNumber?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  levels?: number;
  roomDimensions?: RoomDimension[];
  floorPlanUrl?: string;
  photoUrls?: string[];
  hasStairs?: boolean;
  hasRamp?: boolean;
  permitHistory?: string[];
  parcelData?: ParcelData;
}

export interface RoomDimension {
  roomType: string;
  length: number;
  width: number;
  squareFeet: number;
}

export interface ParcelData {
  lotSize?: number;
  taxAssessedValue?: number;
  zoning?: string;
}

export interface AFHComplianceIssue {
  category: 'bedroom' | 'bathroom' | 'safety' | 'accessibility' | 'other';
  severity: 'critical' | 'warning' | 'info';
  rule: string;
  description: string;
  location?: string;
  currentValue?: number | string;
  requiredValue?: number | string;
}

export interface RenovationTask {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  location: string;
  estimatedCost: number;
  estimatedTime: string;
  materials: string[];
  diyFriendly: boolean;
  requiresPermit: boolean;
  complianceIssues: string[];
  visualPlacement?: string;
  order: number;
}

export interface RenovationPlan {
  property: PropertyData;
  complianceIssues: AFHComplianceIssue[];
  tasks: RenovationTask[];
  summary: {
    totalTasks: number;
    totalEstimatedCost: number;
    criticalIssues: number;
    diyTasks: number;
    professionalTasks: number;
  };
  generatedAt: Date;
}

export interface NWMLSCredentials {
  username: string;
  password: string;
  sessionToken?: string;
}

