import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Clock, ChevronRight, Zap, Star, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface DealsShelfProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll?: () => void;
}

export const DealsShelf: React.FC<DealsShelfProps> = ({
  title,
  subtitle,
  products,
  onSelectProduct,
  onViewAll
}) => {
  // Countdown timer for Deal of the Day (14 hrs remaining)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
      {/* Shelf Header with Timer */}
      <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>

          {/* Deal Timer */}
          <div className="hidden sm:flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-bold border border-red-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDigits(timeLeft.hours)}h : {formatDigits(timeLeft.minutes)}m : {formatDigits(timeLeft.seconds)}s left</span>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="self-end sm:self-auto text-xs font-bold text-[#0b8442] hover:bg-emerald-50 px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Product Track */}
      <div className="flex items-stretch overflow-x-auto no-scrollbar divide-x divide-slate-100 p-2 sm:p-3">
        {products.map((product) => (
          <div
            key={product.id}
            id={`deal-shelf-item-${product.id}`}
            onClick={() => onSelectProduct(product)}
            className="w-48 sm:w-56 flex-shrink-0 p-3 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group bg-white rounded"
          >
            <div>
              <div className="w-full h-36 sm:h-40 flex items-center justify-center p-2 bg-slate-50 rounded mb-2 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {product.discountPercent >= 30 && (
                  <span className="absolute top-2 left-2 bg-[#388e3c] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold mb-1">
                <span>{product.brand}</span>
                {product.assured && (
                  <span className="text-[#0b8442] italic font-black">Apni-Assured</span>
                )}
              </div>

              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#0b8442] transition-colors">
                {product.title}
              </h4>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-extrabold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
              <p className="text-[10px] text-[#388e3c] font-bold mt-0.5">
                Save {formatPrice(product.originalPrice - product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
