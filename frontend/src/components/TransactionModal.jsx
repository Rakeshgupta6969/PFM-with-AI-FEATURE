import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const CATEGORIES = ['Food and Drink', 'Travel', 'Payment', 'Recreation', 'Shops', 'Transfer'];

const TransactionModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      setLoading(true);
      await api.post('/finance/transactions', {
        name,
        amount: Number(amount),
        category,
        date
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="glass-card w-full max-w-md rounded-3xl border border-[var(--border-primary)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Add Transaction</h3>
          <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--border-primary)] hover:bg-brand-500/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="E.g., Morning Coffee"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-brand-500 rounded-xl px-4 py-3 text-[var(--text-primary)] outline-none transition-colors"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="4.50"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-brand-500 rounded-xl px-4 py-3 text-[var(--text-primary)] outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-brand-500 rounded-xl px-4 py-3 text-[var(--text-primary)] outline-none transition-colors hidden-calendar-icon"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] focus:border-brand-500 rounded-xl px-4 py-3 text-[var(--text-primary)] outline-none transition-colors appearance-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="pt-4 mt-6 border-t border-[var(--border-primary)] flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-[var(--border-primary)] hover:bg-brand-500/10 text-[var(--text-primary)] font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
