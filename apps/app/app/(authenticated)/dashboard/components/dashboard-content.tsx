'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import { Progress } from '@repo/design-system/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Filter,
  ExternalLink,
  BarChart3,
  PieChart,
  Users
} from 'lucide-react';
import { ApiChart } from './api-chart';
import { RequestsTable } from './requests-table';
import { ModelBreakdown } from './model-breakdown';

interface DashboardData {
  totalRequests: number;
  totalCubentUnits: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  chartData: Array<{
    date: string;
    requests: number;
    cubentUnits: number;
    tokens: number;
  }>;
  modelBreakdown: Array<{
    modelId: string;
    requests: number;
    cubentUnits: number;
    tokens: number;
    cost: number;
  }>;
  recentAnalytics: any[];
  activeSessions: number;
  userLimit: number;
  subscriptionTier: string;
}

interface DashboardContentProps {
  data: DashboardData;
}

export function DashboardContent({ data }: DashboardContentProps) {
  const usagePercentage = (data.totalCubentUnits / data.userLimit) * 100;
  const isNearLimit = usagePercentage > 80;
  const isOverLimit = usagePercentage > 100;

  return (
    <div className="space-y-6 p-6 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usage</h1>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <option>All Workspaces</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <option>All API keys</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <option>All Models</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <option>Month</option>
          </select>
          <div className="flex items-center space-x-2">
            <button className="text-white hover:text-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-white font-medium">June 2025</span>
            <button className="text-white hover:text-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="h-6 w-px bg-[#333]"></div>
          <select className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium">
            <option>Group by: Model</option>
          </select>
          <Button className="bg-white text-black hover:bg-gray-100 px-4 py-1.5 text-sm font-medium">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Total tokens in</div>
          <div className="text-3xl font-bold text-white">{data.totalTokens.toLocaleString()}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Total tokens out</div>
          <div className="text-3xl font-bold text-white">{Math.floor(data.totalTokens * 0.015).toLocaleString()}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-400">Total web searches</div>
            <div className="text-xs text-gray-500">No data</div>
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </div>
      </div>

      {/* Token Usage Chart */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">Token usage</h3>
          <p className="text-sm text-gray-400">Includes usage from both API and Console</p>
        </div>
        <div className="h-[400px]">
          <ApiChart data={data.chartData} />
        </div>
      </div>

      {/* Rate Limited Requests */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Rate-limited requests</h3>
            <p className="text-sm text-gray-400">The number of requests that were blocked due to rate limits</p>
          </div>
          <Button variant="outline" className="bg-transparent border-[#333] text-white hover:bg-[#2a2a2a] text-sm">
            View rate limits
          </Button>
        </div>
        <div className="h-[300px]">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <p className="text-gray-400 text-sm">No rate-limited requests in this period</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
