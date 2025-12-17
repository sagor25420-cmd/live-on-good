import React, { useState } from 'react';
import { ArrowLeft, Wifi, Phone, Box, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { OPERATORS } from '../services/mockData';
import { useAppContext } from '../context/AppContext';
import { Offer } from '../types';

interface OffersScreenProps {
  onBack: () => void;
}

const OffersScreen: React.FC<OffersScreenProps> = ({ onBack }) => {
  const { offers, addPackageRequest } = useAppContext();
  const [activeTab, setActiveTab] = useState<'internet' | 'voice' | 'bundle'>('bundle');
  const [filterOp, setFilterOp] = useState<string>('all');
  
  // Buy Modal States
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filteredOffers = offers.filter(offer => {
    const typeMatch = activeTab === 'bundle' ? true : offer.type === activeTab;
    const opMatch = filterOp === 'all' ? true : offer.operatorId === filterOp;
    return typeMatch && opMatch;
  });

  const handleBuyClick = (offer: Offer) => {
      setSelectedOffer(offer);
      setCustomerPhone('');
      setPurchaseStatus('idle');
  };

  const handleConfirmPurchase = () => {
      if (!selectedOffer || !customerPhone) return;

      const success = addPackageRequest({
          id: Date.now().toString(),
          customerPhone,
          offerTitle: selectedOffer.title,
          offerData: selectedOffer.data,
          offerMinutes: selectedOffer.minutes,
          offerPrice: selectedOffer.price,
          cashback: selectedOffer.cashback,
          operatorId: selectedOffer.operatorId,
          status: 'pending',
          timestamp: Date.now()
      });

      if (success) {
          setPurchaseStatus('success');
      } else {
          setPurchaseStatus('error');
      }
  };

  const closeBuyModal = () => {
      setSelectedOffer(null);
      setPurchaseStatus('idle');
  };

  return (
    <div className="pb-24 relative">
       {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">ইন্টারনেট অফার</h1>
      </div>

      {/* Operator Filter */}
      <div className="bg-white py-3 px-4 border-b border-gray-100 flex gap-3 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setFilterOp('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition
            ${filterOp === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
            সব
        </button>
        {OPERATORS.map(op => (
             <button 
                key={op.id}
                onClick={() => setFilterOp(op.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition border
                ${filterOp === op.id ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-200'}`}
            >
                {op.name}
            </button>
        ))}
      </div>

      {/* Type Tabs */}
      <div className="flex bg-white px-2 pt-2 shadow-sm mb-4">
        {[
            { id: 'bundle', label: 'বান্ডেল', icon: <Box size={16}/> },
            { id: 'internet', label: 'ইন্টারনেট', icon: <Wifi size={16}/> },
            { id: 'voice', label: 'মিনিট', icon: <Phone size={16}/> }
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition
                    ${activeTab === tab.id ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-400 hover:text-gray-600'}
                `}
            >
                {tab.icon}
                {tab.label}
            </button>
        ))}
      </div>

      {/* Offer List */}
      <div className="px-4 space-y-3">
        {filteredOffers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
                কোন অফার পাওয়া যায়নি
            </div>
        ) : (
            filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onBuy={() => handleBuyClick(offer)} />
            ))
        )}
      </div>

      {/* Buy Modal */}
      {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
                  {purchaseStatus === 'idle' && (
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">প্যাকেজ কিনুন</h3>
                            <button onClick={closeBuyModal} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-xl mb-6 relative">
                            <h4 className="font-bold text-gray-800">{selectedOffer.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{selectedOffer.data} | {selectedOffer.minutes}</p>
                            <p className="text-xs text-gray-500 mt-1">মেয়াদ: {selectedOffer.validity}</p>
                            <p className="text-xl font-bold text-yellow-600 mt-2">৳{selectedOffer.price}</p>
                            {selectedOffer.cashback && (
                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                    ক্যাশব্যাক ৳{selectedOffer.cashback}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">মোবাইল নাম্বার দিন</label>
                            <input 
                                type="tel" 
                                placeholder="017xxxxxxxx"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-bold text-gray-800 focus:border-yellow-500 outline-none"
                                autoFocus
                            />
                        </div>

                        <button 
                            onClick={handleConfirmPurchase}
                            disabled={!customerPhone}
                            className={`w-full py-3 rounded-xl font-bold text-white transition
                                ${customerPhone ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            কনফার্ম করুন
                        </button>
                      </div>
                  )}

                  {purchaseStatus === 'success' && (
                      <div className="p-8 flex flex-col items-center text-center">
                          <CheckCircle2 size={64} className="text-green-500 mb-4" />
                          <h3 className="text-xl font-bold text-gray-800 mb-2">রিকুয়েস্ট সফল!</h3>
                          <p className="text-gray-500 text-sm mb-6">আপনার প্যাকেজ রিকুয়েস্টটি এডমিনের কাছে পাঠানো হয়েছে।</p>
                          {selectedOffer.cashback && (
                              <p className="text-green-600 font-bold mb-4">অভিনন্দন! আপনি {selectedOffer.cashback} টাকা ক্যাশব্যাক পেয়েছেন।</p>
                          )}
                          <button onClick={closeBuyModal} className="bg-gray-800 text-white px-8 py-2 rounded-full font-bold">ঠিক আছে</button>
                      </div>
                  )}

                  {purchaseStatus === 'error' && (
                      <div className="p-8 flex flex-col items-center text-center">
                          <AlertCircle size={64} className="text-red-500 mb-4" />
                          <h3 className="text-xl font-bold text-gray-800 mb-2">ব্যালেন্স নেই!</h3>
                          <p className="text-gray-500 text-sm mb-6">আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে ডিপোজিট করুন।</p>
                          <button onClick={closeBuyModal} className="bg-gray-200 text-gray-800 px-8 py-2 rounded-full font-bold">বন্ধ করুন</button>
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

const OfferCard: React.FC<{ offer: Offer, onBuy: () => void }> = ({ offer, onBuy }) => {
    const operator = OPERATORS.find(op => op.id === offer.operatorId);
    
    return (
        <div onClick={onBuy} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition cursor-pointer">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${operator?.color || 'bg-gray-500'}`}></div>
            <div className="pl-3 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{offer.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 mb-2">
                        {offer.data !== '0 GB' && <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{offer.data}</span>}
                        {offer.minutes !== '0 Min' && <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">{offer.minutes}</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">মেয়াদ: {offer.validity}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                     <span className="block text-xl font-bold text-yellow-600">৳{offer.price}</span>
                     {offer.cashback && offer.cashback > 0 && (
                         <span className="text-xs font-bold text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded">
                             ক্যাশব্যাক ৳{offer.cashback}
                         </span>
                     )}
                     <button className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-bold">কিনুন</button>
                </div>
            </div>
        </div>
    );
}

export default OffersScreen;