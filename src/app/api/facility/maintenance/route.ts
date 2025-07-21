import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateMaintenanceTaskRequest } from '@/lib/types/facility';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      priority: searchParams.get('priority')?.split(','),
      location: searchParams.get('location')?.split(','),
      query: searchParams.get('query') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') as any,
      sortOrder: searchParams.get('sortOrder') as any
    };

    const result = await mockFacilityService.getMaintenanceTasks(params);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching maintenance tasks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch maintenance tasks' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMaintenanceTaskRequest = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const task = await mockFacilityService.createMaintenanceTask(body, userId);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    console.error('Error creating maintenance task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create maintenance task' },
      { status: error.statusCode || 500 }
    );
  }
}