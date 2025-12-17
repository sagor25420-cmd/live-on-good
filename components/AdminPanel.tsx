
import React, { useState, useRef } from 'react';
import { ArrowLeft, Trash2, LayoutGrid, ShoppingBag, DollarSign, FileText, Smartphone, Gift, Upload, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Offer, Product } from '../types';
import { OPERATORS } from '../services/mockData';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'drive_req' | 'recharges' | 'deposits' | 'offers' | 'products' | 'orders'>('offers');
  const { 
    offers, addOffer, deleteOffer, 
    products, addProduct, deleteProduct, 
    deposits, approveDeposit, 
    orders, updateOrderComment,
    recharges, updateRechargeStatus,
    packageRequests, updatePackageRequestStatus
  } = useAppContext();

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({ type: 'bundle', operatorId: 'gp', data: '0 GB', minutes: '0 Min', validity: '30 Days', cashback: 0 });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddOffer = () => {
    if (newOffer.title && newOffer.price) {
        addOffer({
            id: Date.now().toString(),
            title: newOffer.title,
            data: newOffer.data || '0 GB',
            minutes: newOffer.minutes || '0 Min',
            validity: newOffer.validity || '30 Days',
            price: Number(newOffer.price),
            cashback: Number(newOffer.cashback || 0),
            type: newOffer.type as any,
            operatorId: newOffer.operatorId as string
        });
        setNewOffer({ type: 'bundle', operatorId: 'gp', data: '0 GB', minutes: '0 Min', validity: '30 Days', cashback: 0 });
    } else {
        alert("অফারের নাম এবং মূল্য আবশ্যক।");
    }
  };

  const handleAddProduct = () => {
    if (newProduct.title && newProduct.price && newProduct.image) {
        addProduct({
            id: Date.now().toString(),
            title: newProduct.title,
            price: Number(newProduct.price),
            image: newProduct.image,
            description: newProduct.description
        });
        setNewProduct({});
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderComment = (id: string, currentComment: string | undefined) => {
      const comment = prompt("কাস্টমারের জন্য মেসেজ লিখুন:", currentComment || "");
      if (comment !== null) {
          updateOrderComment(id, comment);
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'offers':
              return (
                  <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                          <h3 className="font-bold text-gray-700 text-lg">নতুন অফার যোগ করুন</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                               <select value={newOffer.operatorId} onChange={e => setNewOffer({...newOffer, operatorId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm font-semibold text-gray-900">
                                  {OPERATORS.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                              </select>
                              <select value={newOffer.type} onChange={e => setNewOffer({...newOffer, type: e.target.value as any})} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm font-semibold text-gray-900">
                                  <option value="bundle">বান্ডেল</option>
                                  <option value="internet">ইন্টারনেট</option>
                                  <option value="voice">মিনিট</option>
                              </select>
                          </div>
                          <input type="text" placeholder="অফারের নাম (e.g., Monthly Blast)" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.title || ''} onChange={e => setNewOffer({...newOffer, title: e.target.value})} />
                          <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="ডেটা (e.g., 10 GB)" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.data || ''} onChange={e => setNewOffer({...newOffer, data: e.target.value})} />
                              <input type="text" placeholder="মিনিট (e.g., 200 Min)" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.minutes || ''} onChange={e => setNewOffer({...newOffer, minutes: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                              <input type="text" placeholder="মেয়াদ (e.g., 30 Days)" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.validity || ''} onChange={e => setNewOffer({...newOffer, validity: e.target.value})} />
                              <input type="number" placeholder="মূল্য (Price)" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.price || ''} onChange={e => setNewOffer({...newOffer, price: Number(e.target.value)})} />
                              <input type="number" placeholder="ক্যাশব্যাক" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm text-gray-900" value={newOffer.cashback || ''} onChange={e => setNewOffer({...newOffer, cashback: Number(e.target.value)})} />
                          </div>
                          <button onClick={handleAddOffer} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">অফার যোগ করুন</button>
                      </div>
                      <div className="space-y-3">
                          <h3 className="font-bold text-gray-700">বিদ্যমান অফারসমূহ ({offers.length})</h3>
                          {offers.map(offer => (
                              <div key={offer.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
                                  <div>
                                      <p className="font-bold text-gray-800">{offer.title} <span className="text-xs uppercase text-gray-400">({offer.operatorId})</span></p>
                                      <p className="text-xs text-gray-500">{offer.data} / {offer.minutes} / {offer.validity}</p>
                                      <p className="font-bold text-blue-600">৳{offer.price}</p>
                                  </div>
                                  <button onClick={() => deleteOffer(offer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'drive_req':
              return (
                  <div className="space-y-3">
                      <h3 className="font-bold text-gray-700">Package Requests ({packageRequests.filter(r => r.status === 'pending').length})</h3>
                      {packageRequests.length === 0 ? <p className="text-gray-400 text-center py-4">No package requests</p> : packageRequests.map(req => (
                          <div key={req.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm relative ${req.status === 'completed' ? 'border-green-500 opacity-75' : req.status === 'rejected' ? 'border-red-500 opacity-75' : 'border-pink-500'}`}>
                              <p className="font-bold text-lg text-gray-800">{req.customerPhone}</p>
                              <p className="text-xs text-gray-500 uppercase font-bold">{req.operatorId} | {req.offerTitle}</p>
                              <p className="text-xs text-gray-400">User: {req.userPhone}</p>
                              <div className="flex justify-between items-center mt-3 border-t pt-3">
                                  <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'}`}>{req.status}</span>
                                  {req.status === 'pending' && (
                                      <div className="flex gap-2">
                                          <button onClick={() => updatePackageRequestStatus(req.id, 'rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200">Reject</button>
                                          <button onClick={() => updatePackageRequestStatus(req.id, 'completed')} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">Accept</button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'recharges':
              return (
                  <div className="space-y-3">
                      <h3 className="font-bold text-gray-700">Recharge Requests ({recharges.filter(r => r.status === 'pending').length})</h3>
                      {recharges.length === 0 ? <p className="text-gray-400 text-center py-4">No recharge requests</p> : recharges.map(req => (
                          <div key={req.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm ${req.status === 'completed' ? 'border-green-500 opacity-75' : req.status === 'rejected' ? 'border-red-500 opacity-75' : 'border-blue-500'}`}>
                              <p className="font-bold text-lg text-gray-800">{req.phoneNumber} <span className="text-sm font-medium text-gray-500">({req.type})</span></p>
                              <p className="text-xs text-gray-500 uppercase font-bold">{req.operatorId}</p>
                              <p className="text-xs text-gray-400">User: {req.userPhone}</p>
                              <p className="font-bold text-xl text-blue-600 mt-1">৳{req.amount}</p>
                              <div className="flex justify-between items-center mt-3 border-t pt-3">
                                  <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{req.status}</span>
                                  {req.status === 'pending' && (
                                      <div className="flex gap-2">
                                          <button onClick={() => updateRechargeStatus(req.id, 'rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200">Reject</button>
                                          <button onClick={() => updateRechargeStatus(req.id, 'completed')} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">Accept</button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'deposits':
              return (
                  <div className="space-y-3">
                      <h3 className="font-bold text-gray-700">Deposit Requests ({deposits.filter(d => d.status === 'pending').length})</h3>
                      {deposits.length === 0 ? <p className="text-gray-400 text-center py-4">No deposit requests</p> : deposits.map(dep => (
                          <div key={dep.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm ${dep.status === 'approved' ? 'border-green-500 opacity-75' : dep.status === 'rejected' ? 'border-red-500 opacity-75' : 'border-yellow-500'}`}>
                              <p className="font-bold text-lg text-gray-800">৳{dep.amount}</p>
                              <p className="text-sm text-gray-500">From: {dep.senderNumber}</p>
                              <p className="text-xs text-gray-400 font-mono">TrxID: {dep.trxId}</p>
                              <p className="text-xs text-gray-400">To User: {dep.userPhone}</p>
                              <div className="flex justify-between items-center mt-3 border-t pt-3">
                                  <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${dep.status === 'approved' ? 'bg-green-100 text-green-700' : dep.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{dep.status}</span>
                                  {dep.status === 'pending' && (
                                      <button onClick={() => approveDeposit(dep.id)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">Approve</button>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'products':
              return (
                  <div className="space-y-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                          <h3 className="font-bold text-gray-700">Add Product</h3>
                          <input type="text" placeholder="Product Title" className="w-full p-2 border rounded" value={newProduct.title || ''} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                              {newProduct.image ? <img src={newProduct.image} alt="Preview" className="w-full h-32 object-contain rounded" /> : <><Upload className="mx-auto mb-2" size={24} /><span className="text-sm">Upload Image</span></>}
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </div>
                          <input type="number" placeholder="Price" className="w-full p-2 border rounded" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                          <button onClick={handleAddProduct} className="w-full bg-green-600 text-white py-2 rounded font-bold">Add Product</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          {products.map(prod => (
                              <div key={prod.id} className="bg-white p-2 rounded-lg shadow-sm relative group">
                                  <img src={prod.image} className="w-full h-32 object-cover rounded mb-2" alt={prod.title} />
                                  <h4 className="font-bold text-sm truncate">{prod.title}</h4>
                                  <p className="text-blue-600 font-bold text-sm">৳{prod.price}</p>
                                  <button onClick={() => deleteProduct(prod.id)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 shadow"><Trash2 size={14}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          default: return null;
      }
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-100">
      <div className="bg-gray-800 p-4 text-white flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack}><ArrowLeft /></button>
        <h1 className="font-bold text-lg">Admin Panel</h1>
      </div>

      <div className="flex bg-white shadow-sm sticky top-14 z-10 overflow-x-auto no-scrollbar">
        {[
            { id: 'offers', icon: <LayoutGrid size={18} />, label: 'Offers' },
            { id: 'drive_req', icon: <Gift size={18} />, label: 'Drive Req' },
            { id: 'recharges', icon: <Smartphone size={18} />, label: 'Recharges' },
            { id: 'deposits', icon: <DollarSign size={18} />, label: 'Deposits' },
            { id: 'products', icon: <ShoppingBag size={18} />, label: 'Shop' },
            { id: 'orders', icon: <FileText size={18} />, label: 'Orders' },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500'}`}
            >
                {tab.icon} {tab.label}
            </button>
        ))}
      </div>

      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
