import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

interface ShopScreenProps {
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onBack, onSelectProduct }) => {
  const { products } = useAppContext();

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">শপ</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="h-32 bg-gray-200 relative">
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{product.title}</h3>
                    {product.description && <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.description}</p>}
                    <div className="mt-auto pt-2 flex justify-between items-center">
                        <span className="font-bold text-yellow-600">৳{product.price}</span>
                        <button 
                            onClick={() => onSelectProduct(product)}
                            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                        >
                            <ShoppingBag size={16} />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ShopScreen;