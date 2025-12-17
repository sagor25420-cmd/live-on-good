import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, Wallet, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface DepositScreenProps {
  onBack: () => void;
}

const DepositScreen: React.FC<DepositScreenProps> = ({ onBack }) => {
  const { addDepositRequest, userProfile } = useAppContext();
  const [amount, setAmount] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'upay'>('bkash');

  const adminNumber = "01739376516";

  const handleCopy = () => {
    navigator.clipboard.writeText(adminNumber);
    alert("নাম্বার কপি হয়েছে!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !senderNumber || !trxId) return;
    
    addDepositRequest({
        id: Date.now().toString(),
        userPhone: userProfile.phone, // Attach current user phone
        amount,
        senderNumber,
        trxId,
        method: paymentMethod,
        status: 'pending',
        timestamp: Date.now()
    });
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
            <CheckCircle2 size={80} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">রিকুয়েস্ট সফল হয়েছে!</h2>
            <p className="text-gray-500 mb-8 text-center">আপনার ডিপোজিট রিকুয়েস্টটি গ্রহণ করা হয়েছে। যাচাই করার পর ব্যালেন্স যুক্ত করা হবে।</p>
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
    <div className="pb-24 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">ডিপোজিট</h1>
      </div>

      <div className="p-4 space-y-6 flex-1">
        
        {/* Payment Method Selection */}
        <div className="flex gap-3 justify-center mb-4">
            {['bkash', 'upay'].map((method) => {
                const isSelected = paymentMethod === method;
                let colorClass = 'border-gray-200 bg-white text-gray-500';
                
                if (isSelected) {
                    if (method === 'bkash') colorClass = 'border-pink-500 bg-pink-50 text-pink-600';
                    if (method === 'upay') colorClass = 'border-blue-500 bg-blue-50 text-blue-600';
                }

                return (
                    <button
                        key={method}
                        onClick={() => setPaymentMethod(method as any)}
                        className={`px-4 py-3 rounded-xl text-sm font-bold capitalize transition border-2 flex-1 shadow-sm ${colorClass}`}
                    >
                        {method}
                    </button>
                );
            })}
        </div>

        {/* Admin Number Card */}
        <div className={`rounded-xl p-5 text-white shadow-lg relative overflow-hidden transition-colors duration-300
            ${paymentMethod === 'bkash' ? 'bg-gradient-to-r from-pink-500 to-rose-600' : ''}
            ${paymentMethod === 'upay' ? 'bg-gradient-to-r from-blue-500 to-sky-600' : ''}
        `}>
            <div className="absolute right-0 top-0 p-4 opacity-10">
                <Wallet size={100} />
            </div>
            <p className="text-sm opacity-90 mb-1">নিচের নাম্বারে সেন্ড মানি করুন</p>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-wider">{adminNumber}</h2>
                <button 
                    onClick={handleCopy}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                >
                    <Copy size={20} />
                </button>
            </div>
            <p className="text-xs mt-2 bg-black/20 inline-block px-2 py-1 rounded">পার্সোনাল নাম্বার</p>
        </div>

        {/* Form */}
        <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
            
            {/* Amount */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">টাকার পরিমাণ (মিনিমাম ২০ টাকা)</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-100 focus-within:border-gray-400 transition">
                    <span className="text-gray-500 font-bold text-xl">৳</span>
                    <input 
                        type="number"
                        placeholder="20"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-bold text-black text-xl"
                    />
                </div>
            </div>

            {/* Sender Number */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">সেন্ডার নাম্বার (যে নাম্বার থেকে টাকা পাঠিয়েছেন)</label>
                <input 
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:border-gray-400 outline-none font-bold text-black transition"
                />
            </div>

            {/* TrxID */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">ট্রানজেকশন আইডি (TrxID)</label>
                <input 
                    type="text"
                    placeholder="8N7..."
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:border-gray-400 outline-none font-bold text-black transition uppercase"
                />
            </div>

        </div>

        {/* Submit Button */}
        <button 
            onClick={handleSubmit}
            disabled={!amount || !senderNumber || !trxId}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all
                ${(!amount || !senderNumber || !trxId) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900 active:scale-95'}
            `}
        >
            ডিপোজিট রিকুয়েস্ট পাঠান
        </button>

        {/* Bottom Wallet Logo (Requested Feature) */}
        <div className="flex flex-col items-center justify-center mt-6 opacity-30">
             <div className="bg-gray-200 p-4 rounded-full mb-2">
                 <ShieldCheck size={32} className="text-gray-500" />
             </div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secured by QuickPay</p>
        </div>

      </div>
    </div>
  );
};

export default DepositScreen;