
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Calendar, Clock, Target, CheckCircle } from 'lucide-react';

interface StudyPlannerProps {
  course: Course | null;
  onClose: () => void;
  onSave: (courseId: string, plan: { hoursPerWeek: number, targetDate: string }) => Promise<void>;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ course, onClose, onSave }) => {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5);
  const [targetDate, setTargetDate] = useState<string>('');
  const [weeksToFinish, setWeeksToFinish] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (course) {
      const weeks = Math.ceil(course.durationHours / hoursPerWeek);
      setWeeksToFinish(weeks);
      
      const date = new Date();
      date.setDate(date.getDate() + (weeks * 7));
      setTargetDate(date.toISOString().split('T')[0]);
    }
  }, [course, hoursPerWeek]);

  const handleSave = async () => {
    if (!course) return;
    setIsSaving(true);
    try {
        await onSave(course.id, { hoursPerWeek, targetDate });
    } catch(e) {
        console.error("Error saving plan:", e);
    } finally {
        setIsSaving(false);
        onClose();
    }
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create Study Plan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <img src={course.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover shadow-sm" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">{course.title}</h4>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                <Clock className="w-4 h-4" />
                <span>Total Duration: {course.durationHours} Hours</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                How many hours can you study per week?
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  value={hoursPerWeek} 
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className="flex-grow h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="w-16 text-center font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
                  {hoursPerWeek}h
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 transition-colors">
              <h5 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Projection
              </h5>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Est. Completion:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{weeksToFinish} Weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Target Date:</span>
                <div className="flex items-center gap-2 font-bold text-green-600 dark:text-green-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(targetDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-all flex items-center gap-2
              ${isSaving ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isSaving ? (
              <>Saving Plan...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
