
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { ProductGrid } from './components/ProductGrid';
import { FilterPanel } from './components/FilterPanel';
import { ProductDetailView } from './components/ProductDetailView';
import { searchProducts, fetchMoreProducts } from './services/geminiService';
import type { Product, Platform, FilterOptions } from './types';
import { useDebounce } from './hooks/useDebounce';

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        priceRange: { min: 0, max: 50000 },
        rating: 0,
        platforms: [],
        inStock: true,
        sortBy: 'price-asc',
    });

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim() === '') {
            setProducts([]);
            setShowResults(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        setShowResults(true);
        setSelectedProduct(null);
        try {
            const results = await searchProducts(query);
            setProducts(results);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch product data. The AI might be busy, please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleLoadMore = async () => {
        if (isFetchingMore || debouncedSearchQuery.trim() === '') return;

        setIsFetchingMore(true);
        setError(null);
        try {
            const existingIds = products.map(p => p.id);
            const moreResults = await fetchMoreProducts(debouncedSearchQuery, existingIds);
            setProducts(prevProducts => [...prevProducts, ...moreResults]);
        } catch (err) {
            console.error(err);
            setError('Failed to load more products. Please try again.');
        } finally {
            setIsFetchingMore(false);
        }
    };


    useEffect(() => {
        handleSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery, handleSearch]);

    const filteredAndSortedProducts = useMemo(() => {
        return products
            .filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max)
            .filter(p => p.rating >= filters.rating)
            .filter(p => filters.platforms.length === 0 || filters.platforms.includes(p.platform))
            .filter(p => !filters.inStock || p.inStock)
            .sort((a, b) => {
                switch (filters.sortBy) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'rating-desc':
                        return b.rating - a.rating;
                    default:
                        return 0;
                }
            });
    }, [products, filters]);
    
    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToResults = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-gray-900 to-gray-900 z-0"></div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Header />
                <main>
                    {!selectedProduct && (
                        <div className={`transition-all duration-700 ${showResults ? 'pt-8' : 'pt-24 md:pt-40'}`}>
                            <div className="text-center max-w-3xl mx-auto">
                                <h1 className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 transition-all duration-700 ${showResults ? 'mb-2' : 'mb-4'}`}>
                                    Deal.ai
                                </h1>
                                <p className={`text-lg md:text-xl text-gray-300 transition-all duration-700 ${showResults ? 'mb-6' : 'mb-8'}`}>
                                    Find the best deal. Before the deal finds you.
                                </p>
                            </div>
                            <SearchInput value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    )}

                    {showResults && (
                        <div className="mt-12">
                            {selectedProduct ? (
                                <ProductDetailView product={selectedProduct} onBack={handleBackToResults} />
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8">
                                    <FilterPanel filters={filters} onFilterChange={setFilters} />
                                    <div className="flex-1">
                                        <ProductGrid
                                            products={filteredAndSortedProducts}
                                            isLoading={isLoading}
                                            error={error}
                                            onSelectProduct={handleSelectProduct}
                                        />
                                        {!isLoading && filteredAndSortedProducts.length > 0 && !error && (
                                            <div className="mt-8 text-center">
                                                <button
                                                    onClick={handleLoadMore}
                                                    disabled={isFetchingMore}
                                                    className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                                                >
                                                    {isFetchingMore ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        'Load More'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
