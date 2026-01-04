
import React from 'react';
import type { Product } from '../types';
import { ProductCard, SkeletonCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, error, onSelectProduct }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-gray-800/50 rounded-lg">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">No products found. Try adjusting your filters or search terms.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
        </div>
    );
};
