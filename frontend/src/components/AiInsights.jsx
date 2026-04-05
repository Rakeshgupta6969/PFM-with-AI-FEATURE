import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb, Percent, ShoppingBag } from 'lucide-react';
import api from '../utils/api';

const AiInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiData = async () => {
      try {
        const { data } = await api.get('/ai/insights');
        setData(data);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAiData();
  }, []);

  if (loading) return (
    <div className="glass-card p-6 rounded-3xl animate-pulse flex flex-col gap-4">
      <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
      <div className="h-24 w-full bg-white/5 rounded-2xl"></div>
      <div className="h-32 w-full bg-white/5 rounded-2xl"></div>
    </div>
  );

  if (!data) return null;

  const { distribution, top3, comparison, unusual, suggestions } = data;

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-brand-500 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Financial Lab</h3>
            <p className="text-xs text-brand-400 font-medium">Smart Pattern Recognition</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Comparison vs Last Month */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {comparison.trend === 'increase' ? <TrendingUp className="w-16 h-16" /> : <TrendingDown className="w-16 h-16" />}
           </div>
           <p className="text-sm font-semibold text-gray-400 mb-2">Spending Velocity</p>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">${comparison.totalCurrent.toLocaleString()}</span>
              <div className={`flex items-center pb-1 text-sm font-bold ${comparison.trend === 'increase' ? 'text-red-400' : 'text-emerald-400'}`}>
                {comparison.trend === 'increase' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {comparison.diffPercent}%
              </div>
           </div>
           <p className="text-xs text-gray-500 mt-1 mt-2 flex items-center gap-1">
             <AlertCircle className="w-3 h-3" />
             Compared to ${comparison.totalPrev.toLocaleString()} last month
           </p>
        </div>

        {/* Top Spend Analysis */}
        <div className="glass-card p-5 rounded-2xl border border-white/5">
           <p className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
             <ShoppingBag className="w-4 h-4 text-purple-400" />
             Concentration Areas
           </p>
           <div className="space-y-3">
              {top3.slice(0, 2).map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                      <span className="text-xs text-gray-300 font-medium">{cat.name}</span>
                   </div>
                   <span className="text-xs font-bold text-white">{cat.percentage}%</span>
                </div>
              ))}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1">
                 <div className="h-full bg-brand-500 rounded-full" style={{ width: `${top3[0]?.percentage || 0}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* Detection Alerts & Suggestions */}
      <div className="space-y-4 pt-2">
        {/* Unusual Detection */}
        {unusual.length > 0 && (
          <div className="p-4 bg-red-400/5 border border-red-400/20 rounded-2xl border-dashed">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest">Anomalies Detected</span>
            </div>
            {unusual.map((item, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200">{item.name}</span>
                  <span className="text-[10px] text-gray-500">{item.reason}</span>
                </div>
                <span className="text-sm font-bold text-red-400">${item.amount}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actionable Suggestions */}
        <div className="p-5 bg-emerald-400/5 border border-emerald-400/20 rounded-2xl relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
              <Lightbulb className="w-24 h-24 text-emerald-400" />
           </div>
           <div className="flex items-center gap-2 text-emerald-400 mb-4">
             <Lightbulb className="w-4 h-4" />
             <span className="text-[11px] font-extrabold uppercase tracking-widest">Growth Recommendations</span>
           </div>
           <div className="space-y-4">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                   <div className="mt-1 p-1 bg-emerald-400/20 rounded-full">
                      <CheckCircle className="w-2 h-2 text-emerald-400" />
                   </div>
                   <p className="text-xs leading-relaxed text-gray-300 font-medium">{s}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
