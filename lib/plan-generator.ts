// Renovation Plan Generator
// Generates customized DIY renovation tasks based on property analysis

import type { PropertyData, AFHComplianceIssue, RenovationTask, RenovationPlan } from '@/types';
import { AFH_RULES } from './afh-rules';

export class PlanGenerator {
  generatePlan(property: PropertyData, issues: AFHComplianceIssue[]): RenovationPlan {
    const tasks = this.generateTasks(property, issues);
    
    const summary = {
      totalTasks: tasks.length,
      totalEstimatedCost: tasks.reduce((sum, task) => sum + task.estimatedCost, 0),
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      diyTasks: tasks.filter(t => t.diyFriendly).length,
      professionalTasks: tasks.filter(t => !t.diyFriendly).length,
    };

    return {
      property,
      complianceIssues: issues,
      tasks,
      summary,
      generatedAt: new Date(),
    };
  }

  private generateTasks(property: PropertyData, issues: AFHComplianceIssue[]): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = 1;

    // Group issues by category for task generation
    const bedroomIssues = issues.filter(i => i.category === 'bedroom');
    const bathroomIssues = issues.filter(i => i.category === 'bathroom');
    const safetyIssues = issues.filter(i => i.category === 'safety');
    const accessibilityIssues = issues.filter(i => i.category === 'accessibility');
    const otherIssues = issues.filter(i => i.category === 'other');

    // Bedroom tasks
    tasks.push(...this.generateBedroomTasks(property, bedroomIssues, order));
    order += tasks.length;

    // Bathroom tasks
    tasks.push(...this.generateBathroomTasks(property, bathroomIssues, order));
    order += tasks.length;

    // Safety tasks
    tasks.push(...this.generateSafetyTasks(property, safetyIssues, order));
    order += tasks.length;

    // Accessibility tasks
    tasks.push(...this.generateAccessibilityTasks(property, accessibilityIssues, order));
    order += tasks.length;

