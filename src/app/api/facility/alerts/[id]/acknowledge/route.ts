import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';
import { FacilityAlertAcknowledgeRequest } from '@/lib/types/facility';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // TODO: Get actual user ID from session
    const userId = body.acknowledgedBy || 'user-001';
    
    const acknowledgeRequest: FacilityAlertAcknowledgeRequest = {
      id: params.id,
      acknowledgedBy: userId,
      notes: body.notes
    };
    
    const alert = await mockFacilityService.acknowledgeAlert(acknowledgeRequest);
    
    return NextResponse.json(alert);
  } catch (error: any) {
    console.error('Error acknowledging alert:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to acknowledge alert' },
      { status: error.statusCode || 500 }
    );
  }
}