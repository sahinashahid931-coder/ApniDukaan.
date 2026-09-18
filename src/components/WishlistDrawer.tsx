import React from 'react';
import { Product } from '../types';
import { X, Trash2, ShoppingCart, Heart, Sparkles, Star } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="apnidukaan-wishlist-drawer"
        className="w-full max-w-xl bg-slate-100 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="bg-[#0b8442] text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            <h2 className="text-base sm:text-lg font-bold">My Wishlist ({wishlistProducts.length})</h2>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center space-y-4 shadow-xs mt-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Your wishlist is empty!</h3>
                <p className="text-xs text-slate-500">Explore items and tap the heart icon to save them for later</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#0b8442] text-white font-bold text-xs rounded hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                id={`wishlist-item-${product.id}`}
                className="bg-white p-4 rounded border border-slate-200 shadow-xs flex gap-4 relative group"
              >
                {/* Image */}
                <div 
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-50 rounded p-1 flex items-center justify-center border border-slate-100 cursor-pointer"
                >
                  <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{product.brand}</span>
                    <button
                      id={`remove-wishlist-${product.id}`}
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-[#0b8442] cursor-pointer"
                  >
                    {product.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                    <span className="text-slate-400 text-[11px]">({product.ratingCount})</span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-[#388e3c]">
                      {product.discountPercent}% off
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      id={`wishlist-move-to-cart-${product.id}`}
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="bg-[#ff9f00] hover:bg-[#f39700] active:scale-95 text-white font-bold py-1.5 px-3 rounded text-xs transition-all flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>MOVE TO CART</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
