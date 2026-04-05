import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, Home, ChartPie, CreditCard, Settings, Wallet, 
  ChevronDown, ChevronRight, Brain, Trash2,
  MessageSquare, CircleAlert, MessageCircle, Share2
} from 'lucide-react';

const Sidebar = ({ accounts = [], isAccountsOpen, setIsAccountsOpen, onDeleteAccount }) => {
  const { user, logout } = useContext(AuthContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const { theme } = useContext(ThemeContext);

  return (
    <aside className="w-72 glass-card border-r border-[var(--border-primary)] hidden md:flex flex-col relative z-20 h-full transition-colors duration-300">
      <div className="h-20 flex items-center px-8 border-b border-[var(--border-primary)]">
        <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-xl mr-3 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-[var(--text-primary)]">
          Nexus
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto hide-scrollbar">
        <Link 
          to="/" 
          className={`flex items-center px-4 py-3 rounded-xl border transition-all ${
            isActive('/') 
              ? 'bg-brand-500/10 text-[var(--text-primary)] border-brand-500/20 shadow-sm' 
              : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-brand-500/5'
          }`}
        >
          <Home className={`h-5 w-5 mr-3 ${isActive('/') ? 'text-brand-400' : ''}`} />
          <span className="font-semibold text-sm tracking-wide">Overview</span>
        </Link>
        
        <div className="space-y-1">
          <button 
            onClick={() => setIsAccountsOpen(!isAccountsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-500/5 rounded-xl transition-all group"
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3" />
              <span className="font-medium text-sm tracking-wide">Accounts</span>
            </div>
            {accounts.length > 0 && (
              isAccountsOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
            )}
          </button>
          
          {/* Nested Accounts */}
          {isAccountsOpen && accounts.length > 0 && (
            <div className="pl-12 space-y-1 mt-1">
              {accounts.map(acc => (
                <div key={acc._id} className="group flex items-center justify-between py-1.5 pr-2 rounded-lg hover:bg-brand-500/5 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2 cursor-pointer">
                     <span className="text-xs font-medium text-[var(--text-primary)] truncate">{acc.name}</span>
                     <span className="text-[10px] text-[var(--text-secondary)] truncate">${(acc.balanceCurrent || 0).toLocaleString()}</span>
                  </div>
                  {onDeleteAccount && (
                    <button 
                      onClick={(e) => { e.preventDefault(); onDeleteAccount(acc._id, acc.name); }}
                      className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Financial Lab - NEW */}
        <Link 
          to="/ai-lab" 
          className={`flex items-center px-4 py-3 rounded-xl border transition-all ${
            isActive('/ai-lab') 
              ? 'bg-purple-500/10 text-[var(--text-primary)] border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
              : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-brand-500/5'
          }`}
        >
          <Brain className={`h-5 w-5 mr-3 ${isActive('/ai-lab') ? 'text-purple-400' : ''}`} />
          <span className="font-semibold text-sm tracking-wide">Ai Financial Lab</span>
        </Link>

        <a href="#" className="flex items-center px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-500/5 rounded-xl transition-all">
          <ChartPie className="h-5 w-5 mr-3" />
          <span className="font-medium text-sm tracking-wide">Budgets</span>
        </a>
        <div className="space-y-1">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-500/5 rounded-xl transition-all group"
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-3" />
              <span className="font-medium text-sm tracking-wide">Settings</span>
            </div>
            {isSettingsOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />}
          </button>
          
          {isSettingsOpen && (
            <div className="pl-12 space-y-1 mt-1">
              <Link to="/contact-us" className="flex items-center py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <MessageSquare className="w-3.5 h-3.5 mr-2" />
                Contact us
              </Link>
              <Link to="/report-issue" className="flex items-center py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <CircleAlert className="w-3.5 h-3.5 mr-2" />
                Report Issue
              </Link>
              <Link to="/feedback" className="flex items-center py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <MessageCircle className="w-3.5 h-3.5 mr-2" />
                Feedback
              </Link>
              <Link to="/share" className="flex items-center py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <Share2 className="w-3.5 h-3.5 mr-2" />
                Share
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      <div className="p-6 border-t border-[var(--border-primary)]">
        <div className="bg-[var(--border-primary)] border border-[var(--border-primary)] rounded-2xl p-4 flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[100px]">{user?.name}</span>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">Pro Identity</span>
              </div>
           </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-400/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
