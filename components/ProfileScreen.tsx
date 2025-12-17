import React, { useRef, useState } from 'react';
import { ArrowLeft, Camera, Shield, Edit2, LogOut, ShoppingBag, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateToAdmin: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onNavigateToAdmin }) => {
  const { userProfile, updateUserProfile, orders, logout } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOrders, setShowOrders] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameEdit = () => {
      const newName = prompt("আপনার নতুন নাম লিখুন:", userProfile.name);
      if (newName) {
          updateUserProfile({ name: newName });
      }
  };

  if (showOrders) {
      return (
          <div className="pb-24 min-h-screen bg-gray-50 animate-fade-in">
              <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setShowOrders(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">আমার অর্ডার সমূহ</h1>
              </div>
              <div className="p-4 space-y-4">
                  {orders.length === 0 ? (
                      <div className="text-center text-gray-400 mt-10">কোন অর্ডার পাওয়া যায়নি।</div>
                  ) : (
                      orders.map(order => (
                          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-gray-800">{order.productTitle}</h3>
                                  <span className="text-sm font-bold text-yellow-600">৳{order.totalPrice}</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">{new Date(order.timestamp).toLocaleString()}</p>
                              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                  <span className="font-bold text-gray-700">স্ট্যাটাস: </span>
                                  <span className="text-blue-600 capitalize">{order.status}</span>
                              </div>
                              {order.adminComment && (
                                  <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                                      <p className="text-xs font-bold text-blue-800 mb-1">এডমিন মেসেজ:</p>
                                      <p className="text-sm text-gray-700">{order.adminComment}</p>
                                  </div>
                              )}
                          </div>
                      ))
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">প্রোফাইল</h1>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Avatar Section */}
        <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                )}
            </div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full text-white shadow-md hover:bg-yellow-600 transition"
            >
                <Camera size={20} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>

        {/* User Info */}
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
                <button onClick={handleNameEdit} className="text-gray-400 hover:text-gray-600">
                    <Edit2 size={16} />
                </button>
            </div>
            <p className="text-gray-500 font-medium">{userProfile.phone}</p>
            {userProfile.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">ADMIN</span>
            )}
        </div>

        {/* Menu Items */}
        <div className="w-full space-y-3">
             <div onClick={() => setShowOrders(true)} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer hover:bg-yellow-50 transition">
                 <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><ShoppingBag size={20}/></div>
                 <span className="font-bold text-gray-700 flex-1">আমার অর্ডার</span>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer">
                 <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Shield size={20}/></div>
                 <span className="font-bold text-gray-700 flex-1">অ্যাকাউন্ট ভেরিফিকেশন</span>
                 <span className="text-green-500 text-xs font-bold bg-green-100 px-2 py-1 rounded">Verified</span>
             </div>

             {/* Admin Panel Button - Visible only to ADMIN */}
             {userProfile.role === 'admin' && (
                 <div onClick={onNavigateToAdmin} className="bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-700 transition">
                     <div className="bg-gray-700 p-2 rounded-lg text-white"><Shield size={20}/></div>
                     <span className="font-bold text-white flex-1">অ্যাডমিন প্যানেল</span>
                 </div>
             )}

             <div onClick={logout} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer text-red-500 hover:bg-red-50 transition">
                 <div className="bg-red-50 p-2 rounded-lg"><LogOut size={20}/></div>
                 <span className="font-bold flex-1">লগ আউট</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;