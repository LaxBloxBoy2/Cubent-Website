import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { redirect } from 'next/navigation';
import { TokenUsageContent } from './components/token-usage-content';

const TokenUsagePage = async () => {
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
          tokensUsed: true,
          inputTokens: true,
          outputTokens: true,
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

  // Calculate total tokens
  const totalTokens = await database.usageMetrics.aggregate({
    where: { userId: dbUser.id },
    _sum: {
      tokensUsed: true,
      inputTokens: true,
      outputTokens: true
    }
  });

  // Calculate tokens by model
  const tokensByModel = await database.usageAnalytics.groupBy({
    by: ['modelId'],
    where: { userId: dbUser.id },
    _sum: { tokensUsed: true, requestsMade: true },
    _count: { id: true },
    orderBy: { _sum: { tokensUsed: 'desc' } }
  });

  // Calculate daily averages
  const last7Days = dbUser.usageMetrics.slice(0, 7);
  const avgDailyTokens = last7Days.length > 0 
    ? last7Days.reduce((sum, day) => sum + day.tokensUsed, 0) / last7Days.length 
    : 0;

  // Use real input/output tokens from the database
  const totalTokensSum = totalTokens._sum.tokensUsed || 0;
  const actualInputTokens = totalTokens._sum.inputTokens || 0;
  const actualOutputTokens = totalTokens._sum.outputTokens || 0;

  // Fallback to estimates only if real data is not available
  const inputTokens = actualInputTokens > 0 ? actualInputTokens : Math.round(totalTokensSum * 0.85);
  const outputTokens = actualOutputTokens > 0 ? actualOutputTokens : Math.round(totalTokensSum * 0.15);

  // Calculate peak usage day
  const peakDay = dbUser.usageMetrics.reduce((peak, day) => 
    day.tokensUsed > peak.tokensUsed ? day : peak, 
    { tokensUsed: 0, date: new Date() }
  );

  // Prepare chart data for the last 30 days
  const chartData = dbUser.usageMetrics.map((metric) => ({
    date: metric.date.toISOString().split('T')[0],
    tokens: metric.tokensUsed,
    // Use real input/output tokens, fallback to estimates if not available
    inputTokens: metric.inputTokens > 0 ? metric.inputTokens : Math.round(metric.tokensUsed * 0.85),
    outputTokens: metric.outputTokens > 0 ? metric.outputTokens : Math.round(metric.tokensUsed * 0.15),
    requests: metric.requestsMade,
  })).reverse();

  const tokenUsageData = {
    totalTokens: totalTokensSum,
    estimatedInputTokens: inputTokens,
    estimatedOutputTokens: outputTokens,
    avgDailyTokens: Math.round(avgDailyTokens),
    peakDay: {
      date: peakDay.date,
      tokens: peakDay.tokensUsed,
    },
    chartData,
    tokensByModel: tokensByModel.map(model => ({
      modelId: model.modelId,
      tokens: model._sum.tokensUsed || 0,
      requests: model._sum.requestsMade || 0,
      sessions: model._count.id,
    })),
    recentUsage: dbUser.usageAnalytics.map(analytics => ({
      id: analytics.id,
      modelId: analytics.modelId,
      tokens: analytics.tokensUsed,
      requests: analytics.requestsMade,
      cubentUnits: analytics.cubentUnitsUsed,
      timestamp: analytics.createdAt,
      provider: 'Unknown',
    })),
    tokensPerRequest: totalTokensSum > 0 && dbUser.usageMetrics.length > 0 
      ? Math.round(totalTokensSum / dbUser.usageMetrics.reduce((sum, m) => sum + m.requestsMade, 0))
      : 0,
  };

  return <TokenUsageContent data={tokenUsageData} />;
};

export default TokenUsagePage;
