
import React, { useState, useRef } from 'react';
import { ArrowLeft, Trash2, LayoutGrid, ShoppingBag, DollarSign, FileText, Smartphone, Gift, Upload, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Offer, Product } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'recharges' | 'drive_req' | 'offers' | 'products' | 'deposits' | 'orders'>('drive_req');
  const { 
    offers, addOffer, deleteOffer, 
    products, addProduct, deleteProduct, 
    deposits, approveDeposit, 
    orders, updateOrderComment,
    recharges, updateRechargeStatus,
    packageRequests, updatePackageRequestStatus
  } = useAppContext();

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({ type: 'bundle', operatorId: 'gp' });
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
        setNewOffer({ type: 'bundle', operatorId: 'gp' });
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
        // High quality data URL
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

  return (
    <div className="pb-20 min-h-screen bg-gray-100">
      <div className="bg-gray-800 p-4 text-white flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack}><ArrowLeft /></button>
        <h1 className="font-bold text-lg">Admin Panel</h1>
      </div>

      <div className="flex bg-white shadow-sm sticky top-14 z-10 overflow-x-auto no-scrollbar">
        {[
            { id: 'drive_req', icon: <Gift size={18} />, label: 'Drive Req' },
            { id: 'recharges', icon: <Smartphone size={18} />, label: 'Recharges' },
            { id: 'deposits', icon: <DollarSign size={18} />, label: 'Deposits' },
            { id: 'offers', icon: <LayoutGrid size={18} />, label: 'Offers' },
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
        {activeTab === 'drive_req' && (
            <div className="space-y-3">
                <h3 className="font-bold text-gray-700">Package Requests</h3>
                {packageRequests.length === 0 && <p className="text-gray-400 text-center py-4">No package requests</p>}
                {packageRequests.map(req => (
                    <div key={req.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm relative ${req.status === 'completed' ? 'border-green-500 opacity-75' : req.status === 'rejected' ? 'border-red-500 opacity-75' : 'border-pink-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{req.customerPhone}</p>
                                <p className="text-xs text-gray-500 uppercase font-bold">{req.operatorId} | {req.offerTitle}</p>
                                <p className="text-xs text-gray-400">User: {req.userPhone}</p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-xl text-pink-600 block">৳{req.offerPrice}</span>
                                {req.cashback && req.cashback > 0 && (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1 rounded">
                                        Cashback: ৳{req.cashback}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 border-t pt-3">
                            <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'}`}>
                                {req.status}
                            </span>
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
        )}

        {activeTab === 'products' && (
             <div className="space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                    <h3 className="font-bold text-gray-700">Add Product</h3>
                    <input type="text" placeholder="Product Title" className="w-full p-2 border rounded" value={newProduct.title || ''} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                    
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition min-h-[140px]" 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {newProduct.image ? (
                            <div className="relative w-full h-32">
                                <img src={newProduct.image} alt="Preview" className="w-full h-full object-contain rounded" style={{ imageRendering: 'auto' }} />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white font-bold rounded">Change Photo</div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <Upload className="mx-auto mb-2" size={24} />
                                <span className="text-sm font-medium">Click to upload image (High Quality)</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <input type="number" placeholder="Price" className="w-full p-2 border rounded" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    <button onClick={handleAddProduct} className="w-full bg-green-600 text-white py-2 rounded font-bold">Add Product</button>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                     {products.map(prod => (
                         <div key={prod.id} className="bg-white p-2 rounded-lg shadow-sm relative group">
                             <img src={prod.image} className="w-full h-32 object-cover rounded mb-2" alt="" style={{ imageRendering: 'auto' }} />
                             <h4 className="font-bold text-sm truncate">{prod.title}</h4>
                             <p className="text-blue-600 font-bold text-sm">৳{prod.price}</p>
                             <button onClick={() => deleteProduct(prod.id)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 shadow"><Trash2 size={14}/></button>
                         </div>
                     ))}
                 </div>
             </div>
        )}
        {/* Other tabs follow same pattern... */}
      </div>
    </div>
  );
};

export default AdminPanel;
