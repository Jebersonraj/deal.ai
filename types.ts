
export type Platform = 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio';

export interface Product {
  id: string;
  name: string;
  platform: Platform;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  inStock: boolean;
  bestCardOffer: string;
  bestEmiPlan: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PricePredictionPoint {
    date: string;
    predictedPrice: number;
    confidenceMin: number;
    confidenceMax: number;
}

export interface ProductDetails extends Product {
    priceHistory: PriceHistoryPoint[];
    pricePrediction: PricePredictionPoint[];
    predictionExplanation: string;
}

export interface FilterOptions {
    priceRange: { min: number; max: number };
    rating: number;
    platforms: Platform[];
    inStock: boolean;
    sortBy: 'price-asc' | 'price-desc' | 'rating-desc';
}
