import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const extensionUsageSchema = z.object({
  modelId: z.string(),
  provider: z.string(),
  configName: z.string(),
  cubentUnits: z.number().min(0),
  messageCount: z.number().min(1).default(1),
  timestamp: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Extension-specific usage tracking endpoint
 * Supports Bearer token authentication for VS Code extension
 */
export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      // Extension is using custom token (Clerk session ID)
      const token = authHeader.substring(7);

      // Find the pending login with this token to get the user
      const pendingLogin = await database.pendingLogin.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() }, // Not expired
        },
      });

      if (pendingLogin) {
        // Token is valid, but we need to get the user ID from the session
        // The token is actually a Clerk session ID, so we can use it to get user info
        try {
          const { clerkClient } = await import('@repo/auth/server');
          const client = await clerkClient();
          const session = await client.sessions.getSession(token);
          userId = session.userId;
        } catch (error) {
          console.error('Extension usage tracking - Invalid session token:', error);
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
        console.error('Extension usage tracking - Token not found in pendingLogin table');
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } else {
      console.error('Extension usage tracking - No Bearer token provided');
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { modelId, provider, configName, cubentUnits, messageCount, timestamp, metadata } = extensionUsageSchema.parse(body);

    console.log('Extension usage tracking:', { userId, modelId, provider, cubentUnits, messageCount });

    // Find the user in the database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's total cubent units
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        cubentUnitsUsed: {
          increment: cubentUnits
        }
      },
    });

    // Create usage analytics entry
    await database.usageAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId,
        cubentUnitsUsed: cubentUnits,
        requestsMade: messageCount,
        metadata: {
          provider,
          configName,
          timestamp: timestamp || Date.now(),
          ...metadata,
        },
      },
    });

    // Update or create daily usage metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetrics = await database.usageMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: today,
      },
    });

    if (existingMetrics) {
      await database.usageMetrics.update({
        where: { id: existingMetrics.id },
        data: {
          cubentUnitsUsed: {
            increment: cubentUnits
          },
          requestsMade: {
            increment: messageCount
          }
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          cubentUnitsUsed: cubentUnits,
          requestsMade: messageCount,
          date: today,
        },
      });
    }

    console.log('Extension usage tracking successful:', { 
      userId, 
      cubentUnits, 
      totalUnits: dbUser.cubentUnitsUsed + cubentUnits 
    });

    return NextResponse.json({
      success: true,
      message: 'Usage tracked successfully',
      cubentUnitsUsed: cubentUnits,
      totalCubentUnits: dbUser.cubentUnitsUsed + cubentUnits,
      messageCount,
    });

  } catch (error) {
    console.error('Extension usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
