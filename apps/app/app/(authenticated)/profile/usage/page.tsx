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
    }),
    { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
  );

  const last30Days = dbUser.usageMetrics.slice(0, 30);
  const last30DaysUsage = last30Days.reduce(
    (acc, metric) => ({
      tokensUsed: acc.tokensUsed + metric.tokensUsed,
      requestsMade: acc.requestsMade + metric.requestsMade,
      costAccrued: acc.costAccrued + metric.costAccrued,
    }),
    { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
  );

  const averageDaily = {
    tokensUsed: last30Days.length > 0 ? Math.round(last30DaysUsage.tokensUsed / last30Days.length) : 0,
    requestsMade: last30Days.length > 0 ? Math.round(last30DaysUsage.requestsMade / last30Days.length) : 0,
    costAccrued: last30Days.length > 0 ? last30DaysUsage.costAccrued / last30Days.length : 0,
  };

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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
