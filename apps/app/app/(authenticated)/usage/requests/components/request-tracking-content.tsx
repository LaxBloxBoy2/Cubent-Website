'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { RequestChart } from './request-chart';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

interface RequestTrackingData {
  totalRequests: number;
  avgDailyRequests: number;
  peakDay: {
    date: Date;
    requests: number;
  };
  chartData: Array<{
    date: string;
    requests: number;
    cubentUnits: number;
  }>;
  requestsByModel: Array<{
    modelId: string;
    requests: number;
    sessions: number;
  }>;
  recentRequests: Array<{
    id: string;
    modelId: string;
    requests: number;
    cubentUnits: number;
    timestamp: Date;
    provider: string;
  }>;
  activeSessions: number;
}

interface RequestTrackingContentProps {
  data: RequestTrackingData;
}

export const RequestTrackingContent = ({ data }: RequestTrackingContentProps) => {
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

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Request Tracking</h1>
          <p className="text-gray-400 mt-1">Monitor your API request patterns and usage</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">All time requests made</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.avgDailyRequests}</div>
            <p className="text-xs text-gray-400 mt-1">Requests per day (7-day avg)</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Peak Usage</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.peakDay.requests}</div>
            <p className="text-xs text-gray-400 mt-1">{formatDate(data.peakDay.date)}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.activeSessions}</div>
            <p className="text-xs text-gray-400 mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Request Usage Chart */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">Request Activity</CardTitle>
          <p className="text-sm text-gray-400">Daily request volume over time</p>
        </CardHeader>
        <CardContent>
          <RequestChart data={data.chartData} />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Model */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Requests by Model</CardTitle>
            <p className="text-sm text-gray-400">Usage breakdown by AI model</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.requestsByModel.slice(0, 8).map((model, index) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                    <div>
                      <p className="text-sm font-medium text-white">{model.modelId}</p>
                      <p className="text-xs text-gray-400">{model.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{model.requests.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">requests</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Recent Requests</CardTitle>
            <p className="text-sm text-gray-400">Latest API activity</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentRequests.slice(0, 8).map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{request.modelId}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(request.timestamp)} • {request.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{request.requests} req</p>
                    <p className="text-xs text-gray-400">{request.cubentUnits} units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
