import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Share2, Globe, MessageCircle, Send, Copy, Check, User, Sparkles, Zap, Award } from 'lucide-react';

const Share = () => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = window.location.origin;
  const shareMessage = `Hey! I'm using Nexus AI to manage my finances smarter. Join me here: ${shareUrl}`;
  
  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]/10',
      textColor: 'text-[#25D366]',
      borderColor: 'border-[#25D366]/20',
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      description: 'Rapid message sharing'
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088cc]/10',
      textColor: 'text-[#0088cc]',
      borderColor: 'border-[#0088cc]/20',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`,
      description: 'Encrypted community'
    },
    {
      name: 'Twitter',
      icon: Share2,
      color: 'bg-white/5',
      textColor: 'text-white',
      borderColor: 'border-white/10',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      description: 'Public broadcast'
    }
  ];

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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
             <div className="p-2 bg-brand-500/10 rounded-lg">
                <Share2 className="w-5 h-5 text-brand-400" />
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">Share & Invite</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-[10px] font-bold text-brand-400 uppercase tracking-widest animate-pulse">
                  <Sparkles className="w-3 h-3" /> Growth Program
                </div>
                <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
                  The future of finance is <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-400">Social.</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                   Invite your friends to the Nexus ecosystem and help them master their financial data with AI-powered insights.
                </p>
                
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">24/7</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Analytics</span>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">Global</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Coverage</span>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">Secure</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">End-to-End</span>
                  </div>
                </div>
              </div>

              {/* Profile Preview Card */}
              <div className="glass-card p-1 rounded-[40px] border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-600/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="glass-card rounded-[36px] bg-black/40 p-8 border border-white/5 relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                     <div className="absolute -inset-2 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-full blur opacity-40 animate-spin-slow"></div>
                     <div className="w-24 h-24 rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-4xl font-black text-white relative z-10">
                       {user?.name?.charAt(0).toUpperCase()}
                     </div>
                     <div className="absolute -bottom-1 -right-1 bg-brand-500 p-2 rounded-full border-2 border-black z-20 shadow-xl">
                       <Award className="w-4 h-4 text-white" />
                     </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{user?.name}</h3>
                  <div className="flex items-center gap-2 py-1 px-4 bg-white/5 border border-white/10 rounded-full mb-8">
                     <Zap className="w-3 h-3 text-brand-400" />
                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Premium Entity</span>
                  </div>

                  <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                     <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tighter text-gray-500">
                        <span>Nexus Referral Active</span>
                        <span className="text-emerald-400">Verified</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-brand-500 to-purple-500"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Link Section */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-400" /> Personal Referral Link
                  </h3>
               </div>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-white/20 transition-all font-mono text-sm overflow-hidden">
                     <span className="text-gray-400 truncate flex-1">{shareUrl}</span>
                     <div className="hidden sm:block h-6 w-px bg-white/10"></div>
                     <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest hidden sm:block">Unique ID</div>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                      copied 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/20 active:scale-95'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Link Copied' : 'Copy Link'}
                  </button>
               </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {socialPlatforms.map((platform) => (
                 <a 
                   key={platform.name}
                   href={platform.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`glass-card p-6 rounded-[32px] border ${platform.borderColor} ${platform.color} hover:bg-opacity-20 transition-all group flex flex-col items-center text-center relative overflow-hidden`}
                 >
                   <div className="p-4 rounded-2xl mb-4 bg-white/5 border border-white/5 transition-all group-hover:scale-110 group-hover:bg-white/10">
                      <platform.icon className={`w-8 h-8 ${platform.textColor} ${platform.name === 'WhatsApp' ? 'fill-emerald-400/10' : ''}`} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">{platform.name}</h4>
                   <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{platform.description}</p>
                   
                   <div className="mt-6 p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Share2 className="w-4 h-4 text-white" />
                   </div>
                 </a>
               ))}
            </div>

            {/* Success Info */}
            <div className="text-center p-12 glass-card rounded-[40px] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-brand-500/5 to-purple-600/5 transition-all group-hover:opacity-100 opacity-50"></div>
               <User className="w-12 h-12 text-brand-400 mx-auto mb-6 opacity-40" />
               <p className="text-gray-400 font-medium italic relative z-10 max-w-xl mx-auto">
                 "Sharing is the most powerful way to empower your community. When you invite someone to Nexus, you're not just sharing a tool; you're sharing financial clarity."
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Share;
