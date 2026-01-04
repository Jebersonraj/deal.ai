
import React from 'react';
import type { Product } from '../types';
import { StarIcon, CardOfferIcon, EmiIcon } from './IconComponents';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const platformLogos: { [key in Product['platform']]: string } = {
    Amazon: 'bg-yellow-400 text-black',
    Flipkart: 'bg-blue-600 text-white',
    Myntra: 'bg-pink-500 text-white',
    Ajio: 'bg-red-600 text-white',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
        onClick={() => onSelect(product)}
        className="group cursor-pointer relative flex flex-col h-full bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1"
    >
        <div className="relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover bg-gray-700" />
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${platformLogos[product.platform]}`}>
                {product.platform}
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-white group-hover:text-teal-300 transition-colors duration-300 mb-2 line-clamp-2">{product.name}</h3>
            
            <div className="my-2 space-y-1 text-xs flex-grow">
                <div className="flex items-center gap-1.5 text-green-400">
                    <CardOfferIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{product.bestCardOffer}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                    <EmiIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{product.bestEmiPlan}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
                <p className="text-2xl font-bold text-white">₹{product.price.toFixed(0)}</p>
                <div className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-gray-200">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
    return (
        <div className="relative bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-md animate-pulse">
            <div className="w-full h-48 bg-gray-700"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 my-2">
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
};
