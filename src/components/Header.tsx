import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Coins, 
  Package, 
  Sparkles, 
  Mic, 
  MicOff, 
  X, 
  Store, 
  ChevronDown,
  Menu,
  ShieldCheck,
  TrendingUp,
  LogIn,
  LogOut,
  Settings,
  ArrowRightLeft,
  Shield,
  Smartphone,
  MapPin
} from 'lucide-react';
import { POPULAR_SEARCH_TAGS } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../services/firebase';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenAddressManager?: () => void;
  onResetToHome: () => void;
  superCoins: number;
  onOpenAuth: (role?: UserRole) => void;
  onOpenAdminDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAddressManager,
  onResetToHome,
  superCoins,
  onOpenAuth,
  onOpenAdminDashboard,
}) => {
  const { user, isAdmin, isCustomer, logout, demoLogin } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const sampleQueries = ['iPhone 15', 'Wireless Earbuds', 'Gaming Laptop', 'Samsung Galaxy'];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      onSearchChange(randomQuery);
      setIsListening(false);
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }, 1800);
  };

  const renderSuggestions = (closeDropdown: () => void) => (
    <div 
      id="search-suggestions-dropdown"
      className="absolute left-0 right-0 top-full mt-1 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-200 z-50 overflow-hidden"
    >
      {isListening ? (
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2 animate-bounce">
            <Mic className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Listening to your voice...</p>
          <p className="text-xs text-slate-500 mt-1">Try saying "iPhone 15" or "Headphones"</p>
        </div>
      ) : (
        <div>
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0b8442]" />
              Trending Searches
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Instant Search</span>
          </div>

          <div className="py-1">
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                id={`search-suggestion-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  onSearchChange(tag);
                  closeDropdown();
                }}
                className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-[#0b8442] flex items-center justify-between text-sm transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0b8442]" />
                  <span>{tag}</span>
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-[#0b8442]">in all categories</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-[#0b8442] shadow-md text-white w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4 lg:gap-6 min-w-0">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button 
              id="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ApniDukaan Brand */}
            <div 
              onClick={onResetToHome}
              className="cursor-pointer flex flex-col items-start select-none group shrink-0"
              id="brand-logo-btn"
            >
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-tight italic text-white drop-shadow-sm whitespace-nowrap">
                  Apni<span className="text-[#ffe500]">Dukaan</span>
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ffe500] inline-block animate-pulse"></span>
              </div>
              <div className="flex items-center text-[10px] sm:text-[11px] font-semibold italic text-emerald-100 -mt-1 group-hover:text-white transition-colors">
                <span>Apni</span>
                <span className="text-[#ffe500] font-bold mx-0.5">Plus</span>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ffe500] fill-[#ffe500]" />
              </div>
            </div>
          </div>

          {/* Desktop Search Box (Visible on md and above) */}
          <div 
            ref={searchContainerRef} 
            className="hidden md:block flex-1 max-w-2xl relative mx-2 lg:mx-4 min-w-0"
          >
            <div className="relative flex items-center">
              <input
                id="main-product-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for Products, Brands and More"
                className="w-full bg-white text-slate-900 placeholder:text-slate-500 pl-4 pr-20 py-2 sm:py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
              />

              <div className="absolute right-2 flex items-center gap-1.5 text-slate-500">
                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    onClick={() => onSearchChange('')}
                    className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="voice-search-btn"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:text-[#0b8442]'
                  }`}
                  title="Search by voice"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  id="submit-search-btn"
                  onClick={() => setIsSearchFocused(false)}
                  className="p-1.5 hover:text-[#0b8442] transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-[#0b8442]" />
                </button>
              </div>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && renderSuggestions(() => setIsSearchFocused(false))}
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-4 text-sm font-medium shrink-0">
            
            {/* SuperCoins Badge (Customer) */}
            <div 
              id="supercoins-header-badge"
              className="hidden md:flex items-center gap-1.5 bg-[#075e2f] px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-400/30"
              title="Your SuperCoins Balance"
            >
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-yellow-300">{superCoins}</span>
              <span className="text-white/80 text-[11px]">Coins</span>
            </div>

            {/* Admin Portal Button (Only if logged in as Admin) */}
            {user ? (
              isAdmin && (
                <button
                  id="header-admin-portal-btn"
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#ffe500] hover:bg-yellow-300 text-[#0b8442] font-black rounded text-xs shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
                  title="Manage entire store inventory, catalog & orders"
                >
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0b8442] shrink-0" />
                  <span className="hidden xs:inline sm:inline">Admin</span>
                  <span className="hidden md:inline">Portal</span>
                  <span className="bg-[#0b8442] text-white text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-bold hidden sm:inline">
                    Owner
                  </span>
                </button>
              )
            ) : (
              /* When not logged in, Admin Login option can be shown */
              <button
                id="header-admin-portal-link"
                onClick={() => onOpenAuth('admin')}
                className="hidden xl:flex items-center gap-1.5 hover:text-yellow-200 cursor-pointer transition-colors text-xs font-bold shrink-0"
                title="Store Owner Portal"
              >
                <Shield className="w-4 h-4 text-[#ffe500]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Account / User Menu or Login Button */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-[#0b8442] font-semibold rounded-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer text-xs"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0b8442] shrink-0" />
                  <span className="hidden sm:inline max-w-[80px] md:max-w-[110px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 transition-transform" />
                </button>

                {showUserMenu && (
                  <div 
                    id="user-dropdown-menu"
                    onMouseLeave={() => setShowUserMenu(false)}
                    className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white text-slate-800 rounded shadow-xl border border-slate-200 z-50 py-1 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-3 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Signed in as
                        </p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isAdmin 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {isAdmin ? 'Store Admin' : 'Shopper'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1 truncate">{user.displayName}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium mt-0.5">
                        <Smartphone className="w-3 h-3 text-slate-400" />
                        <span>{user.phone || '+91 Mobile User'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <button
                          id="menu-open-admin-portal"
                          onClick={() => {
                            onOpenAdminDashboard();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-[#0b8442] font-bold flex items-center gap-3 text-xs transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-[#0b8442]" />
                          <span>Open Admin Portal (Catalog & Orders)</span>
                        </button>
                      )}

                      <button
                        id="menu-orders-btn"
                        onClick={() => {
                          onOpenOrders();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-[#0b8442]" />
                        <span>My Orders</span>
                      </button>

                      {onOpenAddressManager && (
                        <button
                          id="menu-addresses-btn"
                          onClick={() => {
                            onOpenAddressManager();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-[#0b8442]" />
                          <span>Saved Delivery Addresses</span>
                        </button>
                      )}

                      <button
                        id="menu-wishlist-btn"
                        onClick={() => {
                          onOpenWishlist();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Wishlist ({wishlistCount})</span>
                      </button>

                      <button
                        id="menu-supercoins-btn"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span>SuperCoin Rewards</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        id="menu-logout-btn"
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out State */
              <button
                id="header-login-btn"
                onClick={() => onOpenAuth('customer')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white text-[#0b8442] font-bold rounded-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer text-xs shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>Login</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-1 sm:p-1.5 hover:text-yellow-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden xl:inline text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <span 
                  id="wishlist-badge-count"
                  className="absolute -top-1 -right-1 bg-[#ff6161] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0b8442]"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon & Counter */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-emerald-700 rounded-sm transition-colors cursor-pointer shrink-0"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline font-semibold text-xs sm:text-sm">Cart</span>
              {cartCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="bg-[#ffe500] text-[#0b8442] font-black text-xs min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 sm:px-1.5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (Dedicated full-width row on < md) */}
        <div 
          ref={mobileSearchContainerRef}
          className="md:hidden pb-2.5 pt-0.5 px-0.5 relative"
        >
          <div className="relative flex items-center">
            <input
              id="mobile-product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsMobileSearchFocused(true)}
              placeholder="Search products, brands & categories..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-3.5 pr-20 py-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            />

            <div className="absolute right-1.5 flex items-center gap-1 text-slate-500">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleVoiceSearch}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:text-[#0b8442]'
                }`}
                title="Voice search"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMobileSearchFocused(false)}
                className="p-1 hover:text-[#0b8442] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 text-[#0b8442]" />
              </button>
            </div>
          </div>

          {/* Live Search Suggestions Dropdown (Mobile) */}
          {isMobileSearchFocused && renderSuggestions(() => setIsMobileSearchFocused(false))}
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="w-72 bg-white text-slate-800 h-full p-4 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                {user ? (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#0b8442] text-white flex items-center justify-center font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm line-clamp-1">{user.displayName}</h3>
                      <p className="text-xs text-emerald-600 font-semibold">
                        {isAdmin ? 'ApniDukaan Store Admin' : 'ApniDukaan Customer'}
                      </p>
                      <p className="text-[11px] text-slate-500">{user.phone}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenAuth('customer');
                    }}
                    className="flex items-center gap-2 bg-[#0b8442] text-white px-3 py-2 rounded text-xs font-bold"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Login / Sign Up</span>
                  </button>
                )}
                <button onClick={() => setShowMobileMenu(false)} className="p-1 text-slate-500 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {isAdmin ? (
                  <button 
                    onClick={() => { onOpenAdminDashboard(); setShowMobileMenu(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-3 text-sm font-bold"
                  >
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Admin Portal (Catalog & Orders)</span>
                  </button>
                ) : (
                  !user && (
                    <button 
                      onClick={() => { onOpenAuth('admin'); setShowMobileMenu(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Admin Login (Store Owner)</span>
                    </button>
                  )
                )}

                <button 
                  onClick={() => { onOpenOrders(); setShowMobileMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                >
                  <Package className="w-4 h-4 text-[#0b8442]" />
                  <span>My Orders</span>
                </button>

                {onOpenAddressManager && (
                  <button 
                    onClick={() => { onOpenAddressManager(); setShowMobileMenu(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4 text-[#0b8442]" />
                    <span>Saved Delivery Addresses</span>
                  </button>
                )}

                <button 
                  onClick={() => { onOpenWishlist(); setShowMobileMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>My Wishlist ({wishlistCount})</span>
                </button>

                <button 
                  onClick={() => { onOpenCart(); setShowMobileMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>My Cart ({cartCount})</span>
                </button>

                {user && (
                  <button 
                    onClick={() => { logout(); setShowMobileMenu(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 flex items-center gap-3 text-sm font-medium pt-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg text-xs text-[#0b8442]">
              <p className="font-bold">100% Safe & Secure Payments</p>
              <p className="text-[11px] text-slate-600 mt-0.5">UPI, Cards, Net Banking & Cash on Delivery</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
