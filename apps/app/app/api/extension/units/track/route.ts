import { auth } from '@repo/auth/server';
import { database, trackTokenUsage, calculateCubentUnits } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const tokenUsageSchema = z.object({
  modelId: z.string(),
  tokensUsed: z.number().min(0).optional(),
  requestsMade: z.number().min(0).default(1),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { modelId, tokensUsed, requestsMade, sessionId, metadata } = tokenUsageSchema.parse(body);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate Cubent Units used
    const cubentUnitsUsed = calculateCubentUnits(modelId);

    // Check if user has enough units remaining
    if (dbUser.cubentUnitsUsed + cubentUnitsUsed > dbUser.cubentUnitsLimit) {
      return NextResponse.json(
        { 
          error: 'Insufficient Cubent Units',
          cubentUnitsUsed: dbUser.cubentUnitsUsed,
          cubentUnitsLimit: dbUser.cubentUnitsLimit,
          cubentUnitsRequired: cubentUnitsUsed,
          cubentUnitsRemaining: Math.max(0, dbUser.cubentUnitsLimit - dbUser.cubentUnitsUsed)
        },
        { status: 429 }
      );
    }

    // Track the usage
    await trackTokenUsage(dbUser.id, {
      modelId,
      cubentUnitsUsed,
      tokensUsed,
      requestsMade,
      sessionId,
      metadata,
    });

    // Get updated usage stats
    const updatedUser = await database.user.findUnique({
      where: { id: dbUser.id },
      select: {
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        unitsResetDate: true,
      },
    });

    const cubentUnitsRemaining = Math.max(0, (updatedUser?.cubentUnitsLimit || 50) - (updatedUser?.cubentUnitsUsed || 0));
    const usagePercentage = Math.min(100, ((updatedUser?.cubentUnitsUsed || 0) / (updatedUser?.cubentUnitsLimit || 50)) * 100);

    return NextResponse.json({
      success: true,
      message: 'Token usage tracked successfully',
      usage: {
        cubentUnitsUsed: updatedUser?.cubentUnitsUsed || 0,
        cubentUnitsLimit: updatedUser?.cubentUnitsLimit || 50,
        cubentUnitsRemaining,
        usagePercentage,
        canMakeRequest: cubentUnitsRemaining > 0,
        unitsResetDate: updatedUser?.unitsResetDate,
      },
      modelInfo: {
        modelId,
        cubentUnitsPerMessage: cubentUnitsUsed,
      },
    });

  } catch (error) {
    console.error('Token usage tracking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user can make a request with a specific model
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { error: 'modelId parameter is required' },
        { status: 400 }
      );
    }

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        unitsResetDate: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const cubentUnitsRequired = calculateCubentUnits(modelId);
    const cubentUnitsRemaining = Math.max(0, dbUser.cubentUnitsLimit - dbUser.cubentUnitsUsed);
    const canMakeRequest = cubentUnitsRemaining >= cubentUnitsRequired;

    return NextResponse.json({
      canMakeRequest,
      cubentUnitsRequired,
      cubentUnitsRemaining,
      cubentUnitsUsed: dbUser.cubentUnitsUsed,
      cubentUnitsLimit: dbUser.cubentUnitsLimit,
      modelId,
    });

  } catch (error) {
    console.error('Token usage check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
