'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Progress } from '@repo/design-system/components/ui/progress';
import { Separator } from '@repo/design-system/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import { 
  ArrowLeft, 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Crown,
  Sparkles,
  BarChart3,
  Clock
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
        setData(prev => ({
          ...prev,
          totalCubentUnits: result.totalCubentUnits,
          totalMessages: result.totalMessages,
          userLimit: result.userLimit,
          subscriptionTier: result.subscriptionTier,
        }));
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to refresh usage data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Cubent Units Usage
              </h1>
              <p className="text-muted-foreground">View your VS Code extension usage statistics and analytics.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
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
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800">
                  <AvatarImage src={data.user.picture} alt={data.user.name} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {data.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{data.user.name}</h3>
                  <p className="text-muted-foreground">{data.user.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
                {tierInfo.name}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Cubent Units Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Cubent Units</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">{data.totalCubentUnits.toFixed(2)}</span>
                  <span className="text-muted-foreground">/ {data.userLimit}</span>
                </div>
                <Progress 
                  value={Math.min(usagePercentage, 100)} 
                  className={`h-2 ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-green-100'}`}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{usagePercentage.toFixed(1)}% used</span>
                  <span className={isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}>
                    {isOverLimit ? 'Over limit' : isNearLimit ? 'Near limit' : 'Within limit'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Total Messages</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{data.totalMessages.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total requests made</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Usage Over Time</CardTitle>
                <CardDescription>Daily Cubent Units usage for the last 30 days</CardDescription>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UsageChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold">Efficiency</h3>
              </div>
              <div className="text-2xl font-bold mb-1">
                {data.totalMessages > 0 ? (data.totalCubentUnits / data.totalMessages).toFixed(2) : '0.00'}
              </div>
              <p className="text-sm text-muted-foreground">Units per message</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold">This Month</h3>
              </div>
              <div className="text-2xl font-bold mb-1">
                {data.chartData.reduce((sum, day) => sum + day.cubentUnitsUsed, 0).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Units used</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold">Daily Average</h3>
              </div>
              <div className="text-2xl font-bold mb-1">
                {data.chartData.length > 0 
                  ? (data.chartData.reduce((sum, day) => sum + day.cubentUnitsUsed, 0) / data.chartData.length).toFixed(2)
                  : '0.00'
                }
              </div>
              <p className="text-sm text-muted-foreground">Units per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Prompt */}
        {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      {isOverLimit ? 'Usage Limit Exceeded' : 'Approaching Usage Limit'}
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Upgrade to Pro for unlimited Cubent Units and advanced features.
                    </p>
                  </div>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
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
