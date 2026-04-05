import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899', '#06B6D4', '#10B981'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-2xl border border-[var(--border-primary)] shadow-2xl backdrop-blur-md">
        <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest mb-1">{payload[0].name}</p>
        <p className="text-[var(--text-primary)] font-extrabold text-lg">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const SpendingPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-medium italic">
        Analyzing distribution...
      </div>
    );
  }

  return (
    <div className="h-80 w-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend at Bottom */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 pb-4">
         {data.map((entry, index) => (
           <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-[11px] font-bold text-[var(--text-secondary)] tracking-tight whitespace-nowrap">
                {entry.name}
              </span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default SpendingPieChart;
