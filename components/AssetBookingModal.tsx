
import React, { useState } from 'react';
import { Asset, Student, Booking } from '../types';
import { X, Calendar, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface AssetBookingModalProps {
  asset: Asset;
  user: Student;
  onClose: () => void;
  onSuccess: () => void;
}

const AssetBookingModal: React.FC<AssetBookingModalProps> = ({ asset, user, onClose, onSuccess }) => {
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [purpose, setPurpose] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Time slots (Simple Mock)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sheetService.createBooking({
        assetId: asset.id,
        studentId: user.id,
        date,
        startTime,
        durationHours: duration,
        purpose
      });
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Reserve Equipment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
           <div className="flex items-start gap-4 mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <img src={asset.image} alt={asset.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                 <h4 className="font-bold text-slate-800 dark:text-white">{asset.name}</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400">{asset.model}</p>
                 <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Certification Verified</span>
                 </div>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                 <input 
                   required
                   type="date"
                   min={new Date().toISOString().split('T')[0]}
                   className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                   value={date}
                   onChange={e => setDate(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                    <select 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Hours)</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={duration}
                      onChange={e => setDuration(parseInt(e.target.value))}
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                      <option value="4">4 Hours</option>
                    </select>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Purpose of Use</label>
                 <textarea 
                   required
                   placeholder="Briefly describe your project..."
                   className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                   value={purpose}
                   onChange={e => setPurpose(e.target.value)}
                 />
              </div>

              <div className="pt-4 flex justify-end">
                 <button 
                   type="submit"
                   disabled={loading}
                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                   Confirm Booking
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AssetBookingModal;
