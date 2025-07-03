import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { redirect } from 'next/navigation';
import { CostTrackingContent } from './components/cost-tracking-content';

const CostTrackingPage = async () => {
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
          costAccrued: true,
          tokensUsed: true,
          requestsMade: true,
          cubentUnitsUsed: true,
        }
      },
      usageAnalytics: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Recent usage
        select: {
          id: true,
          modelId: true,
          costAccrued: true,
          tokensUsed: true,
          requestsMade: true,
          cubentUnitsUsed: true,
          createdAt: true,
          metadata: true,
        }
      }
    }
  });

  if (!dbUser) {
    redirect('/sign-in');
  }

  // Calculate total cost
  const totalCost = await database.usageMetrics.aggregate({
    where: { userId: dbUser.id },
    _sum: { costAccrued: true }
  });

  // Calculate cost by model
  const costByModel = await database.usageAnalytics.groupBy({
    by: ['modelId'],
    where: { userId: dbUser.id },
    _sum: { costAccrued: true, tokensUsed: true, requestsMade: true },
    _count: { id: true },
    orderBy: { _sum: { costAccrued: 'desc' } }
  });

  // Calculate daily averages
  const last7Days = dbUser.usageMetrics.slice(0, 7);
  const avgDailyCost = last7Days.length > 0 
    ? last7Days.reduce((sum, day) => sum + day.costAccrued, 0) / last7Days.length 
    : 0;

  // Calculate peak cost day
  const peakDay = dbUser.usageMetrics.reduce((peak, day) => 
    day.costAccrued > peak.costAccrued ? day : peak, 
    { costAccrued: 0, date: new Date() }
  );

  // Calculate cost efficiency metrics
  const totalTokensSum = await database.usageMetrics.aggregate({
    where: { userId: dbUser.id },
    _sum: { tokensUsed: true }
  });

  const totalRequestsSum = await database.usageMetrics.aggregate({
    where: { userId: dbUser.id },
    _sum: { requestsMade: true }
  });

  const costPerToken = (totalCost._sum.costAccrued || 0) > 0 && (totalTokensSum._sum.tokensUsed || 0) > 0
    ? (totalCost._sum.costAccrued || 0) / (totalTokensSum._sum.tokensUsed || 0)
    : 0;

  const costPerRequest = (totalCost._sum.costAccrued || 0) > 0 && (totalRequestsSum._sum.requestsMade || 0) > 0
    ? (totalCost._sum.costAccrued || 0) / (totalRequestsSum._sum.requestsMade || 0)
    : 0;

  // Prepare chart data for the last 30 days
  const chartData = dbUser.usageMetrics.map((metric) => ({
    date: metric.date.toISOString().split('T')[0],
    cost: metric.costAccrued,
    tokens: metric.tokensUsed,
    requests: metric.requestsMade,
    cubentUnits: metric.cubentUnitsUsed,
  })).reverse();

  const costTrackingData = {
    totalCost: totalCost._sum.costAccrued || 0,
    avgDailyCost,
    peakDay: {
      date: peakDay.date,
      cost: peakDay.costAccrued,
    },
    costPerToken,
    costPerRequest,
    chartData,
    costByModel: costByModel.map(model => ({
      modelId: model.modelId,
      cost: model._sum.costAccrued || 0,
      tokens: model._sum.tokensUsed || 0,
      requests: model._sum.requestsMade || 0,
      sessions: model._count.id,
    })),
    recentCosts: dbUser.usageAnalytics.map(analytics => ({
      id: analytics.id,
      modelId: analytics.modelId,
      cost: analytics.costAccrued,
      tokens: analytics.tokensUsed,
      requests: analytics.requestsMade,
      cubentUnits: analytics.cubentUnitsUsed,
      timestamp: analytics.createdAt,
      provider: 'Unknown',
    })),
    monthlyProjection: avgDailyCost * 30, // Simple projection based on daily average
  };

  return <CostTrackingContent data={costTrackingData} />;
};

export default CostTrackingPage;
