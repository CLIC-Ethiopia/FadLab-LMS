import React, { useState, useEffect, useRef } from 'react';
import { Course, Enrollment } from '../types';
import { X, CheckCircle, PlayCircle, Lock, BookOpen, Clock, ChevronRight, ChevronDown, CheckSquare } from 'lucide-react';

interface CourseProgressModalProps {
  course: Course;
  enrollment: Enrollment;
  onClose: () => void;
  onUpdateProgress?: (courseId: string, progress: number) => void;
}

const CourseProgressModal: React.FC<CourseProgressModalProps> = ({ course, enrollment, onClose, onUpdateProgress }) => {
  // Simulate modules based on course data (since backend doesn't have modules yet)
  const totalModules = 5;
  const completedModules = Math.floor((enrollment.progress / 100) * totalModules);
  
  // State to track which module is expanded
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  
  // Refs for scrolling
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Effect to scroll to the expanded module
  useEffect(() => {
    if (expandedModule !== null && moduleRefs.current[expandedModule]) {
      setTimeout(() => {
        moduleRefs.current[expandedModule]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Slight delay for animation
    }
  }, [expandedModule]);

  const generateModules = () => {
    return Array.from({ length: totalModules }).map((_, index) => {
      const isCompleted = index < completedModules;
      const isCurrent = index === completedModules;
      const isLocked = index > completedModules;

      let title = "";
      let duration = "";
      let videoId = "lxb3EKWsInQ"; // Default placeholder (Nature/Tech)

      switch(index) {
        case 0:
          title = `Introduction to ${course.category}`;
          duration = "45 min";
          videoId = "aircAruvnKk"; // 3Blue1Brown Neural Networks
          break;
        case 1:
          title = "Core Concepts & Fundamentals";
          duration = "1h 30m";
          videoId = "Ilg3gGewQ5U"; // 3Blue1Brown Calculus
          break;
        case 2:
          title = `Applied ${course.title.split(':')[0]}`;
          duration = "2h 15m";
          videoId = "aircAruvnKk";
          break;
        case 3:
          title = "Case Studies & Practical Lab";
          duration = "3h 00m";
          videoId = "Ilg3gGewQ5U";
          break;
        case 4:
          title = "Final Project & Assessment";
          duration = "1h 45m";
          videoId = "aircAruvnKk";
          break;
        default:
          title = "Module " + (index + 1);
          duration = "1h";
      }

      const description = `In this module covering "${title}", we will explore foundational principles and real-world applications. You'll engage with video lectures, interactive exercises, and quizzes to test your understanding of ${course.category} concepts.`;

      return { index, title, duration, isCompleted, isCurrent, isLocked, description, videoId };
    });
  };

  const modules = generateModules();

  const handleModuleClick = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const handleContinueLearning = () => {
    if (completedModules < totalModules) {
      setExpandedModule(completedModules);
    }
  };

  const handleMarkComplete = (index: number) => {
    if (onUpdateProgress) {
      // Calculate new progress percentage
      // For 5 modules: Mod 1 done = 20%, Mod 2 done = 40%, etc.
      const newProgress = Math.min(100, Math.round(((index + 1) / totalModules) * 100));
      onUpdateProgress(course.id, newProgress);
      // Auto expand next module logic will happen naturally as user re-clicks continue or manually navigates
      // But we can close the current one to signify completion or keep it open.
      // Let's toggle it closed to show state change
      setExpandedModule(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-4">
             <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
             <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{course.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                   <span className="font-medium text-blue-600 dark:text-blue-400">{enrollment.progress}% Complete</span>
                   <span>•</span>
                   <span>{course.durationHours} Hours Total</span>
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-950">
           {/* Progress Bar */}
           <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                 <span>Overall Progress</span>
                 <span>{completedModules}/{totalModules} Modules</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                 <div 
                   className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${enrollment.progress}%` }}
                 ></div>
              </div>
           </div>

           {/* Module List */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                 <BookOpen className="w-5 h-5 text-indigo-500" />
                 Course Curriculum
              </h4>
              
              {modules.map((mod, i) => (
                 <div 
                    key={mod.index}
                    ref={(el) => { moduleRefs.current[i] = el; }}
                    onClick={() => handleModuleClick(mod.index)}
                    className={`relative rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer
                       ${mod.isCurrent 
                          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                       }
                       ${mod.isLocked && expandedModule !== mod.index ? 'opacity-60' : 'opacity-100'}
                    `}
                 >
                    <div className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                           {mod.isCompleted ? (
                              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                 <CheckCircle className="w-6 h-6" />
                              </div>
                           ) : mod.isCurrent ? (
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center animate-pulse">
                                 <PlayCircle className="w-6 h-6" />
                              </div>
                           ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                 <Lock className="w-5 h-5" />
                              </div>
                           )}
                        </div>
                        
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <h5 className={`font-semibold ${mod.isCurrent ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                 {mod.title}
                              </h5>
                              {mod.isCurrent && (
                                 <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded">
                                    Current
                                 </span>
                              )}
                           </div>
                           <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                 <Clock className="w-3 h-3" />
                                 {mod.duration}
                              </span>
                              {mod.isCompleted && <span>• Completed</span>}
                           </div>
                        </div>

                        <div className={`transform transition-transform duration-300 ${expandedModule === mod.index ? 'rotate-180' : ''}`}>
                             {expandedModule === mod.index ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedModule === mod.index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                       <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/50">
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 mt-4 leading-relaxed">
                            {mod.description}
                          </p>
                          
                          <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black aspect-video group mb-4">
                             {mod.isLocked && !mod.isCompleted && !mod.isCurrent ? (
                               <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                                  <div className="text-center">
                                     <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                     <p className="text-slate-400 font-medium text-sm">Complete previous modules to unlock video</p>
                                  </div>
                               </div>
                             ) : (
                                <iframe 
                                  width="100%" 
                                  height="100%" 
                                  src={`https://www.youtube.com/embed/${mod.videoId}`} 
                                  title={mod.title}
                                  frameBorder="0" 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen
                                  className="absolute inset-0 w-full h-full"
                                ></iframe>
                             )}
                          </div>
                          
                          {/* Complete Button */}
                          {mod.isCurrent && !mod.isCompleted && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkComplete(mod.index);
                                }}
                                className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckSquare className="w-4 h-4" />
                                Mark as Completed
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
           >
             Close
           </button>
           <button 
              onClick={handleContinueLearning}
              disabled={completedModules >= totalModules}
              className={`px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2
                ${completedModules >= totalModules ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 dark:hover:bg-blue-500'}
              `}
           >
             {completedModules >= totalModules ? (
                 <>
                    <CheckCircle className="w-5 h-5" />
                    Course Completed
                 </>
             ) : (
                 <>
                    <PlayCircle className="w-5 h-5" />
                    Continue Learning
                 </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressModal;