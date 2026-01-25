
import React from 'react';
import { CourseCategory } from '../types';
import { Zap } from 'lucide-react';

interface PipelineProgressProps {
  stats: Record<string, number>;
}

const PipelineProgress: React.FC<PipelineProgressProps> = ({ stats }) => {
  const categories = Object.values(CourseCategory);
  
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Science': return 'bg-blue-500';
      case 'Technology': return 'bg-indigo-500';
      case 'Engineering': return 'bg-orange-500';
      case 'Arts': return 'bg-pink-500';
      case 'Mathematics': return 'bg-teal-500';
      case 'Innovation': return 'bg-yellow-500';
      case 'Entrepreneurship': return 'bg-green-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Industrial Pipeline Balance
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mastery Analysis</span>
      </div>

      <div className="space-y-4">
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {categories.map((cat) => {
            const value = stats[cat] || 0;
            const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
            const width = (value / total) * 100;
            
            return (
              <div 
                key={cat}
                style={{ width: `${Math.max(width, 2)}%` }}
                className={`${getCategoryColor(cat)} h-full transition-all duration-1000 border-r border-white/10 last:border-0`}
                title={`${cat}: ${Math.round(width)}%`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {categories.map((cat) => (
            <div key={cat} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getCategoryColor(cat)}`} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                {cat.charAt(0)}
              </span>
              <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                {Math.round(stats[cat] || 0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineProgress;
