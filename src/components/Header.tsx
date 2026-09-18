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
  Smartphone
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
  onResetToHome,
  superCoins,
  onOpenAuth,
  onOpenAdminDashboard,
}) => {
  const { user, isAdmin, isCustomer, logout, demoLogin } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
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
    }, 1800);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b8442] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-6">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button 
              id="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 hover:bg-emerald-700 rounded-md transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ApniDukaan Brand */}
            <div 
              onClick={onResetToHome}
              className="cursor-pointer flex flex-col items-start select-none group"
              id="brand-logo-btn"
            >
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight italic text-white drop-shadow-sm">
                  Apni<span className="text-[#ffe500]">Dukaan</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ffe500] inline-block animate-pulse"></span>
              </div>
              <div className="flex items-center text-[11px] font-semibold italic text-emerald-100 -mt-1 group-hover:text-white transition-colors">
                <span>Apni</span>
                <span className="text-[#ffe500] font-bold mx-0.5">Plus</span>
                <Sparkles className="w-3 h-3 text-[#ffe500] fill-[#ffe500]" />
              </div>
            </div>
          </div>

          {/* Search Box with Live Dropdown */}
          <div 
            ref={searchContainerRef} 
            className="flex-1 max-w-2xl relative mx-1 sm:mx-2"
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
                    className="p-1 hover:text-slate-800 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="voice-search-btn"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full transition-all ${
                    isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:text-[#0b8442]'
                  }`}
                  title="Search by voice"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  id="submit-search-btn"
                  onClick={() => setIsSearchFocused(false)}
                  className="p-1.5 hover:text-[#0b8442] transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-[#0b8442]" />
                </button>
              </div>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
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
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-[#0b8442] flex items-center justify-between text-sm transition-colors group"
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
            )}
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 text-sm font-medium">
            
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

            {/* Admin Portal Button (If logged in as Admin) */}
            {isAdmin ? (
              <button
                id="header-admin-portal-btn"
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffe500] hover:bg-yellow-300 text-[#0b8442] font-black rounded text-xs shadow-sm transition-all transform hover:scale-105 cursor-pointer"
                title="Manage entire store inventory, catalog & orders"
              >
                <Shield className="w-4 h-4 text-[#0b8442]" />
                <span>Admin Portal</span>
                <span className="bg-[#0b8442] text-white text-[10px] px-1.5 py-0.2 rounded font-bold ml-0.5">
                  Store Owner
                </span>
              </button>
            ) : (
              /* Admin Portal Shortcut (For fast admin switching) */
              <button
                id="header-admin-portal-link"
                onClick={() => onOpenAuth('admin')}
                className="hidden xl:flex items-center gap-1.5 hover:text-yellow-200 cursor-pointer transition-colors text-xs font-bold"
                title="Store Owner Portal"
              >
                <Shield className="w-4 h-4 text-[#ffe500]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Account / User Menu or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#0b8442] font-semibold rounded-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#0b8442]" />
                  <span className="hidden sm:inline max-w-[110px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                </button>

                {showUserMenu && (
                  <div 
                    id="user-dropdown-menu"
                    onMouseLeave={() => setShowUserMenu(false)}
                    className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded shadow-xl border border-slate-200 z-50 py-1 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150"
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
                      {isAdmin ? (
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
                      ) : (
                        <button
                          id="menu-admin-login-btn"
                          onClick={() => {
                            onOpenAuth('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-3 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          <span>Admin Login (Store Owner)</span>
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

                    {/* Quick Demo Switcher within Menu */}
                    <div className="p-2 bg-slate-50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold px-2 mb-1">
                        Quick Demo Switcher
                      </p>
                      <button
                        onClick={() => {
                          demoLogin(isAdmin ? 'customer' : 'admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-white text-[11px] font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-[#0b8442]" />
                        <span>Switch to {isAdmin ? 'Shopper (Sahina)' : 'Store Admin (Owner)'}</span>
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
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#0b8442] font-bold rounded-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer text-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Login</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-1.5 hover:text-yellow-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <span 
                  id="wishlist-badge-count"
                  className="absolute -top-1 -right-1.5 bg-[#ff6161] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0b8442]"
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon & Counter */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 hover:bg-emerald-700 rounded-sm transition-colors cursor-pointer"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Cart</span>
              {cartCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="bg-[#ffe500] text-[#0b8442] font-black text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
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
                  <button 
                    onClick={() => { onOpenAuth('admin'); setShowMobileMenu(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Admin Login (Store Owner)</span>
                  </button>
                )}

                <button 
                  onClick={() => { onOpenOrders(); setShowMobileMenu(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-100 flex items-center gap-3 text-sm font-medium"
                >
                  <Package className="w-4 h-4 text-[#0b8442]" />
                  <span>My Orders</span>
                </button>

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
