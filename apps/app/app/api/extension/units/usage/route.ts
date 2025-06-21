import { auth } from '@repo/auth/server';
import { database, getUserUsageStats, getUserUsageHistory, getUserModelUsage, calculateUserUsageStats } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

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
    const days = parseInt(searchParams.get('days') || '30');
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const includeModels = searchParams.get('includeModels') === 'true';

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
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

    // Calculate current usage stats
    const usageStats = calculateUserUsageStats(
      dbUser.cubentUnitsUsed,
      dbUser.cubentUnitsLimit,
      dbUser.unitsResetDate || undefined
    );

    const response: any = {
      currentUsage: usageStats,
      period: `${days} days`,
    };

    // Include usage history if requested
    if (includeHistory) {
      try {
        const usageHistory = await getUserUsageHistory(dbUser.id, days);
        response.usageHistory = usageHistory;
      } catch (error) {
        console.error('Error fetching usage history:', error);
        response.usageHistory = [];
      }
    }

    // Include model usage breakdown if requested
    if (includeModels) {
      try {
        const modelUsage = await getUserModelUsage(dbUser.id, days);
        response.modelUsage = modelUsage.map(usage => ({
          modelId: usage.modelId,
          cubentUnitsUsed: usage._sum.cubentUnitsUsed || 0,
          tokensUsed: usage._sum.tokensUsed || 0,
          requestsMade: usage._sum.requestsMade || 0,
        }));
      } catch (error) {
        console.error('Error fetching model usage:', error);
        response.modelUsage = [];
      }
    }

    // Get recent usage analytics for charts
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyUsage = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
      select: {
        date: true,
        cubentUnitsUsed: true,
        tokensUsed: true,
        requestsMade: true,
      },
    });

    response.dailyUsage = dailyUsage;

    // Calculate usage trends
    const totalDailyUnits = dailyUsage.reduce((sum, day) => sum + day.cubentUnitsUsed, 0);
    const averageDailyUnits = dailyUsage.length > 0 ? totalDailyUnits / dailyUsage.length : 0;
    
    response.trends = {
      averageDailyUnits,
      totalUnitsThisPeriod: totalDailyUnits,
      daysActive: dailyUsage.filter(day => day.cubentUnitsUsed > 0).length,
    };

    // Calculate warning levels
    const warningLevel = usageStats.usagePercentage >= 100 ? 'exceeded' :
                        usageStats.usagePercentage >= 90 ? 'critical' :
                        usageStats.usagePercentage >= 75 ? 'warning' : 'none';

    response.warningLevel = warningLevel;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Usage stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to reset usage (for testing or manual reset)
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
    const { action } = body;

    if (action !== 'reset') {
      return NextResponse.json(
        { error: 'Invalid action. Only "reset" is supported.' },
        { status: 400 }
      );
    }

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Reset user's usage
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        cubentUnitsUsed: 0,
        unitsResetDate: new Date(),
      },
    });

    // Get updated stats
    const updatedStats = calculateUserUsageStats(0, dbUser.cubentUnitsLimit, new Date());

    return NextResponse.json({
      success: true,
      message: 'Usage reset successfully',
      usage: updatedStats,
    });

  } catch (error) {
    console.error('Usage reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
