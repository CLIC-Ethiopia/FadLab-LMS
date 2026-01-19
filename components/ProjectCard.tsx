
import React from 'react';
import { Project, CourseCategory } from '../types';
import { Heart, BookOpen, Share2, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onRead?: (project: Project) => void;
  onShare?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onRead, onShare }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md text-white shadow-sm backdrop-blur-md
            ${project.category === CourseCategory.Science ? 'bg-blue-500/90' : 
              project.category === CourseCategory.Technology ? 'bg-indigo-500/90' : 
              project.category === CourseCategory.Engineering ? 'bg-orange-500/90' :
              project.category === CourseCategory.Arts ? 'bg-pink-500/90' :
              project.category === CourseCategory.Mathematics ? 'bg-teal-500/90' :
              project.category === CourseCategory.Innovation ? 'bg-yellow-500/90' :
              'bg-green-600/90'}`}>
            {project.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border
            ${project.status === 'Launched' 
              ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-200 dark:border-green-800' 
              : project.status === 'Prototype' 
                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/80 dark:text-purple-200 dark:border-purple-800'
                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700'
            }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
             {project.title}
           </h3>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto space-y-3">
           {/* Author Info */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <img 
                   src={project.authorAvatar} 
                   alt={project.authorName} 
                   className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700" 
                 />
                 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{project.authorName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                 <Heart className="w-3.5 h-3.5 fill-current" />
                 {project.likes}
              </div>
           </div>
           
           {/* Buttons: Read & Share */}
           <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); if(onRead) onRead(project); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Read Report
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); if(onShare) onShare(project); }}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Share Project"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
