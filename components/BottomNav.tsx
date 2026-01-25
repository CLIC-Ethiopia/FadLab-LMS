
import React from 'react';
import { LayoutDashboard, BookOpen, FlaskConical, Users, Settings } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'courses', label: 'Learn', icon: BookOpen },
    { id: 'inno-lab', label: 'Inno', icon: FlaskConical },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center justify-center flex-1 gap-1 relative group py-2"
            >
              <div className={`transition-all duration-300 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              }`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
