import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AiInsights from '../components/AiInsights';
import api from '../utils/api';
import { Brain, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const AiLab = () => {
  const [accounts, setAccounts] = useState([]);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get('/plaid/accounts');
        setAccounts(data);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>

      <Sidebar 
        accounts={accounts} 
        isAccountsOpen={isAccountsOpen} 
        setIsAccountsOpen={setIsAccountsOpen} 
      />

      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden">
        <header className="h-20 glass-card border-b border-[var(--border-primary)] flex items-center px-10 sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-gradient-to-tr from-purple-500 to-brand-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">AI Financial Lab</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            
            {/* Intro Hero Section */}
            <div className="relative p-10 rounded-3xl overflow-hidden glass-card border border-[var(--border-primary)] group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all transform group-hover:scale-110">
                  <Sparkles className="w-40 h-40 text-brand-400" />
               </div>
               <div className="relative z-10 max-w-xl">
                  <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                    Smart Insights, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Better Decisions.</span>
                  </h2>
                  <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                    Our AI Financial Lab analyzes thousands of data points across your accounts to detect patterns, anomalies, and provide tailored suggestions to boost your savings.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Privacy Protected</span>
                     </div>
                     <div className="px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-400" />
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Real-time Analysis</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* The Main AI Insights Component */}
            <div className="glass-card p-10 rounded-3xl border border-[var(--border-primary)] shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
               <AiInsights />
            </div>

            {/* Experimental Note */}
            <div className="text-center p-8 border border-[var(--border-primary)] bg-[var(--border-primary)] rounded-2xl">
               <p className="text-sm text-[var(--text-secondary)] italic">
                 "Our AI Lab is constantly learning. Expect more advanced predictive features like future bill detection and subscription auditing soon."
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AiLab;
