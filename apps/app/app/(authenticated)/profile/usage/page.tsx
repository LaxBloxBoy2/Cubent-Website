import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Zap, DollarSign, BarChart3 } from 'lucide-react';
import { UsageChart } from './components/usage-chart';
import { UsageTable } from './components/usage-table';

const title = 'Usage Analytics';
const description = 'View your VS Code extension usage statistics and analytics.';

export const metadata: Metadata = createMetadata({ title, description });

const UsagePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 90, // Last 90 days
      },
      usageAnalytics: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Last 100 requests for model breakdown
      },
    },
  });

  if (!dbUser) {
    notFound();
  }

  // Calculate totals and averages
  const totalUsage = dbUser.usageMetrics.reduce(
    (acc, metric) => ({
      tokensUsed: acc.tokensUsed + metric.tokensUsed,
      requestsMade: acc.requestsMade + metric.requestsMade,
      costAccrued: acc.costAccrued + metric.costAccrued,
      cubentUnitsUsed: acc.cubentUnitsUsed + metric.cubentUnitsUsed,
    }),
    { tokensUsed: 0, requestsMade: 0, costAccrued: 0, cubentUnitsUsed: 0 }
  );

  // Calculate Cubent Units statistics
  const cubentUnitsStats = {
    used: dbUser.cubentUnitsUsed,
    limit: dbUser.cubentUnitsLimit,
    remaining: Math.max(0, dbUser.cubentUnitsLimit - dbUser.cubentUnitsUsed),
    percentage: Math.min(100, (dbUser.cubentUnitsUsed / dbUser.cubentUnitsLimit) * 100),
    resetDate: dbUser.unitsResetDate,
  };

  const last30Days = dbUser.usageMetrics.slice(0, 30);
  const last30DaysUsage = last30Days.reduce(
    (acc, metric) => ({
      tokensUsed: acc.tokensUsed + metric.tokensUsed,
      requestsMade: acc.requestsMade + metric.requestsMade,
      costAccrued: acc.costAccrued + metric.costAccrued,
      cubentUnitsUsed: acc.cubentUnitsUsed + metric.cubentUnitsUsed,
    }),
    { tokensUsed: 0, requestsMade: 0, costAccrued: 0, cubentUnitsUsed: 0 }
  );

  const averageDaily = {
    tokensUsed: last30Days.length > 0 ? Math.round(last30DaysUsage.tokensUsed / last30Days.length) : 0,
    requestsMade: last30Days.length > 0 ? Math.round(last30DaysUsage.requestsMade / last30Days.length) : 0,
    costAccrued: last30Days.length > 0 ? last30DaysUsage.costAccrued / last30Days.length : 0,
    cubentUnitsUsed: last30Days.length > 0 ? last30DaysUsage.cubentUnitsUsed / last30Days.length : 0,
  };

  // Calculate model usage breakdown from analytics
  const modelUsageMap = new Map<string, { cubentUnits: number; requests: number; tokens: number }>();
  dbUser.usageAnalytics?.forEach(analytics => {
    const existing = modelUsageMap.get(analytics.modelId) || { cubentUnits: 0, requests: 0, tokens: 0 };
    modelUsageMap.set(analytics.modelId, {
      cubentUnits: existing.cubentUnits + analytics.cubentUnitsUsed,
      requests: existing.requests + analytics.requestsMade,
      tokens: existing.tokens + (analytics.tokensUsed || 0),
    });
  });

  const modelUsageBreakdown = Array.from(modelUsageMap.entries())
    .map(([modelId, usage]) => ({
      modelId,
      ...usage,
      percentage: totalUsage.cubentUnitsUsed > 0 ? (usage.cubentUnits / totalUsage.cubentUnitsUsed) * 100 : 0,
    }))
    .sort((a, b) => b.cubentUnits - a.cubentUnits)
    .slice(0, 10); // Top 10 models

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Cubent Units Status */}
      <Card className={`border-2 ${
        cubentUnitsStats.percentage >= 90 ? 'border-red-500 bg-red-50' :
        cubentUnitsStats.percentage >= 75 ? 'border-orange-500 bg-orange-50' :
        'border-green-500 bg-green-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cubent Units Usage</span>
            <span className={`text-sm font-normal ${
              cubentUnitsStats.percentage >= 90 ? 'text-red-600' :
              cubentUnitsStats.percentage >= 75 ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {cubentUnitsStats.percentage.toFixed(1)}% used
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Used: {cubentUnitsStats.used.toFixed(2)} units</span>
              <span>Remaining: {cubentUnitsStats.remaining.toFixed(2)} units</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  cubentUnitsStats.percentage >= 90 ? 'bg-red-500' :
                  cubentUnitsStats.percentage >= 75 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(cubentUnitsStats.percentage, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Limit: {cubentUnitsStats.limit} units
              {cubentUnitsStats.resetDate && (
                <span className="ml-2">
                  • Resets: {new Date(cubentUnitsStats.resetDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cubent Units</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.cubentUnitsUsed.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {averageDaily.cubentUnitsUsed.toFixed(2)}/day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsage.tokensUsed)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(averageDaily.tokensUsed)}/day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsage.requestsMade)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(averageDaily.requestsMade)}/day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalUsage.costAccrued)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(averageDaily.costAccrued)}/day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsage.requestsMade > 0 
                ? Math.round(totalUsage.tokensUsed / totalUsage.requestsMade)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">tokens per request</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Usage Breakdown */}
      {modelUsageBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Model Usage Breakdown</CardTitle>
            <CardDescription>
              Cubent Units consumed by each AI model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelUsageBreakdown.map((model, index) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-blue-${500 + (index * 100)}`} />
                    <div>
                      <div className="font-medium">{model.modelId}</div>
                      <div className="text-sm text-muted-foreground">
                        {model.requests} requests • {formatNumber(model.tokens)} tokens
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{model.cubentUnits.toFixed(2)} units</div>
                    <div className="text-sm text-muted-foreground">
                      {model.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
          <CardDescription>
            Daily usage metrics for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsageChart data={last30Days.reverse()} />
        </CardContent>
      </Card>

      {/* Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Usage History</CardTitle>
          <CardDescription>
            Complete breakdown of your usage by day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsageTable data={dbUser.usageMetrics} />
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download your usage data for external analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline">
              Export as CSV
            </Button>
            <Button variant="outline">
              Export as JSON
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Export includes all usage data, timestamps, and metadata for the selected period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage;
