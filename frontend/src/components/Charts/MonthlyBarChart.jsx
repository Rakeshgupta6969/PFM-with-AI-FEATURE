import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-white font-extrabold text-lg">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-medium italic">
        Gathering trend insights...
      </div>
    );
  }

  // Format data to ensure unique dates for the x-axis display
  const chartData = data.map(item => ({
    ...item,
    formattedDate: (() => {
       const d = new Date(item.date);
       return `${d.getMonth() + 1}/${d.getDate()}`;
    })()
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <defs>
             <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#8b5cf6" />
               <stop offset="100%" stopColor="#3b82f6" />
             </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
            dy={15}
          />
          <YAxis 
            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: [4, 4, 0, 0] }} 
          />
          <Bar 
            dataKey="amount" 
            fill="url(#barGradient)" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={12}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
