
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import StudyPlanner from './components/StudyPlanner';
import CourseDetailsModal from './components/CourseDetailsModal';
import CourseProgressModal from './components/CourseProgressModal';
import AdminDashboard from './components/AdminDashboard';
import ChatBot from './components/ChatBot';
import SteamIE from './components/SteamIE';
import SocialHub from './components/SocialHub';
import InnoLab from './components/InnoLab';
import LabManager from './components/LabManager';
import { sheetService } from './services/sheetService';
import { AuthState, Course, Enrollment, Student, AdminStats } from './types';
import { LayoutDashboard, BookOpen, Settings, LogOut, Loader2, Moon, Sun, User, Upload, ShieldCheck, RefreshCw, Lightbulb, Users, FlaskConical, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [currentView, setCurrentView] = useState<'dashboard' | 'courses' | 'settings' | 'admin' | 'steam-ie' | 'social' | 'inno-lab' | 'lab-manager'>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [leaderboard, setLeaderboard] = useState<Student[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  
  // Modal States
  const [plannerCourse, setPlannerCourse] = useState<Course | null>(null);
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);
  const [progressCourse, setProgressCourse] = useState<Course | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Initialize app data after login
  const fetchData = async (user: Student) => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [
        sheetService.getCourses(),
        sheetService.getStudentEnrollments(user.id),
        sheetService.getLeaderboard()
      ];

      // If admin, fetch admin stats
      if (user.role === 'admin') {
        promises.push(sheetService.getAdminStats());
      }

      const results = await Promise.all(promises);
      
      setCourses(results[0]);
      setEnrollments(results[1]);
      setLeaderboard(results[2]);
      
      if (user.role === 'admin' && results[3]) {
        setAdminStats(results[3]);
      }

    } catch (error) {
      console.error("Failed to fetch data from mock sheets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (student: Student) => {
    setAuth({ isAuthenticated: true, user: student });
    
    // Redirect admin to admin dashboard initially, else standard dashboard
    if (student.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
    fetchData(student);
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    setCurrentView('dashboard');
  };

  const handlePlanCourse = (course: Course) => {
    setPlannerCourse(course);
  };

  const handleViewDetails = (course: Course) => {
    setDetailsCourse(course);
  };
  
  const handleResumeLearning = (course: Course) => {
    setProgressCourse(course);
  };

  const handleEnrollFromDetails = (course: Course) => {
    setDetailsCourse(null);
    setPlannerCourse(course);
  };

  const handleSavePlan = async (courseId: string, plan: { hoursPerWeek: number, startDate: string, targetDate: string }) => {
    if (!auth.user) return;
    await sheetService.enrollStudent(auth.user.id, courseId, plan);
    
    // Refresh Data
    // 1. Refresh Enrollments (Progress)
    const newEnrollments = await sheetService.getStudentEnrollments(auth.user.id);
    setEnrollments(newEnrollments);

    // 2. Refresh User Profile (Study Plans) - This ensures Dashboard 'My Study Goals' updates immediately
    const updatedUser = await sheetService.getStudentProfile(auth.user.email);
    if (updatedUser) {
        // We spread the user object to create a new reference, triggering React re-render
        setAuth(prev => ({ ...prev, user: { ...updatedUser } }));
    }

    setCurrentView('dashboard'); // Redirect to dashboard to show progress
  };
  
  const handleUpdateProgress = async (courseId: string, progress: number) => {
    if (!auth.user) return;
    
    try {
      const updatedEnrollment = await sheetService.updateProgress(auth.user.id, courseId, progress);
      if (updatedEnrollment) {
        // Update local state immediately
        setEnrollments(prev => prev.map(e => e.courseId === courseId ? updatedEnrollment : e));
      }
    } catch (e) {
      console.error("Failed to update progress", e);
    }
  };

  const handleAvatarUpdate = async (newUrl: string) => {
    if (!auth.user) return;
    setLoading(true);
    try {
      await sheetService.updateStudentAvatar(auth.user.id, newUrl);
      setAuth(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, avatar: newUrl } : null
      }));
      setCustomAvatarUrl(''); // Reset input
    } catch (e) {
      console.error("Failed to update avatar", e);
    } finally {
      setLoading(false);
    }
  };

  // Demo functionality to toggle role, mainly for testing
  const handleSwitchRole = async () => {
    if (!auth.user) return;
    const newRole = auth.user.role === 'admin' ? 'student' : 'admin';
    const updatedUser: Student = { ...auth.user, role: newRole };
    
    setAuth({ ...auth, user: updatedUser });
    if (newRole === 'admin') {
        setCurrentView('admin');
        setLoading(true);
        // Fetch admin stats explicitly when switching to admin
        const stats = await sheetService.getAdminStats();
        setAdminStats(stats);
        setLoading(false);
    } else {
        setCurrentView('dashboard');
    }
  };

  // Admin Actions
  const handleAddCourse = async (newCourse: Omit<Course, 'id'>) => {
    if (!auth.user || auth.user.role !== 'admin') return;
    setLoading(true);
    try {
      await sheetService.addCourse(newCourse);
      // Refresh data
      const updatedCourses = await sheetService.getCourses();
      const updatedStats = await sheetService.getAdminStats();
      setCourses(updatedCourses);
      setAdminStats(updatedStats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!auth.user || auth.user.role !== 'admin') return;
    setLoading(true);
    try {
      await sheetService.deleteCourse(courseId);
      // Refresh data
      const updatedCourses = await sheetService.getCourses();
      const updatedStats = await sheetService.getAdminStats();
      setCourses(updatedCourses);
      setAdminStats(updatedStats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const presetAvatars = [
    'https://picsum.photos/200/200?random=50',
    'https://picsum.photos/200/200?random=51',
    'https://picsum.photos/200/200?random=52',
    'https://picsum.photos/200/200?random=53',
  ];

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col transition-colors duration-200">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg shadow-sm"></div>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">FadLab</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${auth.user?.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                    {auth.user?.role === 'admin' ? 'Administrator' : 'Student'}
                </span>
            </div>
          </div>

          <nav className="flex-grow p-4 space-y-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'dashboard' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button 
              onClick={() => setCurrentView('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'courses' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">All Courses</span>
            </button>

            <button 
              onClick={() => setCurrentView('inno-lab')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'inno-lab' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-5 h-5" />
              <span className="font-medium">Inno-Lab</span>
            </button>

            <button 
              onClick={() => setCurrentView('lab-manager')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'lab-manager' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="font-medium">Lab Resources</span>
            </button>

            <button 
              onClick={() => setCurrentView('social')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'social' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Social Hub</span>
            </button>

            <button 
              onClick={() => setCurrentView('steam-ie')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'steam-ie' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">STEAM-IE</span>
            </button>

            {auth.user?.role === 'admin' && (
              <button 
                onClick={() => setCurrentView('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === 'admin' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">Admin Panel</span>
              </button>
            )}

            <button 
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === 'settings' 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
             <button 
              onClick={handleSwitchRole}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              Switch Role (Demo)
            </button>

            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative">
          {/* Mobile Header */}
          <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-yellow-500 rounded-md"></div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100">FadLab</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setCurrentView(currentView === 'dashboard' ? 'courses' : 'dashboard')}>
                <LayoutDashboard className="text-slate-600 dark:text-slate-300 w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Sync Status Indicator */}
              <div className="flex justify-end mb-4">
                 <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                   {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                   {loading ? 'Syncing with Sheets...' : 'Connected to Google Sheets'}
                 </div>
              </div>

              {loading && !auth.user ? (
                <div className="flex h-96 items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300 dark:text-slate-600" />
                </div>
              ) : (
                <>
                  {currentView === 'dashboard' && auth.user && (
                    <Dashboard 
                      student={auth.user} 
                      enrollments={enrollments} 
                      courses={courses}
                      leaderboard={leaderboard}
                      onViewDetails={handleViewDetails}
                      onResumeLearning={handleResumeLearning}
                    />
                  )}
                  {currentView === 'courses' && (
                    <CourseList 
                      courses={courses} 
                      onSelectCourse={handlePlanCourse}
                      onViewDetails={handleViewDetails}
                    />
                  )}
                  {currentView === 'social' && (
                    <SocialHub />
                  )}
                  {currentView === 'inno-lab' && auth.user && (
                    <InnoLab user={auth.user} />
                  )}
                  {currentView === 'lab-manager' && auth.user && (
                    <LabManager user={auth.user} enrollments={enrollments} />
                  )}
                  {currentView === 'steam-ie' && (
                    <SteamIE />
                  )}
                  {currentView === 'admin' && auth.user?.role === 'admin' && (
                    <AdminDashboard 
                      stats={adminStats}
                      courses={courses}
                      onAddCourse={handleAddCourse}
                      onDeleteCourse={handleDeleteCourse}
                      isLoading={loading}
                    />
                  )}
                  {currentView === 'settings' && auth.user && (
                     <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                           <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                               <User className="w-6 h-6" />
                               Profile Settings
                           </h2>

                           <div className="flex flex-col items-center gap-6">
                               <div className="relative group">
                                   <div className="w-32 h-32 rounded-full p-1 border-4 border-slate-100 dark:border-slate-800 shadow-md bg-white dark:bg-slate-800">
                                      <img 
                                          src={auth.user.avatar} 
                                          alt={auth.user.name} 
                                          className="w-full h-full rounded-full object-cover"
                                      />
                                   </div>
                               </div>
                               
                               <div className="text-center">
                                   <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{auth.user.name}</h3>
                                   <p className="text-slate-500 dark:text-slate-400">{auth.user.email}</p>
                                   <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium capitalize">
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                      {auth.user.role === 'admin' ? 'System Administrator' : `Student Rank #${auth.user.rank}`}
                                   </div>
                               </div>

                               <div className="w-full pt-8 border-t border-slate-100 dark:border-slate-800">
                                   <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider text-center">Change Avatar</h4>
                                   
                                   <div className="grid grid-cols-4 gap-4 justify-items-center mb-6 max-w-sm mx-auto">
                                      {presetAvatars.map((url, index) => (
                                          <button 
                                            key={index} 
                                            onClick={() => handleAvatarUpdate(url)} 
                                            className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all transform hover:scale-110 ${auth.user?.avatar === url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-blue-400'}`}
                                          >
                                              <img src={url} alt={`Preset ${index}`} className="w-full h-full object-cover" />
                                          </button>
                                      ))}
                                   </div>

                                   <div className="flex gap-2 max-w-md mx-auto">
                                       <div className="relative flex-grow">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Upload className="h-4 w-4 text-slate-400" />
                                          </div>
                                          <input 
                                              type="text" 
                                              placeholder="Or paste an image URL..." 
                                              value={customAvatarUrl}
                                              onChange={(e) => setCustomAvatarUrl(e.target.value)}
                                              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                          />
                                       </div>
                                       <button 
                                            onClick={() => {
                                                if(customAvatarUrl) handleAvatarUpdate(customAvatarUrl);
                                            }}
                                            disabled={!customAvatarUrl}
                                            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                       >
                                           Update
                                       </button>
                                   </div>
                               </div>
                           </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                           <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                               <Settings className="w-6 h-6" />
                               App Preferences
                           </h2>
                           <div className="flex items-center justify-between">
                               <div>
                                   <p className="font-medium text-slate-800 dark:text-white">Theme Preference</p>
                                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Toggle between light and dark visual modes</p>
                               </div>
                               <button 
                                  onClick={toggleTheme}
                                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800"
                                >
                                   {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                   <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                           </div>
                           
                           <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                              <button 
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-2"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign out of account
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* AI ChatBot */}
          <ChatBot 
            courses={courses}
            user={auth.user}
            enrollments={enrollments}
            leaderboard={leaderboard}
          />
        </main>

        {detailsCourse && (
          <CourseDetailsModal 
            course={detailsCourse} 
            onClose={() => setDetailsCourse(null)}
            onEnroll={handleEnrollFromDetails}
          />
        )}

        {plannerCourse && (
          <StudyPlanner 
            course={plannerCourse} 
            onClose={() => setPlannerCourse(null)} 
            onSave={handleSavePlan} 
          />
        )}
        
        {progressCourse && (
          <CourseProgressModal 
             course={progressCourse}
             enrollment={enrollments.find(e => e.courseId === progressCourse.id) || {
                studentId: auth.user?.id || '',
                courseId: progressCourse.id,
                progress: 0,
                plannedHoursPerWeek: 0,
                startDate: '',
                targetCompletionDate: ''
             }}
             onClose={() => setProgressCourse(null)}
             onUpdateProgress={handleUpdateProgress}
          />
        )}
      </div>
    </HashRouter>
  );
};

export default App;