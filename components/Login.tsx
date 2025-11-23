
import React from 'react';
import { Laptop, Github, Mail, Shield } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface LoginProps {
  onLogin: (email?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
            <Laptop className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">FadLab LMS</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">CLIC Ethiopia E-Learning Platform</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin()}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium group shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
          
          <button 
            onClick={() => onLogin()}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white p-3 rounded-lg hover:bg-[#166fe5] transition-all font-medium shadow-sm"
          >
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Continue with Facebook</span>
          </button>

          <button 
            onClick={() => onLogin('admin@fadlab.tech')}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-all font-medium shadow-sm group"
          >
            <Shield className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span>Login as Administrator</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            By continuing, you agree to the <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Powered by Google Sheets Backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
