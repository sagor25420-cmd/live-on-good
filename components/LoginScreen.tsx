import React, { useState } from 'react';
import { LogIn, Phone, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LoginScreenProps {
  onGoToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onGoToRegister }) => {
  const { login } = useAppContext();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(phone, password)) {
        // Success handled by context state change
    } else {
        setError('ভুল মোবাইল নাম্বার অথবা পাসওয়ার্ড!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                <LogIn size={40} />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">স্বাগতম!</h2>
        <p className="text-center text-gray-500 mb-8">অনুগ্রহ করে লগইন করুন</p>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">আপনার মোবাইল নাম্বার দেন</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-yellow-500 transition">
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
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">আপনার পাসওয়ার্ড দেন</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-200 focus-within:border-yellow-500 transition">
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

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <button 
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95"
            >
                লগইন করুন
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                একাউন্ট নেই?{' '}
                <button onClick={onGoToRegister} className="text-yellow-600 font-bold hover:underline">
                    রেজিস্ট্রেশন করুন
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;