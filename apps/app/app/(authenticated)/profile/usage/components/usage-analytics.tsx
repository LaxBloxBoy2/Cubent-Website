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
    <div className="flex h-screen bg-background">
      {/* Sidebar-style navigation */}
      <div className="w-64 border-r bg-sidebar text-sidebar-foreground p-4">
        <div className="space-y-4">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Cubent Units</h2>
            <p className="text-sm text-sidebar-foreground/70">VS Code extension usage</p>
          </div>

          {/* Quick Stats in Sidebar */}
          <div className="space-y-3 pt-4">
            <div className="p-3 rounded-lg bg-sidebar-accent">
              <div className="flex items-center justify-between">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Units Used</span>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">{data.totalCubentUnits.toFixed(2)}</div>
                <div className="text-xs text-sidebar-foreground/70">of {data.userLimit} limit</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sidebar-accent">
              <div className="flex items-center justify-between">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Messages</span>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">{data.totalMessages.toLocaleString()}</div>
                <div className="text-xs text-sidebar-foreground/70">total requests</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sidebar-accent">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Efficiency</span>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold">
                  {data.totalMessages > 0 ? (data.totalCubentUnits / data.totalMessages).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-sidebar-foreground/70">units per message</div>
              </div>
            </div>
          </div>

          {/* Subscription Badge */}
          <div className="pt-4 border-t border-sidebar-border">
            <Badge variant="secondary" className="w-full justify-center">
              <TierIcon className={`h-4 w-4 mr-2 ${tierInfo.color}`} />
              {tierInfo.name}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Usage Analytics</h1>
              <p className="text-muted-foreground">Monitor your Cubent Units consumption over time</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last updated</p>
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* Usage Progress Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Current Usage</h3>
                  <p className="text-sm text-muted-foreground">Your Cubent Units consumption</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{data.totalCubentUnits.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">of {data.userLimit} units</div>
                </div>
              </div>

              <Progress
                value={Math.min(usagePercentage, 100)}
                className="h-3 mb-3"
              />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {usagePercentage.toFixed(1)}% used
                </span>
                <span className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                  {data.userLimit - data.totalCubentUnits > 0
                    ? `${(data.userLimit - data.totalCubentUnits).toFixed(2)} remaining`
                    : 'Limit exceeded'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Usage Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Usage Over Time
                  </CardTitle>
                  <CardDescription>Daily Cubent Units and message activity for the last 30 days</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Cubent Units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Messages</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UsageChart data={data.chartData} />
            </CardContent>
          </Card>

          {/* Upgrade Prompt */}
          {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
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
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
