'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RequestChartData {
  date: string;
  requests: number;
  cubentUnits: number;
}

interface RequestChartProps {
  data: RequestChartData[];
}

export const RequestChart = ({ data }: RequestChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d97706]" />
              <span className="text-gray-300 text-sm">Requests:</span>
              <span className="text-white font-medium">{payload[0]?.value?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-gray-300 text-sm">Cubent Units:</span>
              <span className="text-white font-medium">{payload[1]?.value?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="unitsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" className="opacity-50" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            yAxisId="requests"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            yAxisId="units"
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="requests"
            stackId="1"
            stroke="#d97706"
            fill="url(#requestsGradient)"
            strokeWidth={2}
            yAxisId="requests"
          />
          <Area
            type="monotone"
            dataKey="cubentUnits"
            stackId="2"
            stroke="#f59e0b"
            fill="url(#unitsGradient)"
            strokeWidth={2}
            yAxisId="units"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
