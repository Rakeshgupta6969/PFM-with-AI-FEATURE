import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Mail, MessageCircle, Phone, Globe, MapPin, ExternalLink, Send, Share2 } from 'lucide-react';

const ContactUs = () => {
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

  const contactInfo = {
    whatsapp: "+91 8176896806",
    email: "rakeshgupta6834@gmail.com",
    whatsappLink: "https://wa.me/918176896806",
    emailLink: "mailto:rakeshgupta6834@gmail.com"
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
                <Phone className="w-5 h-5 text-brand-400" />
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">Contact Us</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 hide-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Get in Touch</h2>
              <p className="text-gray-400 text-lg">We're here to help you with any questions about Nexus and your financial journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* WhatsApp Card */}
              <a 
                href={contactInfo.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-8 rounded-3xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageCircle className="w-24 h-24 text-emerald-400" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">WhatsApp</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Chat with us directly on WhatsApp for quick support and queries.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-bold text-emerald-400 tracking-wider">
                    {contactInfo.whatsapp}
                  </span>
                  <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </a>

              {/* Email Card */}
              <a 
                href={contactInfo.emailLink}
                className="glass-card p-8 rounded-3xl border border-brand-500/10 hover:border-brand-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Mail className="w-24 h-24 text-brand-400" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand-500/10 rounded-2xl group-hover:bg-brand-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Email Support</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Send us an email for detailed inquiries or official support.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-brand-400 truncate pr-4">
                    {contactInfo.email}
                  </span>
                  <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-brand-400 transition-colors" />
                </div>
              </a>

            </div>

            {/* Social & Extra Info */}
            <div className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-400 font-bold uppercase tracking-widest text-xs">
                    <Globe className="w-4 h-4" /> Global Presence
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Available 24/7 across all digital platforms for worldwide users.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
                    <MapPin className="w-4 h-4" /> Headquarters
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Virtual First Company <br /> Proudly Built Globally.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
                    <Share2 className="w-4 h-4" /> Social Connect
                  </div>
                  <div className="flex gap-4">
                    <Send className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" title="Telegram" />
                    <Globe className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" title="Website" />
                    <Share2 className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" title="Socials" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-8 border border-white/5 bg-white/2 rounded-2xl">
               <p className="text-sm text-gray-500 italic">
                 "Our typical response time via WhatsApp is under 2 hours."
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
