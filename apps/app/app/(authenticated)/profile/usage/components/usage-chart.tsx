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
    <div className="h-96 w-full">
      {/* Chart Area */}
      <div className="relative h-80 w-full bg-gradient-to-b from-background to-muted/20 rounded-lg border p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-4">
          <span>{maxCubentUnits.toFixed(1)}</span>
          <span>{(maxCubentUnits * 0.75).toFixed(1)}</span>
          <span>{(maxCubentUnits * 0.5).toFixed(1)}</span>
          <span>{(maxCubentUnits * 0.25).toFixed(1)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-4 left-8">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-muted/30"
              style={{ top: `${100 - percent}%` }}
            />
          ))}
        </div>

        {/* Chart bars */}
        <div className="flex items-end justify-between h-full space-x-1 pl-8 pr-4 pt-4 pb-8">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 h-full group">
              <div className="flex-1 flex flex-col justify-end w-full relative">
                {/* Cubent Units bar */}
                <div className="relative">
                  <div
                    className="bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105"
                    style={{
                      height: `${maxCubentUnits > 0 ? Math.max((item.cubentUnits / maxCubentUnits) * 240, item.cubentUnits > 0 ? 4 : 0) : 0}px`,
                      width: '80%',
                      margin: '0 auto',
                    }}
                  />

                  {/* Enhanced tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-20 shadow-2xl border border-gray-700">
                    <div className="font-semibold text-blue-300">{item.date}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>{item.cubentUnits.toFixed(2)} units</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>{item.requests} messages</span>
                    </div>
                    {item.cubentUnits > 0 && item.requests > 0 && (
                      <div className="text-gray-300 text-xs mt-1">
                        {(item.cubentUnits / item.requests).toFixed(2)} units/msg
                      </div>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>

                {/* Message count indicator */}
                {item.requests > 0 && (
                  <div
                    className="bg-gradient-to-t from-green-600 to-green-400 rounded-full mx-auto mt-1 transition-all duration-300 hover:from-green-700 hover:to-green-500"
                    style={{
                      height: `${Math.max((item.requests / maxRequests) * 20, 3)}px`,
                      width: `${Math.max((item.requests / maxRequests) * 20, 3)}px`,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-4 flex justify-between">
          {chartData.map((item, index) => (
            index % 6 === 0 && (
              <div key={index} className="text-xs text-muted-foreground transform -rotate-45 origin-left">
                {item.date}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Enhanced Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {chartData.reduce((sum, item) => sum + item.cubentUnits, 0).toFixed(2)}
          </div>
          <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Units (30 days)</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {chartData.reduce((sum, item) => sum + item.requests, 0)}
          </div>
          <div className="text-xs text-green-600/70 dark:text-green-400/70">Total Messages (30 days)</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {chartData.reduce((sum, item) => sum + item.cubentUnits, 0) > 0 && chartData.reduce((sum, item) => sum + item.requests, 0) > 0
              ? (chartData.reduce((sum, item) => sum + item.cubentUnits, 0) / chartData.reduce((sum, item) => sum + item.requests, 0)).toFixed(2)
              : '0.00'
            }
          </div>
          <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Avg Units/Message</div>
        </div>
      </div>
    </div>
  );
}
