
import React, { useState, useEffect } from 'react';
import { Lab, Asset, DigitalAsset, Student, Enrollment, Course } from '../types';
import { sheetService } from '../services/sheetService';
import { ArrowLeft, Tool, Download, Lock, Calendar, CheckCircle, Search, FileCode, Box } from 'lucide-react';
import AssetBookingModal from './AssetBookingModal';

interface LabDetailProps {
  lab: Lab;
  user: Student;
  enrollments: Enrollment[];
  onBack: () => void;
}

const LabDetail: React.FC<LabDetailProps> = ({ lab, user, enrollments, onBack }) => {
  const [activeTab, setActiveTab] = useState<'Physical' | 'Digital'>('Physical');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [aData, dData] = await Promise.all([
        sheetService.getAssets(lab.id),
        sheetService.getDigitalAssets(lab.id)
      ]);
      setAssets(aData);
      setDigitalAssets(dData);
      setLoading(false);
    };
    fetchData();
  }, [lab.id]);

  const checkCertification = (asset: Asset): boolean => {
    if (!asset.certificationRequired) return true;
    // Check if user has enrolled in the required course
    const enrollment = enrollments.find(e => e.courseId === asset.certificationRequired);
    // Simple logic: Must be enrolled (and ideally completed, but for demo just enrolled is fine or progress > 80)
    return enrollment ? enrollment.progress >= 80 : false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Lab Map
      </button>

      {/* Lab Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{lab.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">{lab.description}</p>
            <div className="flex gap-4 mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
               <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  📍 {lab.location}
               </span>
               <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  👥 Capacity: {lab.capacity}
               </span>
            </div>
         </div>
         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('Physical')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Physical' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Physical Equipment
            </button>
            <button 
              onClick={() => setActiveTab('Digital')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Digital' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Digital Repository
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
         {activeTab === 'Physical' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {assets.map(asset => {
               const isCertified = checkCertification(asset);
               return (
                 <div key={asset.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                       <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                       <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm
                          ${asset.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/80 dark:text-green-300' : 
                            asset.status === 'Maintenance' ? 'bg-red-100 text-red-700 dark:bg-red-900/80 dark:text-red-300' :
                            'bg-orange-100 text-orange-700 dark:bg-orange-900/80 dark:text-orange-300'
                          }`}>
                          {asset.status}
                       </div>
                    </div>
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h3 className="font-bold text-slate-800 dark:text-white">{asset.name}</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400">{asset.model}</p>
                          </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          {isCertified ? (
                             <button 
                               disabled={asset.status !== 'Available'}
                               onClick={() => setSelectedAsset(asset)}
                               className="w-full py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                             >
                               <Calendar className="w-4 h-4" />
                               {asset.status === 'Available' ? 'Book Now' : 'Unavailable'}
                             </button>
                          ) : (
                             <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg flex items-start gap-3">
                                <Lock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div>
                                   <p className="text-xs font-bold text-orange-700 dark:text-orange-300">Certification Required</p>
                                   <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                      Complete the safety course to unlock this equipment.
                                   </p>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search files, models, code..." 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-300 transition-colors">
                    Upload Asset
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                       <tr>
                          <th className="px-6 py-3 rounded-l-lg">Name</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Author</th>
                          <th className="px-6 py-3">Downloads</th>
                          <th className="px-6 py-3 rounded-r-lg text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {digitalAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                      {asset.type === 'Model' ? <Box className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                                   </div>
                                   <div>
                                      <p className="font-bold text-slate-800 dark:text-slate-200">{asset.title}</p>
                                      <p className="text-xs text-slate-500">{asset.size}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                                   {asset.type}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.authorName}</td>
                             <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.downloads}</td>
                             <td className="px-6 py-4 text-right">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                   <Download className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}
      </div>

      {selectedAsset && (
        <AssetBookingModal 
          asset={selectedAsset}
          user={user}
          onClose={() => setSelectedAsset(null)}
          onSuccess={() => {
             // Refresh logic could go here
             setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
};

export default LabDetail;
