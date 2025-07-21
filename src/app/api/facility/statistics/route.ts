import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';

export async function GET(request: NextRequest) {
  try {
    const statistics = await mockFacilityService.getFacilityStatistics();
    
    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('Error fetching facility statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch facility statistics' },
      { status: error.statusCode || 500 }
    );
  }
}