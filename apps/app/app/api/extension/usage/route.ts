import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const usageUpdateSchema = z.object({
  tokensUsed: z.number().min(0),
  requestsMade: z.number().min(0),
  costAccrued: z.number().min(0),
  date: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header (for extension)
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
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } else {
      // Fallback to regular Clerk auth for web requests
      const authResult = await auth();
      userId = authResult.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Handle both old format and new Cubent Units format
    if (body.modelId && body.cubentUnits !== undefined) {
      // New Cubent Units tracking format
      const { modelId, provider, configName, cubentUnits, messageCount, timestamp } = body;

      const dbUser = await database.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user's total Cubent Units used
      await database.user.update({
        where: { id: dbUser.id },
        data: {
          cubentUnitsUsed: {
            increment: cubentUnits
          },
          lastActiveAt: new Date(),
        },
      });

      // Create usage analytics record
      await database.usageAnalytics.create({
        data: {
          userId: dbUser.id,
          modelId,
          cubentUnitsUsed: cubentUnits,
          requestsMade: messageCount || 1,
          metadata: {
            provider,
            configName,
            timestamp
          }
        },
      });

      // Update daily usage metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingMetrics = await database.usageMetrics.findFirst({
        where: {
          userId: dbUser.id,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (existingMetrics) {
        await database.usageMetrics.update({
          where: { id: existingMetrics.id },
          data: {
            cubentUnitsUsed: {
              increment: cubentUnits
            },
            requestsMade: {
              increment: messageCount || 1
            }
          },
        });
      } else {
        await database.usageMetrics.create({
          data: {
            userId: dbUser.id,
            cubentUnitsUsed: cubentUnits,
            requestsMade: messageCount || 1,
            date: today,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Cubent Units usage tracked successfully',
        cubentUnitsUsed: cubentUnits,
        totalCubentUnits: dbUser.cubentUnitsUsed + cubentUnits
      });
    }

    // Original token-based tracking format
    const { tokensUsed, requestsMade, costAccrued, date } = usageUpdateSchema.parse(body);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const usageDate = date ? new Date(date) : new Date();
    
    // Create or update usage metrics for the day
    const existingUsage = await database.usageMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: {
          gte: new Date(usageDate.getFullYear(), usageDate.getMonth(), usageDate.getDate()),
          lt: new Date(usageDate.getFullYear(), usageDate.getMonth(), usageDate.getDate() + 1),
        },
      },
    });

    if (existingUsage) {
      await database.usageMetrics.update({
        where: { id: existingUsage.id },
        data: {
          tokensUsed: existingUsage.tokensUsed + tokensUsed,
          requestsMade: existingUsage.requestsMade + requestsMade,
          costAccrued: existingUsage.costAccrued + costAccrued,
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          tokensUsed,
          requestsMade,
          costAccrued,
          date: usageDate,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Usage metrics updated successfully',
    });

  } catch (error) {
    console.error('Usage update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header (for extension)
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
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } else {
      // Fallback to regular Clerk auth for web requests
      const authResult = await auth();
      userId = authResult.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalUsage = usageMetrics.reduce(
      (acc, metric) => ({
        tokensUsed: acc.tokensUsed + metric.tokensUsed,
        requestsMade: acc.requestsMade + metric.requestsMade,
        costAccrued: acc.costAccrued + metric.costAccrued,
      }),
      { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
    );

    return NextResponse.json({
      totalUsage,
      dailyUsage: usageMetrics,
      period: `${days} days`,
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
