// API route for fetching property data from NWMLS

import { NextRequest, NextResponse } from 'next/server';
import { NWMLSFetcher, generateMockPropertyData } from '@/lib/nwmls-fetcher';
import type { PropertyData, NWMLSCredentials } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mlsNumber, address, city, state, useMock, credentials } = body;

    // Use mock data for development/testing
    if (useMock || process.env.NODE_ENV === 'development') {
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

