import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { UpdateWorkPermitRequest } from '@/lib/types/facility';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permit = await mockFacilityService.getWorkPermit(params.id);
    return NextResponse.json(permit);
  } catch (error: any) {
    console.error('Error fetching work permit:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch work permit' },
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
    const updateRequest: UpdateWorkPermitRequest = {
      id: params.id,
      ...body
    };
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const permit = await mockFacilityService.updateWorkPermit(updateRequest, userId);
    return NextResponse.json(permit);
  } catch (error: any) {
    console.error('Error updating work permit:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update work permit' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await mockFacilityService.deleteWorkPermit(params.id);
    return NextResponse.json({ message: 'Work permit deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting work permit:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete work permit' },
      { status: error.statusCode || 500 }
    );
  }
}