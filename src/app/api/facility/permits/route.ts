import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateWorkPermitRequest, Priority, PermitType } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      priority: searchParams.get('priority')?.split(',') as Priority[] | undefined,
      type: searchParams.get('type')?.split(',') as PermitType[] | undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await mockFacilityService.getWorkPermits(params);
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateWorkPermitRequest = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const permit = await mockFacilityService.createWorkPermit(body, userId);
    
    return NextResponse.json(permit, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}