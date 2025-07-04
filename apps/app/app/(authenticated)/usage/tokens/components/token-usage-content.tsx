'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { TokenChart } from './token-chart';
import { Zap, TrendingUp, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TokenUsageData {
  totalTokens: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  avgDailyTokens: number;
  peakDay: {
    date: Date;
    tokens: number;
  };
  chartData: Array<{
    date: string;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    requests: number;
  }>;
  tokensByModel: Array<{
    modelId: string;
    tokens: number;
    requests: number;
    sessions: number;
  }>;
  recentUsage: Array<{
    id: string;
    modelId: string;
    tokens: number;
    requests: number;
    cubentUnits: number;
    timestamp: Date;
    provider: string;
  }>;
  tokensPerRequest: number;
}

interface TokenUsageContentProps {
  data: TokenUsageData;
}

export const TokenUsageContent = ({ data }: TokenUsageContentProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Token Usage</h1>
          <p className="text-gray-400 mt-1">Track your input and output token consumption</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#333] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="7d" className="text-white hover:bg-[#333]">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-[#333]">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-[#333]">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333]">
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.totalTokens)}</div>
            <p className="text-xs text-gray-400 mt-1">All time usage</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Input Tokens</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.estimatedInputTokens)}</div>
            <p className="text-xs text-gray-400 mt-1">~85% of total (estimated)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Output Tokens</CardTitle>
            <ArrowDown className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.estimatedOutputTokens)}</div>
            <p className="text-xs text-gray-400 mt-1">~15% of total (estimated)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.avgDailyTokens)}</div>
            <p className="text-xs text-gray-400 mt-1">Tokens per day (7-day avg)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Per Request</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.tokensPerRequest)}</div>
            <p className="text-xs text-gray-400 mt-1">Average tokens/request</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Usage Chart */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">Token Consumption</CardTitle>
          <p className="text-sm text-gray-400">Daily token usage breakdown (input vs output)</p>
        </CardHeader>
        <CardContent>
          <TokenChart data={data.chartData} />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokens by Model */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Tokens by Model</CardTitle>
            <p className="text-sm text-gray-400">Token consumption by AI model</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tokensByModel.slice(0, 8).map((model, index) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                    <div>
                      <p className="text-sm font-medium text-white">{model.modelId}</p>
                      <p className="text-xs text-gray-400">{model.requests} requests • {model.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatNumber(model.tokens)}</p>
                    <p className="text-xs text-gray-400">tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Token Usage */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Recent Usage</CardTitle>
            <p className="text-sm text-gray-400">Latest token consumption</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentUsage.slice(0, 8).map((usage) => (
                <div key={usage.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{usage.modelId}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(usage.timestamp)} • {usage.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatNumber(usage.tokens)}</p>
                    <p className="text-xs text-gray-400">{usage.requests} req • {usage.cubentUnits} units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about estimation */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
            <div>
              <p className="text-sm font-medium text-white">Token Breakdown Estimation</p>
              <p className="text-xs text-gray-400 mt-1">
                Input/output token breakdown is estimated based on typical usage patterns (~85% input, ~15% output). 
                For precise tracking, individual input/output tokens will be implemented in a future update.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
