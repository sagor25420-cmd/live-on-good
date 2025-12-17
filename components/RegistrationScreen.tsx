import React, { useState } from 'react';
import { UserPlus, User, Phone, Lock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface RegistrationScreenProps {
  onGoToLogin: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onGoToLogin }) => {
  const { register } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('পাসওয়ার্ড মিলছে না!');
        return;
    }

    if (password.length < 4) {
        setError('পাসওয়ার্ড অন্তত ৪ সংখ্যার হতে হবে।');
        return;
    }
    
    if (register(name, phone, password)) {
        // Success handled by context state change (auto login)
    } else {
        setError('এই নাম্বারে ইতিমধ্যে একাউন্ট আছে!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <UserPlus size={40} />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">রেজিস্ট্রেশন</h2>
        <p className="text-center text-gray-500 mb-8">নতুন একাউন্ট তৈরি করুন</p>

        <form onSubmit={handleRegister} className="space-y-4">
            
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">আপনার নাম</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-blue-500 transition">
                    <User size={18} className="text-gray-400" />
                    <input 
                        type="text"
                        placeholder="আপনার নাম লিখুন"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-medium text-gray-800"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">আপনার মোবাইল নাম্বার দেন</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-blue-500 transition">
                    <Phone size={18} className="text-gray-400" />
                    <input 
                        type="tel"
                        placeholder="017xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-medium text-gray-800"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">পাসওয়ার্ড মনে রাখতে হবে</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-blue-500 transition">
                    <Lock size={18} className="text-gray-400" />
                    <input 
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-medium text-gray-800"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">কনফার্ম পাসওয়ার্ড দেন</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-blue-500 transition">
                    <CheckCircle size={18} className="text-gray-400" />
                    <input 
                        type="password"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent p-3 outline-none font-medium text-gray-800"
                        required
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95"
            >
                রেজিস্ট্রেশন করুন
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button onClick={onGoToLogin} className="text-blue-600 font-bold hover:underline">
                    লগইন করুন
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;