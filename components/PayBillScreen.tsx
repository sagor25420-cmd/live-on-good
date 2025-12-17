import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb, Flame, Droplets, Wifi, Tv } from 'lucide-react';

interface PayBillScreenProps {
  onBack: () => void;
}

const PayBillScreen: React.FC<PayBillScreenProps> = ({ onBack }) => {
  const [billType, setBillType] = useState<'electricity' | 'gas' | 'water' | 'internet' | 'tv'>('electricity');
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock Providers based on Type
  const getProviders = () => {
    switch(billType) {
        case 'electricity': return ['পল্লী বিদ্যুৎ (Palli Bidyut)', 'ডেসকো (DESCO)', 'নেসকো (NESCO)', 'ডিপিডিসি (DPDC)'];
        case 'gas': return ['তিতাস গ্যাস (Titas)', 'বাখরাবাদ গ্যাস (Bakhrabad)', 'কর্ণফুলী গ্যাস (Karnaphuli)'];
        case 'water': return ['ঢাকা ওয়াসা (Dhaka WASA)', 'চট্টগ্রাম ওয়াসা (Chattogram WASA)'];
        case 'internet': return ['কার্নিভাল (Carnival)', 'আম্বার আইটি (Amber IT)', 'লিংক৩ (Link3)'];
        case 'tv': return ['আকাশ ডিটিএইচ (Akash DTH)', 'বিঞ্জ (Binge)'];
        default: return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !accountNumber || !phoneNumber || !amount) return;
    
    setTimeout(() => {
        setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
            <CheckCircle2 size={80} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">বিল পরিশোধ সফল হয়েছে!</h2>
            <p className="text-gray-500 mb-8 text-center">আপনার {provider} বিল সফলভাবে পরিশোধ করা হয়েছে।</p>
            <button 
                onClick={() => { setIsSuccess(false); onBack(); }}
                className="bg-yellow-500 text-white w-full py-3 rounded-xl font-bold shadow-md"
            >
                হোম পেজে ফিরে যান
            </button>
        </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">পে বিল</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Bill Type Selector */}
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
                { id: 'electricity', label: 'বিদ্যুৎ', icon: <Lightbulb size={20}/> },
                { id: 'gas', label: 'গ্যাস', icon: <Flame size={20}/> },
                { id: 'water', label: 'পানি', icon: <Droplets size={20}/> },
                { id: 'internet', label: 'নেট', icon: <Wifi size={20}/> },
                { id: 'tv', label: 'টিভি', icon: <Tv size={20}/> }
            ].map((type) => (
                <button
                    key={type.id}
                    onClick={() => { setBillType(type.id as any); setProvider(''); }}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-xl border-2 transition-all
                        ${billType === type.id 
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm' 
                            : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}
                    `}
                >
                    <div className="mb-1">{type.icon}</div>
                    <span className="text-xs font-bold">{type.label}</span>
                </button>
            ))}
        </div>

        {/* Form */}
        <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
            
            {/* Provider Select */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">প্রতিষ্ঠানের নাম</label>
                <select 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:border-yellow-500 outline-none font-semibold text-gray-700 transition appearance-none"
                >
                    <option value="">নির্বাচন করুন</option>
                    {getProviders().map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* Account/Meter Number */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">হিসাব নম্বর / মিটার নং</label>
                <input 
                    type="text"
                    placeholder="123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:border-yellow-500 outline-none font-semibold text-gray-700 transition"
                />
            </div>

            {/* Mobile Number */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">মোবাইল নাম্বার</label>
                <input 
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:border-yellow-500 outline-none font-semibold text-gray-700 transition"
                />
            </div>

            {/* Amount */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">বিলের পরিমাণ</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-100 focus-within:border-yellow-500 transition">
                    <span className="text-gray-500 font-bold">৳</span>
                    <input 
                        type="number"
                        placeholder="500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-semibold text-gray-700"
                    />
                </div>
            </div>

        </div>

        {/* Submit Button */}
        <button 
            onClick={handleSubmit}
            disabled={!provider || !accountNumber || !phoneNumber || !amount}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all
                ${(!provider || !accountNumber || !phoneNumber || !amount) ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95'}
            `}
        >
            বিল পরিশোধ করুন
        </button>

      </div>
    </div>
  );
};

export default PayBillScreen;