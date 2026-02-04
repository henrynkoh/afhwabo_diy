// AFH Compliance Analyzer
// Analyzes property data against DSHS AFH regulations

import type { PropertyData, AFHComplianceIssue } from '@/types';
import { AFH_RULES, AFH_COMPLIANCE_CATEGORIES, SEVERITY_LEVELS } from './afh-rules';

export class AFHAnalyzer {
  analyze(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    // Check bedrooms
    issues.push(...this.checkBedrooms(property));

    // Check bathrooms
    issues.push(...this.checkBathrooms(property));

    // Check safety features
    issues.push(...this.checkSafetyFeatures(property));

    // Check accessibility
    issues.push(...this.checkAccessibility(property));

    // Check other requirements
    issues.push(...this.checkOtherRequirements(property));

    return issues;
  }

  private checkBedrooms(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    if (!property.bedrooms || property.bedrooms === 0) {
      issues.push({
        category: 'bedroom',
        severity: 'critical',
        rule: 'WAC 388-76-10150',
        description: 'Property must have at least one bedroom for residents.',
        location: 'Property-wide',
      });
      return issues;
    }

    // Check bedroom square footage
    if (property.roomDimensions) {
      property.roomDimensions.forEach((room, index) => {
        if (room.roomType.toLowerCase().includes('bedroom')) {
          if (room.squareFeet < AFH_RULES.BEDROOM_MIN_SQFT) {
            issues.push({
              category: 'bedroom',
              severity: 'critical',
              rule: 'WAC 388-76-10150',
              description: `Bedroom must be at least ${AFH_RULES.BEDROOM_MIN_SQFT} sq ft for single occupant.`,
              location: room.roomType,
              currentValue: `${room.squareFeet} sq ft`,
              requiredValue: `${AFH_RULES.BEDROOM_MIN_SQFT} sq ft`,
            });
          }
        }
      });
    } else if (property.squareFeet && property.bedrooms) {
      // Estimate average bedroom size
      const avgBedroomSqft = property.squareFeet / (property.bedrooms + 1); // +1 for common areas
      if (avgBedroomSqft < AFH_RULES.BEDROOM_MIN_SQFT) {
        issues.push({
          category: 'bedroom',
          severity: 'warning',
          rule: 'WAC 388-76-10150',
          description: `Estimated average bedroom size may be below ${AFH_RULES.BEDROOM_MIN_SQFT} sq ft. Verify actual room dimensions.`,
          location: 'All bedrooms',
          currentValue: `~${Math.round(avgBedroomSqft)} sq ft`,
          requiredValue: `${AFH_RULES.BEDROOM_MIN_SQFT} sq ft`,
        });
      }
    }

    // Check for egress windows (always flag as requirement)
    issues.push({
      category: 'bedroom',
      severity: 'critical',
      rule: 'WAC 388-76-10150',
      description: `Each bedroom must have an egress window with at least ${AFH_RULES.BEDROOM_EGRESS_WINDOW_SQFT} sq ft openable area and sill height ≤${AFH_RULES.BEDROOM_EGRESS_SILL_MAX_HEIGHT}" from floor.`,
      location: 'All bedrooms',
    });

    // Check for lockable doors
    issues.push({
      category: 'bedroom',
      severity: 'warning',
      rule: 'WAC 388-76-10150',
      description: 'Bedroom doors must be private and lockable.',
      location: 'All bedrooms',
    });

    return issues;
  }

  private checkBathrooms(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    if (!property.bathrooms || property.bathrooms === 0) {
      issues.push({
        category: 'bathroom',
        severity: 'critical',
        rule: 'WAC 388-76-10160',
        description: 'Property must have at least one bathroom.',
        location: 'Property-wide',
      });
      return issues;
    }

    // Check toilet ratio (assuming max 5 residents for standard AFH)
    const maxResidents = Math.floor(property.bathrooms * AFH_RULES.BATHROOM_TOILET_RATIO);
    if (maxResidents < 5) {
      issues.push({
        category: 'bathroom',
        severity: 'warning',
        rule: 'WAC 388-76-10160',
        description: `Must have 1 toilet per 5 residents. Current capacity: ${maxResidents} residents.`,
        location: 'All bathrooms',
        currentValue: `${property.bathrooms} toilet(s)`,
        requiredValue: '1 per 5 residents',
      });
    }

    // Check grab bars
    issues.push({
      category: 'bathroom',
      severity: 'critical',
      rule: 'WAC 388-76-10160',
      description: `Grab bars required at toilet (${AFH_RULES.GRAB_BAR_HEIGHT_MIN}-${AFH_RULES.GRAB_BAR_HEIGHT_MAX}" high) and shower/tub. Must support ${AFH_RULES.GRAB_BAR_SUPPORT_WEIGHT} lbs.`,
      location: 'All bathrooms',
    });

    // Check non-slip surfaces
    issues.push({
      category: 'bathroom',
      severity: 'warning',
      rule: 'WAC 388-76-10160',
      description: 'Bathroom floors must have non-slip surfaces.',
      location: 'All bathrooms',
    });

    return issues;
  }

