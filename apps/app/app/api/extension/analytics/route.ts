import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get comprehensive extension usage analytics
 */
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
    const period = searchParams.get('period') || '30d';
    const groupBy = searchParams.get('groupBy') || 'day';

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get usage metrics for the period
    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Get extension sessions for the period
    const extensionSessions = await database.extensionSession.findMany({
      where: {
        userId: dbUser.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate totals
    const totals = usageMetrics.reduce(
      (acc, metric) => ({
        tokensUsed: acc.tokensUsed + metric.tokensUsed,
        requestsMade: acc.requestsMade + metric.requestsMade,
        costAccrued: acc.costAccrued + metric.costAccrued,
      }),
      { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
    );

    // Group data by time period
    const groupedData = groupBy === 'day' 
      ? groupByDay(usageMetrics, startDate, now)
      : groupBy === 'week'
      ? groupByWeek(usageMetrics, startDate, now)
      : groupByMonth(usageMetrics, startDate, now);

    // Calculate session statistics
    const sessionStats = {
      totalSessions: extensionSessions.length,
      activeSessions: extensionSessions.filter(s => s.isActive).length,
      averageSessionDuration: calculateAverageSessionDuration(extensionSessions),
      mostUsedVersion: getMostUsedVersion(extensionSessions),
      platformDistribution: getPlatformDistribution(extensionSessions),
    };

    // Calculate trends (compare with previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const previousTotals = previousMetrics.reduce(
      (acc, metric) => ({
        tokensUsed: acc.tokensUsed + metric.tokensUsed,
        requestsMade: acc.requestsMade + metric.requestsMade,
        costAccrued: acc.costAccrued + metric.costAccrued,
      }),
      { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
    );

    const trends = {
      tokensUsed: calculateTrend(totals.tokensUsed, previousTotals.tokensUsed),
      requestsMade: calculateTrend(totals.requestsMade, previousTotals.requestsMade),
      costAccrued: calculateTrend(totals.costAccrued, previousTotals.costAccrued),
    };

    // Get top usage days
    const topUsageDays = usageMetrics
      .sort((a, b) => b.tokensUsed - a.tokensUsed)
      .slice(0, 5)
      .map(metric => ({
        date: metric.date,
        tokensUsed: metric.tokensUsed,
        requestsMade: metric.requestsMade,
        costAccrued: metric.costAccrued,
      }));

    const response = {
      period,
      dateRange: {
        start: startDate,
        end: now,
      },
      totals,
      trends,
      timeSeries: groupedData,
      sessions: sessionStats,
      topUsageDays,
      insights: generateInsights(totals, sessionStats, trends),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function groupByDay(metrics: any[], startDate: Date, endDate: Date) {
  const grouped: { [key: string]: any } = {};
  
  // Initialize all days with zero values
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    grouped[dateKey] = {
      date: dateKey,
      tokensUsed: 0,
      requestsMade: 0,
      costAccrued: 0,
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual data
  metrics.forEach(metric => {
    const dateKey = metric.date.toISOString().split('T')[0];
    if (grouped[dateKey]) {
      grouped[dateKey].tokensUsed += metric.tokensUsed;
      grouped[dateKey].requestsMade += metric.requestsMade;
      grouped[dateKey].costAccrued += metric.costAccrued;
    }
  });

  return Object.values(grouped);
}

function groupByWeek(metrics: any[], startDate: Date, endDate: Date) {
  // Similar implementation for weekly grouping
  return groupByDay(metrics, startDate, endDate); // Simplified for now
}

function groupByMonth(metrics: any[], startDate: Date, endDate: Date) {
  // Similar implementation for monthly grouping
  return groupByDay(metrics, startDate, endDate); // Simplified for now
}

function calculateAverageSessionDuration(sessions: any[]) {
  if (sessions.length === 0) return 0;
  
  const totalDuration = sessions.reduce((acc, session) => {
    if (session.lastActiveAt && session.createdAt) {
      return acc + (session.lastActiveAt.getTime() - session.createdAt.getTime());
    }
    return acc;
  }, 0);

  return Math.round(totalDuration / sessions.length / (1000 * 60)); // Average in minutes
}

function getMostUsedVersion(sessions: any[]) {
  const versionCounts: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    if (session.extensionVersion) {
      versionCounts[session.extensionVersion] = (versionCounts[session.extensionVersion] || 0) + 1;
    }
  });

  return Object.entries(versionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
}

function getPlatformDistribution(sessions: any[]) {
  const platformCounts: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    if (session.platform) {
      platformCounts[session.platform] = (platformCounts[session.platform] || 0) + 1;
    }
  });

  return platformCounts;
}

function calculateTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function generateInsights(totals: any, sessionStats: any, trends: any) {
  const insights = [];

  if (trends.tokensUsed > 20) {
    insights.push({
      type: 'positive',
      message: `Token usage increased by ${trends.tokensUsed}% compared to the previous period`,
    });
  } else if (trends.tokensUsed < -20) {
    insights.push({
      type: 'neutral',
      message: `Token usage decreased by ${Math.abs(trends.tokensUsed)}% compared to the previous period`,
    });
  }

  if (sessionStats.averageSessionDuration > 60) {
    insights.push({
      type: 'positive',
      message: `Long average session duration (${sessionStats.averageSessionDuration} minutes) indicates high engagement`,
    });
  }

  if (totals.costAccrued > 10) {
    insights.push({
      type: 'warning',
      message: `High cost accrued ($${totals.costAccrued.toFixed(2)}). Consider optimizing usage or upgrading plan`,
    });
  }

  return insights;
}
