
import React, { useState } from 'react';
import { AdminStats, Course, CourseCategory, Resource } from '../types';
import { Plus, Trash2, Users, BookOpen, GraduationCap, BarChart2, CheckCircle, Loader2, ArrowUpRight, Link as LinkIcon, Video, FileText, X } from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStats | null;
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, courses, onAddCourse, onDeleteCourse, isLoading }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    category: CourseCategory.Science,
    durationHours: 10,
    description: '',
    instructor: '',
    level: 'Beginner',
    thumbnail: 'https://picsum.photos/400/225?grayscale',
    resources: []
  });

  // Temp state for adding a resource
  const [tempResource, setTempResource] = useState<Resource>({
    title: '',
    url: '',
    type: 'link'
  });

  const categories = Object.values(CourseCategory);

  const handleAddResource = () => {
    if (tempResource.title && tempResource.url) {
      setNewCourse(prev => ({
        ...prev,
        resources: [...(prev.resources || []), tempResource]
      }));
      setTempResource({ title: '', url: '', type: 'link' });
    }
  };

  const handleRemoveResource = (index: number) => {
    setNewCourse(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index)
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
        resources: []
      });
      setTempResource({ title: '', url: '', type: 'link' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-scale-in">
              <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Add New Course</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.title}
                      onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.instructor}
                      onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.category}
                      onChange={e => setNewCourse({...newCourse, category: e.target.value as CourseCategory})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.level}
                      onChange={e => setNewCourse({...newCourse, level: e.target.value as any})}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Hours)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.durationHours}
                      onChange={e => setNewCourse({...newCourse, durationHours: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail URL</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      value={newCourse.thumbnail}
                      onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 h-24"
                    value={newCourse.description}
                    onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  />
                </div>

                {/* Supplementary Materials Section */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">Supplementary Materials (Optional)</label>
                  
                  {/* Added Resources List */}
                  {newCourse.resources && newCourse.resources.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {newCourse.resources.map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-100 dark:border-slate-700">
                           <div className="flex items-center gap-2">
                             {res.type === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : 
                              res.type === 'document' ? <FileText className="w-4 h-4 text-orange-500" /> : 
                              <LinkIcon className="w-4 h-4 text-green-500" />}
                             <span className="font-medium text-slate-700 dark:text-slate-200">{res.title}</span>
                             <span className="text-xs text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2 ml-2 truncate max-w-[150px]">{res.url}</span>
                           </div>
                           <button 
                            type="button" 
                            onClick={() => handleRemoveResource(idx)} 
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                           >
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Resource Input */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                     <div className="md:col-span-4">
                        <input 
                          type="text" 
                          placeholder="Title (e.g. Intro Video)"
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          value={tempResource.title}
                          onChange={e => setTempResource({...tempResource, title: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-5">
                        <input 
                          type="text" 
                          placeholder="URL (https://...)"
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          value={tempResource.url}
                          onChange={e => setTempResource({...tempResource, url: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2">
                        <select
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          value={tempResource.type}
                          onChange={e => setTempResource({...tempResource, type: e.target.value as any})}
                        >
                          <option value="link">Website</option>
                          <option value="video">Video</option>
                          <option value="document">PDF/Doc</option>
                        </select>
                     </div>
                     <div className="md:col-span-1">
                        <button 
                          type="button" 
                          onClick={handleAddResource}
                          disabled={!tempResource.title || !tempResource.url}
                          className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Save Course
                  </button>
                </div>
              </form>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                           ${course.category === CourseCategory.Science ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                             course.category === CourseCategory.Technology ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                             course.category === CourseCategory.Engineering ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                             course.category === CourseCategory.Arts ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' :
                             course.category === CourseCategory.Mathematics ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' :
                             course.category === CourseCategory.Innovation ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                             'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                           }
                        `}>
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
            {courses.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No courses available. Add one above.
              </div>
            )}
          </div>
        </div>

        {/* Course Statistics */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <BarChart2 className="w-5 h-5" />
             Course Analytics
           </h3>
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Course</span>
                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
             </div>
             <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {stats?.coursePerformance.map(cp => (
                   <div key={cp.courseId} className="p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1 flex-1 pr-2">{cp.title}</h4>
                         <a href="#" className="text-slate-400 hover:text-blue-500"><ArrowUpRight className="w-3 h-3" /></a>
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

                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                         <div 
                           className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" 
                           style={{ width: cp.enrolledCount > 0 ? `${(cp.completedCount / cp.enrolledCount) * 100}%` : '0%' }}
                         ></div>
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
               Are you sure you want to remove this course? This action cannot be undone and will affect student enrollments.
             </p>
             <div className="flex justify-end gap-3">
               <button 
                 onClick={() => setDeleteId(null)}
                 className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
               >
                 Cancel
               </button>
               <button 
                 onClick={async () => {
                   await onDeleteCourse(deleteId);
                   setDeleteId(null);
                 }}
                 className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
               >
                 Delete
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
