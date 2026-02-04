// DSHS AFH Compliance Rules (WAC 388-76 series)
// Washington State Adult Family Home Regulations

import type { AFHComplianceIssue } from '@/types';

export interface AFHRule {
  category: string;
  rule: string;
  requirement: string;
  check: (property: any) => AFHComplianceIssue | null;
}

export const AFH_RULES = {
  BEDROOM_MIN_SQFT: 80,
  BEDROOM_EGRESS_WINDOW_SQFT: 5.7,
  BEDROOM_EGRESS_SILL_MAX_HEIGHT: 44, // inches
  BATHROOM_TOILET_RATIO: 5, // 1 toilet per 5 residents
  GRAB_BAR_SUPPORT_WEIGHT: 250, // pounds
  GRAB_BAR_HEIGHT_MIN: 32, // inches
  GRAB_BAR_HEIGHT_MAX: 36, // inches
  DOOR_MIN_WIDTH: 32, // inches
  HOT_WATER_MAX_TEMP: 120, // Fahrenheit
  HOT_WATER_IDEAL_MIN: 105,
  HOT_WATER_IDEAL_MAX: 110,
  RAMP_MAX_SLOPE: 12, // 1:12 ratio
  HANDRAIL_HEIGHT_MIN: 34, // inches
  HANDRAIL_HEIGHT_MAX: 38, // inches
  TEMP_CONTROL_DAY: 68, // Fahrenheit
};

export const AFH_COMPLIANCE_CATEGORIES = {
  BEDROOM: 'bedroom',
  BATHROOM: 'bathroom',
  SAFETY: 'safety',
  ACCESSIBILITY: 'accessibility',
  OTHER: 'other',
} as const;

export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
} as const;

