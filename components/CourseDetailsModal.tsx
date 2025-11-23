import React from 'react';
import { Course, CourseCategory } from '../types';
import { Clock, BarChart, User, Tag, X, CheckCircle, FileText, Video, Link as LinkIcon, ExternalLink, BookOpen } from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, onClose, onEnroll }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        <div className="relative h-64 w-full flex-shrink-0 group">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
             <span className={`self-start px-3 py-1 text-xs font-bold rounded-full text-white mb-3 shadow-sm
                  ${course.category === CourseCategory.Science ? 'bg-blue-500' : 
                    course.category === CourseCategory.Technology ? 'bg-indigo-500' : 
                    course.category === CourseCategory.Engineering ? 'bg-orange-500' :
                    course.category === CourseCategory.Arts ? 'bg-pink-500' :
                    course.category === CourseCategory.Mathematics ? 'bg-teal-500' :
                    course.category === CourseCategory.Innovation ? 'bg-yellow-500' :
                    'bg-green-600'}`}>
                  {course.category}
            </span>
            <h2 className="text-3xl font-bold text-white shadow-sm leading-tight">{course.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <span className="block text-xs text-slate-400 uppercase font-semibold tracking-wider">Instructor</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{course.instructor}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <span className="block text-xs text-slate-400 uppercase font-semibold tracking-wider">Duration</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{course.durationHours} Hours</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-slate-400" />
              <div>
                 <span className="block text-xs text-slate-400 uppercase font-semibold tracking-wider">Level</span>
                 <span className="font-medium text-slate-900 dark:text-slate-100">{course.level}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">About this Course</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                This comprehensive course is designed to provide you with practical skills and theoretical knowledge essential for the modern industry. 
                You will engage in hands-on projects, collaborate with peers, and receive mentorship from industry experts at CLIC Ethiopia.
              </p>
            </div>
            
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  What you'll learn
                </h4>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Core concepts and advanced methodologies in {course.category}</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                         <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Practical application using industry-standard tools and workflows</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                         <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Problem-solving strategies for real-world scenarios</span>
                    </li>
                </ul>
            </div>

            {course.resources && course.resources.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Supplementary Materials
                </h3>
                <div className="grid gap-3">
                  {course.resources.map((resource, idx) => (
                    <a 
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        {resource.type === 'video' ? <Video className="w-5 h-5" /> : 
                         resource.type === 'document' ? <FileText className="w-5 h-5" /> : 
                         <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                         <h4 className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{resource.title}</h4>
                         <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-400 dark:text-slate-500">Ready to start learning?</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Join other students today.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:shadow-sm rounded-xl transition-all font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              Close
            </button>
            <button 
              onClick={() => onEnroll(course)}
              className="flex-1 sm:flex-none px-8 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;