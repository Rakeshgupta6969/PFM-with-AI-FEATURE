import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, Home, ChartPie, CreditCard, Settings, Wallet, TrendingUp, DollarSign, RefreshCw, ChartColumn, Plus, Trash2, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import LinkBank from '../components/LinkBank';
import SpendingPieChart from '../components/Charts/SpendingPieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';
import BudgetWidget from '../components/BudgetWidget';
import TransactionModal from '../components/TransactionModal';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [accounts, setAccounts] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(1500);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isMainAccountsOpen, setIsMainAccountsOpen] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch data in parallel
      const [accountsRes, summaryRes, budgetRes, txRes] = await Promise.allSettled([
        api.get('/plaid/accounts'),
        api.get('/finance/summary'),
        api.get('/finance/budget'),
        api.get('/finance/transactions')
      ]);

      if (accountsRes.status === 'fulfilled') setAccounts(accountsRes.value.data);
      if (summaryRes.status === 'fulfilled') setSummaryData(summaryRes.value.data);
      if (budgetRes.status === 'fulfilled') setBudgetLimit(budgetRes.value.data.limit);
      if (txRes.status === 'fulfilled') setTransactions(txRes.value.data);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteParams = async (id) => {
    if (!window.confirm("Delete transaction?")) return;
    try {
      await api.delete(`/finance/transactions/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the account "${name}"? This will also delete all associated transactions from your ledger.`)) return;
    try {
      await api.delete(`/plaid/accounts/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Error deleting account: ' + (err.response?.data?.message || err.message));
    }
  };

  const totalNetWorth = accounts.reduce((sum, acc) => sum + (acc.balanceCurrent || 0), 0);
  const monthlySpent = summaryData?.monthlySpent || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar 
        accounts={accounts} 
        isAccountsOpen={isAccountsOpen} 
        setIsAccountsOpen={setIsAccountsOpen} 
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden">
        <header className="h-20 glass-card border-b border-white/5 flex items-center px-6 sm:px-10 sticky top-0 z-30">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:hidden">Nexus</h1>
          <div className="ml-auto flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 bg-[var(--border-primary)] hover:bg-brand-500/10 text-[var(--text-primary)] rounded-lg transition-all border border-[var(--border-primary)] flex items-center justify-center group"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              )}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-brand-600/20 text-brand-400 hover:bg-brand-600/40 rounded-lg transition-colors flex items-center gap-2 font-medium border border-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-400' : 'text-gray-400'}`} />
            </button>
            <LinkBank onSuccessLink={fetchDashboardData} />
          </div>
        </header>

        {isModalOpen && (
          <TransactionModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchDashboardData();
            }} 
          />
        )}

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Financial Overview</h2>
              <p className="text-gray-400 mt-2">Track your net worth, spending, and financial health.</p>
            </div>

            {/* Top Stat Level */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              <div className="glass-card p-6 rounded-3xl border border-white/5 lg:col-span-1 flex flex-col justify-between hover:border-brand-500/30 transition-all group">
                <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Total Net Worth</p>
                      <div className="p-2 bg-brand-500/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-brand-400" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white tracking-tight">
                      ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-emerald-400 font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2.4%
                      </span>
                      <span className="ml-2 text-gray-500">from last month</span>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-400">Connected Accounts</p>
                        <CreditCard className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-white tracking-tight">{accounts.length}</p>
                </div>
              </div>

              {/* Dynamic Budget Widget */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 lg:col-span-2 hover:border-purple-500/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Monthly Budget Tracker</p>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <ChartPie className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <BudgetWidget 
                   monthlySpent={monthlySpent} 
                   budgetLimit={budgetLimit} 
                   onBudgetUpdated={fetchDashboardData} 
                />
              </div>
            </div>

            {/* High-Level Analytics Row */}
            {summaryData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Trend */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Spending Trend</h3>
                      <p className="text-[12px] text-gray-500 font-medium">Past 30 days visualization</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                      <ChartColumn className="text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  <MonthlyBarChart data={summaryData.barChartData} />
                </div>

                {/* Expense Distribution */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Expense Distribution</h3>
                      <p className="text-[12px] text-gray-500 font-medium">Spending by category</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                      <ChartPie className="text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  <SpendingPieChart data={summaryData.pieChartData} />
                </div>
              </div>
            )}

            {/* Accounts Table List */}
            {accounts.length > 0 && (
              <div className="glass-card rounded-3xl border border-white/5 overflow-hidden mt-6">
                <button 
                  onClick={() => setIsMainAccountsOpen(!isMainAccountsOpen)}
                  className="w-full px-6 py-5 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-white">Active Connections</h3>
                  {isMainAccountsOpen ? <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white" /> : <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />}
                </button>
                {isMainAccountsOpen && (
                  <div className="divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {accounts.map(account => (
                      <div key={account._id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                            <CreditCard className="h-6 w-6 text-brand-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-lg">{account.name}</p>
                            <p className="text-sm text-gray-400 capitalize">{account.subtype} • {account.officialName || 'Standard Account'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">
                              ${(account.balanceCurrent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-gray-400">Current Balance</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteAccount(account._id, account.name)}
                            className="p-2.5 text-red-500/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-400/20"
                            title="Delete Account"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ledger */}
            {transactions.length > 0 && (
               <div className="glass-card rounded-3xl border border-white/5 overflow-hidden mt-6">
                 <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-white">Recent Ledger Log</h3>
                 </div>
                 <div className="divide-y divide-white/5">
                   {transactions.map(txn => (
                     <div key={txn._id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                           <DollarSign className="h-5 w-5 text-purple-400" />
                         </div>
                         <div>
                           <p className="font-semibold text-white">{txn.name}</p>
                           <p className="text-sm text-gray-400">
                             {new Date(txn.date).toLocaleDateString()} • {txn.category[0] || 'Uncategorized'}
                           </p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <p className="text-lg font-bold text-brand-400">
                           ${txn.amount.toFixed(2)}
                         </p>
                         <button 
                           onClick={() => handleDeleteParams(txn._id)}
                           className="p-2 text-red-500/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold group-hover:scale-100 scale-90"
                           title="Delete"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
