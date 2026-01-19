
import React, { useState } from 'react';
import { AdminStats, Course, CourseCategory, Resource, CourseModule } from '../types';
import { Plus, Trash2, Users, BookOpen, GraduationCap, BarChart2, CheckCircle, Loader2, RefreshCw, Link as LinkIcon, Video, FileText, X, Layers, List, Tag } from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStats | null;
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  onRefreshStats: () => Promise<void>;
  isLoading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, courses, onAddCourse, onDeleteCourse, onRefreshStats, isLoading }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'curriculum'>('basic');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    category: CourseCategory.Science,
    durationHours: 10,
    description: '',
    instructor: '',
    level: 'Beginner',
    thumbnail: 'https://picsum.photos/400/225?grayscale',
    videoUrl: '',
    resources: [],
    learningPoints: [],
    prerequisites: [],
    curriculum: []
  });

  // Inputs for list items
  const [tempResource, setTempResource] = useState<Resource>({ title: '', url: '', type: 'link' });
  const [tempPoint, setTempPoint] = useState('');
  const [tempPrereq, setTempPrereq] = useState('');
  const [tempModule, setTempModule] = useState<CourseModule>({ title: '', duration: '', content: '' });

  const categories = Object.values(CourseCategory);

  // -- HANDLERS --

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshStats();
    setIsRefreshing(false);
  };

  const handleAddResource = () => {
    if (tempResource.title && tempResource.url) {
      setNewCourse(prev => ({
        ...prev,
        resources: [...(prev.resources || []), tempResource]
      }));
      setTempResource({ title: '', url: '', type: 'link' });
    }
  };

  const handleAddPoint = () => {
    if (tempPoint.trim()) {
      setNewCourse(prev => ({ ...prev, learningPoints: [...(prev.learningPoints || []), tempPoint] }));
      setTempPoint('');
    }
  };

  const handleAddPrereq = () => {
    if (tempPrereq.trim()) {
      setNewCourse(prev => ({ ...prev, prerequisites: [...(prev.prerequisites || []), tempPrereq] }));
      setTempPrereq('');
    }
  };

  const handleAddModule = () => {
    if (tempModule.title && tempModule.duration) {
      setNewCourse(prev => ({ ...prev, curriculum: [...(prev.curriculum || []), tempModule] }));
      setTempModule({ title: '', duration: '', content: '' });
    }
  };

  const removeItem = (key: keyof Course, index: number) => {
    setNewCourse(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.title && newCourse.instructor && newCourse.description) {
      await onAddCourse(newCourse as Omit<Course, 'id'>);
      setIsAdding(false);
      // Reset form
      setNewCourse({
        title: '',
        category: CourseCategory.Science,
        durationHours: 10,
        description: '',
        instructor: '',
        level: 'Beginner',
        thumbnail: 'https://picsum.photos/400/225?grayscale',
        videoUrl: '',
        resources: [],
        learningPoints: [],
        prerequisites: [],
        curriculum: []
      });
      setActiveTab('basic');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>
               <button 
                 onClick={handleManualRefresh}
                 disabled={isRefreshing || isLoading}
                 className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                 title="Refresh Stats"
               >
                 <RefreshCw className={`w-4 h-4 ${isRefreshing || isLoading ? 'animate-spin text-blue-500' : ''}`} />
               </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Manage courses and view platform statistics.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Courses</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalCourses || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Students</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalStudents || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Enrollments</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalEnrollments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Course Management</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
            >
              {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Course</>}
            </button>
          </div>

          {isAdding && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-scale-in overflow-hidden">
               {/* Tab Navigation */}
               <div className="flex border-b border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setActiveTab('basic')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'basic' ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    1. Basic Info
                  </button>
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'details' ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    2. Details & Requirements
                  </button>
                  <button 
                    onClick={() => setActiveTab('curriculum')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'curriculum' ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    3. Curriculum & Resources
                  </button>
               </div>

               <div className="p-6">
                  {/* TAB 1: BASIC INFO */}
                  {activeTab === 'basic' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                          <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</label>
                          <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value as CourseCategory})}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value as any})}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Hours)</label>
                          <input required type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.durationHours} onChange={e => setNewCourse({...newCourse, durationHours: parseInt(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Intro Video URL</label>
                          <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            value={newCourse.videoUrl} onChange={e => setNewCourse({...newCourse, videoUrl: e.target.value})} />
                        </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail URL</label>
                         <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                           value={newCourse.thumbnail} onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea required className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-24"
                          value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                      </div>
                      <div className="flex justify-end pt-4">
                         <button onClick={() => setActiveTab('details')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Next: Details
                         </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DETAILS (Learning Points & Prereqs) */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                       {/* Learning Points */}
                       <div>
                          <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                             <Tag className="w-4 h-4" /> What will they learn?
                          </label>
                          <div className="space-y-2 mb-3">
                             {newCourse.learningPoints?.map((pt, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                                   <span className="text-slate-700 dark:text-slate-300">{pt}</span>
                                   <button onClick={() => removeItem('learningPoints', idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                </div>
                             ))}
                          </div>
                          <div className="flex gap-2">
                             <input type="text" placeholder="Add learning outcome..." className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm dark:text-white"
                                value={tempPoint} onChange={e => setTempPoint(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddPoint()} />
                             <button onClick={handleAddPoint} className="px-3 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><Plus className="w-4 h-4" /></button>
                          </div>
                       </div>

                       {/* Prerequisites */}
                       <div>
                          <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                             <List className="w-4 h-4" /> Prerequisites
                          </label>
                          <div className="space-y-2 mb-3">
                             {newCourse.prerequisites?.map((pt, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                                   <span className="text-slate-700 dark:text-slate-300">{pt}</span>
                                   <button onClick={() => removeItem('prerequisites', idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                </div>
                             ))}
                          </div>
                          <div className="flex gap-2">
                             <input type="text" placeholder="Add prerequisite..." className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm dark:text-white"
                                value={tempPrereq} onChange={e => setTempPrereq(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddPrereq()} />
                             <button onClick={handleAddPrereq} className="px-3 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><Plus className="w-4 h-4" /></button>
                          </div>
                       </div>

                       <div className="flex justify-between pt-4">
                          <button onClick={() => setActiveTab('basic')} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Back</button>
                          <button onClick={() => setActiveTab('curriculum')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Next: Curriculum</button>
                       </div>
                    </div>
                  )}

                  {/* TAB 3: CURRICULUM & RESOURCES */}
                  {activeTab === 'curriculum' && (
                     <div className="space-y-6">
                        {/* Curriculum Modules */}
                        <div>
                           <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                              <Layers className="w-4 h-4" /> Curriculum Modules
                           </label>
                           <div className="space-y-3 mb-4">
                              {newCourse.curriculum?.map((mod, idx) => (
                                 <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                       <div>
                                          <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">{idx+1}. {mod.title}</h5>
                                          <p className="text-xs text-slate-500">{mod.duration} • {mod.content}</p>
                                       </div>
                                       <button onClick={() => removeItem('curriculum', idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                              <div className="flex gap-2 mb-2">
                                 <input type="text" placeholder="Module Title" className="flex-grow px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white"
                                    value={tempModule.title} onChange={e => setTempModule({...tempModule, title: e.target.value})} />
                                 <input type="text" placeholder="Duration (e.g. 2h)" className="w-24 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white"
                                    value={tempModule.duration} onChange={e => setTempModule({...tempModule, duration: e.target.value})} />
                              </div>
                              <input type="text" placeholder="Description/Content" className="w-full px-3 py-1.5 mb-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm dark:text-white"
                                    value={tempModule.content} onChange={e => setTempModule({...tempModule, content: e.target.value})} />
                              <button onClick={handleAddModule} className="w-full py-1.5 bg-slate-200 dark:bg-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-300 dark:hover:bg-slate-600">Add Module</button>
                           </div>
                        </div>

                        {/* Resources */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                           <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">Supplementary Materials</label>
                           <div className="space-y-2 mb-4">
                              {newCourse.resources?.map((res, idx) => (
                                 <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                       <span className="font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{res.title}</span>
                                       <span className="text-xs text-slate-400 truncate">{res.url}</span>
                                    </div>
                                    <button onClick={() => removeItem('resources', idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                 </div>
                              ))}
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                              <div className="md:col-span-4"><input type="text" placeholder="Title" className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" value={tempResource.title} onChange={e => setTempResource({...tempResource, title: e.target.value})} /></div>
                              <div className="md:col-span-5"><input type="text" placeholder="URL" className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" value={tempResource.url} onChange={e => setTempResource({...tempResource, url: e.target.value})} /></div>
                              <div className="md:col-span-2"><select className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" value={tempResource.type} onChange={e => setTempResource({...tempResource, type: e.target.value as any})}><option value="link">Link</option><option value="video">Video</option><option value="document">Doc</option></select></div>
                              <div className="md:col-span-1"><button onClick={handleAddResource} className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300"><Plus className="w-4 h-4" /></button></div>
                           </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                           <button onClick={() => setActiveTab('details')} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Back</button>
                           <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              Save & Publish
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{course.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{course.instructor}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setDeleteId(course.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Statistics (Right Column) */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <BarChart2 className="w-5 h-5" />
             Analytics
           </h3>
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Course Performance</span>
             </div>
             <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {stats?.coursePerformance.map(cp => (
                   <div key={cp.courseId} className="p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1 flex-1 pr-2">{cp.title}</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                         <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 rounded">
                            <span className="block font-bold text-lg">{cp.enrolledCount}</span>
                            <span>Registered</span>
                         </div>
                         <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-2 rounded">
                            <span className="block font-bold text-lg">{cp.completedCount}</span>
                            <span>Completed</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           </div>
        </div>

      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-sm w-full shadow-2xl animate-scale-in">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Confirm Delete</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
               Are you sure you want to remove this course? This action cannot be undone.
             </p>
             <div className="flex justify-end gap-3">
               <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">Cancel</button>
               <button onClick={async () => { await onDeleteCourse(deleteId); setDeleteId(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
