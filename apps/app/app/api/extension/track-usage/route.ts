import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Comprehensive usage tracking schema
const comprehensiveUsageSchema = z.object({
  modelId: z.string(),
  provider: z.string(),
  configName: z.string().optional(),
  
  // Core metrics
  cubentUnits: z.number().min(0),
  tokensUsed: z.number().min(0),
  inputTokens: z.number().min(0).optional(),
  outputTokens: z.number().min(0).optional(),
  costAccrued: z.number().min(0),
  requestsMade: z.number().min(1).default(1),
  
  // Metadata
  timestamp: z.number().optional(),
  sessionId: z.string().optional(),
  feature: z.string().optional(), // e.g., 'code-completion', 'chat', 'refactor'
  language: z.string().optional(), // programming language
  metadata: z.record(z.any()).optional(),
});

/**
 * Comprehensive usage tracking endpoint for the VS Code extension
 * Tracks Cubent Units, tokens, costs, and requests in a single call
 */
export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        // Try to validate as Clerk JWT directly
        const { clerkClient } = await import('@repo/auth/server');
        const client = await clerkClient();
        const session = await client.sessions.getSession(token);
        userId = session.userId;
        console.log('Comprehensive usage tracking - Clerk JWT validation successful:', { userId });
      } catch (clerkError) {
        console.log('Comprehensive usage tracking - Clerk JWT failed, trying PendingLogin:', clerkError);

        // Fallback: Check PendingLogin table
        const pendingLogin = await database.pendingLogin.findFirst({
          where: {
            token,
            expiresAt: { gt: new Date() },
          },
        });

        if (pendingLogin) {
          userId = pendingLogin.userId;
          console.log('Comprehensive usage tracking - PendingLogin validation successful:', { userId });
        } else {
          console.error('Comprehensive usage tracking - Invalid token');
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          );
        }
      }
    } else {
      console.error('Comprehensive usage tracking - No Bearer token provided');
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
    const {
      modelId,
      provider,
      configName,
      cubentUnits,
      tokensUsed,
      inputTokens = 0,
      outputTokens = 0,
      costAccrued,
      requestsMade,
      timestamp,
      sessionId,
      feature,
      language,
      metadata
    } = comprehensiveUsageSchema.parse(body);

    console.log('Comprehensive usage tracking:', {
      userId,
      modelId,
      provider,
      cubentUnits,
      tokensUsed,
      costAccrued,
      requestsMade,
      feature
    });

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

    // Update user's total usage counters
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        cubentUnitsUsed: {
          increment: cubentUnits
        },
        lastActiveAt: new Date(),
      },
    });

    // Create comprehensive usage analytics record
    await database.usageAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId,
        cubentUnitsUsed: cubentUnits,
        tokensUsed: tokensUsed,
        costAccrued: costAccrued,
        requestsMade: requestsMade,
        sessionId: sessionId,
        metadata: {
          provider,
          configName,
          timestamp: timestamp || Date.now(),
          inputTokens,
          outputTokens,
          feature,
          language,
          ...metadata
        }
      },
    });

    // Update or create daily usage metrics
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
          tokensUsed: {
            increment: tokensUsed
          },
          costAccrued: {
            increment: costAccrued
          },
          requestsMade: {
            increment: requestsMade
          }
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          cubentUnitsUsed: cubentUnits,
          tokensUsed: tokensUsed,
          costAccrued: costAccrued,
          requestsMade: requestsMade,
          date: today,
        },
      });
    }

    console.log('Comprehensive usage tracking successful:', {
      userId,
      cubentUnits,
      tokensUsed,
      costAccrued,
      requestsMade,
      totalCubentUnits: dbUser.cubentUnitsUsed + cubentUnits
    });

    return NextResponse.json({
      success: true,
      message: 'Comprehensive usage tracked successfully',
      data: {
        cubentUnitsUsed: cubentUnits,
        tokensUsed: tokensUsed,
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        costAccrued: costAccrued,
        requestsMade: requestsMade,
        totalCubentUnits: dbUser.cubentUnitsUsed + cubentUnits,
        modelId: modelId,
        provider: provider,
        feature: feature
      }
    });

  } catch (error) {
    console.error('Comprehensive usage tracking error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get comprehensive usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const { clerkClient } = await import('@repo/auth/server');
        const client = await clerkClient();
        const session = await client.sessions.getSession(token);
        userId = session.userId;
      } catch (clerkError) {
        const pendingLogin = await database.pendingLogin.findFirst({
          where: {
            token,
            expiresAt: { gt: new Date() },
          },
        });

        if (pendingLogin) {
          userId = pendingLogin.userId;
        } else {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          );
        }
      }
    } else {
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

    // Get usage metrics for the period
    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Get recent usage analytics
    const recentAnalytics = await database.usageAnalytics.findMany({
      where: {
        userId: dbUser.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalUsage = usageMetrics.reduce(
      (acc, metric) => ({
        cubentUnitsUsed: acc.cubentUnitsUsed + metric.cubentUnitsUsed,
        tokensUsed: acc.tokensUsed + metric.tokensUsed,
        requestsMade: acc.requestsMade + metric.requestsMade,
        costAccrued: acc.costAccrued + metric.costAccrued,
      }),
      { cubentUnitsUsed: 0, tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsage,
        dailyUsage: usageMetrics,
        recentActivity: recentAnalytics,
        period: `${days} days`,
        userTotals: {
          totalCubentUnits: dbUser.cubentUnitsUsed,
          cubentUnitsLimit: dbUser.cubentUnitsLimit,
        }
      }
    });

  } catch (error) {
    console.error('Usage statistics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
