import React from 'react';
import { Student, Enrollment, Course } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Clock, BookOpen, TrendingUp } from 'lucide-react';

interface DashboardProps {
  student: Student;
  enrollments: Enrollment[];
  courses: Course[];
  leaderboard: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ student, enrollments, courses, leaderboard }) => {
  
  // Calculate stats
  const totalProgress = enrollments.reduce((acc, curr) => acc + curr.progress, 0);
  const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;
  const inProgressCount = enrollments.filter(e => e.progress < 100).length;
  const completedCount = enrollments.filter(e => e.progress === 100).length;

  // Prepare chart data for progress
  const progressData = enrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId);
    return {
      name: course ? course.title.substring(0, 15) + '...' : 'Unknown',
      progress: e.progress,
      color: e.progress === 100 ? '#43A047' : '#1E88E5'
    };
  });

  // Prepare leaderboard data
  const leaderboardData = leaderboard.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    points: s.points
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Welcome back, {student.name}! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">Here's what's happening with your STEAM learning journey.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Current Rank</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">#{student.rank} Leaderboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enrolled Courses</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{enrollments.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{inProgressCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Progress</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{avgProgress}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 lg:col-span-2 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Course Progress</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={20}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Top Students</h3>
          <div className="space-y-4">
            {leaderboard.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500' : 
                      idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                      idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-500' : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{s.points} XP</span>
                  </div>
                </div>
                {idx === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;