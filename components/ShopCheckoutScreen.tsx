import React, { useState } from 'react';
import { ArrowLeft, User, Receipt, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

interface ShopCheckoutScreenProps {
  onBack: () => void;
  product: Product;
}

const ShopCheckoutScreen: React.FC<ShopCheckoutScreenProps> = ({ onBack, product }) => {
  const { addOrder } = useAppContext();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock pricing
  const deliveryCharge = 130;
  const total = deliveryCharge + product.price;

  const handleSubmit = () => {
    if (!customerName || !customerPhone || !address || !agreed) return;
    
    addOrder({
        id: Date.now().toString(),
        customerName,
        customerPhone,
        address: `${address}, ${upazila}, ${district}. Note: ${note}`,
        productTitle: product.title,
        totalPrice: total,
        status: 'pending',
        timestamp: Date.now()
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in bg-white min-h-screen">
            <CheckCircle2 size={80} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">অর্ডার সফল হয়েছে!</h2>
            <p className="text-gray-500 mb-8 text-center">আপনার অর্ডারটি গ্রহণ করা হয়েছে। শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</p>
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
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-500 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm text-white">
        <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">চেকআউট</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Product Preview */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
            <img src={product.image} className="w-16 h-16 object-cover rounded-lg bg-gray-100" alt="" />
            <div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                <p className="text-yellow-600 font-bold">৳{product.price}</p>
            </div>
        </div>

        {/* Customer Details Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <User className="text-yellow-500" size={20} />
                <h2 className="text-lg font-bold text-gray-800">কাস্টমার বিবরণ</h2>
            </div>

            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">কাস্টমার নাম</label>
                    <input 
                        type="text"
                        placeholder="আপনার কাস্টমার নাম লিখুন"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition placeholder-gray-400 font-medium"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">কাস্টমার নাম্বার</label>
                    <input 
                        type="tel"
                        placeholder="আপনার কাস্টমার নাম্বার লিখুন"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition placeholder-gray-400 font-medium"
                    />
                </div>

                {/* District Select */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">জেলা নির্বাচন করুন</label>
                    <div className="relative">
                        <select 
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition appearance-none font-medium"
                        >
                            <option value="">জেলা নির্বাচন করুন</option>
                            <option value="Dhaka">ঢাকা</option>
                            <option value="Chittagong">চট্টগ্রাম</option>
                            <option value="Sylhet">সিলেট</option>
                            <option value="Rajshahi">রাজশাহী</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Upazila Select */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">উপজেলা নির্বাচন করুন</label>
                    <div className="relative">
                        <select 
                            value={upazila}
                            onChange={(e) => setUpazila(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition appearance-none font-medium"
                        >
                            <option value="">উপজেলা নির্বাচন করুন</option>
                            <option value="Sadar">সদর</option>
                            <option value="Other">অন্যান্য</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ডেলিভারি ঠিকানা</label>
                    <textarea 
                        rows={2}
                        placeholder="আপনার ডেলিভারি ঠিকানা লিখুন"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition placeholder-gray-400 resize-none font-medium"
                    />
                </div>

                {/* Extra Instructions */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">অতিরিক্ত নির্দেশ <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span></label>
                    <input 
                        type="text"
                        placeholder="আপনার অতিরিক্ত নির্দেশ লিখুন"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-yellow-500 focus:bg-white outline-none transition placeholder-gray-400 font-medium"
                    />
                </div>
            </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Receipt className="text-yellow-500" size={20} />
                <h2 className="text-lg font-bold text-gray-800">অর্ডার সারাংশ</h2>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Product Price</span>
                    <span className="font-bold text-gray-800">{product.price}৳</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-3">
                    <span className="text-gray-600">ডেলিভারি চার্জ</span>
                    <span className="font-bold text-gray-800">{deliveryCharge}৳</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-1">
                    <span className="font-bold text-gray-800">টোটাল</span>
                    <span className="font-bold text-gray-800">৳{total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-4">
             <div className="flex items-start gap-3 px-1">
                 <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                 />
                 <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                    I agree with <span className="text-yellow-600 font-bold hover:underline">Terms & Conditions</span> and <span className="text-yellow-600 font-bold hover:underline">Refund Policy</span>
                 </label>
             </div>

             <button 
                onClick={handleSubmit}
                disabled={!customerName || !customerPhone || !address || !agreed}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                    ${(!customerName || !customerPhone || !address || !agreed) 
                        ? 'bg-yellow-200 cursor-not-allowed' 
                        : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95'}
                `}
            >
                <CheckCircle2 size={20} />
                অর্ডার করুন
            </button>
        </div>

      </div>
    </div>
  );
};

export default ShopCheckoutScreen;