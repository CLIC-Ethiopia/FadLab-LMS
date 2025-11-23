import React, { useState } from 'react';
import { Course, CourseCategory } from '../types';
import { Search, Clock, User, BarChart, Plus } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onViewDetails: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(CourseCategory)];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Course Catalog</h2>
          <p className="text-slate-500 dark:text-slate-400">Explore new skills in STEAM and Industrial Tech.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id} 
            className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group flex flex-col cursor-pointer"
            onClick={() => onViewDetails(course)}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm
                  ${course.category === CourseCategory.Science ? 'bg-blue-500' : 
                    course.category === CourseCategory.Technology ? 'bg-indigo-500' : 
                    course.category === CourseCategory.Engineering ? 'bg-orange-500' :
                    course.category === CourseCategory.Arts ? 'bg-pink-500' :
                    course.category === CourseCategory.Mathematics ? 'bg-teal-500' :
                    course.category === CourseCategory.Innovation ? 'bg-yellow-500' :
                    'bg-green-600'}`}>
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3 h-3" />
                  <span>{course.instructor}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{course.durationHours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <BarChart className="w-3 h-3" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course);
                    }}
                    className="flex items-center gap-1 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors z-10"
                  >
                    <Plus className="w-3 h-3" />
                    Plan Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 dark:text-slate-500">No courses found matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
            className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseList;