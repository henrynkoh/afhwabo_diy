// API route for fetching property data from NWMLS
// This is a server-only route
// For web deployment (Vercel), only mock data is available
// Real NWMLS fetching requires Tauri desktop app

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { PropertyData } from '@/types';

// Mock data generator (no Playwright dependency)
function generateMockPropertyData(mlsNumber?: string): PropertyData {
  return {
    mlsNumber: mlsNumber || '9876543',
    address: '1234 Example Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98105',
    squareFeet: 2500,
    bedrooms: 4,
    bathrooms: 2.5,
    yearBuilt: 1985,
    levels: 2,
    roomDimensions: [
      { roomType: 'Master Bedroom', length: 14, width: 12, squareFeet: 168 },
      { roomType: 'Bedroom 2', length: 12, width: 10, squareFeet: 120 },
      { roomType: 'Bedroom 3', length: 11, width: 9, squareFeet: 99 },
      { roomType: 'Bedroom 4', length: 10, width: 8, squareFeet: 80 },
    ],
    hasStairs: true,
    hasRamp: false,
    photoUrls: [],
    floorPlanUrl: undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mlsNumber, address, city, state, useMock } = body;

    // For web deployment, always use mock data
    // Real NWMLS fetching is only available in Tauri desktop app
    // This prevents Playwright from being bundled in web builds
    const mockData = generateMockPropertyData(mlsNumber);
    return NextResponse.json({ 
      property: mockData, 
      source: 'mock',
      note: 'Web deployment uses mock data. For real NWMLS data, use the Tauri desktop app.'
    });
    
    // Note: Real NWMLS fetching code removed for web deployment
    // It's available in lib/nwmls-fetcher.server.ts for Tauri desktop app only
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}

