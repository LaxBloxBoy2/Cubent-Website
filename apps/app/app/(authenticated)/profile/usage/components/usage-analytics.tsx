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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Clean Header - Fixed Dark Mode */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Cubent Units Usage
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Here's what happening with your usage today
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Fixed Dark Mode Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Cubent Units Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {data.totalCubentUnits.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Cubent Units</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-green-500'}`}>
                    {usagePercentage.toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">This month</span>
                </div>
              </div>
              <div className="w-12 h-8">
                {/* Mini chart placeholder */}
                <svg className="w-full h-full" viewBox="0 0 48 32">
                  <path
                    d="M0,20 Q12,15 24,18 T48,12"
                    stroke={isOverLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : "#10b981"}
                    strokeWidth="2"
                    fill="none"
                    className="opacity-60"
                  />
                </svg>
              </div>
            </div>
            <Progress
              value={Math.min(usagePercentage, 100)}
              className="h-1.5"
            />
          </div>

          {/* Messages Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {data.totalMessages.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-blue-500">
                    +{Math.round((data.totalMessages / 30) * 7)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">This week</span>
                </div>
              </div>
              <div className="w-12 h-8">
                <svg className="w-full h-full" viewBox="0 0 48 32">
                  <path
                    d="M0,25 Q12,20 24,22 T48,16"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-60"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Efficiency Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {data.totalMessages > 0 ? (data.totalCubentUnits / data.totalMessages).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Efficiency</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-purple-500">
                    Units/msg
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">Average</span>
                </div>
              </div>
              <div className="w-12 h-8">
                <svg className="w-full h-full" viewBox="0 0 48 32">
                  <path
                    d="M0,28 Q12,24 24,20 T48,18"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-60"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {data.userLimit}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Usage Limit</p>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <TierIcon className={`h-3 w-3 mr-1 ${tierInfo.color}`} />
                    {tierInfo.name}
                  </Badge>
                </div>
              </div>
              <div className="w-12 h-8 flex items-center justify-center">
                <TierIcon className={`h-6 w-6 ${tierInfo.color}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Dark Mode Chart */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily consumption for the last 30 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Cubent Units</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Messages</span>
              </div>
            </div>
          </div>
          <UsageChart data={data.chartData} />
        </div>

        {/* Fixed Dark Mode Upgrade Prompt */}
        {(isNearLimit || isOverLimit) && data.subscriptionTier === 'free_trial' && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isOverLimit ? 'Usage Limit Exceeded' : 'Approaching Usage Limit'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upgrade to Pro for unlimited Cubent Units and advanced features.
                  </p>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl px-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
