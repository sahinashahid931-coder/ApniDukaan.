import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bgGradient: string;
  imageUrl: string;
  ctaText: string;
  categoryTrigger: string;
}

const BANNERS: Banner[] = [
  {
    id: 'b-1',
    title: 'BIG BILLION SAVINGS DAYS',
    subtitle: 'Up to 75% Off on Flagship Mobiles & Laptops + 10% Instant Bank Discount',
    tag: 'MEGA DEAL OF THE SEASON',
    bgGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Shop Electronics',
    categoryTrigger: 'electronics'
  },
  {
    id: 'b-2',
    title: 'NEXT-GEN SMARTPHONES UNLEASHED',
    subtitle: 'iPhone 15 & Galaxy S24 Ultra with Extra Exchange Bonus & No-Cost EMI',
    tag: 'APNIDUKAAN EXCLUSIVE',
    bgGradient: 'from-slate-900 via-emerald-950 to-green-900',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Explore Mobiles',
    categoryTrigger: 'mobiles'
  },
  {
    id: 'b-3',
    title: 'GRAND HOME & LIVING FESTIVAL',
    subtitle: 'Luxury Sheesham Furniture, 4K OLED Smart TVs & Memory Foam Mattresses',
    tag: 'BEST VALUE GUARANTEE',
    bgGradient: 'from-amber-900 via-stone-900 to-slate-900',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Upgrade Home',
    categoryTrigger: 'home'
  }
];

interface HeroBannersProps {
  onBannerClick: (categoryId: string) => void;
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ onBannerClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const current = BANNERS[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-4 w-full">
      {/* Main Banner Slider */}
      <div className="relative rounded-lg overflow-hidden shadow-md group">
        <div className={`w-full bg-gradient-to-r ${current.bgGradient} text-white transition-all duration-700 min-h-[180px] sm:min-h-[250px] md:min-h-[280px] flex items-center justify-between px-4 sm:px-12 py-4 sm:py-6 relative`}>
          
          {/* Banner Text Content */}
          <div className="max-w-xl z-10 space-y-2 sm:space-y-3 min-w-0 pr-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-yellow-400 text-slate-950 tracking-wider shadow-sm">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
              <span className="truncate">{current.tag}</span>
            </span>

            <h2 className="text-lg sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow break-words">
              {current.title}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium line-clamp-2">
              {current.subtitle}
            </p>

            <div className="pt-1">
              <button
                id={`hero-banner-cta-${current.id}`}
                onClick={() => onBannerClick(current.categoryTrigger)}
                className="bg-[#ffe500] hover:bg-yellow-300 text-slate-900 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
              >
                <span>{current.ctaText}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* Banner Image Preview */}
          <div className="hidden sm:block w-1/3 max-w-[280px] h-[190px] md:h-[220px] rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl relative z-10 flex-shrink-0">
            <img 
              src={current.imageUrl} 
              alt={current.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Background Decorative Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          id="hero-prev-btn"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-14 bg-white/80 hover:bg-white text-slate-800 rounded-r flex items-center justify-center shadow-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          id="hero-next-btn"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-14 bg-white/80 hover:bg-white text-slate-800 rounded-l flex items-center justify-center shadow-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-[#ffe500]' : 'w-2 bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-3">
        <div className="bg-white p-2 sm:p-3 rounded border border-slate-200 shadow-xs flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-[#0b8442] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">100% Authentic</h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Verified brand partners</p>
          </div>
        </div>

        <div className="bg-white p-2 sm:p-3 rounded border border-slate-200 shadow-xs flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">Secure Payment</h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">256-Bit SSL Encrypted</p>
          </div>
        </div>

        <div className="bg-white p-2 sm:p-3 rounded border border-slate-200 shadow-xs flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">7-Day Easy Returns</h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Instant pickup & refund</p>
          </div>
        </div>

        <div className="bg-white p-2 sm:p-3 rounded border border-slate-200 shadow-xs flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">Fast Delivery</h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">Next day in 100+ cities</p>
          </div>
        </div>
      </div>
    </div>
  );
};
