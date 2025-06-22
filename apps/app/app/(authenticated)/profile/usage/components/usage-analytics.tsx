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

// Extension usage data structure (matches extension's localStorage format)
interface ExtensionUsageStats {
  totalCubentUnits: number;
  totalMessages: number;
  entries: Array<{
    timestamp: number;
    modelId: string;
    cubentUnits: number;
    messageCount: number;
    provider: string;
    configName: string;
  }>;
  lastUpdated: number;
}

export function UsageAnalytics({ initialData }: UsageAnalyticsProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [extensionDataFound, setExtensionDataFound] = useState(false);

  // Function to read usage data from localStorage (where extension stores it)
  const readExtensionUsageData = (): ExtensionUsageStats | null => {
    try {
      // Try to find user-specific usage data first
      const storageKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cubent-usage-stats')) {
          storageKeys.push(key);
        }
      }

      console.log('🔍 Found localStorage keys:', storageKeys);

      // Try each key to find valid usage data
      for (const key of storageKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as ExtensionUsageStats;
            if (parsed.totalCubentUnits !== undefined && parsed.totalMessages !== undefined) {
              console.log('✅ Found valid extension usage data:', parsed);
              return parsed;
            }
          } catch (e) {
            console.warn('Failed to parse data from key:', key, e);
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error reading extension usage data:', error);
      return null;
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // First, try to read from localStorage (extension data)
      const extensionData = readExtensionUsageData();

      if (extensionData) {
        console.log('📊 Using extension localStorage data:', extensionData);
        setData(prev => ({
          ...prev,
          totalCubentUnits: extensionData.totalCubentUnits,
          totalMessages: extensionData.totalMessages,
        }));
        setExtensionDataFound(true);
        setLastUpdated(new Date(extensionData.lastUpdated));
        return;
      }

      // Fallback to API call if no extension data found
      console.log('📊 No extension data found, trying API...');
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
          setExtensionDataFound(false);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to refresh usage data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load extension data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Auto-refresh every 10 seconds to catch localStorage changes
  useEffect(() => {
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('cubent-usage-stats')) {
        console.log('🔄 localStorage changed, refreshing data');
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
            <h1 className="text-3xl font-bold">Cubent Units Usage</h1>
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
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile and subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data.user.picture} alt={data.user.name} />
              <AvatarFallback>
                {data.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{data.user.name}</h3>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm">Subscription:</span>
            <Badge variant="secondary" className="flex items-center gap-2">
              <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
              {tierInfo.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cubent Units Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cubent Units</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCubentUnits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {data.userLimit - data.totalCubentUnits} remaining of {data.userLimit}
            </p>
            <Progress
              value={Math.min(usagePercentage, 100)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{usagePercentage.toFixed(1)}% used</span>
              <span className={isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}>
                {isOverLimit ? 'Over limit' : isNearLimit ? 'Near limit' : 'Within limit'}
              </span>
            </div>
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
            <p className="text-xs text-muted-foreground">Total requests made</p>
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
            <p className="text-xs text-muted-foreground">Units per message</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
          <CardDescription>Daily Cubent Units usage for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <UsageChart data={data.chartData} />
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
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
  );
}
