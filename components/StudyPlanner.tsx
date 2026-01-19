


import React, { useState, useEffect } from 'react';
import { Course, Enrollment } from '../types';
import { Calendar, Clock, Target, CheckCircle } from 'lucide-react';

interface StudyPlannerProps {
  course: Course | null;
  initialPlan?: Enrollment; // Allow passing existing enrollment to pre-fill data
  onClose: () => void;
  onSave: (courseId: string, plan: { hoursPerWeek: number, startDate: string, targetDate: string }) => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ course, initialPlan, onClose, onSave }) => {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5);
  // Default start date to today or initial plan
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState<string>('');
  const [weeksToFinish, setWeeksToFinish] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state from initialPlan if provided
  useEffect(() => {
    if (initialPlan) {
        if (initialPlan.plannedHoursPerWeek) setHoursPerWeek(initialPlan.plannedHoursPerWeek);
        if (initialPlan.startDate) setStartDate(initialPlan.startDate);
        // Target date is recalculated based on hours/start, but we can set it initially
        // The effect below will likely override it immediately based on logic, which is fine
    }
  }, [initialPlan]);

  useEffect(() => {
    if (course && startDate) {
      const weeks = Math.ceil(course.durationHours / hoursPerWeek);
      setWeeksToFinish(weeks);
      
      const start = new Date(startDate);
      // Create a new date object for target
      const target = new Date(start);
      // Add weeks * 7 days
      target.setDate(start.getDate() + (weeks * 7));
      
      if (!isNaN(target.getTime())) {
          setTargetDate(target.toISOString().split('T')[0]);
      } else {
          setTargetDate('');
      }
    }
  }, [course, hoursPerWeek, startDate]);

  const handleSave = () => {
    if (!course || !targetDate) return;
    setIsSaving(true);
    // Simulate backend call
    setTimeout(() => {
      onSave(course.id, { hoursPerWeek, startDate, targetDate });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
             {initialPlan ? 'Update Study Plan' : 'Create Study Plan'}
          </h3>
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

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                1. When do you want to start?
              </label>
              <div className="relative">
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   onClick={(e) => {
                     // Try to open the picker on click anywhere in the input
                     if('showPicker' in e.currentTarget) {
                        try { (e.currentTarget as any).showPicker(); } catch(err) {}
                     }
                   }}
                   className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:[color-scheme:dark] cursor-pointer"
                 />
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                2. Weekly Commitment
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
                <span className="w-20 text-center font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 text-sm">
                  {hoursPerWeek} hrs/wk
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 transition-colors">
              <h5 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
                <Target className="w-4 h-4" />
                Plan Projection
              </h5>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Est. Duration:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{weeksToFinish} Weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Target Date:</span>
                <div className="flex items-center gap-2 font-bold text-green-600 dark:text-green-400">
                  <Calendar className="w-4 h-4" />
                  {targetDate ? new Date(targetDate).toLocaleDateString() : 'Invalid Date'}
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
            disabled={isSaving || !targetDate}
            className={`px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-all flex items-center gap-2
              ${isSaving || !targetDate ? 'opacity-70 cursor-not-allowed' : ''}
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
