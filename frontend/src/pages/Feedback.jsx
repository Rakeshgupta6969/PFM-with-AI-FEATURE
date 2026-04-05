import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Star, MessageCircle, Send, User, Calendar, CircleCheck, CircleAlert } from 'lucide-react';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  const fetchFeedbacks = async () => {
    try {
      setFetching(true);
      const { data } = await api.get('/support/feedback');
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/support/feedback', { rating, comment });
      setSuccess(true);
      setComment('');
      setRating(5);
      fetchFeedbacks(); // Refresh the list
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>

      <Sidebar 
        accounts={accounts} 
        isAccountsOpen={isAccountsOpen} 
        setIsAccountsOpen={setIsAccountsOpen} 
      />

      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-hidden">
        <header className="h-20 glass-card border-b border-white/5 flex items-center px-10 sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-400" />
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">Community Feedback</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-5xl mx-auto space-y-12 pb-20">
            
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Share Your Experience</h2>
              <p className="text-gray-400 text-lg">Your feedback helps us build a better financial tool for everyone.</p>
            </div>

            {/* Main Grid: Form and Existed Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* Submission Form */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star className="w-24 h-24 text-brand-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    Submit Feedback
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-3 text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Rate Us</p>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-all transform hover:scale-125 focus:outline-none"
                          >
                            <Star 
                              className={`w-8 h-8 ${
                                (hoverRating || rating) >= star 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Your Thoughts</label>
                      <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like? What can we improve?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                        <CircleAlert className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <CircleCheck className="w-4 h-4 flex-shrink-0" />
                        <span>Feedback sent successfully!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !comment.trim()}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white rounded-2xl font-bold transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Feedback
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="p-6 bg-white/2 rounded-2xl border border-white/5 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-tighter mb-1">Authenticated As</p>
                  <p className="text-sm font-bold text-brand-400">{user?.name}</p>
                </div>
              </div>

              {/* Existed Feedback Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Existed Feedback</h3>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                    {feedbacks.length} Total Contributions
                  </div>
                </div>

                {fetching ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
                    ))}
                  </div>
                ) : feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {feedbacks.map((f) => (
                      <div key={f._id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                              {f.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{f.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-[10px] text-gray-500 font-mono">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(f.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed italic">
                          "{f.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center rounded-3xl border border-white/5">
                    <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium font-mono text-sm leading-relaxed">
                       No feedback yet. <br /> Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
