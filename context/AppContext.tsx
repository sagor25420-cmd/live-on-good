import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Offer, Product, DepositRequest, Order, RechargeRequest, PackageRequest, UserProfile, Reel, Comment, RecentTransaction } from '../types';
import { OFFERS as INITIAL_OFFERS } from '../services/mockData';

interface AppContextType {
  // Auth State
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
  
  // Ad Job Functions
  watchAdReward: () => boolean;
  claimYoutubeReward: () => void;
  transferAdBalanceToMain: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // === DATABASE STATE (Simulated) ===
  // In a real app, this would be in a backend database.
  const [users, setUsers] = useState<UserProfile[]>([
      {
          name: 'Admin',
          phone: '01818818513',
          password: 'SAGOR2542R',
          role: 'admin',
          avatar: null,
          balance: 0,
          adBalance: 0,
          dailyAdCount: 0
      }
  ]);

  // Current logged in user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Derived state for easy access (fallback to 0 if no user)
  // We use currentUser state to display, but critical logic checks the 'users' array
  const balance = currentUser?.balance || 0;
  const adBalance = currentUser?.adBalance || 0;
  const dailyAdCount = currentUser?.dailyAdCount || 0;
  
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [products, setProducts] = useState<Product[]>([
      { id: 'p1', title: 'Premium Headphone', price: 1200, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', description: 'Best sound quality' },
      { id: 'p2', title: 'Smart Watch', price: 2500, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', description: 'Waterproof' }
  ]);
  
  // Global Lists of Transactions
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recharges, setRecharges] = useState<RechargeRequest[]>([]);
  const [packageRequests, setPackageRequests] = useState<PackageRequest[]>([]);
  
  const [reels, setReels] = useState<Reel[]>([
      {
          id: 'r1',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
          caption: 'প্রকৃতির সৌন্দর্য 🌿 #nature #vlog',
          likes: 120,
          isLiked: false,
          comments: [{ id: 'c1', username: 'Rahim', text: 'Beautiful!', timestamp: Date.now() }],
          userName: 'Nature Lover',
          userAvatar: null,
          isFollowed: false,
          timestamp: Date.now()
      },
       {
          id: 'r2',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-1166-large.mp4',
          caption: 'সাগর পাড়ে একদিন 🌊',
          likes: 245,
          isLiked: true,
          comments: [],
          userName: 'Travel BD',
          userAvatar: null,
          isFollowed: true,
          timestamp: Date.now()
      }
  ]);

  // --- Auth Functions ---
  const login = (phone: string, pass: string) => {
      const user = users.find(u => u.phone === phone && u.password === pass);
      if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          return true;
      }
      return false;
  };

  const register = (name: string, phone: string, pass: string) => {
      const existing = users.find(u => u.phone === phone);
      if (existing) return false; // Duplicate phone not allowed

      const newUser: UserProfile = {
          name,
          phone,
          password: pass,
          role: 'user', 
          avatar: null,
          balance: 0, // Start with 0 balance
          adBalance: 0,
          dailyAdCount: 0
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      return true;
  };

  const logout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
  };

  // --- Helper to update specific user data in the main 'users' array ---
  const updateUserData = (phone: string, data: Partial<UserProfile>) => {
      const updatedUsers = users.map(user => {
          if (user.phone === phone) {
              const updated = { ...user, ...data };
              // If we are modifying the currently logged in user, update local state too
              if (currentUser?.phone === phone) {
                  setCurrentUser(updated);
              }
              return updated;
          }
          return user;
      });
      setUsers(updatedUsers);
  };

