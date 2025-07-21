import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { UpdateMaintenanceTaskRequest } from '@/lib/types/facility';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await mockFacilityService.getMaintenanceTask(params.id);
    return NextResponse.json(task);
  } catch (error: any) {
    console.error('Error fetching maintenance task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch maintenance task' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updateRequest: UpdateMaintenanceTaskRequest = {
      id: params.id,
      ...body
    };
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const task = await mockFacilityService.updateMaintenanceTask(updateRequest, userId);
    return NextResponse.json(task);
  } catch (error: any) {
    console.error('Error updating maintenance task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update maintenance task' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await mockFacilityService.deleteMaintenanceTask(params.id);
    return NextResponse.json({ message: 'Maintenance task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting maintenance task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete maintenance task' },
      { status: error.statusCode || 500 }
    );
  }
}