'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { CostChart } from './cost-chart';
import { DollarSign, TrendingUp, Calendar, Calculator, Target } from 'lucide-react';

interface CostTrackingData {
  totalCost: number;
  avgDailyCost: number;
  peakDay: {
    date: Date;
    cost: number;
  };
  costPerToken: number;
  costPerRequest: number;
  chartData: Array<{
    date: string;
    cost: number;
    tokens: number;
    requests: number;
    cubentUnits: number;
  }>;
  costByModel: Array<{
    modelId: string;
    cost: number;
    tokens: number;
    requests: number;
    sessions: number;
  }>;
  recentCosts: Array<{
    id: string;
    modelId: string;
    cost: number;
    tokens: number;
    requests: number;
    cubentUnits: number;
    timestamp: Date;
    provider: string;
  }>;
  monthlyProjection: number;
}

interface CostTrackingContentProps {
  data: CostTrackingData;
}

export const CostTrackingContent = ({ data }: CostTrackingContentProps) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount < 0.01 ? 4 : 2,
      maximumFractionDigits: amount < 0.01 ? 4 : 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Cost Tracking</h1>
          <p className="text-gray-400 mt-1">Monitor your API costs and spending patterns</p>
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
            <CardTitle className="text-sm font-medium text-gray-400">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.totalCost)}</div>
            <p className="text-xs text-gray-400 mt-1">All time spending</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.avgDailyCost)}</div>
            <p className="text-xs text-gray-400 mt-1">Cost per day (7-day avg)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Peak Day</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.peakDay.cost)}</div>
            <p className="text-xs text-gray-400 mt-1">{formatDate(data.peakDay.date)}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Cost/Token</CardTitle>
            <Calculator className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.costPerToken)}</div>
            <p className="text-xs text-gray-400 mt-1">Average per token</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monthly Projection</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.monthlyProjection)}</div>
            <p className="text-xs text-gray-400 mt-1">Based on current usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Chart */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">Cost Analysis</CardTitle>
          <p className="text-sm text-gray-400">Daily spending and usage correlation</p>
        </CardHeader>
        <CardContent>
          <CostChart data={data.chartData} />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Model */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Cost by Model</CardTitle>
            <p className="text-sm text-gray-400">Spending breakdown by AI model</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.costByModel.slice(0, 8).map((model, index) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                    <div>
                      <p className="text-sm font-medium text-white">{model.modelId}</p>
                      <p className="text-xs text-gray-400">
                        {model.requests.toLocaleString()} requests • {model.sessions} sessions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(model.cost)}</p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(model.requests > 0 ? model.cost / model.requests : 0)}/req
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Costs */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Recent Costs</CardTitle>
            <p className="text-sm text-gray-400">Latest spending activity</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentCosts.slice(0, 8).map((cost) => (
                <div key={cost.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{cost.modelId}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(cost.timestamp)} • {cost.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(cost.cost)}</p>
                    <p className="text-xs text-gray-400">
                      {cost.requests} req • {cost.tokens.toLocaleString()} tokens
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Efficiency Note */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="text-sm font-medium text-white">Cost Efficiency</p>
              <p className="text-xs text-gray-400 mt-1">
                Your average cost per request is {formatCurrency(data.costPerRequest)}. 
                Consider using more cost-effective models for routine tasks to optimize spending.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
