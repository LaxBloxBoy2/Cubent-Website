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

  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else if (i === points.length - 1) {
        // Last curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Middle curves
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y + (next.y - points[i - 2]?.y || 0) * 0.1;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y - (points[i + 1]?.y - prev.y || 0) * 0.1;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  return (
    <div className="w-full">
      {/* Modern Line Chart */}
      <div className="relative h-64 w-full">
        {/* Y-axis values */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 py-4 pr-4">
          <span>{maxCubentUnits.toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.75).toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.5).toFixed(0)}</span>
          <span>{(maxCubentUnits * 0.25).toFixed(0)}</span>
          <span>0</span>
        </div>

        {/* Horizontal grid lines */}
        <div className="absolute inset-0 left-12 flex flex-col justify-between py-4">
          {[0, 1, 2, 3, 4].map((line) => (
            <div key={line} className="w-full border-t border-gray-100 dark:border-gray-800"></div>
          ))}
        </div>

        {/* SVG Chart */}
        <div className="relative h-full ml-12 py-4">
          <svg className="w-full h-full" viewBox={`0 0 ${chartData.length * 10} 200`}>
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Cubent Units Line */}
            {(() => {
              const points = chartData.map((item, index) => ({
                x: (index * 10) + 5,
                y: 200 - (maxCubentUnits > 0 ? (item.cubentUnits / maxCubentUnits) * 180 : 0)
              }));

              const pathData = createSmoothPath(points);
              const areaPath = pathData + ` L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

              return (
                <>
                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill="url(#blueGradient)"
                  />
                  {/* Line */}
                  <path
                    d={pathData}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                  {/* Data points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#3b82f6"
                      className="hover:r-4 transition-all cursor-pointer"
                    />
                  ))}
                </>
              );
            })()}

            {/* Messages Line */}
            {(() => {
              const points = chartData.map((item, index) => ({
                x: (index * 10) + 5,
                y: 200 - (maxRequests > 0 ? (item.requests / maxRequests) * 60 : 0)
              }));

              const pathData = createSmoothPath(points);

              return (
                <>
                  {/* Line */}
                  <path
                    d={pathData}
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="opacity-70"
                  />
                  {/* Data points */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="2"
                      fill="#10b981"
                      className="hover:r-3 transition-all cursor-pointer"
                    />
                  ))}
                </>
              );
            })()}
          </svg>

          {/* Interactive overlay for tooltips */}
          <div className="absolute inset-0 flex">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex-1 relative group cursor-pointer"
              >
                <div className="absolute inset-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors rounded"></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg border border-gray-700">
                  <div className="font-medium text-center">{item.date}</div>
                  <div className="text-blue-300">{item.cubentUnits.toFixed(2)} units</div>
                  <div className="text-green-300">{item.requests} messages</div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
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
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {chartData.reduce((sum, item) => sum + item.cubentUnits, 0).toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Units</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {chartData.reduce((sum, item) => sum + item.requests, 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Messages</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {chartData.reduce((sum, item) => sum + item.cubentUnits, 0) > 0 && chartData.reduce((sum, item) => sum + item.requests, 0) > 0
                ? (chartData.reduce((sum, item) => sum + item.cubentUnits, 0) / chartData.reduce((sum, item) => sum + item.requests, 0)).toFixed(2)
                : '0.00'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Units/Message</p>
          </div>
        </div>
      </div>
    </div>
  );
}
