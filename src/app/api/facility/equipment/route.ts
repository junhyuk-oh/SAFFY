import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateEquipmentRequest, FacilityArea } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      status: searchParams.get('status')?.split(','),
      location: searchParams.get('location')?.split(',') as FacilityArea[] | undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await mockFacilityService.getEquipments(params);
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEquipmentRequest = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const equipment = await mockFacilityService.createEquipment(body, userId);
    
    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}