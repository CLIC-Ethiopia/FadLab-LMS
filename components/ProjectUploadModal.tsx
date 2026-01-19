
import React, { useState } from 'react';
import { CourseCategory, Project, Student } from '../types';
import { X, Upload, Loader2, Image as ImageIcon, Github, Globe, FileText, Download } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface ProjectUploadModalProps {
  user: Student;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CourseCategory.Innovation,
    status: 'Idea' as Project['status'],
    tags: '',
    thumbnail: '',
    githubUrl: '',
    demoUrl: '',
    blogUrl: '',
    docsUrl: ''
  });

  const categories = Object.values(CourseCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProject: Omit<Project, 'id' | 'timestamp'> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        thumbnail: formData.thumbnail || `https://picsum.photos/500/300?random=${Math.floor(Math.random() * 1000)}`,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        likes: 0,
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl,
        blogUrl: formData.blogUrl,
        docsUrl: formData.docsUrl
      };

      await sheetService.addProject(newProject);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
          <div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Submit New Project</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Share your STEAM innovation with the campus.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Solar Powered Water Pump"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as CourseCategory})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Status</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Idea">Idea Phase</option>
                  <option value="Prototype">Prototype Ready</option>
                  <option value="Launched">Fully Launched</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                required
                placeholder="Describe the problem, your solution, and the technology used..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. IoT, Agriculture, React, Python"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Media & Links</h4>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                       <ImageIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Image URL (Optional - leave empty for random)"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.thumbnail}
                      onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    />
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                       <Globe className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Live Demo URL (Optional)"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.demoUrl}
                      onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                    />
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                       <FileText className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Blog Post / Article URL (Optional)"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.blogUrl}
                      onChange={e => setFormData({...formData, blogUrl: e.target.value})}
                    />
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                       <Download className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Download Document / PDF URL (Optional)"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.docsUrl}
                      onChange={e => setFormData({...formData, docsUrl: e.target.value})}
                    />
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                       <Github className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="GitHub Repository URL (Optional)"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.githubUrl}
                      onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                    />
                 </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
             <button 
               type="submit"
               disabled={loading}
               className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               Publish Project
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectUploadModal;
