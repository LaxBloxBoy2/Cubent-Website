'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Progress } from '@repo/design-system/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import {
  ArrowLeft,
  Zap,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Crown,
  Sparkles,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { UsageChart } from './usage-chart';

interface UsageData {
  totalCubentUnits: number;
  totalMessages: number;
  userLimit: number;
  subscriptionTier: string;
  chartData: Array<{
    date: Date;
    cubentUnitsUsed: number;
    requestsMade: number;
  }>;
  user: {
    name: string;
    email: string;
    picture?: string;
  };
}

interface UsageAnalyticsProps {
  initialData: UsageData;
}

export function UsageAnalytics({ initialData }: UsageAnalyticsProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/extension/usage/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(prev => ({
            ...prev,
            totalCubentUnits: result.totalCubentUnits,
            totalMessages: result.totalMessages,
            userLimit: result.userLimit,
            subscriptionTier: result.subscriptionTier,
          }));
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to refresh usage data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const usagePercentage = (data.totalCubentUnits / data.userLimit) * 100;
  const isNearLimit = usagePercentage > 80;
  const isOverLimit = usagePercentage > 100;

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'pro':
        return { name: 'Pro', icon: Crown, color: 'text-yellow-600' };
      case 'premium':
        return { name: 'Premium', icon: Sparkles, color: 'text-purple-600' };
      default:
        return { name: 'Free Trial', icon: Zap, color: 'text-blue-600' };
    }
  };

  const tierInfo = getTierInfo(data.subscriptionTier);
  const TierIcon = tierInfo.icon;

  return (
    <>
      {/* Shadcn-Admin Style Header */}
      <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">
              {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Shadcn-Admin Style Main Content */}
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Usage Analytics</h2>
            <p className="text-muted-foreground">
              Here's what happening with your usage today
            </p>
          </div>
        </div>

        {/* Shadcn-Admin Style Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Cubent Units Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cubent Units
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalCubentUnits.toFixed(2)}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={`font-medium ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-green-500'}`}>
                  {usagePercentage.toFixed(0)}%
                </span>
                <span>of {data.userLimit} limit</span>
              </div>
              <Progress
                value={Math.min(usagePercentage, 100)}
                className="mt-2 h-1"
              />
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.round((data.totalMessages / 30) * 7)} this week
              </p>
            </CardContent>
          </Card>

          {/* Efficiency Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.totalMessages > 0 ? (data.totalCubentUnits / data.totalMessages).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                units per message
              </p>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <TierIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.userLimit}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  <TierIcon className={`h-3 w-3 mr-1 ${tierInfo.color}`} />
                  {tierInfo.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shadcn-Admin Style Chart with Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>
                  Daily consumption for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <UsageChart data={data.chartData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Advanced usage metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Advanced analytics coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Reports</CardTitle>
                <CardDescription>
                  Export and download usage reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Report generation coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Shadcn-Admin Style Upgrade Prompt */}
        {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                  <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {isOverLimit ? 'Usage Limit Exceeded' : 'Approaching Usage Limit'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro for unlimited Cubent Units and advanced features.
                  </p>
                </div>
              </div>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
