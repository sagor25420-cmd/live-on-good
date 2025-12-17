
import React, { useState } from 'react';
import Header from './components/Header';
import ActionGrid from './components/ActionGrid';
import BottomNav from './components/BottomNav';
import RechargeScreen from './components/RechargeScreen';
import OffersScreen from './components/OffersScreen';
import DepositScreen from './components/DepositScreen';
import PayBillScreen from './components/PayBillScreen';
import ShopScreen from './components/ShopScreen';
import ShopCheckoutScreen from './components/ShopCheckoutScreen';
import AdminPanel from './components/AdminPanel';
import ProfileScreen from './components/ProfileScreen';
import ReelsScreen from './components/ReelsScreen';
import AdsJobScreen from './components/AdsJobScreen';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import { ViewState, Product, AuthView } from './types';
import { Zap, ArrowDownLeft, Smartphone, Wifi } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authView, setAuthView] = useState<AuthView>('LOGIN');
  
  const { recentTransactions, isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
      return authView === 'LOGIN' 
        ? <LoginScreen onGoToRegister={() => setAuthView('REGISTER')} /> 
        : <RegistrationScreen onGoToLogin={() => setAuthView('LOGIN')} />;
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('SHOP_CHECKOUT');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'ADMIN': return <AdminPanel onBack={() => setCurrentView('HOME')} />;
      case 'RECHARGE': return <RechargeScreen onBack={() => setCurrentView('HOME')} />;
      case 'OFFERS': return <OffersScreen onBack={() => setCurrentView('HOME')} />;
      case 'DEPOSIT': return <DepositScreen onBack={() => setCurrentView('HOME')} />;
      case 'PAY_BILL': return <PayBillScreen onBack={() => setCurrentView('HOME')} />;
      case 'SHOP': return <ShopScreen onBack={() => setCurrentView('HOME')} onSelectProduct={handleSelectProduct} />;
      case 'SHOP_CHECKOUT': return selectedProduct ? <ShopCheckoutScreen onBack={() => setCurrentView('SHOP')} product={selectedProduct} /> : <ShopScreen onBack={() => setCurrentView('HOME')} onSelectProduct={handleSelectProduct} />;
      case 'PROFILE': return <ProfileScreen onBack={() => setCurrentView('HOME')} onNavigateToAdmin={() => setCurrentView('ADMIN')} />;
      case 'HISTORY': return <ReelsScreen onBack={() => setCurrentView('HOME')} />;
      case 'ADS_JOB': return <AdsJobScreen onBack={() => setCurrentView('HOME')} />;
      default:
        return (
          <div className="pb-24 animate-fade-in">
            <Header onNavigate={setCurrentView} />
            <ActionGrid onNavigate={setCurrentView} />
            
            <div className="px-4 mb-6">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-5 text-white flex justify-between items-center shadow-lg">
                    <div>
                        <h3 className="font-bold text-lg">ক্যাশব্যাক অফার!</h3>
                        <p className="text-sm opacity-80 mt-1">৫০ টাকা রিচার্জে ১০% ক্যাশব্যাক</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Zap size={24} className="text-yellow-300" />
                    </div>
                </div>
            </div>

            <div className="px-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-700">সাম্প্রতিক লেনদেন</h3>
                    <button className="text-xs text-yellow-600 font-bold">সব দেখুন</button>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-400 text-center text-sm py-4">কোনো লেনদেন পাওয়া যায়নি</p>
                    ) : (
                        recentTransactions.map((trx) => (
                            <div key={trx.id} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-2">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                         trx.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                                         trx.type === 'recharge' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                                     }`}>
                                         {trx.type === 'deposit' && <ArrowDownLeft size={18} />}
                                         {trx.type === 'recharge' && <Smartphone size={18} />}
                                         {trx.type === 'package' && <Wifi size={18} />}
                                     </div>
                                     <div className="overflow-hidden">
                                         <p className="font-bold text-sm text-gray-800 truncate">{trx.title}</p>
                                         <div className="flex items-center gap-2">
                                             <p className="text-xs text-gray-400 truncate max-w-[120px]">{trx.subtitle}</p>
                                             <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                                                 trx.status === 'completed' || trx.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                 trx.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                             }`}>
                                                 {trx.status}
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                      <span className={`font-bold text-sm ${trx.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                          {trx.isPositive ? '+' : '-'}৳{trx.amount}
                                      </span>
                                 </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </div>
        );
    }
  };

  const hideBottomNav = ['RECHARGE', 'DEPOSIT', 'PAY_BILL', 'SHOP', 'SHOP_CHECKOUT', 'ADMIN', 'ADS_JOB', 'HISTORY'].includes(currentView);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {renderContent()}
      {!hideBottomNav && <BottomNav currentView={currentView} onChangeView={setCurrentView} />}
      {currentView === 'PROFILE' && <BottomNav currentView={currentView} onChangeView={setCurrentView} />}
    </div>
  );
};

const App = () => (
    <AppProvider>
        <MainApp />
    </AppProvider>
);

export default App;
