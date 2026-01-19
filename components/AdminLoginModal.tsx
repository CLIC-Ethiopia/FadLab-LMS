
import React, { useState } from 'react';
import { Shield, Lock, Mail, Loader2, X, AlertTriangle } from 'lucide-react';
import { sheetService } from '../services/sheetService';
import { Student } from '../types';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (admin: Student) => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const admin = await sheetService.verifyAdmin(email, password);
      onLogin(admin);
      onClose();
    } catch (e: any) {
      setError(e.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 flex justify-between items-start border-b border-slate-100 dark:border-slate-800">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Shield className="w-5 h-5 text-purple-600" />
                 <h3 className="font-bold text-slate-800 dark:text-white">Admin Portal</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure Access for Staff Only</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-8">
           {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                 <AlertTriangle className="w-4 h-4" />
                 {error}
              </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="admin@fadlab.tech"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white transition-all"
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
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white transition-all"
                    />
                 </div>
              </div>

              <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
