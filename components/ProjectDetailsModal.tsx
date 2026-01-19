
import React from 'react';
import { Project, CourseCategory } from '../types';
import { X, Calendar, User, Tag, Github, ExternalLink, FileText, Cpu, CheckCircle, Lightbulb, Target, Download, BookOpen } from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  
  // Helper to generate a category color
  const getCategoryColor = (cat: CourseCategory) => {
    switch(cat) {
        case CourseCategory.Science: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
        case CourseCategory.Technology: return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30';
        case CourseCategory.Engineering: return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
        case CourseCategory.Arts: return 'text-pink-500 bg-pink-100 dark:bg-pink-900/30';
        case CourseCategory.Mathematics: return 'text-teal-500 bg-teal-100 dark:bg-teal-900/30';
        case CourseCategory.Innovation: return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
        default: return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    }
  };

  const categoryStyle = getCategoryColor(project.category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header / Hero */}
        <div className="relative h-48 md:h-64 flex-shrink-0">
           <img 
             src={project.thumbnail} 
             alt={project.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
           
           <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={onClose}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
           </div>

           <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                 <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20`}>
                    {project.category}
                 </span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${project.status === 'Launched' ? 'bg-green-500 text-white' : 
                      project.status === 'Prototype' ? 'bg-purple-500 text-white' : 'bg-slate-500 text-white'}
                 `}>
                    Status: {project.status}
                 </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white shadow-sm leading-tight">{project.title}</h2>
           </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
           
           {/* Main Report Area */}
           <div className="flex-1 p-8 space-y-8">
              
              {/* Abstract */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Project Abstract
                 </h3>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                    {project.description}
                 </p>
              </div>

              {/* Technical Implementation */}
              <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    Technical Stack & Tools
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                       <span key={tag} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                          #{tag}
                       </span>
                    ))}
                 </div>
              </div>

              {/* Project Log / Process (Simulated for this view) */}
              <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-6 space-y-8">
                 <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                       <Lightbulb className="w-4 h-4 text-yellow-500" /> Ideation Phase
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                       Problem identification and initial concept sketches. Exploring feasible solutions within local constraints.
                    </p>
                 </div>
                 <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                       <Target className="w-4 h-4 text-blue-500" /> Development & Prototyping
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                       Iterative building process. Testing core assumptions and refining the design based on user feedback.
                    </p>
                 </div>
                 {project.status === 'Launched' && (
                    <div className="relative">
                       <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
                       <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" /> Deployment
                       </h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400">
                          Final release and impact assessment. The solution is now active in the field.
                       </p>
                    </div>
                 )}
              </div>

           </div>

           {/* Sidebar Meta Data */}
           <div className="w-full md:w-80 bg-white dark:bg-slate-900 p-8 border-l border-slate-200 dark:border-slate-800 space-y-8">
              
              {/* Author */}
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Project Author</h4>
                 <div className="flex items-center gap-3">
                    <img src={project.authorAvatar} alt={project.authorName} className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                    <div>
                       <p className="font-bold text-slate-800 dark:text-white">{project.authorName}</p>
                       <p className="text-xs text-slate-500">Student Researcher</p>
                    </div>
                 </div>
              </div>

              {/* Meta Stats */}
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Meta Data</h4>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Published</span>
                       <span className="font-medium text-slate-800 dark:text-slate-200">{project.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Field</span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${categoryStyle}`}>
                          {project.category}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Resources Links */}
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Project Resources</h4>
                 <div className="space-y-3">
                    
                    {/* 1. Live Demo */}
                    {project.demoUrl ? (
                       <a 
                         href={project.demoUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                             <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-800 dark:text-white text-sm">Live Demo</span>
                             <span className="text-xs text-slate-500">Launch Project</span>
                          </div>
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed">
                          <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-md">
                             <ExternalLink className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-600 dark:text-slate-400 text-sm">Live Demo</span>
                             <span className="text-xs text-slate-400">Not Available</span>
                          </div>
                       </div>
                    )}

                    {/* 2. Blog Post */}
                    {project.blogUrl ? (
                       <a 
                         href={project.blogUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                             <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-800 dark:text-white text-sm">Read Article</span>
                             <span className="text-xs text-slate-500">Blog Post</span>
                          </div>
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed">
                          <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-md">
                             <BookOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-600 dark:text-slate-400 text-sm">Read Article</span>
                             <span className="text-xs text-slate-400">Not Available</span>
                          </div>
                       </div>
                    )}

                    {/* 3. Download Doc */}
                    {project.docsUrl ? (
                       <a 
                         href={project.docsUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                             <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-800 dark:text-white text-sm">Documentation</span>
                             <span className="text-xs text-slate-500">Download PDF</span>
                          </div>
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed">
                          <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-md">
                             <Download className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-600 dark:text-slate-400 text-sm">Documentation</span>
                             <span className="text-xs text-slate-400">Not Available</span>
                          </div>
                       </div>
                    )}

                    {/* 4. Source Code */}
                    {project.githubUrl ? (
                       <a 
                         href={project.githubUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                       >
                          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                             <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-800 dark:text-white text-sm">Source Code</span>
                             <span className="text-xs text-slate-500">View on GitHub</span>
                          </div>
                       </a>
                    ) : (
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-60 cursor-not-allowed">
                          <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-md">
                             <Github className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <span className="block font-bold text-slate-600 dark:text-slate-400 text-sm">Source Code</span>
                             <span className="text-xs text-slate-400">Not Available</span>
                          </div>
                       </div>
                    )}

                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
