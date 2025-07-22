import { NextRequest } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { CreateEquipmentRequest, FacilityArea } from '@/lib/types/facility';
import { handleApiError } from '@/lib/utils/error-handling';
import { paginatedResponse, createdResponse, badRequestResponse } from '@/lib/api/response';
import { PaginationParams } from '@/lib/types/utility-types';

interface EquipmentQueryParams extends PaginationParams {
  status?: string[];
  location?: FacilityArea[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '10');
    
    if (isNaN(page) || page < 1) {
      return badRequestResponse('Invalid page parameter');
    }
    
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return badRequestResponse('Invalid limit parameter (must be between 1 and 100)');
    }
    
    const params: EquipmentQueryParams = {
      status: searchParams.get('status')?.split(',').filter(Boolean),
      location: searchParams.get('location')?.split(',').filter(Boolean) as FacilityArea[] | undefined,
      page,
      pageSize
    };

    const result = await mockFacilityService.getEquipments({
      ...params,
      limit: params.pageSize
    });
    
    return paginatedResponse(
      result.items,
      result.total,
      result.page,
      result.limit,
      'Equipment list retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEquipmentRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.type || !body.location) {
      return badRequestResponse('Missing required fields: name, type, location');
    }
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    const equipment = await mockFacilityService.createEquipment(body, userId);
    
    return createdResponse(equipment, 'Equipment created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}