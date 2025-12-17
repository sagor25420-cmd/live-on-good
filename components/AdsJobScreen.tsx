import React, { useEffect, useState } from 'react';
import { ArrowLeft, MonitorPlay, Youtube, CheckCircle2, Wallet, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface AdsJobScreenProps {
  onBack: () => void;
}

const AdsJobScreen: React.FC<AdsJobScreenProps> = ({ onBack }) => {
  const { adBalance, dailyAdCount, watchAdReward, claimYoutubeReward, transferAdBalanceToMain } = useAppContext();
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

  // Inject script for ads
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//libtl.com/sdk.js';
    script.dataset.zone = '10325458';
    script.dataset.sdk = 'show_10325458';
    
    const container = document.getElementById('ad-script-container');
    if (container) {
        container.appendChild(script);
    }

    return () => {
        if (container && container.contains(script)) {
            container.removeChild(script);
        }
    };
  }, []);

  const handleWatchAd = () => {
      setAdLoading(true);
      setTimeout(() => {
          const success = watchAdReward();
          setAdLoading(false);
          if (success) {
              alert("অভিনন্দন! আপনি ৫০ পয়সা বোনাস পেয়েছেন।");
          } else {
              alert("আজকের লিমিট শেষ!");
          }
      }, 3000);
  };

  const handleYoutubeTask = (e: React.MouseEvent) => {
      e.preventDefault();
      // Open YouTube in new tab
      window.open("https://m.youtube.com/@liveongood", "_blank");
      
      // Simulate verification/reward delay
      setTimeout(() => {
          claimYoutubeReward();
          alert("অভিনন্দন! ইউটিউব টাস্কের জন্য ৫০ পয়সা বোনাস পেয়েছেন।");
      }, 5000);
  };

  const handleTransfer = () => {
      const success = transferAdBalanceToMain();
      if (success) {
          setShowTransferSuccess(true);
          setTimeout(() => setShowTransferSuccess(false), 3000);
      } else {
          alert("মেইন ওয়ালেটে নিতে হলে কমপক্ষে ৫০০ টাকা অ্যাড ব্যালেন্স থাকতে হবে।");
      }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">অ্যাড জব</h1>
      </div>

      <div className="p-4 space-y-6">
          
          {/* Ad Balance Card */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-sm opacity-80 font-medium">অ্যাড জব ব্যালেন্স</p>
                      <h2 className="text-3xl font-bold mt-1">৳ {adBalance.toFixed(2)}</h2>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                      <MonitorPlay size={24} />
                  </div>
              </div>
              
              <div className="flex gap-2">
                  <button 
                    onClick={handleTransfer}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2
                        ${adBalance >= 500 ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-300' : 'bg-white/20 text-white/50 cursor-not-allowed'}
                    `}
                  >
                      <Wallet size={16} />
                      ট্রান্সফার (Min ৳500)
                  </button>
              </div>
              {showTransferSuccess && (
                  <p className="text-xs text-green-300 mt-2 font-bold animate-pulse">টাকা সফলভাবে মেইন ওয়ালেটে পাঠানো হয়েছে!</p>
              )}
          </div>

          {/* Ad Watching Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                  অ্যাড দেখুন (৫০ পয়সা)
              </h3>
              <p className="text-sm text-gray-500 mb-4">নিচের লিংকে ক্লিক করে অ্যাড দেখুন এবং আয় করুন।</p>
              
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                  <span className="text-sm font-bold text-gray-600">আজকের সম্পন্ন:</span>
                  <span className={`text-sm font-bold ${dailyAdCount >= 100 ? 'text-red-500' : 'text-green-600'}`}>
                      {dailyAdCount} / 100
                  </span>
              </div>

              {/* Ad Script Container */}
              <div id="ad-script-container" className="mb-4 min-h-[50px] bg-gray-100 flex items-center justify-center rounded border border-dashed border-gray-300">
                  <span className="text-xs text-gray-400">Ad Space</span>
              </div>

              <button 
                onClick={handleWatchAd}
                disabled={adLoading || dailyAdCount >= 100}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition
                    ${adLoading || dailyAdCount >= 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:scale-95'}
                `}
              >
                  {adLoading ? 'অ্যাড লোড হচ্ছে...' : dailyAdCount >= 100 ? 'আজকের লিমিট শেষ' : 'অ্যাড দেখুন'}
              </button>
          </div>

          {/* YouTube Video & Follow Task */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                  ভিডিও ও ফলো (৫০ পয়সা)
              </h3>
              <p className="text-sm text-gray-500 mb-4">ভিডিও দেখে এবং ফলো করে ইনকাম করুন।</p>

              <button 
                onClick={handleYoutubeTask}
                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-red-700 transition active:scale-95"
              >
                  <Youtube size={20} />
                  ভিডিও দেখুন ও ফলো করুন
              </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>নিয়মাবলী:</strong> অ্যাড জব ওয়ালেটে ৫০০ টাকা জমা হলে আপনি তা মেইন ওয়ালেটে (রিয়েল ব্যালেন্স) ট্রান্সফার করতে পারবেন। প্রতিদিন সর্বোচ্চ ১০০টি অ্যাড দেখা যাবে।
              </p>
          </div>

      </div>
    </div>
  );
};

export default AdsJobScreen;