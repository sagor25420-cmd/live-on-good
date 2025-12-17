import React, { useState } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { ViewState } from '../types';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
    onNavigate?: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const { balance, userProfile } = useAppContext();

  return (
    <div className="bg-yellow-500 rounded-b-[30px] px-6 pt-10 pb-16 text-white relative shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <div 
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 overflow-hidden cursor-pointer"
                onClick={() => onNavigate && onNavigate('PROFILE')}
            >
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon />
                )}
            </div>
            <div>
                <p className="text-sm opacity-90">শুভ সকাল,</p>
                <h2 className="font-bold text-lg leading-tight">{userProfile.name}</h2>
            </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full cursor-pointer hover:bg-white/30 transition">
            <Bell size={20} />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white text-gray-800 rounded-2xl p-4 shadow-lg flex justify-between items-center absolute -bottom-8 left-6 right-6">
         <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">বর্তমান ব্যালেন্স</span>
            <div 
                className="flex items-center gap-2 cursor-pointer mt-1"
                onClick={() => setBalanceVisible(!balanceVisible)}
            >
                <span className={`text-2xl font-bold text-yellow-600 transition-all duration-300 ${balanceVisible ? '' : 'blur-sm'}`}>
                    ৳ {balance.toFixed(2)}
                </span>
            </div>
         </div>
         <button 
            onClick={() => onNavigate && onNavigate('DEPOSIT')}
            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-200 transition"
         >
            টপ আপ
         </button>
      </div>
    </div>
  );
};

// Simple User Icon component
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default Header;