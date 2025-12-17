import React from 'react';
import { Home, PlaySquare, ShoppingCart, User, Wallet } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const getIconColor = (view: ViewState) => {
    return currentView === view ? 'text-yellow-500' : 'text-gray-500';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 shadow-lg max-w-md mx-auto z-50">
      <div className="relative flex justify-between items-center h-full px-4">
        
        {/* Home */}
        <button onClick={() => onChangeView('HOME')} className="flex flex-col items-center justify-center w-14 space-y-1">
          <Home size={24} className={getIconColor('HOME')} />
          <span className={`text-xs ${getIconColor('HOME')}`}>হোম</span>
        </button>

        {/* Reels (Placeholder) */}
        <button onClick={() => onChangeView('HISTORY')} className="flex flex-col items-center justify-center w-14 space-y-1">
          <PlaySquare size={24} className={getIconColor('HISTORY')} />
          <span className={`text-xs ${getIconColor('HISTORY')}`}>রিলস</span>
        </button>

        {/* Central Floating Wallet Button */}
        <div className="relative -top-8">
          <button 
            onClick={() => onChangeView('DEPOSIT')}
            className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] p-1 border-4 border-gray-50"
          >
             <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center text-white">
                <Wallet size={28} />
             </div>
          </button>
          <div className="text-center w-full absolute top-16 text-gray-500 text-xs font-medium">ওয়ালেট</div>
        </div>

        {/* Shop */}
        <button onClick={() => onChangeView('SHOP')} className="flex flex-col items-center justify-center w-14 space-y-1">
          <ShoppingCart size={24} className={getIconColor('SHOP')} />
          <span className={`text-xs ${getIconColor('SHOP')}`}>শপ</span>
        </button>

        {/* Profile */}
        <button onClick={() => onChangeView('PROFILE')} className="flex flex-col items-center justify-center w-14 space-y-1">
          <User size={24} className={getIconColor('PROFILE')} />
          <span className={`text-xs ${getIconColor('PROFILE')}`}>প্রোফাইল</span>
        </button>

      </div>
    </div>
  );
};

export default BottomNav;