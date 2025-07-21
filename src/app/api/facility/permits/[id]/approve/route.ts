import { NextRequest, NextResponse } from 'next/server';
import { mockFacilityService } from '@/lib/services/mockFacilityService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { comments, action } = body;
    
    // TODO: Get actual user ID from session
    const userId = 'user-001';
    
    let permit;
    if (action === 'approve') {
      permit = await mockFacilityService.approveWorkPermit(params.id, userId, comments);
    } else if (action === 'reject') {
      permit = await mockFacilityService.rejectWorkPermit(params.id, userId, comments);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(permit);
  } catch (error: any) {
    console.error('Error processing work permit approval:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process work permit approval' },
      { status: error.statusCode || 500 }
    );
  }
}