    // Other tasks
    tasks.push(...this.generateOtherTasks(property, otherIssues, order));

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return priorityDiff !== 0 ? priorityDiff : a.order - b.order;
    });

    return tasks;
  }

  private generateBedroomTasks(
    property: PropertyData,
    issues: AFHComplianceIssue[],
    startOrder: number
  ): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = startOrder;

    // Check for small bedrooms
    const smallBedroomIssues = issues.filter(i => 
      i.description.includes('sq ft') && i.severity === 'critical'
    );
    
    if (smallBedroomIssues.length > 0) {
      smallBedroomIssues.forEach((issue, idx) => {
        tasks.push({
          id: `bedroom-size-${idx}`,
          priority: 'high',
          category: 'Bedroom',
          title: `Expand or Reconfigure ${issue.location || 'Bedroom'}`,
          description: `Room is below ${AFH_RULES.BEDROOM_MIN_SQFT} sq ft minimum. Consider removing non-load-bearing walls, combining rooms, or reconfiguring layout.`,
          location: issue.location || 'Bedroom',
          estimatedCost: 2000,
          estimatedTime: '2-3 days',
          materials: ['Drywall', 'Studs', 'Paint', 'Flooring'],
          diyFriendly: false,
          requiresPermit: true,
          complianceIssues: [issue.rule],
          visualPlacement: 'Measure room dimensions and plan wall removal or reconfiguration',
          order: order++,
        });
      });
    }

    // Egress windows
    const egressIssue = issues.find(i => i.description.includes('egress window'));
    if (egressIssue) {
      tasks.push({
        id: 'bedroom-egress-windows',
        priority: 'high',
        category: 'Bedroom',
        title: 'Install/Verify Egress Windows in All Bedrooms',
        description: `Each bedroom must have an egress window with at least ${AFH_RULES.BEDROOM_EGRESS_WINDOW_SQFT} sq ft openable area and sill height ≤${AFH_RULES.BEDROOM_EGRESS_SILL_MAX_HEIGHT}" from floor.`,
        location: 'All bedrooms',
        estimatedCost: 800,
        estimatedTime: '1 day per window',
        materials: ['Egress window', 'Window frame', 'Insulation', 'Trim'],
        diyFriendly: false,
        requiresPermit: true,
        complianceIssues: [egressIssue.rule],
        visualPlacement: 'Install in each bedroom, ensuring proper sizing and height',
        order: order++,
      });
    }

    // Lockable doors
    const doorIssue = issues.find(i => i.description.includes('lockable'));
    if (doorIssue) {
      tasks.push({
        id: 'bedroom-lockable-doors',
        priority: 'medium',
        category: 'Bedroom',
        title: 'Install Lockable Bedroom Doors',
        description: 'Install privacy locks on all bedroom doors to ensure resident privacy.',
        location: 'All bedrooms',
        estimatedCost: 150,
        estimatedTime: '2-3 hours',
        materials: ['Privacy lockset', 'Door hardware'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [doorIssue.rule],
        visualPlacement: 'Install on interior side of each bedroom door',
        order: order++,
      });
    }

    return tasks;
  }

  private generateBathroomTasks(
    property: PropertyData,
    issues: AFHComplianceIssue[],
    startOrder: number
  ): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = startOrder;

    // Grab bars
    const grabBarIssue = issues.find(i => i.description.includes('Grab bars'));
    if (grabBarIssue) {
      tasks.push({
        id: 'bathroom-grab-bars',
        priority: 'high',
        category: 'Bathroom',
        title: 'Install Grab Bars in All Bathrooms',
        description: `Install grab bars at toilet (${AFH_RULES.GRAB_BAR_HEIGHT_MIN}-${AFH_RULES.GRAB_BAR_HEIGHT_MAX}" high) and in shower/tub. Must support ${AFH_RULES.GRAB_BAR_SUPPORT_WEIGHT} lbs.`,
        location: 'All bathrooms',
        estimatedCost: 200,
        estimatedTime: '2-3 hours per bathroom',
        materials: ['Grab bars', 'Wall anchors', 'Screws', 'Stud finder'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [grabBarIssue.rule],
        visualPlacement: 'Install at toilet (side and rear) and in shower/tub area',
        order: order++,
      });
    }

    // Non-slip surfaces
    const nonSlipIssue = issues.find(i => i.description.includes('non-slip'));
    if (nonSlipIssue) {
      tasks.push({
        id: 'bathroom-non-slip',
        priority: 'medium',
        category: 'Bathroom',
        title: 'Install Non-Slip Bathroom Flooring',
        description: 'Replace or treat bathroom floors with non-slip surfaces for safety.',
        location: 'All bathrooms',
        estimatedCost: 300,
        estimatedTime: '1 day',
        materials: ['Non-slip tile', 'Adhesive', 'Grout', 'Sealer'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [nonSlipIssue.rule],
        visualPlacement: 'Apply to all bathroom floor surfaces',
        order: order++,
      });
    }

    // Additional toilets if needed
    const toiletIssue = issues.find(i => i.description.includes('toilet per'));
    if (toiletIssue && property.bathrooms && property.bathrooms < 1) {
      tasks.push({
        id: 'bathroom-additional-toilet',
        priority: 'high',
        category: 'Bathroom',
        title: 'Install Additional Bathroom/Toilet',
        description: 'Must have 1 toilet per 5 residents. Install additional bathroom if needed.',
        location: 'New bathroom location',
        estimatedCost: 5000,
        estimatedTime: '1-2 weeks',
        materials: ['Toilet', 'Plumbing fixtures', 'Drywall', 'Tile', 'Ventilation'],
        diyFriendly: false,
        requiresPermit: true,
        complianceIssues: [toiletIssue.rule],
        visualPlacement: 'Plan location with access to plumbing lines',
        order: order++,
      });
    }

    return tasks;
  }

  private generateSafetyTasks(
    property: PropertyData,
    issues: AFHComplianceIssue[],
    startOrder: number
  ): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = startOrder;

    // Smoke detectors
    const smokeIssue = issues.find(i => i.description.includes('smoke detector'));
    if (smokeIssue) {
      tasks.push({
        id: 'safety-smoke-detectors',
        priority: 'high',
        category: 'Safety',
        title: 'Install Interconnected Smoke Detectors',
        description: 'Install interconnected smoke detectors on every level and in every bedroom.',
        location: 'All levels and bedrooms',
        estimatedCost: 400,
        estimatedTime: '1 day',
        materials: ['Interconnected smoke detectors', 'Mounting hardware', 'Wire'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [smokeIssue.rule],
        visualPlacement: 'Install on ceiling of each level and bedroom',
        order: order++,
      });
    }

    // Fire extinguishers
    const fireExtIssue = issues.find(i => i.description.includes('Fire extinguisher'));
    if (fireExtIssue) {
      tasks.push({
        id: 'safety-fire-extinguishers',
        priority: 'high',
        category: 'Safety',
        title: 'Install Fire Extinguishers',
        description: 'Install fire extinguishers in kitchen and common areas, easily accessible.',
        location: 'Kitchen and common areas',
        estimatedCost: 100,
        estimatedTime: '1 hour',
        materials: ['Fire extinguishers', 'Mounting brackets'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [fireExtIssue.rule],
        visualPlacement: 'Mount in kitchen and near exits',
        order: order++,
      });
    }

    // Hot water temperature
    const hotWaterIssue = issues.find(i => i.description.includes('Hot water'));
    if (hotWaterIssue) {
      tasks.push({
        id: 'safety-hot-water-temp',
        priority: 'high',
        category: 'Safety',
        title: 'Adjust Hot Water Temperature',
        description: `Set water heater to ${AFH_RULES.HOT_WATER_IDEAL_MIN}-${AFH_RULES.HOT_WATER_IDEAL_MAX}°F (max ${AFH_RULES.HOT_WATER_MAX_TEMP}°F).`,
        location: 'Water heater',
        estimatedCost: 0,
        estimatedTime: '30 minutes',
        materials: ['Thermometer'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [hotWaterIssue.rule],
        visualPlacement: 'Adjust thermostat on water heater',
        order: order++,
      });
    }

    // Emergency lighting
    const emergencyLightIssue = issues.find(i => i.description.includes('Emergency lighting'));
    if (emergencyLightIssue) {
      tasks.push({
        id: 'safety-emergency-lighting',
        priority: 'medium',
        category: 'Safety',
        title: 'Install Emergency Lighting',
        description: 'Install emergency lighting in hallways and exit paths.',
        location: 'Hallways and exits',
        estimatedCost: 300,
        estimatedTime: '1 day',
        materials: ['Emergency lights', 'Batteries', 'Mounting hardware'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [emergencyLightIssue.rule],
        visualPlacement: 'Install along exit paths and in hallways',
        order: order++,
      });
    }

    // Temperature control
    const tempIssue = issues.find(i => i.description.includes('Temperature control'));
    if (tempIssue) {
      tasks.push({
        id: 'safety-temperature-control',
        priority: 'medium',
        category: 'Safety',
        title: 'Verify/Upgrade Temperature Control',
        description: `Ensure HVAC system maintains at least ${AFH_RULES.TEMP_CONTROL_DAY}°F during day.`,
        location: 'HVAC system',
        estimatedCost: 500,
        estimatedTime: '1 day',
        materials: ['Thermostat', 'HVAC service'],
        diyFriendly: false,
        requiresPermit: false,
        complianceIssues: [tempIssue.rule],
        visualPlacement: 'Check and upgrade thermostat if needed',
        order: order++,
      });
    }

    return tasks;
  }

  private generateAccessibilityTasks(
    property: PropertyData,
    issues: AFHComplianceIssue[],
    startOrder: number
  ): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = startOrder;

    // Door width
    const doorWidthIssue = issues.find(i => i.description.includes('Door') && i.description.includes('width'));
    if (doorWidthIssue) {
      tasks.push({
        id: 'accessibility-door-width',
        priority: 'medium',
        category: 'Accessibility',
        title: 'Verify/Modify Door Widths',
        description: `Ensure all resident-accessible doors are ≥${AFH_RULES.DOOR_MIN_WIDTH}" clear width.`,
        location: 'All resident-accessible doors',
        estimatedCost: 600,
        estimatedTime: '1-2 days',
        materials: ['Wider door frames', 'New doors', 'Hardware'],
        diyFriendly: false,
        requiresPermit: true,
        complianceIssues: [doorWidthIssue.rule],
        visualPlacement: 'Measure and replace narrow doors',
        order: order++,
      });
    }

    // Ramps
    if (property.hasStairs && !property.hasRamp) {
      const rampIssue = issues.find(i => i.description.includes('ramp'));
      if (rampIssue) {
        tasks.push({
          id: 'accessibility-ramp',
          priority: 'high',
          category: 'Accessibility',
          title: 'Install Access Ramp',
          description: `Install ramp with max 1:${AFH_RULES.RAMP_MAX_SLOPE} slope for stairs.`,
          location: 'Entry/exits with stairs',
          estimatedCost: 2000,
          estimatedTime: '2-3 days',
          materials: ['Concrete/wood', 'Handrails', 'Non-slip surface'],
          diyFriendly: false,
          requiresPermit: true,
          complianceIssues: [rampIssue.rule],
          visualPlacement: 'Install at main entry with proper slope and handrails',
          order: order++,
        });
      }
    }

    // Handrails
    if (property.hasStairs) {
      const handrailIssue = issues.find(i => i.description.includes('Handrail'));
      if (handrailIssue) {
        tasks.push({
          id: 'accessibility-handrails',
          priority: 'high',
          category: 'Accessibility',
          title: 'Install Handrails on Stairs',
          description: `Install handrails on both sides of all stairs, ${AFH_RULES.HANDRAIL_HEIGHT_MIN}-${AFH_RULES.HANDRAIL_HEIGHT_MAX}" high.`,
          location: 'All stairways',
          estimatedCost: 400,
          estimatedTime: '1 day',
          materials: ['Handrails', 'Mounting brackets', 'Screws'],
          diyFriendly: true,
          requiresPermit: false,
          complianceIssues: [handrailIssue.rule],
          visualPlacement: 'Install on both sides of each stairway',
          order: order++,
        });
      }
    }

    // Fenced hazards
    const fenceIssue = issues.find(i => i.description.includes('fenced'));
    if (fenceIssue) {
      tasks.push({
        id: 'accessibility-fence-hazards',
        priority: 'low',
        category: 'Accessibility',
        title: 'Fence Outdoor Hazards',
        description: 'Install fencing around outdoor hazards (pools, steep drops, etc.).',
        location: 'Outdoor areas',
        estimatedCost: 1500,
        estimatedTime: '2-3 days',
        materials: ['Fencing', 'Posts', 'Hardware'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [fenceIssue.rule],
        visualPlacement: 'Install around identified hazards',
        order: order++,
      });
    }

    return tasks;
  }

  private generateOtherTasks(
    property: PropertyData,
    issues: AFHComplianceIssue[],
    startOrder: number
  ): RenovationTask[] {
    const tasks: RenovationTask[] = [];
    let order = startOrder;

    // Pest control
    const pestIssue = issues.find(i => i.description.includes('pest'));
    if (pestIssue) {
      tasks.push({
        id: 'other-pest-control',
        priority: 'medium',
        category: 'Other',
        title: 'Pest Control Inspection and Treatment',
        description: 'Inspect and treat for pests. Establish ongoing pest control measures.',
        location: 'Property-wide',
        estimatedCost: 300,
        estimatedTime: '1 day',
        materials: ['Pest control service', 'Sealants'],
        diyFriendly: false,
        requiresPermit: false,
        complianceIssues: [pestIssue.rule],
        visualPlacement: 'Inspect all areas and treat as needed',
        order: order++,
      });
    }

    // Permits
    const permitIssue = issues.find(i => i.description.includes('permit'));
    if (permitIssue) {
      tasks.push({
        id: 'other-permits',
        priority: 'medium',
        category: 'Other',
        title: 'Obtain Required Building Permits',
        description: 'Obtain permits for structural, electrical, and plumbing work from local building department.',
        location: 'Local building department',
        estimatedCost: 500,
        estimatedTime: '1-2 weeks',
        materials: ['Permit applications', 'Plans'],
        diyFriendly: false,
        requiresPermit: false,
        complianceIssues: [permitIssue.rule],
        visualPlacement: 'Submit applications to local building department',
        order: order++,
      });
    }

    // Laundry/kitchen separation
    const separationIssue = issues.find(i => i.description.includes('Laundry'));
    if (separationIssue) {
      tasks.push({
        id: 'other-laundry-separation',
        priority: 'low',
        category: 'Other',
        title: 'Separate Laundry/Kitchen from Resident Areas',
        description: 'Ensure laundry and kitchen areas are properly separated from resident living areas.',
        location: 'Laundry/kitchen',
        estimatedCost: 1000,
        estimatedTime: '2-3 days',
        materials: ['Walls', 'Doors', 'Drywall'],
        diyFriendly: true,
        requiresPermit: false,
        complianceIssues: [separationIssue.rule],
        visualPlacement: 'Install separation as needed',
        order: order++,
      });
    }

    return tasks;
  }
}

