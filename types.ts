import React from 'react';

export type ViewState = 'HOME' | 'RECHARGE' | 'OFFERS' | 'HISTORY' | 'PROFILE' | 'DEPOSIT' | 'PAY_BILL' | 'SHOP' | 'SHOP_CHECKOUT' | 'ADMIN' | 'ADS_JOB';
export type AuthView = 'LOGIN' | 'REGISTER';

export interface Operator {
  id: string;
  name: string;
  color: string;
  logoText: string;
}

export interface Offer {
  id: string;
  operatorId: string;
  title: string;
  data: string;
  minutes: string;
  validity: string;
  price: number;
  cashback?: number; 
  type: 'internet' | 'bundle' | 'voice';
}

export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description?: string;
}

export interface DepositRequest {
    id: string;
    userPhone: string; // Account to credit (যার একাউন্টে টাকা যাবে)
    amount: string;
    senderNumber: string; 
    trxId: string;
    method: 'bkash' | 'upay';
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface RechargeRequest {
    id: string;
    userPhone: string; // Account who requested (যে ইউজার রিচার্জ করছে)
    phoneNumber: string; 
    operatorId: string;
    amount: number;
    type: string;
    status: 'pending' | 'completed' | 'rejected';
    timestamp: number;
}

export interface PackageRequest {
    id: string;
    userPhone: string; // Account who requested
    customerPhone: string;
    offerTitle: string;
    offerData: string;
    offerMinutes: string;
    offerPrice: number;
    cashback?: number;
    operatorId: string;
    status: 'pending' | 'completed' | 'rejected';
    timestamp: number;
}

export interface Order {
    id: string;
    userPhone: string; // Account who ordered
    customerName: string;
    customerPhone: string;
    address: string;
    productTitle: string;
    totalPrice: number;
    status: 'pending' | 'completed';
    adminComment?: string;
    timestamp: number;
}

export interface RecentTransaction {
    id: string;
    type: 'deposit' | 'recharge' | 'package';
    title: string;
    subtitle: string;
    amount: number;
    timestamp: number;
    status: string;
    isPositive: boolean;
}

export interface UserProfile {
    name: string;
    avatar: string | null;
    phone: string;
    password?: string;
    role: 'user' | 'admin';
    balance: number;      // Individual Balance
    adBalance: number;    // Individual Ad Balance
    dailyAdCount: number; // Individual Ad Count
}

export interface Comment {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

export interface Reel {
    id: string;
    videoUrl: string;
    caption: string;
    likes: number;
    isLiked: boolean;
    comments: Comment[];
    userName: string;
    userAvatar: string | null;
    isFollowed: boolean;
    timestamp: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}