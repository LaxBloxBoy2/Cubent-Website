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
    <div className="w-full">
      {/* Xenith-Style Chart */}
      <div className="relative h-64 w-full">
        {/* Y-axis values */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4 pr-4">
          <span>{maxCubentUnits.toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.75).toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.5).toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.25).toFixed(0)}</span>
          <span>0</span>
        </div>

        {/* Horizontal grid lines */}
        <div className="absolute inset-0 left-12 flex flex-col justify-between py-4">
          {[0, 1, 2, 3, 4].map((line) => (
            <div key={line} className="w-full border-t border-gray-100 dark:border-gray-700"></div>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative h-full ml-12 flex items-end justify-between py-4 gap-0.5">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full group">
              <div className="flex-1 flex flex-col justify-end w-full relative">
                {/* Main usage bar */}
                <div className="relative w-full">
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 rounded-t-sm"
                    style={{
                      height: `${maxCubentUnits > 0 ? Math.max((item.cubentUnits / maxCubentUnits) * 200, item.cubentUnits > 0 ? 1 : 0) : 0}px`,
                    }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                    <div className="font-medium text-center">{item.date}</div>
                    <div className="text-blue-300">{item.cubentUnits.toFixed(2)} units</div>
                    <div className="text-green-300">{item.requests} messages</div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                  </div>
                </div>

                {/* Message indicator */}
                {item.requests > 0 && (
                  <div
                    className="w-1 bg-green-500 rounded-full mt-0.5 mx-auto"
                    style={{
                      height: `${Math.max((item.requests / maxRequests) * 12, 2)}px`,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-gray-400 mt-2">
          {chartData.map((item, index) => (
            index % 6 === 0 && (
              <div key={index} className="transform -rotate-45 origin-left">
                {item.date}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartData.reduce((sum, item) => sum + item.cubentUnits, 0).toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">Total Units</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartData.reduce((sum, item) => sum + item.requests, 0)}
            </p>
            <p className="text-xs text-gray-500">Total Messages</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartData.reduce((sum, item) => sum + item.cubentUnits, 0) > 0 && chartData.reduce((sum, item) => sum + item.requests, 0) > 0
                ? (chartData.reduce((sum, item) => sum + item.cubentUnits, 0) / chartData.reduce((sum, item) => sum + item.requests, 0)).toFixed(2)
                : '0.00'
              }
            </p>
            <p className="text-xs text-gray-500">Avg Units/Message</p>
          </div>
        </div>
      </div>
    </div>
  );
}
