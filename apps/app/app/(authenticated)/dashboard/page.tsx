import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardContent } from './components/dashboard-content';

const title = 'Dashboard - Cubent';
const description = 'API analytics and extension usage metrics';

export const metadata: Metadata = {
  title,
  description,
};

const Dashboard = async () => {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  // Get user from database
  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
      },
      usageAnalytics: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Recent analytics
      },
      extensionSessions: {
        where: { isActive: true },
      },
    },
  });

  if (!dbUser) {
    notFound();
  }

  // Calculate totals
  const totalUsage = dbUser.usageMetrics.reduce(
    (acc, metric) => ({
      tokensUsed: acc.tokensUsed + metric.tokensUsed,
      inputTokens: acc.inputTokens + metric.inputTokens,
      outputTokens: acc.outputTokens + metric.outputTokens,
      requestsMade: acc.requestsMade + metric.requestsMade,
      costAccrued: acc.costAccrued + metric.costAccrued,
      cubentUnitsUsed: acc.cubentUnitsUsed + metric.cubentUnitsUsed,
    }),
    { tokensUsed: 0, inputTokens: 0, outputTokens: 0, requestsMade: 0, costAccrued: 0, cubentUnitsUsed: 0 }
  );

  // Get recent analytics for API calls breakdown
  const recentAnalytics = dbUser.usageAnalytics.slice(0, 50);

  // Calculate model usage breakdown
  const modelBreakdown = dbUser.usageAnalytics.reduce((acc, analytics) => {
    const modelId = analytics.modelId;
    if (!acc[modelId]) {
      acc[modelId] = {
        modelId,
        requests: 0,
        cubentUnits: 0,
        tokens: 0,
        cost: 0,
      };
    }
    acc[modelId].requests += analytics.requestsMade;
    acc[modelId].cubentUnits += analytics.cubentUnitsUsed;
    acc[modelId].tokens += analytics.tokensUsed;
    acc[modelId].cost += analytics.costAccrued;
    return acc;
  }, {} as Record<string, any>);

  // Calculate response times (mock data for now)
  const avgResponseTime = 231.5; // ms

  // Prepare chart data for the last 30 days
  const chartData = dbUser.usageMetrics.map(metric => ({
    date: metric.date.toISOString().split('T')[0],
    requests: metric.requestsMade,
    cubentUnits: metric.cubentUnitsUsed,
    tokens: metric.tokensUsed,
  })).reverse();

  const dashboardData = {
    totalRequests: totalUsage.requestsMade,
    totalCubentUnits: totalUsage.cubentUnitsUsed,
    totalTokens: totalUsage.tokensUsed,
    totalInputTokens: totalUsage.inputTokens,
    totalOutputTokens: totalUsage.outputTokens,
    totalCost: totalUsage.costAccrued,
    avgResponseTime,
    chartData,
    modelBreakdown: Object.values(modelBreakdown),
    recentAnalytics,
    activeSessions: dbUser.extensionSessions.length,
    userLimit: dbUser.cubentUnitsLimit || 50,
    subscriptionTier: dbUser.subscriptionTier || 'free_trial',
  };

  return <DashboardContent data={dashboardData} />;
};

export default Dashboard;
