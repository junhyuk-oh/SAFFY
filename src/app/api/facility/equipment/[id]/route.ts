import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { UpdateEquipmentRequest } from '@/lib/types/facility';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipment = await mockFacilityService.getEquipment(params.id);
    return NextResponse.json(equipment);
  } catch (error: any) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch equipment' },
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
    const updateRequest: UpdateEquipmentRequest = {
      id: params.id,
      updates: body
    };
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const equipment = await mockFacilityService.updateEquipment(updateRequest, userId);
    return NextResponse.json(equipment);
  } catch (error: any) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update equipment' },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await mockFacilityService.deleteEquipment(params.id);
    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete equipment' },
      { status: error.statusCode || 500 }
    );
  }
}