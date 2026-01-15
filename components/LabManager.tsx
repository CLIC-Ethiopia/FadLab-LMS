
import React, { useState, useEffect } from 'react';
import { Lab, Student, Enrollment } from '../types';
import { sheetService } from '../services/sheetService';
import { Hammer, Monitor, Sprout, Briefcase, ChevronRight, Loader2, MapPin, Users } from 'lucide-react';
import LabDetail from './LabDetail';

interface LabManagerProps {
  user: Student;
  enrollments: Enrollment[];
}

const LabManager: React.FC<LabManagerProps> = ({ user, enrollments }) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      try {
        const data = await sheetService.getLabs();
        setLabs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Hammer': return <Hammer className="w-8 h-8" />;
      case 'Monitor': return <Monitor className="w-8 h-8" />;
      case 'Sprout': return <Sprout className="w-8 h-8" />;
      case 'Briefcase': return <Briefcase className="w-8 h-8" />;
      default: return <Hammer className="w-8 h-8" />;
    }
  };

  const getGradient = (type: string) => {
    switch(type) {
      case 'Fabrication': return 'from-orange-500 to-red-500';
      case 'Digital': return 'from-blue-500 to-indigo-500';
      case 'Field': return 'from-green-500 to-teal-500';
      case 'Business': return 'from-purple-500 to-pink-500';
      default: return 'from-slate-500 to-slate-700';
    }
  };

  if (selectedLab) {
    return <LabDetail lab={selectedLab} user={user} enrollments={enrollments} onBack={() => setSelectedLab(null)} />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
       <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10">
           <h1 className="text-4xl font-bold mb-4">Lab Resource Manager</h1>
           <p className="text-slate-300 max-w-xl text-lg">
             Bridge the physical and digital. Reserve high-tech equipment, download fabrication files, and access the tools you need to build the future.
           </p>
         </div>
       </div>

       {loading ? (
         <div className="flex justify-center py-20">
           <Loader2 className="w-8 h-8 animate-spin text-slate-300 dark:text-slate-600" />
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {labs.map(lab => (
             <button
               key={lab.id}
               onClick={() => setSelectedLab(lab)}
               className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 text-left h-64 flex flex-col"
             >
               <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getGradient(lab.type)}`}></div>
               
               <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${getGradient(lab.type)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {getIcon(lab.icon)}
                     </div>
                     <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{lab.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mb-auto">
                    {lab.description}
                  </p>

                  <div className="mt-6 flex gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                     <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Cap: {lab.capacity}</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{lab.location}</span>
                     </div>
                  </div>
               </div>
             </button>
           ))}
         </div>
       )}
    </div>
  );
};

export default LabManager;
