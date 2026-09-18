import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard,
  Tag,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { formatPrice, calculateSavings, getEstimatedDeliveryDate } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}) => {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(product.gallery[0] || product.image);
  const [pincode, setPincode] = useState('560001');
  const [pincodeVerified, setPincodeVerified] = useState(true);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeVerified(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="product-detail-modal"
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200"
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
          
          {/* Left Column: Image Gallery & Action CTAs */}
          <div className="md:col-span-5 flex flex-col">
            <div className="sticky top-0 space-y-4">
              
              {/* Main Image Stage */}
              <div className="relative border border-slate-200 rounded-lg p-4 bg-white flex items-center justify-center h-80 sm:h-96">
                <img 
                  src={selectedImage} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />

                <button
                  id="detail-wishlist-toggle-btn"
                  onClick={() => onToggleWishlist(product)}
                  className="absolute right-3 top-3 p-2 rounded-full bg-white shadow-md text-slate-400 hover:text-red-500 transition-colors"
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded border-2 p-1 bg-white overflow-hidden flex-shrink-0 cursor-pointer ${
                        selectedImage === img ? 'border-[#0b8442]' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* ApniDukaan Signature Dual Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="detail-add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                  className="bg-[#ff9f00] hover:bg-[#f39700] active:scale-95 text-white font-black py-3 px-4 rounded text-sm transition-transform shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  id="detail-buy-now-btn"
                  onClick={() => onBuyNow(product)}
                  className="bg-[#fb641b] hover:bg-[#e95a12] active:scale-95 text-white font-black py-3 px-4 rounded text-sm transition-transform shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, Offers & Specs */}
          <div className="md:col-span-7 space-y-5">
            
            {/* Breadcrumb & Brand */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="uppercase font-bold text-[#0b8442]">{product.brand}</span>
                <span>•</span>
                <span className="capitalize">{product.subcategory || product.category}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Ratings & Apni-Assured */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-[#388e3c] text-white px-2 py-0.5 rounded text-xs font-bold">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {product.ratingCount.toLocaleString()} Ratings & {product.reviewsCount.toLocaleString()} Reviews
              </span>

              {product.assured && (
                <div className="flex items-center gap-1 text-xs font-black italic text-[#0b8442] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span>Apni-Assured</span>
                  <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-bold text-[#388e3c]">
                  {product.discountPercent}% off
                </span>
              </div>

              <p className="text-xs text-[#388e3c] font-semibold">
                You save {formatPrice(calculateSavings(product.price, product.originalPrice))} on this product!
              </p>

              {product.superCoins > 0 && (
                <p className="text-xs text-amber-700 font-semibold pt-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  Earn {product.superCoins} SuperCoins on this purchase
                </p>
              )}
            </div>

            {/* Bank & Promotional Offers */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#388e3c]" />
                Available Offers
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {product.offers.map((offer, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#388e3c] flex-shrink-0 mt-0.5" />
                    <span>{offer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Pincode Checker */}
            <div className="border-t border-b border-slate-200 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#0b8442]" />
                  Delivery & Services
                </span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex items-center gap-2 max-w-xs">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="delivery-pincode-input"
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-50 text-[#0b8442] font-bold text-xs rounded hover:bg-emerald-100 transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeVerified && (
                <div className="text-xs space-y-1 text-slate-700 pt-1">
                  <p className="font-semibold text-slate-900">
                    {getEstimatedDeliveryDate(product.fastDelivery)} | <span className="text-[#388e3c]">FREE</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    If ordered before 11:59 PM. Cash on Delivery available.
                  </p>
                </div>
              )}
            </div>

            {/* Product Highlights */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Highlights</h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {product.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Specifications</h3>
              <div className="border border-slate-200 rounded-md overflow-hidden divide-y divide-slate-100 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-2.5 hover:bg-slate-50">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="col-span-2 text-slate-800 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <RotateCcw className="w-4 h-4 text-[#0b8442] flex-shrink-0" />
                <span>7 Days Replacement</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CreditCard className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>GST Invoice Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
