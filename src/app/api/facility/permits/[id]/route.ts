import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { UpdateWorkPermitRequest } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const permit = await mockFacilityService.getWorkPermit(id);
    return NextResponse.json(permit);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateRequest: UpdateWorkPermitRequest = {
      id,
      ...body
    };
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const permit = await mockFacilityService.updateWorkPermit(updateRequest, userId);
    return NextResponse.json(permit);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await mockFacilityService.deleteWorkPermit(id);
    return NextResponse.json({ message: 'Work permit deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}