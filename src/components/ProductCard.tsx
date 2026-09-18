import React from 'react';
import { Product } from '../types';
import { Heart, Star, Sparkles, Zap, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  viewMode = 'grid'
}) => {
  if (viewMode === 'list') {
    return (
      <div 
        id={`product-list-item-${product.id}`}
        className="bg-white p-3 sm:p-4 rounded-md border border-slate-200 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row gap-3 sm:gap-4 relative group w-full min-w-0 overflow-hidden"
      >
        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute right-3 sm:right-4 top-3 sm:top-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 shadow-xs transition-colors"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Product Image */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="w-full sm:w-44 md:w-48 h-44 sm:h-48 flex-shrink-0 cursor-pointer overflow-hidden rounded flex items-center justify-center bg-slate-50 relative p-2"
        >
          <img 
            src={product.image} 
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Product Details & Specs */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="flex-1 cursor-pointer space-y-1.5 sm:space-y-2 pr-2 sm:pr-6 min-w-0"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">{product.brand}</span>
            {product.assured && (
              <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-black italic text-[#0b8442] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <span>Apni-Assured</span>
                <Sparkles className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0b8442] transition-colors leading-snug break-words">
            {product.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold">
              {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-slate-500 text-xs truncate">
              {product.ratingCount.toLocaleString()} Ratings & {product.reviewsCount.toLocaleString()} Reviews
            </span>
          </div>

          {/* Highlights */}
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside pt-1 hidden md:block">
            {product.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="line-clamp-1">{h}</li>
            ))}
          </ul>
        </div>

        {/* Price & Actions Section */}
        <div className="w-full sm:w-52 md:w-56 flex-shrink-0 flex flex-col justify-between sm:border-l sm:border-slate-100 sm:pl-4 pt-2 sm:pt-0 min-w-0">
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap min-w-0">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-bold text-[#388e3c]">
                {product.discountPercent}% off
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              {product.fastDelivery ? '⚡ Free delivery by Tomorrow' : 'Standard Delivery: 2-3 days'}
            </p>

            <p className="text-[11px] text-[#388e3c] font-semibold mt-0.5">
              Bank Offer available
            </p>
          </div>

          <div className="pt-3 flex gap-2 min-w-0">
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 bg-[#ff9f00] hover:bg-[#f39700] active:scale-95 text-white font-bold py-2 px-2 sm:px-3 rounded text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer min-w-0"
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            {onBuyNow && (
              <button
                id={`buy-now-btn-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow(product);
                }}
                className="flex-1 bg-[#fb641b] hover:bg-[#e95a12] active:scale-95 text-white font-bold py-2 px-2 sm:px-3 rounded text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs cursor-pointer min-w-0"
              >
                <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                <span className="truncate">BUY NOW</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white p-2.5 sm:p-4 rounded-md border border-slate-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative group cursor-pointer w-full min-w-0 overflow-hidden"
    >
      {/* Wishlist Button */}
      <button
        id={`wishlist-toggle-grid-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 shadow-xs transition-colors"
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <div className="min-w-0">
        {/* Product Image */}
        <div className="w-full h-36 xs:h-40 sm:h-48 md:h-52 overflow-hidden rounded flex items-center justify-center bg-slate-50 relative p-2 mb-2 sm:mb-3">
          <img 
            src={product.image} 
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* SuperCoins tag */}
          {product.superCoins > 0 && (
            <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-yellow-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
              +{product.superCoins} Coins
            </span>
          )}
        </div>

        {/* Brand & Assured */}
        <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">{product.brand}</span>
          {product.assured && (
            <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black italic text-[#0b8442] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 shrink-0">
              <span>Apni-Assured</span>
              <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-500 fill-yellow-500" />
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-[#0b8442] transition-colors mb-1 sm:mb-1.5 leading-snug break-words">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs mb-2 flex-wrap">
          <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold shrink-0">
            {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
          </span>
          <span className="text-slate-400 text-[10px] sm:text-[11px] truncate">
            ({product.ratingCount > 1000 ? `${(product.ratingCount / 1000).toFixed(1)}k` : product.ratingCount})
          </span>
        </div>
      </div>

      {/* Pricing & Add to Cart CTA */}
      <div className="pt-2 border-t border-slate-100 min-w-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap min-w-0">
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#388e3c]">
            {product.discountPercent}% off
          </span>
        </div>

        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 truncate">
          <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500 shrink-0" />
          <span className="truncate">{product.fastDelivery ? 'Free Delivery Tomorrow' : 'Standard Delivery'}</span>
        </p>

        <div className="mt-2 sm:mt-2.5 pt-1 flex gap-1 sm:gap-1.5 min-w-0">
          <button
            id={`add-to-cart-grid-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex-1 bg-[#ff9f00] hover:bg-[#f39700] active:scale-95 text-white font-bold py-1.5 sm:py-2 px-1 rounded text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer min-w-0"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>

          {onBuyNow && (
            <button
              id={`buy-now-grid-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
              }}
              className="flex-1 bg-[#fb641b] hover:bg-[#e95a12] active:scale-95 text-white font-bold py-1.5 sm:py-2 px-1 rounded text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer min-w-0"
              title="Buy Now (Check address & checkout)"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
