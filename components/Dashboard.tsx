
import React, { useMemo } from 'react';
import { Student, Enrollment, Course, CourseCategory } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  LabelList
} from 'recharts';
import { Trophy, Clock, BookOpen, TrendingUp, Target, Calendar, ArrowRight, PlayCircle, Edit, BrainCircuit, Zap, ShieldCheck, Eye, Play } from 'lucide-react';
import RadarChartWidget from './RadarChartWidget';
import PipelineProgress from './PipelineProgress';

interface DashboardProps {
  student: Student;
  enrollments: Enrollment[];
  courses: Course[];
  leaderboard: Student[];
  onViewDetails: (course: Course) => void;
  onResumeLearning?: (course: Course) => void; 
  onEditGoal?: (course: Course) => void; 
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completed = payload[0].value;
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in">
        <p className="font-bold text-slate-800 dark:text-white mb-1">{label}</p>
        <div className="space-y-1 text-xs">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-slate-600 dark:text-slate-300">Progress:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completed}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomProgressBarBackground = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      rx={height / 2} 
      className="fill-slate-100 dark:fill-slate-800" 
    />
  );
};

const CustomProgressBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  const cx = x + width;
  const cy = y + height / 2;
  const radius = 14;

  return (
    <g>
      <defs>
        <linearGradient id="circleGradient" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor="#6366f1" />
           <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius} fill="url(#circleGradient)" />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="white" strokeWidth={2} className="dark:stroke-slate-900" />
      <text x={cx} y={cy} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold">
        {value}
      </text>
    </g>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ student, enrollments, courses, leaderboard, onViewDetails, onResumeLearning, onEditGoal }) => {
  
  // Advanced Stat Calculation for Radar and Pipeline
  const skillStats = useMemo(() => {
    const categories = Object.values(CourseCategory);
    const stats: Record<string, number> = {};
    categories.forEach(cat => stats[cat] = 0);

    enrollments.forEach(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      if (course) {
        const points = (enrollment.progress / 100) * (course.durationHours * 2);
        stats[course.category] += points;
      }
    });

    const radarData = categories.map(cat => ({
      category: cat.charAt(0),
      fullName: cat,
      value: Math.min(stats[cat], 100),
      fullMark: 100
    }));

    return { radarData, rawStats: stats };
  }, [enrollments, courses]);

  const masteryTitle = useMemo(() => {
    if (student.points > 2000) return "Master Innovator";
    if (student.points > 1000) return "Lead Engineer";
    if (student.points > 500) return "Industrial Technician";
    return "Campus Apprentice";
  }, [student.points]);

  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length) 
    : 0;

  const progressData = enrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId);
    return {
      name: course ? (course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title) : 'Unknown',
      completed: e.progress,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome & Industrial Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{student.name}</span>! 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              You are currently ranked <span className="font-bold text-slate-800 dark:text-slate-200">#{student.rank}</span> on the global leaderboards.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Rank Title</p>
                   <p className="text-sm font-bold text-indigo-700 dark:text-indigo-200 leading-none">{masteryTitle}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 rounded-2xl">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                   <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-none mb-1">Knowledge XP</p>
                   <p className="text-sm font-bold text-amber-700 dark:text-amber-200 leading-none">{student.points} Points</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Skill Radar
                 </h3>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <RadarChartWidget data={skillStats.radarData} />
           </div>
        </div>
      </div>

      <PipelineProgress stats={skillStats.rawStats} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'blue' },
          { label: 'In Progress', value: enrollments.filter(e => e.progress < 100).length, icon: Clock, color: 'orange' },
          { label: 'Completed', value: enrollments.filter(e => e.progress === 100).length, icon: Trophy, color: 'green' },
          { label: 'Avg. Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:scale-[1.02]">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 lg:col-span-2 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Curriculum</h3>
                <p className="text-sm text-slate-500">Your current path through the industrial framework.</p>
             </div>
             <span className="text-xs font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
               GLOBAL AVG: {avgProgress}%
             </span>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="completed" barSize={10} radius={[5, 5, 5, 5]} fill="#6366f1" background={<CustomProgressBarBackground />} animationDuration={1000}>
                   <LabelList dataKey="completed" content={<CustomProgressBarLabel />} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Innovation Leaderboard</h3>
          <div className="space-y-5">
            {leaderboard.slice(0, 5).map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all group-hover:scale-110
                    ${idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-500 ring-2 ring-amber-500/20' : 
                      'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{s.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.points} XP</span>
                  </div>
                </div>
                {idx === 0 && <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              View Comprehensive Rankings
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Study Map Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-500" />
                Strategic Study Map
              </h3>
              <p className="text-slate-500">Manage your industrial research milestones.</p>
           </div>
           <div className="h-px bg-slate-100 dark:bg-slate-800 flex-grow mx-6 hidden md:block"></div>
        </div>
        
        {enrollments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 group">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-600 dark:text-slate-400">No active research paths identified.</p>
            <p className="text-sm text-slate-400 mt-2">Browse the catalog and set your first study goal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => {
              const course = courses.find(c => c.id === enrollment.courseId);
              if (!course) return null;
              
              const targetDateObj = new Date(enrollment.targetCompletionDate);
              const startDateObj = new Date(enrollment.startDate);
              const today = new Date();
              
              const hasValidTarget = !isNaN(targetDateObj.getTime());
              const hasValidStart = !isNaN(startDateObj.getTime());
              
              let statusText = "Ready to Begin";
              let statusColor = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
              
              if (hasValidStart && hasValidTarget) {
                 if (today < startDateObj) {
                    const diffDays = Math.ceil(Math.abs(startDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); 
                    statusText = `T-MINUS ${diffDays} DAYS`;
                    statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
                 } else {
                    const daysLeft = Math.ceil((targetDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysLeft < 0) {
                        statusText = "SCHEDULE OVERDUE";
                        statusColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
                    } else {
                        statusText = `${daysLeft} DAYS TO DEADLINE`;
                        statusColor = daysLeft <= 7 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30" : "bg-green-100 text-green-700 dark:bg-green-900/30";
                    }
                 }
              }

              return (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${
                    course.category === 'Science' ? 'from-blue-500 to-indigo-600' : 
                    course.category === 'Technology' ? 'from-indigo-500 to-purple-600' : 
                    course.category === 'Engineering' ? 'from-orange-500 to-red-600' : 
                    'from-slate-500 to-slate-700'
                  }`}></div>
                  
                  {/* Card Header */}
                  <div className="p-6 pb-0 flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                       <img src={course.thumbnail} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                         <ShieldCheck className="w-3 h-3 text-blue-500" />
                       </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-black text-slate-800 dark:text-white line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                          {course.title}
                        </h4>
                        <button onClick={(e) => { e.stopPropagation(); if (onEditGoal) onEditGoal(course); }} className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all flex-shrink-0">
                            <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 block">{course.category} SPECIALIZATION</span>
                    </div>
                  </div>

                  {/* Card Body - Synced Dates */}
                  <div className="p-6 pt-5 space-y-4 flex-grow">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            <span>Start Date</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {hasValidStart ? startDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending'}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            <span>Commitment</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{enrollment.plannedHoursPerWeek} HR/WK</p>
                       </div>
                    </div>

                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <Target className="w-3 h-3" />
                         <span>Target Completion</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                             {hasValidTarget ? targetDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                          <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
                            {statusText}
                          </div>
                       </div>
                    </div>

                    {/* Progress Visual */}
                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Phase Completion</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Always Visible Buttons */}
                  <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3 border-t border-slate-50 dark:border-slate-700/50 mt-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewDetails(course); }}
                      className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      DETAILS
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onResumeLearning) onResumeLearning(course); }}
                      className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      RESUME
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
