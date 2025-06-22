import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find or create user in database
    let dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        subscriptionTier: true,
      }
    });

    if (!dbUser) {
      // Create new user automatically for social login users
      const newUser = await database.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          picture: clerkUser.imageUrl,
        },
        select: {
          id: true,
          cubentUnitsUsed: true,
          cubentUnitsLimit: true,
          subscriptionTier: true,
        }
      });
      dbUser = newUser;
    }

    // Get total messages from usage analytics
    const totalMessages = await database.usageAnalytics.count({
      where: {
        userId: dbUser.id
      }
    });

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '0'); // 0 = all time

    // Calculate date range
    let dateFilter = {};
    if (days > 0) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = {
        date: {
          gte: startDate
        }
      };
    }

    // Get usage metrics for the specified period
    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        ...dateFilter
      },
      orderBy: { date: 'desc' }
    });

    // Get usage analytics for detailed breakdown
    const usageAnalytics = await database.usageAnalytics.findMany({
      where: {
        userId: dbUser.id,
        ...(days > 0 ? {
          createdAt: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    const totalCubentUnits = days > 0
      ? usageMetrics.reduce((sum, metric) => sum + (metric.cubentUnitsUsed || 0), 0)
      : dbUser.cubentUnitsUsed || 0;

    const totalMessages = usageMetrics.reduce((sum, metric) => sum + (metric.requestsMade || 0), 0);

    // Calculate model breakdown
    const modelBreakdown: Record<string, { cubentUnits: number; messages: number }> = {};
    usageAnalytics.forEach(analytics => {
      if (!modelBreakdown[analytics.modelId]) {
        modelBreakdown[analytics.modelId] = { cubentUnits: 0, messages: 0 };
      }
      modelBreakdown[analytics.modelId].cubentUnits += analytics.cubentUnitsUsed || 0;
      modelBreakdown[analytics.modelId].messages += analytics.requestsMade || 0;
    });

    // Create entries array for compatibility with frontend
    const entries = usageAnalytics.map(analytics => ({
      timestamp: analytics.createdAt.getTime(),
      modelId: analytics.modelId,
      cubentUnits: analytics.cubentUnitsUsed || 0,
      messageCount: analytics.requestsMade || 0,
      provider: (analytics.metadata as any)?.provider || 'unknown',
      configName: (analytics.metadata as any)?.configName || 'default'
    }));

    // Get current month usage for additional context
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        cubentUnitsUsed: true,
        requestsMade: true
      }
    });

    return NextResponse.json({
      success: true,
      totalCubentUnits,
      totalMessages,
      userLimit: dbUser.cubentUnitsLimit || 50,
      subscriptionTier: dbUser.subscriptionTier || 'free_trial',
      lastUpdated: usageAnalytics.length > 0 ? usageAnalytics[0].createdAt.getTime() : Date.now(),
      entries,
      modelBreakdown,
      monthlyUsage: {
        cubentUnits: monthlyUsage._sum.cubentUnitsUsed || 0,
        messages: monthlyUsage._sum.requestsMade || 0
      }
    });

  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
