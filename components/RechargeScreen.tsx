import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Contact } from 'lucide-react';
import { OPERATORS } from '../services/mockData';
import { useAppContext } from '../context/AppContext';

interface RechargeScreenProps {
  onBack: () => void;
}

const RechargeScreen: React.FC<RechargeScreenProps> = ({ onBack }) => {
  const { addRechargeRequest } = useAppContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [rechargeType, setRechargeType] = useState('prepaid');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Auto-detect operator mock logic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 11) setPhoneNumber(val);
    
    if (val.startsWith('017') || val.startsWith('013')) setSelectedOperator('gp');
    else if (val.startsWith('019') || val.startsWith('014')) setSelectedOperator('bl');
    else if (val.startsWith('018')) setSelectedOperator('robi');
    else if (val.startsWith('016')) setSelectedOperator('airtel');
    else if (val.startsWith('015')) setSelectedOperator('teletalk');
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !amount || !selectedOperator) return;
    
    const success = addRechargeRequest({
        id: Date.now().toString(),
        phoneNumber,
        operatorId: selectedOperator,
        amount: Number(amount),
        type: rechargeType,
        status: 'pending',
        timestamp: Date.now()
    });

    if (success) {
        setStatus('success');
    } else {
        setStatus('error'); // Insufficient balance
    }
  };

  if (status === 'success') {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
            <CheckCircle2 size={80} className="text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">রিকুয়েস্ট পাঠানো হয়েছে!</h2>
            <p className="text-gray-500 mb-8 text-center">আপনার {phoneNumber} নাম্বারে ৳{amount} রিচার্জ রিকুয়েস্ট সফলভাবে সাবমিট হয়েছে। এডমিন অ্যাপ্রুভ করলে রিচার্জ সম্পন্ন হবে।</p>
            <button 
                onClick={() => { setStatus('idle'); onBack(); }}
                className="bg-yellow-500 text-white w-full py-3 rounded-xl font-bold shadow-md"
            >
                হোম পেজে ফিরে যান
            </button>
        </div>
    );
  }

  if (status === 'error') {
     return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
            <AlertCircle size={80} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ব্যালেন্স অপর্যাপ্ত!</h2>
            <p className="text-gray-500 mb-8 text-center">আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ডিপোজিট করুন।</p>
            <button 
                onClick={() => { setStatus('idle'); }}
                className="bg-gray-800 text-white w-full py-3 rounded-xl font-bold shadow-md"
            >
                ফিরে যান
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
        <h1 className="text-xl font-bold text-gray-800">মোবাইল রিচার্জ</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Type Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-full">
            <button 
                onClick={() => setRechargeType('prepaid')}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition ${rechargeType === 'prepaid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >
                প্রিপেইড
            </button>
            <button 
                onClick={() => setRechargeType('postpaid')}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition ${rechargeType === 'postpaid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >
                পোস্টপেইড
            </button>
        </div>

        {/* Phone Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">মোবাইল নাম্বার</label>
            <div className="flex items-center gap-3">
                <input 
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-1 bg-gray-50 p-3 rounded-lg outline-none font-bold text-gray-800 focus:bg-yellow-50 transition border border-transparent focus:border-yellow-200"
                />
                <Contact className="text-gray-400" />
            </div>
        </div>

        {/* Operator Selection */}
        <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block px-1">অপারেটর</label>
            <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
                {OPERATORS.map((op) => (
                    <button
                        key={op.id}
                        onClick={() => setSelectedOperator(op.id)}
                        className={`flex flex-col items-center gap-1 min-w-[60px] transition-opacity ${selectedOperator === op.id ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}
                    >
                        <div className={`w-12 h-12 rounded-full ${op.color} flex items-center justify-center text-white font-bold text-xs shadow-md border-2 ${selectedOperator === op.id ? 'border-yellow-500' : 'border-transparent'}`}>
                            {op.logoText}
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">{op.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Amount Input */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">টাকার পরিমাণ</label>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-400">৳</span>
                <input 
                    type="number"
                    placeholder="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent p-2 text-3xl font-bold text-gray-800 outline-none placeholder-gray-200"
                />
            </div>
            
            {/* Quick Amount Chips */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {[20, 50, 100, 200, 500].map(amt => (
                    <button 
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 whitespace-nowrap"
                    >
                        {amt}
                    </button>
                ))}
            </div>
        </div>

        {/* Submit Button */}
        <button 
            onClick={handleRecharge}
            disabled={!phoneNumber || !selectedOperator || !amount}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-4 transition-all
                ${(!phoneNumber || !selectedOperator || !amount) ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95'}
            `}
        >
            রিচার্জ করুন
        </button>

      </div>
    </div>
  );
};

export default RechargeScreen;