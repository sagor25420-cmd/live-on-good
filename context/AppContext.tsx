
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Offer, Product, DepositRequest, Order, RechargeRequest, PackageRequest, UserProfile, Reel, RecentTransaction } from '../types';
import { OFFERS as INITIAL_OFFERS } from '../services/mockData';

// --- LocalStorage Utility Functions ---
const saveData = <T,>(key: string, data: T) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Failed to save data", e); }
};

const loadData = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error("Failed to load data", e);
    return defaultValue;
  }
};
// --- ---

interface AppContextType {
  isLoggedIn: boolean;
  login: (phone: string, pass: string) => boolean;
  register: (name: string, phone: string, pass: string) => boolean;
  logout: () => void;
  balance: number;
  adBalance: number;
  dailyAdCount: number;
  userProfile: UserProfile;
  offers: Offer[];
  products: Product[];
  deposits: DepositRequest[];
  orders: Order[];
  recharges: RechargeRequest[];
  packageRequests: PackageRequest[];
  reels: Reel[];
  recentTransactions: RecentTransaction[];
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addReel: (reel: Reel) => void;
  likeReel: (id: string) => void;
  addComment: (reelId: string, text: string) => void;
  toggleFollow: (reelId: string) => void;
  addOffer: (offer: Offer) => void;
  deleteOffer: (id: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addDepositRequest: (request: DepositRequest) => void;
  approveDeposit: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderComment: (id: string, comment: string) => void;
  addRechargeRequest: (request: RechargeRequest) => boolean;
  updateRechargeStatus: (id: string, status: 'completed' | 'rejected') => void;
  addPackageRequest: (request: PackageRequest) => boolean;
  updatePackageRequestStatus: (id: string, status: 'completed' | 'rejected') => void;
  watchAdReward: () => boolean;
  claimYoutubeReward: () => void;
  transferAdBalanceToMain: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USERS: 'quickpay_users',
    CURRENT_USER_PHONE: 'quickpay_currentUserPhone',
    OFFERS: 'quickpay_offers',
    PRODUCTS: 'quickpay_products',
    DEPOSITS: 'quickpay_deposits',
    ORDERS: 'quickpay_orders',
    RECHARGES: 'quickpay_recharges',
    PACKAGES: 'quickpay_packages',
    REELS: 'quickpay_reels',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => loadData(STORAGE_KEYS.USERS, [{ name: 'Admin', phone: '01818818513', password: 'SAGOR2542R', role: 'admin', avatar: null, balance: 1000, adBalance: 0, dailyAdCount: 0 }]));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [offers, setOffers] = useState<Offer[]>(() => loadData(STORAGE_KEYS.OFFERS, INITIAL_OFFERS));
  const [products, setProducts] = useState<Product[]>(() => loadData(STORAGE_KEYS.PRODUCTS, [{ id: 'p1', title: 'Premium Headphone', price: 1200, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', description: 'Best sound quality' }, { id: 'p2', title: 'Smart Watch', price: 2500, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', description: 'Waterproof' }]));
  const [deposits, setDeposits] = useState<DepositRequest[]>(() => loadData(STORAGE_KEYS.DEPOSITS, []));
  const [orders, setOrders] = useState<Order[]>(() => loadData(STORAGE_KEYS.ORDERS, []));
  const [recharges, setRecharges] = useState<RechargeRequest[]>(() => loadData(STORAGE_KEYS.RECHARGES, []));
  const [packageRequests, setPackageRequests] = useState<PackageRequest[]>(() => loadData(STORAGE_KEYS.PACKAGES, []));
  const [reels, setReels] = useState<Reel[]>(() => loadData(STORAGE_KEYS.REELS, [{ id: 'r1', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-alone-34882-large.mp4', caption: 'Dancing under the lights! 💃✨ #Vibe #Music', likes: 1250, isLiked: false, comments: [{ id: 'c1', username: 'Karim', text: 'অসাধারণ নাচ!', timestamp: Date.now() }, { id: 'c2', username: 'Shova', text: 'গানটা দারুণ 🎵', timestamp: Date.now() }], userName: 'Nabila Ahsan', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', isFollowed: false, timestamp: Date.now() }, { id: 'r2', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-skateboarding-on-a-sunny-day-43265-large.mp4', caption: 'Morning skate session 🛹☀️ #Skate #Lifestyle', likes: 840, isLiked: true, comments: [], userName: 'Sagor Ahmed', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', isFollowed: true, timestamp: Date.now() }]));
  
  // Persist state changes to localStorage
  useEffect(() => { saveData(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { saveData(STORAGE_KEYS.OFFERS, offers); }, [offers]);
  useEffect(() => { saveData(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { saveData(STORAGE_KEYS.DEPOSITS, deposits); }, [deposits]);
  useEffect(() => { saveData(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { saveData(STORAGE_KEYS.RECHARGES, recharges); }, [recharges]);
  useEffect(() => { saveData(STORAGE_KEYS.PACKAGES, packageRequests); }, [packageRequests]);
  useEffect(() => { saveData(STORAGE_KEYS.REELS, reels); }, [reels]);
  
  // Auto-login effect
  useEffect(() => {
    const loggedInUserPhone = loadData<string | null>(STORAGE_KEYS.CURRENT_USER_PHONE, null);
    if (loggedInUserPhone) {
        const user = users.find(u => u.phone === loggedInUserPhone);
        if (user) {
            setCurrentUser(user);
            setIsLoggedIn(true);
        }
    }
  }, [users]);

  const balance = currentUser?.balance || 0;
  const adBalance = currentUser?.adBalance || 0;
  const dailyAdCount = currentUser?.dailyAdCount || 0;

  const login = (phone: string, pass: string) => {
      const user = users.find(u => u.phone === phone && u.password === pass);
      if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          saveData(STORAGE_KEYS.CURRENT_USER_PHONE, user.phone);
          return true;
      }
      return false;
  };

  const register = (name: string, phone: string, pass: string) => {
      if (users.find(u => u.phone === phone)) return false;
      const newUser: UserProfile = { name, phone, password: pass, role: 'user', avatar: null, balance: 0, adBalance: 0, dailyAdCount: 0 };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      saveData(STORAGE_KEYS.CURRENT_USER_PHONE, newUser.phone);
      return true;
  };

  const logout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_PHONE);
  };

  const updateUserData = (phone: string, data: Partial<UserProfile>) => {
      const updatedUsers = users.map(u => u.phone === phone ? { ...u, ...data } : u);
      setUsers(updatedUsers);
      if (currentUser?.phone === phone) {
          const updatedCurrentUser = updatedUsers.find(u => u.phone === phone);
          setCurrentUser(updatedCurrentUser || null);
      }
  };

  const getRecentTransactions = (): RecentTransaction[] => {
      if (!currentUser) return [];
      const filter = (p: string) => currentUser.role === 'admin' || currentUser.phone === p;
      const dL: RecentTransaction[] = deposits.filter(d => filter(d.userPhone)).map(d => ({ id: d.id, type: 'deposit', title: 'ব্যালেন্স যুক্ত', subtitle: d.trxId, amount: Number(d.amount), timestamp: d.timestamp, status: d.status, isPositive: true }));
      const rL: RecentTransaction[] = recharges.filter(r => filter(r.userPhone)).map(r => ({ id: r.id, type: 'recharge', title: 'মোবাইল রিচার্জ', subtitle: r.phoneNumber, amount: r.amount, timestamp: r.timestamp, status: r.status, isPositive: false }));
      const pL: RecentTransaction[] = packageRequests.filter(p => filter(p.userPhone)).map(p => ({ id: p.id, type: 'package', title: 'প্যাকেজ ক্রয়', subtitle: p.customerPhone, amount: p.offerPrice, timestamp: p.timestamp, status: p.status, isPositive: false }));
      return [...dL, ...rL, ...pL].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  };
  
  const addDepositRequest = (request: Omit<DepositRequest, 'userPhone'>) => {
      if (currentUser) {
          setDeposits([{ ...request, userPhone: currentUser.phone }, ...deposits]);
      }
  };

  const addRechargeRequest = (request: Omit<RechargeRequest, 'userPhone'>) => {
      if (!currentUser || balance < request.amount) return false;
      updateUserData(currentUser.phone, { balance: balance - request.amount });
      setRecharges([{ ...request, userPhone: currentUser.phone }, ...recharges]);
      return true;
  };

  const addPackageRequest = (request: Omit<PackageRequest, 'userPhone'>) => {
      if (!currentUser || balance < request.offerPrice) return false;
      const finalBalance = (balance - request.offerPrice) + (request.cashback || 0);
      updateUserData(currentUser.phone, { balance: finalBalance });
      setPackageRequests([{ ...request, userPhone: currentUser.phone }, ...packageRequests]);
      return true;
  };
  
  return (
    <AppContext.Provider value={{ 
        isLoggedIn, login, register, logout, balance, adBalance, dailyAdCount, 
        userProfile: currentUser || { name: '', phone: '', avatar: null, role: 'user', balance: 0, adBalance: 0, dailyAdCount: 0 },
        offers, products, deposits, orders, recharges, packageRequests, reels, recentTransactions: getRecentTransactions(),
        updateUserProfile: (p) => currentUser && updateUserData(currentUser.phone, p),
        addReel: (r) => setReels([r, ...reels]),
        likeReel: (id) => setReels(reels.map(r => r.id === id ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked } : r)),
        addComment: (rid, t) => setReels(reels.map(r => r.id === rid ? { ...r, comments: [...r.comments, { id: Date.now().toString(), username: currentUser!.name, text: t, timestamp: Date.now() }] } : r)),
        toggleFollow: (rid) => setReels(reels.map(r => r.id === rid ? { ...r, isFollowed: !r.isFollowed } : r)),
        addOffer: (o) => setOffers([o, ...offers]), deleteOffer: (id) => setOffers(offers.filter(o => o.id !== id)),
        addProduct: (p) => setProducts([p, ...products]), deleteProduct: (id) => setProducts(products.filter(p => p.id !== id)),
        addDepositRequest,
        approveDeposit: (id) => {
            const dep = deposits.find(d => d.id === id);
            if (dep && dep.status === 'pending') {
                const user = users.find(u => u.phone === dep.userPhone);
                if (user) updateUserData(user.phone, { balance: user.balance + Number(dep.amount) });
                setDeposits(deposits.map(d => d.id === id ? { ...d, status: 'approved' } : d));
            }
        },
        addOrder: (o) => currentUser && setOrders([{ ...o, userPhone: currentUser.phone }, ...orders]),
        updateOrderComment: (id, c) => setOrders(orders.map(o => o.id === id ? { ...o, adminComment: c } : o)),
        addRechargeRequest,
        updateRechargeStatus: (id, s) => {
            const req = recharges.find(r => r.id === id);
            if (s === 'rejected' && req && req.status === 'pending') {
                const user = users.find(u => u.phone === req.userPhone);
                if(user) updateUserData(user.phone, { balance: user.balance + req.amount });
            }
            setRecharges(recharges.map(r => r.id === id ? { ...r, status: s } : r));
        },
        addPackageRequest,
        updatePackageRequestStatus: (id, s) => {
            const req = packageRequests.find(p => p.id === id);
            if (s === 'rejected' && req && req.status === 'pending') {
                const user = users.find(u => u.phone === req.userPhone);
                if(user) {
                    const refundAmount = req.offerPrice - (req.cashback || 0);
                    updateUserData(user.phone, { balance: user.balance + refundAmount });
                }
            }
            setPackageRequests(packageRequests.map(p => p.id === id ? { ...p, status: s } : p));
        },
        watchAdReward: () => {
            if (!currentUser || dailyAdCount >= 100) return false;
            updateUserData(currentUser.phone, { adBalance: adBalance + 0.50, dailyAdCount: dailyAdCount + 1 });
            return true;
        },
        claimYoutubeReward: () => currentUser && updateUserData(currentUser.phone, { adBalance: adBalance + 0.5 }),
        transferAdBalanceToMain: () => {
            if (!currentUser || adBalance < 500) return false;
            updateUserData(currentUser.phone, { balance: balance + adBalance, adBalance: 0 });
            return true;
        }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
