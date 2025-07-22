import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { UpdateEquipmentRequest } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const equipment = await mockFacilityService.getEquipment(id);
    return NextResponse.json(equipment);
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
    const updateRequest: UpdateEquipmentRequest = {
      id,
      updates: body
    };
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const equipment = await mockFacilityService.updateEquipment(updateRequest, userId);
    return NextResponse.json(equipment);
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
    await mockFacilityService.deleteEquipment(id);
    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}