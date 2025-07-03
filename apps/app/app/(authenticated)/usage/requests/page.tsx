import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { redirect } from 'next/navigation';
import { RequestTrackingContent } from './components/request-tracking-content';

const RequestTrackingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user from database
  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
        select: {
          date: true,
          requestsMade: true,
          cubentUnitsUsed: true,
        }
      },
      usageAnalytics: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Recent requests
        select: {
          id: true,
          modelId: true,
          requestsMade: true,
          cubentUnitsUsed: true,
          createdAt: true,
          metadata: true,
        }
      },
      extensionSessions: {
        where: { isActive: true },
        select: {
          id: true,
          isActive: true,
        }
      }
    }
  });

  if (!dbUser) {
    redirect('/sign-in');
  }

  // Calculate total requests
  const totalRequests = await database.usageMetrics.aggregate({
    where: { userId: dbUser.id },
    _sum: { requestsMade: true }
  });

  // Calculate requests by model
  const requestsByModel = await database.usageAnalytics.groupBy({
    by: ['modelId'],
    where: { userId: dbUser.id },
    _sum: { requestsMade: true },
    _count: { id: true },
    orderBy: { _sum: { requestsMade: 'desc' } }
  });

  // Calculate daily averages
  const last7Days = dbUser.usageMetrics.slice(0, 7);
  const avgDailyRequests = last7Days.length > 0 
    ? last7Days.reduce((sum, day) => sum + day.requestsMade, 0) / last7Days.length 
    : 0;

  // Calculate peak usage day
  const peakDay = dbUser.usageMetrics.reduce((peak, day) => 
    day.requestsMade > peak.requestsMade ? day : peak, 
    { requestsMade: 0, date: new Date() }
  );

  // Prepare chart data for the last 30 days
  const chartData = dbUser.usageMetrics.map((metric) => ({
    date: metric.date.toISOString().split('T')[0],
    requests: metric.requestsMade,
    cubentUnits: metric.cubentUnitsUsed,
  })).reverse();

  const requestTrackingData = {
    totalRequests: totalRequests._sum.requestsMade || 0,
    avgDailyRequests: Math.round(avgDailyRequests * 10) / 10,
    peakDay: {
      date: peakDay.date,
      requests: peakDay.requestsMade,
    },
    chartData,
    requestsByModel: requestsByModel.map(model => ({
      modelId: model.modelId,
      requests: model._sum.requestsMade || 0,
      sessions: model._count.id,
    })),
    recentRequests: dbUser.usageAnalytics.map(analytics => ({
      id: analytics.id,
      modelId: analytics.modelId,
      requests: analytics.requestsMade,
      cubentUnits: analytics.cubentUnitsUsed,
      timestamp: analytics.createdAt,
      provider: 'Unknown',
    })),
    activeSessions: dbUser.extensionSessions?.length || 0,
  };

  return <RequestTrackingContent data={requestTrackingData} />;
};

export default RequestTrackingPage;