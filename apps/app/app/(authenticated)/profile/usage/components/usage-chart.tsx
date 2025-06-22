'use client';

import { useMemo } from 'react';

interface UsageMetric {
  date: Date;
  cubentUnitsUsed: number;
  requestsMade: number;
}

interface UsageChartProps {
  data: UsageMetric[];
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = useMemo(() => {
    // Fill in missing days with zero values for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const filledData = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(thirtyDaysAgo);
      currentDate.setDate(thirtyDaysAgo.getDate() + i);

      const existingData = data.find(metric => {
        const metricDate = new Date(metric.date);
        return metricDate.toDateString() === currentDate.toDateString();
      });

      filledData.push({
        date: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        cubentUnits: existingData?.cubentUnitsUsed || 0,
        requests: existingData?.requestsMade || 0,
      });
    }

    return filledData;
  }, [data]);

  const maxCubentUnits = Math.max(...chartData.map(d => d.cubentUnits), 1);
  const maxRequests = Math.max(...chartData.map(d => d.requests), 1);

  return (
    <div className="w-full space-y-6">
      {/* Simplified, Elegant Chart */}
      <div className="relative h-80 w-full">
        {/* Clean grid background */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted/5 to-transparent rounded-lg"></div>

        {/* Subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {[0, 1, 2, 3, 4].map((line) => (
            <div key={line} className="w-full border-t border-muted/20"></div>
          ))}
        </div>

        {/* Chart bars */}
        <div className="relative h-full flex items-end justify-between px-4 py-4 gap-1">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full group max-w-8">
              <div className="flex-1 flex flex-col justify-end w-full">
                {/* Main bar */}
                <div className="relative w-full">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-200 hover:from-blue-600 hover:to-blue-500 shadow-sm"
                    style={{
                      height: `${maxCubentUnits > 0 ? Math.max((item.cubentUnits / maxCubentUnits) * 260, item.cubentUnits > 0 ? 2 : 0) : 0}px`,
                    }}
                  />

                  {/* Clean tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                    <div className="font-medium">{item.date}</div>
                    <div className="text-blue-300">{item.cubentUnits.toFixed(2)} units</div>
                    <div className="text-green-300">{item.requests} messages</div>
                  </div>
                </div>

                {/* Message indicator dot */}
                {item.requests > 0 && (
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full mt-1 transition-all duration-200"
                    style={{
                      transform: `scale(${Math.max((item.requests / maxRequests) * 1.5, 0.5)})`,
                    }}
                  />
                )}
              </div>

              {/* Date labels - show every 5th */}
              {index % 5 === 0 && (
                <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left whitespace-nowrap">
                  {item.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simple Legend & Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-muted-foreground">Cubent Units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Messages</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            Last 30 days: <span className="font-medium text-foreground">{chartData.reduce((sum, item) => sum + item.cubentUnits, 0).toFixed(2)} units</span>
            {' • '}
            <span className="font-medium text-foreground">{chartData.reduce((sum, item) => sum + item.requests, 0)} messages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
