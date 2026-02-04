// API route for generating renovation plan

import { NextRequest, NextResponse } from 'next/server';
import { AFHAnalyzer } from '@/lib/afh-analyzer';
import { PlanGenerator } from '@/lib/plan-generator';
import type { PropertyData, RenovationPlan } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property } = body as { property: PropertyData };

    if (!property) {
      return NextResponse.json(
        { error: 'Property data required' },
        { status: 400 }
      );
    }

    // Analyze property for compliance issues
    const analyzer = new AFHAnalyzer();
    const issues = analyzer.analyze(property);

    // Generate renovation plan
    const generator = new PlanGenerator();
    const plan = generator.generatePlan(property, issues);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

