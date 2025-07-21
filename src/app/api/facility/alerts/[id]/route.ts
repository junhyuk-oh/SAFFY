import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { FacilityAlertResolveRequest } from '@/lib/types/facility';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await mockFacilityService.getAlert(params.id);
    return NextResponse.json(alert);
  } catch (error: any) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alert' },
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
    
    // Check if this is a resolve request
    if (body.resolution && body.actionsTaken) {
      const resolveRequest: FacilityAlertResolveRequest = {
        id: params.id,
        resolvedBy: body.resolvedBy || 'user-001', // TODO: Get from session
        resolution: body.resolution,
        actionsTaken: body.actionsTaken,
        preventiveMeasures: body.preventiveMeasures,
        attachments: body.attachments,
        notes: body.notes
      };
      
      const alert = await mockFacilityService.resolveAlert(resolveRequest);
      return NextResponse.json(alert);
    } else {
      // For now, just return error for other updates
      return NextResponse.json(
        { error: 'Only resolve action is supported via PUT' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update alert' },
      { status: error.statusCode || 500 }
    );
  }
}