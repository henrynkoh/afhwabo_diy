// API route for fetching property data from NWMLS
// This is a server-only route - Playwright will only run here
// Mark as server-only to prevent client bundling
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { PropertyData, NWMLSCredentials } from '@/types';

// Dynamic import to ensure Playwright is only loaded server-side
// Use string path to prevent static analysis
async function getNWMLSFetcher() {
  // @ts-ignore - Dynamic import prevents bundling
  const module = await import('@/lib/nwmls-fetcher.server');
  return module.NWMLSFetcher;
}

async function getMockData() {
  // @ts-ignore - Dynamic import prevents bundling
  const module = await import('@/lib/nwmls-fetcher.server');
  return module.generateMockPropertyData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mlsNumber, address, city, state, useMock, credentials } = body;

    // Use mock data for development/testing
    if (useMock || process.env.NODE_ENV === 'development') {
      const generateMockPropertyData = await getMockData();
      const mockData = generateMockPropertyData(mlsNumber);
      return NextResponse.json({ property: mockData, source: 'mock' });
    }

    // Real NWMLS fetch
    if (!credentials || !credentials.username || !credentials.password) {
      return NextResponse.json(
        { error: 'NWMLS credentials required' },
        { status: 400 }
      );
    }

    const NWMLSFetcher = await getNWMLSFetcher();
    const fetcher = new NWMLSFetcher();
    
    try {
      await fetcher.initialize(credentials as NWMLSCredentials);
      
      let property: PropertyData;
      if (mlsNumber) {
        property = await fetcher.fetchByMLS(mlsNumber);
      } else if (address) {
        property = await fetcher.fetchByAddress(address, city, state);
      } else {
        return NextResponse.json(
          { error: 'MLS number or address required' },
          { status: 400 }
        );
      }

      await fetcher.close();
      
      return NextResponse.json({ property, source: 'nwmls' });
    } catch (error) {
      await fetcher.close();
      throw error;
    }
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}

