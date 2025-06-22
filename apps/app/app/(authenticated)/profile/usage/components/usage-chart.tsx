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
    <div className="h-80 w-full">
      <div className="flex items-end justify-between h-full space-x-1 px-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full max-w-8">
            <div className="flex-1 flex flex-col justify-end w-full space-y-1">
              {/* Cubent Units bar */}
              <div className="relative group">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all hover:from-blue-600 hover:to-blue-500 shadow-sm"
                  style={{
                    height: `${maxCubentUnits > 0 ? Math.max((item.cubentUnits / maxCubentUnits) * 180, item.cubentUnits > 0 ? 3 : 0) : 0}px`,
                    width: '100%',
                  }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                  <div className="font-medium">{item.cubentUnits.toFixed(2)} units</div>
                  <div className="text-gray-300">{item.requests} requests</div>
                  <div className="text-gray-300">{item.date}</div>
                </div>
              </div>

              {/* Requests indicator */}
              <div className="relative group">
                <div
                  className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all hover:from-green-600 hover:to-green-500 shadow-sm"
                  style={{
                    height: `${maxRequests > 0 ? Math.max((item.requests / maxRequests) * 60, item.requests > 0 ? 2 : 0) : 0}px`,
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Date label - show every 5th day to avoid crowding */}
            {index % 5 === 0 && (
              <div className="text-xs text-muted-foreground mt-3 transform -rotate-45 origin-left whitespace-nowrap">
                {item.date}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-8 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded shadow-sm"></div>
          <span className="text-sm font-medium text-muted-foreground">Cubent Units</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded shadow-sm"></div>
          <span className="text-sm font-medium text-muted-foreground">Messages</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Total: {chartData.reduce((sum, item) => sum + item.cubentUnits, 0).toFixed(2)} units, {' '}
          {chartData.reduce((sum, item) => sum + item.requests, 0)} messages
        </p>
      </div>
    </div>
  );
}
