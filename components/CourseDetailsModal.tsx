
import React from 'react';
import { Course, CourseCategory } from '../types';
import { Clock, BarChart, User, Tag, X, CheckCircle, FileText, Video, Link as LinkIcon, ExternalLink, BookOpen, Layers, List, GraduationCap } from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, onClose, onEnroll }) => {
  
  // Dynamic content generation to ensure sections are populated
  const learningPoints = [
    `Comprehensive understanding of ${course.title} fundamentals`,
    `Hands-on experience with ${course.category} tools and workflows`,
    `Real-world problem solving methodologies used in industry`,
    `Project-based learning culminating in a portfolio piece`
  ];

  const prerequisites = course.level === 'Beginner' 
    ? ["No prior experience required", "Basic computer literacy", "A curiosity for STEAM subjects"]
    : ["Completion of introductory modules", "Familiarity with basic terminology", "Access to a computer with internet"];

  // Ensure resources array exists, or provide defaults so the section is always visible
  const displayResources = course.resources && course.resources.length > 0 ? course.resources : [
    { title: "Course Syllabus", url: "#", type: "document" },
    { title: "Glossary of Terms", url: "#", type: "document" },
    { title: "Community Forum", url: "#", type: "link" }
  ];

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

          <div className="space-y-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                About this Course
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                This comprehensive course is designed to provide you with practical skills and theoretical knowledge essential for the modern industry. 
                You will engage in hands-on projects, collaborate with peers, and receive mentorship from industry experts at CLIC Ethiopia.
              </p>
            </div>
            
            {/* What you'll learn (Enhanced) */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  What you'll learn
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                      </li>
                    ))}
                </ul>
            </div>

            {/* NEW SECTION: Course Curriculum / Structure */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-indigo-500" />
                 Course Curriculum
              </h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                 <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">1</span>
                       <span className="font-medium text-slate-700 dark:text-slate-200">Introduction & Foundations</span>
                    </div>
                    <span className="text-xs text-slate-400">1h 30m</span>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">2</span>
                       <span className="font-medium text-slate-700 dark:text-slate-200">Core Concepts & Theory</span>
                    </div>
                    <span className="text-xs text-slate-400">2h 15m</span>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">3</span>
                       <span className="font-medium text-slate-700 dark:text-slate-200">Applied Lab & Practical</span>
                    </div>
                    <span className="text-xs text-slate-400">3h 00m</span>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">4</span>
                       <span className="font-medium text-slate-700 dark:text-slate-200">Final Assessment</span>
                    </div>
                    <span className="text-xs text-slate-400">45m</span>
                 </div>
              </div>
            </div>

            {/* NEW SECTION: Prerequisites */}
            <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <List className="w-5 h-5 text-orange-500" />
                 Prerequisites
               </h3>
               <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-sm pl-2">
                  {prerequisites.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
               </ul>
            </div>

            {/* Supplementary Materials (Always show, use defaults if missing) */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Supplementary Materials
              </h3>
              <div className="grid gap-3">
                {displayResources.map((resource: any, idx: number) => (
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

            {/* NEW SECTION: Certification Info */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-orange-100 dark:border-orange-900/30">
               <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                  <GraduationCap className="w-6 h-6 text-orange-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Earn a Certificate</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Complete all modules and the final project to receive a verified certificate from FadLab & CLIC Ethiopia, which can be shared on your professional profile.
                  </p>
               </div>
            </div>

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
