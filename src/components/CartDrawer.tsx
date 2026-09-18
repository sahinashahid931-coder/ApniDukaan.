import React from 'react';
import { CartItem } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles,
  Heart
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onMoveToWishlist: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const totalMRP = cartItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const totalSellingPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalMRP - totalSellingPrice;
  const platformFee = cartItems.length > 0 ? 3 : 0;
  const deliveryCharge = 0; // Free delivery
  const finalAmount = totalSellingPrice + platformFee + deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="apnidukaan-cart-drawer"
        className="w-full max-w-2xl bg-slate-100 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="bg-[#0b8442] text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold">My Shopping Cart ({cartItems.length})</h2>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center space-y-4 shadow-xs mt-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-[#0b8442] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Your cart is empty!</h3>
                <p className="text-xs text-slate-500">Explore our best deals and add items to your cart</p>
              </div>
              <button
                id="shop-now-empty-cart-btn"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0b8442] text-white font-bold text-xs rounded hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
              >
                SHOP NOW
              </button>
            </div>
          ) : (
            <>
              {/* Deliver To Pin Strip */}
              <div className="bg-white p-3 rounded border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Deliver to: </span>
                  <span className="font-bold text-slate-800">Bengaluru - 560001</span>
                </div>
                <button className="text-[#0b8442] font-bold hover:underline cursor-pointer">Change</button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    id={`cart-item-${product.id}`}
                    className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-50 rounded p-1 flex items-center justify-center border border-slate-100">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">{product.brand}</span>
                          {product.assured && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black italic text-[#0b8442] bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                              <span>Apni-Assured</span>
                              <Sparkles className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2">
                          {product.title}
                        </h4>

                        {/* Price */}
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

                        <p className="text-[11px] text-slate-500">
                          Delivery by <span className="font-semibold text-slate-800">Tomorrow, 9 PM</span> | Free ₹40
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          id={`qty-minus-${product.id}`}
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          id={`qty-plus-${product.id}`}
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                        <button
                          id={`save-for-later-${product.id}`}
                          onClick={() => onMoveToWishlist(product.id)}
                          className="hover:text-[#0b8442] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>SAVE FOR LATER</span>
                        </button>

                        <button
                          id={`remove-cart-item-${product.id}`}
                          onClick={() => onRemoveItem(product.id)}
                          className="hover:text-red-500 transition-colors flex items-center gap-1 text-slate-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details Card */}
              <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Price Details
                </h3>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Price ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                    <span>{formatPrice(totalMRP)}</span>
                  </div>

                  <div className="flex justify-between text-[#388e3c]">
                    <span>Discount</span>
                    <span>- {formatPrice(totalDiscount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-[#388e3c]">
                      <span className="line-through text-slate-400 mr-1">₹40</span>
                      FREE
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalAmount)}</span>
                </div>

                <div className="bg-emerald-50 text-[#388e3c] p-2.5 rounded text-xs font-semibold text-center">
                  You will save {formatPrice(totalDiscount)} on this order!
                </div>
              </div>

              {/* Trust & Safe Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safe and Secure Payments. 100% Authentic products.</span>
              </div>
            </>
          )}
        </div>

        {/* Sticky Place Order Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white p-4 border-t border-slate-200 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Total Payable</p>
              <p className="text-base sm:text-lg font-black text-slate-900">
                {formatPrice(finalAmount)}
              </p>
            </div>

            <button
              id="cart-place-order-btn"
              onClick={onProceedToCheckout}
              className="bg-[#fb641b] hover:bg-[#e6550f] active:scale-95 text-white font-black py-3 px-6 rounded text-xs sm:text-sm transition-transform shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>PLACE ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
