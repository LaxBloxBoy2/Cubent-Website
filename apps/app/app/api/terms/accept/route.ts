import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const acceptTermsSchema = z.object({
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId } = acceptTermsSchema.parse(body);

    // Verify the user exists and belongs to the authenticated user
    const dbUser = await database.user.findUnique({
      where: { 
        id: userId,
        clerkId: clerkUserId,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user to mark terms as accepted
    const updatedUser = await database.user.update({
      where: { id: userId },
      data: {
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Terms accepted successfully',
      termsAcceptedAt: updatedUser.termsAcceptedAt,
    });

  } catch (error) {
    console.error('Terms acceptance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
