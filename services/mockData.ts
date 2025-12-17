import { Operator, Offer } from '../types';

export const OPERATORS: Operator[] = [
  { id: 'gp', name: 'Grameenphone', color: 'bg-blue-500', logoText: 'GP' },
  { id: 'bl', name: 'Banglalink', color: 'bg-orange-500', logoText: 'BL' },
  { id: 'robi', name: 'Robi', color: 'bg-red-600', logoText: 'Robi' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500', logoText: 'Air' },
  { id: 'teletalk', name: 'Teletalk', color: 'bg-green-600', logoText: 'TT' },
];

export const OFFERS: Offer[] = [
  { id: '1', operatorId: 'gp', title: 'Monthly Blast', data: '10 GB', minutes: '200 Min', validity: '30 Days', price: 499, cashback: 50, type: 'bundle' },
  { id: '2', operatorId: 'gp', title: 'Data Only', data: '5 GB', minutes: '0 Min', validity: '7 Days', price: 149, cashback: 10, type: 'internet' },
  { id: '3', operatorId: 'bl', title: 'Power Pack', data: '20 GB', minutes: '500 Min', validity: '30 Days', price: 699, cashback: 60, type: 'bundle' },
  { id: '4', operatorId: 'bl', title: 'Small Talk', data: '1 GB', minutes: '50 Min', validity: '3 Days', price: 58, cashback: 0, type: 'bundle' },
  { id: '5', operatorId: 'robi', title: 'Internet Offer', data: '50 GB', minutes: '0 Min', validity: '30 Days', price: 999, cashback: 100, type: 'internet' },
  { id: '6', operatorId: 'airtel', title: 'Fun Pack', data: '3 GB', minutes: '100 Min', validity: '7 Days', price: 198, cashback: 20, type: 'bundle' },
];