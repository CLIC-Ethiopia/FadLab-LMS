
import React, { useState } from 'react';
import { Laptop, Shield, Loader2, ArrowLeft, Mail, Lock, AlertTriangle } from 'lucide-react';
import { sheetService } from '../services/sheetService';
import { Student } from '../types';

interface LoginProps {
  onLogin: (student: Student) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Admin Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError('');
    try {
      const student = await sheetService.loginWithSocial(provider);
      onLogin(student);
    } catch (e) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const admin = await sheetService.verifyAdmin(email, password);
      onLogin(admin);
    } catch (e) {
      setError("Invalid Email or Password. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* Abstract Background Shapes (FadLab Style) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/30 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/30 dark:bg-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/30 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-8 relative z-10 mx-4">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 pb-0 text-center">
             <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500">
                {isAdminView ? <Shield className="text-white w-8 h-8" /> : <Laptop className="text-white w-8 h-8" />}
             </div>
             <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
               {isAdminView ? "Admin Portal" : "FadLab LMS"}
             </h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm">
               {isAdminView ? "Secure Access for Staff Only" : "Empowering Innovation via STEAM-IE"}
             </p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
                 <AlertTriangle className="w-4 h-4" />
                 {error}
              </div>
            )}

            {!isAdminView ? (
              // STUDENT VIEW
              <div className="space-y-4 animate-fade-in">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3.5 rounded-xl transition-all font-medium group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />}
                  <span>Continue with Google</span>
                </button>
                
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white p-3.5 rounded-xl transition-all font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                  <span>Continue with Facebook</span>
                </button>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
                   <button 
                     onClick={() => { setIsAdminView(true); setError(''); }}
                     className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
                   >
                     Are you an Administrator? <span className="underline">Login here</span>
                   </button>
                </div>
              </div>
            ) : (
              // ADMIN VIEW
              <form onSubmit={handleAdminLogin} className="space-y-4 animate-fade-in">
                <div>
                   <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="admin@fadlab.tech"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                      />
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
                </button>

                <div className="pt-4 text-center">
                   <button 
                     type="button"
                     onClick={() => { setIsAdminView(false); setError(''); }}
                     className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition-colors mx-auto"
                   >
                     <ArrowLeft className="w-4 h-4" />
                     Back to Student Login
                   </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
               Protected by CLIC Ethiopia • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
