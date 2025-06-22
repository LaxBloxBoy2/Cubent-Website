import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Zap, MessageSquare, BarChart3, RefreshCw, Download, Upload, Trash2 } from 'lucide-react';
import { UsageChart } from './components/usage-chart';
import { UsageTable } from './components/usage-table';

const title = 'Cubent Units Usage';
const description = 'View your VS Code extension usage statistics and analytics.';

export const metadata: Metadata = createMetadata({ title, description });

const UsagePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find or create user in database
  let dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 90, // Last 90 days
      },
      usageAnalytics: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Recent usage for model breakdown
      },
    },
  });

  if (!dbUser) {
    // Create new user automatically for social login users
    dbUser = await database.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        picture: user.imageUrl,
      },
      include: {
        usageMetrics: {
          orderBy: { date: 'desc' },
          take: 90,
        },
        usageAnalytics: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    });
  }

  // Calculate totals and averages for Cubent Units
  const totalUsage = dbUser.usageMetrics.reduce(
    (acc, metric) => ({
      cubentUnitsUsed: acc.cubentUnitsUsed + (metric.cubentUnitsUsed || 0),
      requestsMade: acc.requestsMade + metric.requestsMade,
    }),
    { cubentUnitsUsed: 0, requestsMade: 0 }
  );

  const last30Days = dbUser.usageMetrics.slice(0, 30);
  const last30DaysUsage = last30Days.reduce(
    (acc, metric) => ({
      cubentUnitsUsed: acc.cubentUnitsUsed + (metric.cubentUnitsUsed || 0),
      requestsMade: acc.requestsMade + metric.requestsMade,
    }),
    { cubentUnitsUsed: 0, requestsMade: 0 }
  );

  const averageDaily = {
    cubentUnitsUsed: last30Days.length > 0 ? (last30DaysUsage.cubentUnitsUsed / last30Days.length) : 0,
    requestsMade: last30Days.length > 0 ? Math.round(last30DaysUsage.requestsMade / last30Days.length) : 0,
  };

  // Get model usage breakdown from analytics
  const modelUsage = dbUser.usageAnalytics.reduce((acc, analytics) => {
    const modelId = analytics.modelId || 'unknown';
    if (!acc[modelId]) {
      acc[modelId] = {
        cubentUnitsUsed: 0,
        requestsMade: 0,
      };
    }
    acc[modelId].cubentUnitsUsed += analytics.cubentUnitsUsed || 0;
    acc[modelId].requestsMade += analytics.requestsMade;
    return acc;
  }, {} as Record<string, { cubentUnitsUsed: number; requestsMade: number }>);

  const topModels = Object.entries(modelUsage)
    .sort(([, a], [, b]) => b.cubentUnitsUsed - a.cubentUnitsUsed)
    .slice(0, 5);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatUnits = (units: number) => {
    return units.toFixed(2);
  };

  const getLastUpdated = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Usage Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Usage Overview</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              User-based tracking (synced across devices)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Server Cubent Units */}
            <div className="space-y-2">
              <div className="text-3xl font-bold">{formatUnits(dbUser.cubentUnitsUsed || 0)}</div>
              <div className="text-sm text-muted-foreground">Server Cubent Units</div>
              <div className="text-xs text-muted-foreground">Limit: {dbUser.cubentUnitsLimit || 50}</div>
            </div>

            {/* Server Messages */}
            <div className="space-y-2">
              <div className="text-3xl font-bold">{totalUsage.requestsMade}</div>
              <div className="text-sm text-muted-foreground">Server Messages</div>
              <div className="text-xs text-muted-foreground">Total requests made</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Models by Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Models by Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {topModels.length > 0 ? (
            <div className="space-y-3">
              {topModels.map(([modelId, usage]) => (
                <div key={modelId} className="flex items-center justify-between py-2">
                  <div className="font-medium text-sm">{modelId}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatUnits(usage.cubentUnitsUsed)} units</span>
                    <span>{usage.requestsMade} msgs</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No usage data available</p>
              <p className="text-xs">Start using the extension to see model breakdown</p>
            </div>
          )}
          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
            Last updated: {getLastUpdated()}
          </div>
        </CardContent>
      </Card>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Over Time</CardTitle>
          <CardDescription>
            Daily Cubent Units usage for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsageChart data={last30Days.reverse()} />
        </CardContent>
      </Card>

      {/* Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Usage History</CardTitle>
          <CardDescription>
            Complete breakdown of your Cubent Units usage by day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsageTable data={dbUser.usageMetrics} />
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Usage data is stored locally in your browser. Export your data to back it up or transfer it to another device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage;
