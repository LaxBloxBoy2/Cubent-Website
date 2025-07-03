'use client';

import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  date: string;
  requests: number;
  cubentUnits: number;
  tokens: number;
}

interface ApiChartProps {
  data: ChartData[];
}

export function ApiChart({ data }: ApiChartProps) {
  const chartData = useMemo(() => {
    // Fill in missing days with zero values for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const filledData = [];
    const dataMap = new Map(data.map(item => [item.date, item]));

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(thirtyDaysAgo);
      currentDate.setDate(thirtyDaysAgo.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const existingData = dataMap.get(dateStr);
      filledData.push({
        date: currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        requests: existingData?.requests || 0,
        cubentUnits: existingData?.cubentUnits || 0,
        tokens: existingData?.tokens || 0,
      });
    }

    return filledData;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#333] p-3 shadow-lg">
          <p className="font-medium text-white text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm text-gray-300">
                  {entry.name}: {entry.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 1" stroke="#333" className="opacity-50" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="requests"
            name="Claude Sonnet 3.7 - Input Tokens per Minute Cache Aware"
            stroke="#d97706"
            strokeWidth={0}
            fillOpacity={1}
            fill="url(#colorRequests)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="cubentUnits"
            name="Claude Haiku 3 - Input Tokens per Minute"
            stroke="#f59e0b"
            strokeWidth={0}
            fillOpacity={1}
            fill="url(#colorUnits)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
