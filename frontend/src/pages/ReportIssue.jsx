import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { CircleAlert, ChartPie, ChartColumn, Send, User, Mail, Phone, MessageSquare, CircleCheck } from 'lucide-react';

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    description: ''
  });

  // Sync user data when it becomes available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/plaid/accounts');
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/support/report-issue', formData);
      setSuccess(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        contactNumber: '',
        description: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex relative overflow-hidden">
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
             <div className="p-2 bg-brand-500/10 rounded-lg">
                <CircleAlert className="w-5 h-5 text-brand-400" />
             </div>
             <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Report an Issue</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">How can we help?</h2>
              <p className="text-[var(--text-secondary)]">Describe the issue you're facing, and our team will get back to you shortly.</p>
            </div>

            {success ? (
              <div className="glass-card p-10 rounded-3xl border border-emerald-500/20 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CircleCheck className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Report Submitted!</h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  Thank you for your feedback. We've received your report and our support team will contact you soon.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-[var(--border-primary)] hover:bg-brand-500/10 text-[var(--text-primary)] rounded-xl transition-all font-medium border border-[var(--border-primary)]"
                >
                  Send another report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-[var(--border-primary)] space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                    <CircleAlert className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      readOnly
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-secondary)] cursor-not-allowed focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Issue Details
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide details about the problem..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Report
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="text-center p-8 border border-[var(--border-primary)] bg-[var(--border-primary)] rounded-2xl">
               <p className="text-sm text-[var(--text-secondary)] italic">
                 "Average response time is currently less than 24 hours."
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;