  // --- Transaction Logic ---
  const getRecentTransactions = (): RecentTransaction[] => {
      if (!currentUser) return [];

      // Filter function: Show all if admin, otherwise show only OWN transactions
      const isOwner = (itemPhone: string) => currentUser.role === 'admin' || currentUser.phone === itemPhone;

      const depositList: RecentTransaction[] = deposits.filter(d => isOwner(d.userPhone)).map(d => ({
          id: d.id,
          type: 'deposit',
          title: 'Money Added',
          subtitle: `${d.method} - ${d.trxId}`,
          amount: Number(d.amount),
          timestamp: d.timestamp,
          status: d.status,
          isPositive: true
      }));

      const rechargeList: RecentTransaction[] = recharges.filter(r => isOwner(r.userPhone)).map(r => ({
          id: r.id,
          type: 'recharge',
          title: 'Mobile Recharge',
          subtitle: `${r.operatorId.toUpperCase()} | ${r.phoneNumber}`,
          amount: r.amount,
          timestamp: r.timestamp,
          status: r.status,
          isPositive: false
      }));

      const packageList: RecentTransaction[] = packageRequests.filter(p => isOwner(p.userPhone)).map(p => ({
          id: p.id,
          type: 'package',
          title: 'Internet Pack',
          subtitle: `${p.offerTitle} | ${p.customerPhone}`,
          amount: p.offerPrice,
          timestamp: p.timestamp,
          status: p.status,
          isPositive: false
      }));

      // Sort by newest first
      return [...depositList, ...rechargeList, ...packageList]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20);
  };

  const recentTransactions = getRecentTransactions();

  // --- Actions ---
  const updateUserProfile = (profile: Partial<UserProfile>) => {
      if (currentUser) {
          updateUserData(currentUser.phone, profile);
      }
  };

  // Reels Logic
  const addReel = (reel: Reel) => setReels([reel, ...reels]);
  const likeReel = (id: string) => {
      setReels(prev => prev.map(r => r.id === id ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked } : r));
  };
  const addComment = (reelId: string, text: string) => {
      if (!currentUser) return;
      const newComment: Comment = { id: Date.now().toString(), username: currentUser.name, text, timestamp: Date.now() };
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, comments: [...r.comments, newComment] } : r));
  };
  const toggleFollow = (reelId: string) => {
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, isFollowed: !r.isFollowed } : r));
  };

  // Admin / Shop Logic
  const addOffer = (offer: Offer) => setOffers([offer, ...offers]);
  const deleteOffer = (id: string) => setOffers(offers.filter(o => o.id !== id));
  const addProduct = (product: Product) => setProducts([product, ...products]);
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  // === CRITICAL DEPOSIT LOGIC ===
  const addDepositRequest = (request: DepositRequest) => {
    // Attach the current user's phone to the request so we know who to credit later
    if (currentUser) {
        const newRequest = { ...request, userPhone: currentUser.phone };
        setDeposits([newRequest, ...deposits]);
    }
  };

  const approveDeposit = (id: string) => {
    const targetDeposit = deposits.find(d => d.id === id);
    
    // Only process if it exists and is pending
    if (targetDeposit && targetDeposit.status === 'pending') {
        
        // 1. Find the user who made the request
        const userToCredit = users.find(u => u.phone === targetDeposit.userPhone);
        
        if (userToCredit) {
             // 2. Update THAT user's balance
             updateUserData(userToCredit.phone, { 
                 balance: userToCredit.balance + Number(targetDeposit.amount) 
             });
        }
        
        // 3. Update request status to approved
        setDeposits(deposits.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    }
  };

  // Order Logic
  const addOrder = (order: Order) => {
    if(currentUser) {
        setOrders([{ ...order, userPhone: currentUser.phone }, ...orders]);
    }
  };
  const updateOrderComment = (id: string, comment: string) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, adminComment: comment } : o));
  };

  // Recharge Logic
  const addRechargeRequest = (request: RechargeRequest) => {
    if (!currentUser) return false;
    
    // Check if CURRENT user has enough money
    if (currentUser.balance >= request.amount) {
        // Deduct from CURRENT user
        updateUserData(currentUser.phone, { balance: currentUser.balance - request.amount });
        setRecharges([{ ...request, userPhone: currentUser.phone }, ...recharges]);
        return true;
    }
    return false;
  };

  const updateRechargeStatus = (id: string, status: 'completed' | 'rejected') => {
    setRecharges(prev => prev.map(r => {
        if (r.id === id) {
            // Refund if rejected and was pending
            if (status === 'rejected' && r.status === 'pending') {
                const userToRefund = users.find(u => u.phone === r.userPhone);
                if (userToRefund) {
                    updateUserData(userToRefund.phone, { balance: userToRefund.balance + r.amount });
                }
            }
            return { ...r, status };
        }
        return r;
    }));
  };

  // Package Logic
  const addPackageRequest = (request: PackageRequest) => {
     if (!currentUser) return false;

     if (currentUser.balance >= request.offerPrice) {
         const cashbackAmount = request.cashback || 0;
         const newBalance = (currentUser.balance - request.offerPrice) + cashbackAmount;
         
         updateUserData(currentUser.phone, { balance: newBalance });
         setPackageRequests([{ ...request, userPhone: currentUser.phone }, ...packageRequests]);
         return true;
     }
     return false;
  };

  const updatePackageRequestStatus = (id: string, status: 'completed' | 'rejected') => {
    setPackageRequests(prev => prev.map(p => {
        if (p.id === id) {
             if (status === 'rejected' && p.status === 'pending') {
                 // Refund
                 const userToRefund = users.find(u => u.phone === p.userPhone);
                 if (userToRefund) {
                     const cashbackGiven = p.cashback || 0;
                     const refundAmount = p.offerPrice - cashbackGiven;
                     updateUserData(userToRefund.phone, { balance: userToRefund.balance + refundAmount });
                 }
             }
             return { ...p, status };
        }
        return p;
    }));
  };

  // Ad Job Logic
  const watchAdReward = () => {
      if (!currentUser) return false;
      if (dailyAdCount < 100) {
          updateUserData(currentUser.phone, { 
              adBalance: adBalance + 0.50,
              dailyAdCount: dailyAdCount + 1
          });
          return true;
      }
      return false;
  };

  const claimYoutubeReward = () => {
      if (!currentUser) return;
      updateUserData(currentUser.phone, { adBalance: adBalance + 0.50 });
  };

  const transferAdBalanceToMain = () => {
      if (!currentUser) return false;
      if (adBalance >= 500) {
          updateUserData(currentUser.phone, {
              balance: balance + adBalance,
              adBalance: 0
          });
          return true;
      }
      return false;
  };

  // Expose Data: Filter for regular users, Show all for Admin
  const filteredDeposits = currentUser?.role === 'admin' ? deposits : deposits.filter(d => d.userPhone === currentUser?.phone);
  const filteredOrders = currentUser?.role === 'admin' ? orders : orders.filter(o => o.userPhone === currentUser?.phone);
  const filteredRecharges = currentUser?.role === 'admin' ? recharges : recharges.filter(r => r.userPhone === currentUser?.phone);
  const filteredPackages = currentUser?.role === 'admin' ? packageRequests : packageRequests.filter(p => p.userPhone === currentUser?.phone);

  return (
    <AppContext.Provider value={{ 
        isLoggedIn, login, register, logout,
        balance, adBalance, dailyAdCount, 
        userProfile: currentUser || { name: '', phone: '', avatar: null, role: 'user', balance: 0, adBalance: 0, dailyAdCount: 0 },
        offers, products, 
        deposits: filteredDeposits,
        orders: filteredOrders,
        recharges: filteredRecharges,
        packageRequests: filteredPackages,
        reels, recentTransactions,
        updateUserProfile, addReel, likeReel, addComment, toggleFollow,
        addOffer, deleteOffer, addProduct, deleteProduct, 
        addDepositRequest, approveDeposit, addOrder, updateOrderComment,
        addRechargeRequest, updateRechargeStatus,
        addPackageRequest, updatePackageRequestStatus,
        watchAdReward, claimYoutubeReward, transferAdBalanceToMain
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