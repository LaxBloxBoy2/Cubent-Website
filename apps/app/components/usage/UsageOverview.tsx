'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Zap, DollarSign, Hash, Calendar } from 'lucide-react';

interface UsageData {
  currentMonth: {
    cubentUnits: number;
    cubentUnitsLimit: number;
    usagePercentage: number;
    tokensUsed: number;
    requestsMade: number;
    costAccrued: number;
  };
  totalUsage: {
    tokensUsed: number;
    requestsMade: number;
    costAccrued: number;
    cubentUnits: number;
  };
  dailyUsage: Array<{
    date: string;
    tokensUsed: number;
    requestsMade: number;
    costAccrued: number;
    cubentUnits: number;
  }>;
}

export function UsageOverview() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/extension/usage?days=30');
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }
      
      const data = await response.json();
      setUsageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsageData} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Current Month Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Month Usage
          </CardTitle>
          <CardDescription>
            Your Cubent Units usage for this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cubent Units Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cubent Units</span>
              <span className={`text-sm font-semibold ${getUsageColor(usageData.currentMonth.usagePercentage)}`}>
                {usageData.currentMonth.cubentUnits.toFixed(1)} / {usageData.currentMonth.cubentUnitsLimit}
              </span>
            </div>
            <Progress 
              value={Math.min(usageData.currentMonth.usagePercentage, 100)} 
              className="h-3"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{usageData.currentMonth.usagePercentage.toFixed(1)}% used</span>
              <span>{(usageData.currentMonth.cubentUnitsLimit - usageData.currentMonth.cubentUnits).toFixed(1)} remaining</span>
            </div>
          </div>

          {/* Usage Warning */}
          {usageData.currentMonth.usagePercentage >= 90 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ⚠️ You're approaching your Cubent Units limit. Consider upgrading your plan to continue using the service.
              </p>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Hash className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {usageData.currentMonth.requestsMade}
              </div>
              <div className="text-xs text-gray-500">Requests</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {(usageData.currentMonth.tokensUsed / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500">Tokens</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                ${usageData.currentMonth.costAccrued.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All-Time Usage
          </CardTitle>
          <CardDescription>
            Your total usage across all time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {usageData.totalUsage.cubentUnits.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Total Cubent Units</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {usageData.totalUsage.requestsMade}
              </div>
              <div className="text-sm text-gray-500">Total Requests</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(usageData.totalUsage.tokensUsed / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-gray-500">Total Tokens</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                ${usageData.totalUsage.costAccrued.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Usage</CardTitle>
          <CardDescription>
            Upgrade your plan or view detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button className="flex-1">
              Upgrade Plan
            </Button>
            <Button variant="outline" className="flex-1">
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