  private checkSafetyFeatures(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    // Smoke detectors
    issues.push({
      category: 'safety',
      severity: 'critical',
      rule: 'WAC 388-76-10200',
      description: 'Interconnected smoke detectors required on every level and in every bedroom.',
      location: 'All levels and bedrooms',
    });

    // Fire extinguishers
    issues.push({
      category: 'safety',
      severity: 'critical',
      rule: 'WAC 388-76-10200',
      description: 'Fire extinguishers must be installed and accessible.',
      location: 'Kitchen and common areas',
    });

    // Hot water temperature
    issues.push({
      category: 'safety',
      severity: 'critical',
      rule: 'WAC 388-76-10180',
      description: `Hot water must be ≤${AFH_RULES.HOT_WATER_MAX_TEMP}°F (ideal: ${AFH_RULES.HOT_WATER_IDEAL_MIN}-${AFH_RULES.HOT_WATER_IDEAL_MAX}°F).`,
      location: 'All water heaters',
    });

    // Emergency lighting
    issues.push({
      category: 'safety',
      severity: 'warning',
      rule: 'WAC 388-76-10200',
      description: 'Emergency lighting required in hallways and exit paths.',
      location: 'Hallways and exits',
    });

    // Temperature control
    issues.push({
      category: 'safety',
      severity: 'warning',
      rule: 'WAC 388-76-10180',
      description: `Temperature control must maintain at least ${AFH_RULES.TEMP_CONTROL_DAY}°F during day.`,
      location: 'HVAC system',
    });

    return issues;
  }

  private checkAccessibility(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    // Door width
    issues.push({
      category: 'accessibility',
      severity: 'warning',
      rule: 'WAC 388-76-10150',
      description: `Doors should be ≥${AFH_RULES.DOOR_MIN_WIDTH}" clear width for accessibility.`,
      location: 'All resident-accessible doors',
    });

    // Stairs and ramps
    if (property.hasStairs && !property.hasRamp) {
      issues.push({
        category: 'accessibility',
        severity: 'warning',
        rule: 'WAC 388-76-10150',
        description: `If stairs are present, ramps may be required with max 1:${AFH_RULES.RAMP_MAX_SLOPE} slope.`,
        location: 'Entry/exits with stairs',
      });
    }

    // Handrails
    if (property.hasStairs) {
      issues.push({
        category: 'accessibility',
        severity: 'critical',
        rule: 'WAC 388-76-10150',
        description: `Handrails required on both sides of stairs, ${AFH_RULES.HANDRAIL_HEIGHT_MIN}-${AFH_RULES.HANDRAIL_HEIGHT_MAX}" high.`,
        location: 'All stairways',
      });
    }

    // Fenced hazards
    issues.push({
      category: 'accessibility',
      severity: 'info',
      rule: 'WAC 388-76-10150',
      description: 'Outdoor hazards (pools, steep drops) must be fenced.',
      location: 'Outdoor areas',
    });

    return issues;
  }

  private checkOtherRequirements(property: PropertyData): AFHComplianceIssue[] {
    const issues: AFHComplianceIssue[] = [];

    // Laundry/kitchen separation
    issues.push({
      category: 'other',
      severity: 'info',
      rule: 'WAC 388-76-10170',
      description: 'Laundry and kitchen areas may need separation from resident areas.',
      location: 'Laundry/kitchen',
    });

    // Pest control
    issues.push({
      category: 'other',
      severity: 'warning',
      rule: 'WAC 388-76-10190',
      description: 'Property must be free of pests and have pest control measures in place.',
      location: 'Property-wide',
    });

    // Permits
    if (!property.permitHistory || property.permitHistory.length === 0) {
      issues.push({
        category: 'other',
        severity: 'info',
        rule: 'Local building codes',
        description: 'Verify permits are required for structural, electrical, and plumbing work.',
        location: 'Property-wide',
      });
    }

    return issues;
  }
}

