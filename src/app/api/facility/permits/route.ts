import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateWorkPermitRequest } from '@/lib/types/facility';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      priority: searchParams.get('priority')?.split(','),
      type: searchParams.get('type')?.split(','),
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await mockFacilityService.getWorkPermits(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching work permits:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch work permits' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateWorkPermitRequest = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const permit = await mockFacilityService.createWorkPermit(body, userId);
    
    return NextResponse.json(permit, { status: 201 });
  } catch (error: any) {
    console.error('Error creating work permit:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create work permit' },
      { status: error.statusCode || 500 }
    );
  }
}