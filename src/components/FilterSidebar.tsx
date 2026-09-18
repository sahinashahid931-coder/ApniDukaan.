import React from 'react';
import { FilterState, Product } from '../types';
import { CATEGORIES } from '../data/products';
import { Star, RotateCcw, Check, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  allProducts: Product[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allProducts
}) => {
  // Extract all unique brands with their product counts
  const brandCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const brandsList = Object.keys(brandCounts).sort();

  const handleBrandToggle = (brand: string) => {
    const current = [...filters.selectedBrands];
    const index = current.indexOf(brand);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(brand);
    }
    onFilterChange({ selectedBrands: current });
  };

  const isAnyFilterActive = 
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200000 ||
    filters.minRating > 0 ||
    filters.assuredOnly ||
    filters.selectedBrands.length > 0 ||
    filters.inStockOnly;

  return (
    <aside className="bg-white rounded-md border border-slate-200 shadow-xs divide-y divide-slate-100 text-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-bold text-base text-slate-800 tracking-wide">Filters</h3>
        {isAnyFilterActive && (
          <button
            id="clear-all-filters-btn"
            onClick={onResetFilters}
            className="text-xs text-[#0b8442] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            id="filter-cat-all"
            onClick={() => onFilterChange({ category: 'all', subcategory: '' })}
            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
              filters.category === 'all'
                ? 'bg-emerald-50 text-[#0b8442] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-slate-400">({allProducts.length})</span>
          </button>

          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
            const count = allProducts.filter(p => p.category === cat.id).length;
            const isSelected = filters.category === cat.id;

            return (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => onFilterChange({ category: cat.id, subcategory: '' })}
                className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 text-[#0b8442] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-400">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ApniDukaan Assured Filter */}
      <div className="p-4">
        <label 
          htmlFor="apnidukaan-assured-checkbox"
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <input
              id="apnidukaan-assured-checkbox"
              type="checkbox"
              checked={filters.assuredOnly}
              onChange={(e) => onFilterChange({ assuredOnly: e.target.checked })}
              className="w-4 h-4 rounded text-[#0b8442] focus:ring-emerald-500 border-slate-300"
            />
            <div className="flex items-center gap-1 italic text-xs font-black text-[#0b8442]">
              <span>Apni-Assured</span>
              <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Verified Plus</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range</h4>
          <span className="text-xs font-semibold text-[#0b8442]">
            {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
          </span>
        </div>

        {/* Max price slider */}
        <div>
          <input
            id="price-range-slider"
            type="range"
            min="500"
            max="200000"
            step="1000"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[#0b8442] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Min (₹500)</span>
            <span>Max (₹2,00,000)</span>
          </div>
        </div>

        {/* Quick price presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => onFilterChange({ minPrice: 0, maxPrice: 5000 })}
            className="px-2 py-1 text-[11px] border border-slate-200 rounded hover:border-[#0b8442] hover:text-[#0b8442] transition-colors"
          >
            Under ₹5,000
          </button>
          <button
            onClick={() => onFilterChange({ minPrice: 5000, maxPrice: 30000 })}
            className="px-2 py-1 text-[11px] border border-slate-200 rounded hover:border-[#0b8442] hover:text-[#0b8442] transition-colors"
          >
            ₹5K - ₹30K
          </button>
          <button
            onClick={() => onFilterChange({ minPrice: 30000, maxPrice: 75000 })}
            className="px-2 py-1 text-[11px] border border-slate-200 rounded hover:border-[#0b8442] hover:text-[#0b8442] transition-colors"
          >
            ₹30K - ₹75K
          </button>
          <button
            onClick={() => onFilterChange({ minPrice: 75000, maxPrice: 200000 })}
            className="px-2 py-1 text-[11px] border border-slate-200 rounded hover:border-[#0b8442] hover:text-[#0b8442] transition-colors"
          >
            Above ₹75K
          </button>
        </div>
      </div>

      {/* Customer Ratings */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Ratings</h4>
        <div className="space-y-1.5">
          {[4, 3].map((star) => (
            <label
              key={star}
              htmlFor={`rating-filter-${star}`}
              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none hover:text-[#0b8442]"
            >
              <input
                id={`rating-filter-${star}`}
                type="checkbox"
                checked={filters.minRating === star}
                onChange={() => onFilterChange({ minRating: filters.minRating === star ? 0 : star })}
                className="w-4 h-4 rounded text-[#0b8442] focus:ring-emerald-500 border-slate-300"
              />
              <div className="flex items-center gap-1 font-semibold">
                <span>{star}★ & above</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filters */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {brandsList.map((brand) => {
            const isChecked = filters.selectedBrands.includes(brand);
            const count = brandCounts[brand];

            return (
              <label
                key={brand}
                htmlFor={`brand-checkbox-${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none hover:text-[#0b8442]"
              >
                <div className="flex items-center gap-2">
                  <input
                    id={`brand-checkbox-${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 rounded text-[#0b8442] focus:ring-emerald-500 border-slate-300"
                  />
                  <span>{brand}</span>
                </div>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="p-4">
        <label 
          htmlFor="in-stock-only-checkbox"
          className="flex items-center justify-between cursor-pointer select-none text-xs text-slate-700"
        >
          <span>Exclude Out of Stock</span>
          <input
            id="in-stock-only-checkbox"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#0b8442] focus:ring-emerald-500 border-slate-300"
          />
        </label>
      </div>
    </aside>
  );
};
