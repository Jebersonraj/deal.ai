
import React, { useState, useEffect } from 'react';
import type { Product, ProductDetails } from '../types';
import { fetchProductDetails } from '../services/geminiService';
import { PriceChart } from './PriceChart';
import { StarIcon, CardOfferIcon, EmiIcon } from './IconComponents';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
}

const platformStyles: { [key in Product['platform']]: string } = {
    Amazon: 'bg-yellow-400 text-black',
    Flipkart: 'bg-blue-600 text-white',
    Myntra: 'bg-pink-500 text-white',
    Ajio: 'bg-red-600 text-white',
};

// Simple in-memory cache to store fetched details for the session
const detailsCache = new Map<string, ProductDetails>();

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
    const [details, setDetails] = useState<ProductDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDetails = async () => {
            setIsLoading(true);
            setError(null);
            
            // Check cache first
            if (detailsCache.has(product.id)) {
                setDetails(detailsCache.get(product.id)!);
                setIsLoading(false);
                return;
            }

            try {
                const fetchedDetails = await fetchProductDetails(product);
                setDetails(fetchedDetails);
                detailsCache.set(product.id, fetchedDetails); // Save to cache
            } catch (err) {
                setError('Could not load detailed product information. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDetails();
    }, [product]);

    return (
        <div className="space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Back to results
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-md">
                            <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg mb-4 bg-gray-700"/>
                            <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
                            <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${platformStyles[product.platform]}`}>
                                {product.platform}
                            </div>
                            
                            <div className="my-4 space-y-3 border-y border-gray-700 py-4">
                                <div className="flex items-start gap-3 text-green-300">
                                    <CardOfferIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm text-white">Best Card Offer</p>
                                        <p className="text-sm text-gray-300">{product.bestCardOffer}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-blue-300">
                                    <EmiIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm text-white">Top EMI Plan</p>
                                        <p className="text-sm text-gray-300">{product.bestEmiPlan}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-baseline justify-between mb-4">
                                <p className="text-4xl font-extrabold text-teal-300">₹{product.price.toFixed(0)}</p>
                                <div className="flex items-center gap-1">
                                    <StarIcon className="w-5 h-5 text-yellow-400" />
                                    <span className="font-semibold text-gray-200">{product.rating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <a 
                                href={product.productUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full block text-center bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-400 transition-colors"
                            >
                                View Deal
                            </a>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {isLoading && (
                        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-md animate-pulse">
                            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
                            <div className="h-64 bg-gray-700 rounded-lg mb-6"></div>
                             <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                             <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    )}
                    {error && <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg text-red-300">{error}</div>}
                    
                    {details && (
                        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-md">
                            <h2 className="text-2xl font-bold mb-4 text-white">Price History & AI Prediction</h2>
                            <PriceChart history={details.priceHistory} prediction={details.pricePrediction} />
                             <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="font-semibold text-teal-300 mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A.75.75 0 009 13.5h.25a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A.75.75 0 009 9z" clipRule="evenodd" /></svg>
                                    AI Prediction Analysis
                                </h3>
                                <p className="text-gray-300 text-sm">{details.predictionExplanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
