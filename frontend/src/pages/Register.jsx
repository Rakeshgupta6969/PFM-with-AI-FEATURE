import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-card rounded-3xl shadow-2xl overflow-hidden p-10 space-y-8 relative z-10">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-white tracking-tight">
            Join Platform
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400">
            Take control of your financial future
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
             <AlertCircle className="text-red-400 h-5 w-5" />
             <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-400">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="pl-11 w-full px-4 py-3 glass-input rounded-xl transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-400">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="pl-11 w-full px-4 py-3 glass-input rounded-xl transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-400">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="pl-11 w-full px-4 py-3 glass-input rounded-xl transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Sign up
                </div>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
