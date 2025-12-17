import React from 'react';
import { Smartphone, Gift, FileText, MonitorPlay } from 'lucide-react';
import { ViewState } from '../types';

interface ActionGridProps {
  onNavigate: (view: ViewState) => void;
}

const ActionGrid: React.FC<ActionGridProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white mx-4 rounded-xl p-6 shadow-sm mt-12 mb-6">
      <div className="grid grid-cols-4 gap-2">
        
        {/* Recharge */}
        <div 
          onClick={() => onNavigate('RECHARGE')}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition">
            <Smartphone size={24} />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">রিচার্জ</span>
        </div>

        {/* Drive Offer */}
        <div 
           onClick={() => onNavigate('OFFERS')}
           className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100 group-hover:bg-pink-100 transition">
            <Gift size={24} />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">ড্রাইভ অফার</span>
        </div>

        {/* Pay Bill */}
        <div 
          onClick={() => onNavigate('PAY_BILL')}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-100 transition">
            <FileText size={24} />
          </div>
          <span className="text-xs font-medium text-gray-700 text-center">পে বিল</span>
        </div>

        {/* Ads Job (Previously Micro Job) */}
        <div 
          onClick={() => onNavigate('ADS_JOB')}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-100 transition">
            <MonitorPlay size={24} />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">অ্যাড জব</span>
        </div>

      </div>
    </div>
  );
};

export default ActionGrid;