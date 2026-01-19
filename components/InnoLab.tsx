
import React, { useState, useEffect } from 'react';
import { Project, Student, CourseCategory } from '../types';
import { sheetService } from '../services/sheetService';
import ProjectCard from './ProjectCard';
import ProjectUploadModal from './ProjectUploadModal';
import ProjectDetailsModal from './ProjectDetailsModal'; // New Import
import { Plus, Search, Filter, Rocket, Loader2, FlaskConical } from 'lucide-react';

interface InnoLabProps {
  user: Student;
}

const InnoLab: React.FC<InnoLabProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // State for Read Modal
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await sheetService.getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = ['All', ...Object.values(CourseCategory)];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRead = (project: Project) => {
    setSelectedProject(project);
  };

  const handleShare = async (project: Project) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FadLab Project: ${project.title}`,
          text: `Check out this amazing project by ${project.authorName}: ${project.description}`,
          url: window.location.href // Ideally, a deep link to the project
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${project.title} by ${project.authorName}\n${project.description}`);
      alert("Project info copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-widest mb-4 text-indigo-300">
                <FlaskConical className="w-4 h-4" />
                The Innovation Laboratory
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Build, Share, & Collaborate
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Welcome to the FadLab digital makerspace. Explore projects from your peers, showcase your own prototypes, and find collaborators for your next big idea.
              </p>
            </div>
            
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              Upload Project
            </button>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 sticky top-0 z-20 py-4 bg-slate-50 dark:bg-slate-950/95 backdrop-blur-sm transition-colors">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setFilterCategory(cat)}
               className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border
                 ${filterCategory === cat 
                   ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800'
                 }`}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="relative w-full lg:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search projects or tags..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
           />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300 dark:text-slate-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onRead={handleRead}
              onShare={handleShare}
            />
          ))}
          
          {/* Empty State Call to Action */}
          <div 
             onClick={() => setShowUploadModal(true)}
             className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group min-h-[350px]"
          >
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500" />
             </div>
             <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Have an idea?</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
               Share your work with the community and get feedback from peers and mentors.
             </p>
          </div>
        </div>
      )}

      {showUploadModal && (
        <ProjectUploadModal 
          user={user} 
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchProjects}
        />
      )}

      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default InnoLab;
