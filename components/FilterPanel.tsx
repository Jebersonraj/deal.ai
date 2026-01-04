
import React from 'react';
import type { FilterOptions, Platform } from '../types';

interface FilterPanelProps {
    filters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
}

const platforms: Platform[] = ['Amazon', 'Flipkart', 'Myntra', 'Ajio'];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {

    const handlePlatformToggle = (platform: Platform) => {
        const newPlatforms = filters.platforms.includes(platform)
            ? filters.platforms.filter(p => p !== platform)
            : [...filters.platforms, platform];
        onFilterChange({ ...filters, platforms: newPlatforms });
    };

    return (
        <aside className="w-full md:w-72 lg:w-80 md:sticky top-24 self-start">
            <div className="p-6 bg-gray-800/40 border border-gray-700 rounded-xl backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white">Filters</h3>

                {/* Sort By */}
                <div className="mb-6">
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <select
                        id="sort-by"
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                    >
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating-desc">Highest Rating</option>
                    </select>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                    <label htmlFor="price-range" className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                        <span>₹{filters.priceRange.min}</span>
                        <span>₹{filters.priceRange.max}</span>
                    </div>
                    <input
                        type="range"
                        id="price-range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={filters.priceRange.max}
                        onChange={(e) => onFilterChange({ ...filters, priceRange: { ...filters.priceRange, max: Number(e.target.value) } })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                        <span>{filters.rating.toFixed(1)} ★</span>
                        <span>5.0 ★</span>
                    </div>
                    <input
                        type="range"
                        id="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filters.rating}
                        onChange={(e) => onFilterChange({ ...filters, rating: Number(e.target.value) })}
                         className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                </div>

                {/* Platforms */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Platforms</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.map(platform => (
                            <button
                                key={platform}
                                onClick={() => handlePlatformToggle(platform)}
                                className={`text-sm py-2 px-3 rounded-md transition-colors duration-200 ${
                                    filters.platforms.includes(platform)
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                }`}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Availability */}
                <div>
                     <div className="flex items-center">
                        <input
                            id="in-stock"
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-teal-500 focus:ring-teal-500"
                        />
                        <label htmlFor="in-stock" className="ml-3 text-sm text-gray-300">In Stock Only</label>
                    </div>
                </div>
            </div>
        </aside>
    );
};
