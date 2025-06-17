'use client';

import { useMemo } from 'react';

interface UsageMetric {
  id: string;
  tokensUsed: number;
  requestsMade: number;
  costAccrued: number;
  date: Date;
}

interface UsageChartProps {
  data: UsageMetric[];
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = useMemo(() => {
    return data.map(metric => ({
      date: new Date(metric.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      tokens: metric.tokensUsed,
      requests: metric.requestsMade,
      cost: metric.costAccrued,
    }));
  }, [data]);

  const maxTokens = Math.max(...chartData.map(d => d.tokens));
  const maxRequests = Math.max(...chartData.map(d => d.requests));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No usage data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <div className="flex items-end justify-between h-full space-x-1">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full">
            <div className="flex-1 flex flex-col justify-end w-full space-y-1">
              {/* Tokens bar */}
              <div className="relative group">
                <div
                  className="bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                  style={{
                    height: `${maxTokens > 0 ? (item.tokens / maxTokens) * 100 : 0}%`,
                    minHeight: item.tokens > 0 ? '2px' : '0px',
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.tokens.toLocaleString()} tokens
                </div>
              </div>
              
              {/* Requests bar */}
              <div className="relative group">
                <div
                  className="bg-green-500 rounded-t-sm transition-all hover:bg-green-600"
                  style={{
                    height: `${maxRequests > 0 ? (item.requests / maxRequests) * 80 : 0}%`,
                    minHeight: item.requests > 0 ? '2px' : '0px',
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.requests} requests
                </div>
              </div>
            </div>
            
            {/* Date label */}
            <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
              {item.date}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-muted-foreground">Tokens</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-muted-foreground">Requests</span>
        </div>
      </div>
    </div>
  );
}
