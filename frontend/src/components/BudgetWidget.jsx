import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import api from '../utils/api';

const BudgetWidget = ({ monthlySpent, budgetLimit, onBudgetUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budgetLimit || 1500);

  const percentage = Math.min(((monthlySpent || 0) / (budgetLimit || 1500)) * 100, 100);
  
  // Dynamic color based on how close they are to the budget
  let progressColor = "bg-emerald-500";
  if (percentage > 75) progressColor = "bg-amber-500";
  if (percentage > 90) progressColor = "bg-red-500";

  const handleSave = async () => {
    try {
      await api.post('/finance/budget', { limit: newLimit });
      setIsEditing(false);
      if (onBudgetUpdated) onBudgetUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-white">${monthlySpent.toLocaleString()}</span>
          <span className="text-gray-400 ml-2">/ ${budgetLimit.toLocaleString()}</span>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Settings2 className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-3 mb-4 mt-4 bg-white/5 p-3 rounded-xl border border-white/10">
          <input 
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
          />
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-500 transition-colors"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mt-4 shadow-inner">
          <div 
            className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-3 flex items-center justify-between">
        <span>{percentage.toFixed(1)}% of monthly budget utilized</span>
        {percentage > 90 && <span className="text-red-400 font-medium">Critical capacity</span>}
      </p>
    </div>
  );
};

export default BudgetWidget;
