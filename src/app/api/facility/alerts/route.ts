import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      severity: searchParams.get('severity')?.split(',') as any,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await mockFacilityService.getAlerts(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alerts' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const alert = await mockFacilityService.createAlert(body, userId);
    
    return NextResponse.json(alert, { status: 201 });
  } catch (error: any) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create alert' },
      { status: error.statusCode || 500 }
    );
  }
}