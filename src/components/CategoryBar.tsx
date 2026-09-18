import React from 'react';
import { CATEGORIES } from '../data/products';
import { 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Tv, 
  Sofa, 
  HeartHandshake, 
  ShoppingBasket,
  ChevronDown
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string, subcategory?: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-emerald-600" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-teal-600" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-rose-500" />;
      case 'Tv': return <Tv className="w-6 h-6 text-emerald-700" />;
      case 'Sofa': return <Sofa className="w-6 h-6 text-amber-700" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-pink-500" />;
      case 'ShoppingBasket': return <ShoppingBasket className="w-6 h-6 text-emerald-500" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 overflow-x-auto no-scrollbar py-2 sm:py-3 justify-start">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div 
                key={cat.id} 
                className="relative group flex-shrink-0"
              >
                <button
                  id={`cat-btn-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 px-2 py-1 rounded transition-all cursor-pointer select-none ${
                    isSelected ? 'text-[#0b8442]' : 'text-slate-700 hover:text-[#0b8442]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-emerald-50 transition-colors p-1.5 overflow-hidden border border-slate-100 group-hover:border-emerald-200">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                    />
                  </div>
                  
                  <span className={`text-xs font-bold whitespace-nowrap flex items-center gap-0.5 ${
                    isSelected ? 'text-[#0b8442] underline underline-offset-4 decoration-2' : ''
                  }`}>
                    {cat.name}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform hidden sm:inline" />
                    )}
                  </span>
                </button>

                {/* Subcategories Hover Popover */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 bg-white rounded-md shadow-xl border border-slate-200 py-2 z-30">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular in {cat.name}
                    </div>
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        id={`subcat-btn-${sub.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(cat.id, sub);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#0b8442] transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
