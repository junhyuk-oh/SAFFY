import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateMaintenanceTaskRequest, Priority, FacilityArea } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      priority: searchParams.get('priority')?.split(',') as Priority[] | undefined,
      location: searchParams.get('location')?.split(',') as FacilityArea[] | undefined,
      query: searchParams.get('query') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined
    };

    const result = await mockFacilityService.getMaintenanceTasks(params);
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMaintenanceTaskRequest = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const task = await mockFacilityService.createMaintenanceTask(body, userId);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}