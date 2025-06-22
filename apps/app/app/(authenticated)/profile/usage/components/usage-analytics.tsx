'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Progress } from '@repo/design-system/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import {
  ArrowLeft,
  Zap,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Crown,
  Sparkles
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Elegant Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
                <Link href="/profile">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profile
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Cubent Units Usage</h1>
              <p className="text-muted-foreground">Monitor your VS Code extension consumption</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
                className="shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Elegant Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cubent Units Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cubent Units</p>
                  <p className="text-3xl font-bold">{data.totalCubentUnits.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">of {data.userLimit} limit</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress
                  value={Math.min(usagePercentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between mt-2 text-xs">
                  <span className={isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}>
                    {usagePercentage.toFixed(1)}% used
                  </span>
                  <span className="text-muted-foreground">
                    {data.userLimit - data.totalCubentUnits > 0
                      ? `${(data.userLimit - data.totalCubentUnits).toFixed(2)} remaining`
                      : 'Over limit'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                  <p className="text-3xl font-bold">{data.totalMessages.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">requests made</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                  <p className="text-3xl font-bold">
                    {data.totalMessages > 0 ? (data.totalCubentUnits / data.totalMessages).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-muted-foreground">units per message</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Elegant Usage Chart */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Usage Over Time</CardTitle>
                <CardDescription>Daily consumption patterns for the last 30 days</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
                {tierInfo.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <UsageChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Elegant Upgrade Prompt */}
        {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                      {isOverLimit ? 'Usage Limit Exceeded' : 'Approaching Usage Limit'}
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Upgrade to Pro for unlimited Cubent Units and advanced features.
                    </p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
