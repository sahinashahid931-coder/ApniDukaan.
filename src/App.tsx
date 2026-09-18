import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, CartItem, FilterState, Order, Address } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanners } from './components/HeroBanners';
import { ProductCard } from './components/ProductCard';
import { DealsShelf } from './components/DealsShelf';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddressModal } from './components/AddressModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { 
  UserRole, 
  UserProfile,
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore,
  subscribeToProductsFromFirestore,
  seedProductsToFirestoreIfEmpty,
  saveUserCartToFirestore,
  getUserCartFromFirestore,
  saveUserWishlistToFirestore,
  getUserWishlistFromFirestore,
  saveUserAddressesToFirestore,
  getUserAddressesFromFirestore,
  saveOrderToFirestore,
  subscribeToOrdersFromFirestore
} from './services/firebase';
import { 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  CheckCircle, 
  Package, 
  Shield 
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  subcategory: '',
  minPrice: 0,
  maxPrice: 200000,
  minRating: 0,
  assuredOnly: false,
  selectedBrands: [],
  inStockOnly: false,
  sortBy: 'relevance'
};

// Helper to extract a normalized 10-digit key for isolated per-user storage
const getUserPhoneKey = (currentUser: { phone?: string; uid?: string } | null): string => {
  if (!currentUser) return 'guest';
  const rawDigits = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
  const clean10 = rawDigits.slice(-10);
  return clean10 || currentUser.uid || 'guest';
};

export default function App() {
  const { user, isAdmin, isCustomer } = useAuth();

  // Active user phone key tracking
  const initialKey = getUserPhoneKey(user);
  const activeUserKeyRef = useRef<string>(initialKey);

  // Products with persistent local and live seller catalog updates from Firestore
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('apnidukaan_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Seed and subscribe in real-time to Firestore database products collection
  useEffect(() => {
    seedProductsToFirestoreIfEmpty(PRODUCTS);
    const unsubscribe = subscribeToProductsFromFirestore((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('apnidukaan_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);
  
  // Filters state (only search & category, all filters removed)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  
  // View mode (Grid / List)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Auth & Admin Portal Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Cart & Wishlist persistence - strictly isolated per user mobile number
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const currentKey = getUserPhoneKey(user);
      const saved = localStorage.getItem(`apnidukaan_cart_${currentKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const currentKey = getUserPhoneKey(user);
      const saved = localStorage.getItem(`apnidukaan_wishlist_${currentKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders persistence (all store orders, filtered per user for shopper views)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('apnidukaan_all_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Addresses persistence - strictly isolated per user
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const currentKey = getUserPhoneKey(user);
      const saved = localStorage.getItem(`apnidukaan_addresses_${currentKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // SuperCoins
  const [superCoins, setSuperCoins] = useState<number>(420);

  // Modal Dialogs
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState<boolean>(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Cleanup legacy global keys once on mount to avoid cross-user data leakage
  useEffect(() => {
    try {
      localStorage.removeItem('apnidukaan_cart');
      localStorage.removeItem('flipkart_cart');
      localStorage.removeItem('apnidukaan_wishlist');
      localStorage.removeItem('flipkart_wishlist');
      localStorage.removeItem('apnidukaan_orders');
      localStorage.removeItem('flipkart_orders');
      localStorage.removeItem('apnidukaan_addresses');
    } catch {}
  }, []);

  // Real-time synchronization for orders collection from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOrdersFromFirestore((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        try {
          localStorage.setItem('apnidukaan_all_orders', JSON.stringify(dbOrders));
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  // User switching isolation: load user-specific cart, wishlist, and addresses
  useEffect(() => {
    const newKey = getUserPhoneKey(user);
    activeUserKeyRef.current = newKey;

    // 1. Isolated Cart
    const localCart = localStorage.getItem(`apnidukaan_cart_${newKey}`);
    if (localCart !== null) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
      if (user?.uid) {
        getUserCartFromFirestore(user.uid).then((cloudCart) => {
          if (cloudCart && activeUserKeyRef.current === newKey) {
            setCartItems(cloudCart);
            try {
              localStorage.setItem(`apnidukaan_cart_${newKey}`, JSON.stringify(cloudCart));
            } catch {}
          }
        }).catch(console.warn);
      }
    }

    // 2. Isolated Wishlist
    const localWishlist = localStorage.getItem(`apnidukaan_wishlist_${newKey}`);
    if (localWishlist !== null) {
      try {
        setWishlistIds(JSON.parse(localWishlist));
      } catch {
        setWishlistIds([]);
      }
    } else {
      setWishlistIds([]);
      if (user?.uid) {
        getUserWishlistFromFirestore(user.uid).then((cloudWishlist) => {
          if (cloudWishlist && activeUserKeyRef.current === newKey) {
            setWishlistIds(cloudWishlist);
            try {
              localStorage.setItem(`apnidukaan_wishlist_${newKey}`, JSON.stringify(cloudWishlist));
            } catch {}
          }
        }).catch(console.warn);
      }
    }

    // 3. Isolated Addresses
    const localAddrs = localStorage.getItem(`apnidukaan_addresses_${newKey}`);
    if (localAddrs !== null) {
      try {
        setAddresses(JSON.parse(localAddrs));
      } catch {
        setAddresses([]);
      }
    } else {
      setAddresses([]);
      if (user?.uid) {
        getUserAddressesFromFirestore(user.uid).then((cloudAddrs) => {
          if (cloudAddrs && activeUserKeyRef.current === newKey) {
            setAddresses(cloudAddrs);
            try {
              localStorage.setItem(`apnidukaan_addresses_${newKey}`, JSON.stringify(cloudAddrs));
            } catch {}
          }
        }).catch(console.warn);
      }
    }
  }, [user]);

  // Persist user-isolated state to localStorage and Firestore
  useEffect(() => {
    const key = activeUserKeyRef.current;
    try {
      localStorage.setItem(`apnidukaan_cart_${key}`, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
    if (user?.uid) {
      saveUserCartToFirestore(user.uid, cartItems).catch(console.warn);
    }
  }, [cartItems]);

  useEffect(() => {
    const key = activeUserKeyRef.current;
    try {
      localStorage.setItem(`apnidukaan_wishlist_${key}`, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
    if (user?.uid) {
      saveUserWishlistToFirestore(user.uid, wishlistIds).catch(console.warn);
    }
  }, [wishlistIds]);

  useEffect(() => {
    const key = activeUserKeyRef.current;
    try {
      localStorage.setItem(`apnidukaan_addresses_${key}`, JSON.stringify(addresses));
    } catch (e) {
      console.error(e);
    }
    if (user?.uid) {
      saveUserAddressesToFirestore(user.uid, addresses).catch(console.warn);
    }
  }, [addresses]);

  // Handle Cart Operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title.slice(0, 30)}..." to Cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleMoveToWishlist = (productId: string) => {
    if (!wishlistIds.includes(productId)) {
      setWishlistIds((prev) => [...prev, productId]);
    }
    handleRemoveFromCart(productId);
    showToast('Item saved to Wishlist');
  };

  // Handle Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved to Wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Handle Buy Now (opens checkout immediately with the single product)
  const handleBuyNow = (product: Product) => {
    // Add product to cart if not already present
    const exists = cartItems.find((i) => i.product.id === product.id);
    if (!exists) {
      setCartItems((prev) => [...prev, { product, quantity: 1 }]);
    }
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Address Management Handlers
  const handleSaveAddress = (address: Address) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === address.id);
      if (exists) {
        return prev.map((a) => (a.id === address.id ? address : a));
      }
      // If it's the first address or marked default, set it as default
      const isDefault = prev.length === 0 || address.isDefault;
      const updatedList = prev.map((a) => (isDefault ? { ...a, isDefault: false } : a));
      return [...updatedList, { ...address, isDefault }];
    });
    showToast('Delivery address saved successfully!');
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    showToast('Delivery address deleted');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId
      }))
    );
    showToast('Default delivery address updated');
  };

  // Handle Order Success
  const handleOrderSuccess = async (newOrder: Order) => {
    const currentKey = activeUserKeyRef.current;
    const enrichedOrder: Order = {
      ...newOrder,
      userId: user?.uid || (currentKey !== 'guest' ? `user-phone-${currentKey}` : 'guest'),
      userPhone: currentKey !== 'guest' ? currentKey : (newOrder.address?.phone?.replace(/\D/g, '').slice(-10) || '')
    };

    setOrders((prev) => [enrichedOrder, ...prev]);
    setLastPlacedOrder(enrichedOrder);
    
    // Clear cart for this specific active user
    setCartItems([]);
    try {
      localStorage.setItem(`apnidukaan_cart_${currentKey}`, JSON.stringify([]));
      if (user?.uid) {
        saveUserCartToFirestore(user.uid, []);
      }
    } catch (e) {
      console.warn(e);
    }

    // Persist order to Firestore
    try {
      await saveOrderToFirestore(enrichedOrder);
    } catch (e) {
      console.warn('Firestore order save error:', e);
    }

    // Reward SuperCoins
    const earnedCoins = enrichedOrder.items.reduce((sum, i) => sum + i.product.superCoins * i.quantity, 0);
    setSuperCoins((prev) => prev + earnedCoins);
    
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
  };

  // Seller Maintainer Operations with Firestore Sync
  const handleAddProduct = async (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    try {
      await addProductToFirestore(newProd);
    } catch (e) {
      console.warn('Firestore add product sync warning:', e);
    }
    showToast(`Product "${newProd.title}" added to store catalog!`);
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    try {
      await updateProductInFirestore(updatedProd);
    } catch (e) {
      console.warn('Firestore update product sync warning:', e);
    }
    showToast(`Product "${updatedProd.title}" updated!`);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteProductFromFirestore(productId);
    } catch (e) {
      console.warn('Firestore delete product sync warning:', e);
    }
    showToast('Product removed from store catalog');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['trackingStatus']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, trackingStatus: status } : ord)));
    showToast(`Order #${orderId.slice(-6)} status updated to ${status}`);
  };

  // Handle Category click
  const handleSelectCategory = (categoryId: string, subcategory?: string) => {
    setFilters((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: subcategory || '',
      searchQuery: ''
    }));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleResetToHome = () => {
    setFilters(INITIAL_FILTERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering & Sorting Logic - All Facet Filters Removed Per Request
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSubcategory = product.subcategory.toLowerCase().includes(query);
        const matchesHighlights = product.highlights.some(h => h.toLowerCase().includes(query));
        const matchesSpecs = Object.values(product.specs).some(s => s.toLowerCase().includes(query));

        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesSubcategory && !matchesHighlights && !matchesSpecs) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Subcategory filter
      if (filters.subcategory && product.subcategory.toLowerCase() !== filters.subcategory.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low_high':
          return a.price - b.price;
        case 'price_high_low':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discountPercent - a.discountPercent;
        default:
          return 0; // relevance
      }
    });
  }, [products, filters]);

  // Wishlisted products list
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Orders strictly belonging to the currently active mobile number or user UID
  const userOrders = useMemo(() => {
    const currentKey = getUserPhoneKey(user);
    if (!user || currentKey === 'guest') {
      return orders.filter(o => !o.userId || o.userId === 'guest' || !o.userPhone);
    }
    return orders.filter(o => {
      const cleanOrderPhone = o.userPhone ? o.userPhone.replace(/\D/g, '').slice(-10) : '';
      return (cleanOrderPhone && cleanOrderPhone === currentKey) || (user.uid && o.userId === user.uid);
    });
  }, [orders, user]);

  // Featured lists for Deal Shelves
  const dealsOfTheDay = useMemo(() => {
    return products.filter((p) => p.discountPercent >= 25);
  }, [products]);

  const electronicsSpecial = useMemo(() => {
    return products.filter((p) => p.category === 'electronics');
  }, [products]);

  const isBrowsingMode = Boolean(
    filters.searchQuery || 
    filters.category !== 'all' || 
    filters.subcategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4] w-full max-w-full overflow-x-hidden">
      {/* 1. ApniDukaan Header */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsMyOrdersOpen(true)}
        onOpenAddressManager={() => setIsAddressModalOpen(true)}
        onResetToHome={handleResetToHome}
        superCoins={superCoins}
        onOpenAuth={() => {
          setIsAuthModalOpen(true);
        }}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Active Store Admin Bar */}
      {isAdmin && (
        <div 
          id="admin-active-strip"
          className="bg-amber-400 text-slate-900 border-b border-amber-500 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0b8442] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0b8442]"></span>
            </span>
            <span>
              <strong>Store Admin Mode Active:</strong> You sell everything on ApniDukaan ({products.length} live catalog products, {orders.length} orders)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="strip-manage-catalog-btn"
              onClick={() => setIsAdminDashboardOpen(true)}
              className="bg-[#0b8442] hover:bg-emerald-800 text-white px-3 py-1 rounded text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-yellow-300" />
              <span>Admin Portal (Products & Orders)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Horizontal Categories Navigation Strip */}
      <CategoryBar
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Container */}
      <main className="flex-1 pb-10">
        
        {/* If on Homepage with no filters, show Hero Banners & Deals Carousel */}
        {!isBrowsingMode && (
          <div className="space-y-4 sm:space-y-6">
            <HeroBanners
              onBannerClick={(cat) => handleSelectCategory(cat)}
            />

            <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6">
              {/* Deals of the Day Shelf with countdown timer */}
              <DealsShelf
                title="Deals of the Day"
                subtitle="Lightning discounts with extra bank offers"
                products={dealsOfTheDay}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onViewAll={() => setFilters(prev => ({ ...prev, sortBy: 'discount' }))}
              />

              {/* Best of Electronics Shelf */}
              <DealsShelf
                title="Best of Electronics & Laptops"
                subtitle="MacBooks, OLED Gaming Rigs & Studio Audio"
                products={electronicsSpecial}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onViewAll={() => handleSelectCategory('electronics')}
              />
            </div>
          </div>
        )}

        {/* Catalog & Search Results Section */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 mt-4 sm:mt-6">
          
          {/* Results Meta & Sort Controls */}
          <div className="bg-white p-3 sm:p-4 rounded-md border border-slate-200 shadow-xs mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2 flex-wrap">
                {filters.searchQuery ? (
                  <span className="truncate">Showing results for <span className="text-[#0b8442]">"{filters.searchQuery}"</span></span>
                ) : filters.category !== 'all' ? (
                  <span className="capitalize truncate">{filters.subcategory || filters.category} Store</span>
                ) : (
                  <span>All Recommended Products</span>
                )}
                <span className="text-xs text-slate-400 font-normal shrink-0">
                  ({filteredProducts.length} items found)
                </span>
              </h2>
            </div>

            {/* Sort Bar & View Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap text-xs min-w-0">
              
              {/* Sort Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-slate-600 max-w-full pb-0.5 sm:pb-0">
                <span className="font-bold text-slate-400 mr-1 hidden sm:inline">Sort By:</span>
                
                <button
                  id="sort-relevance"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'relevance' }))}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filters.sortBy === 'relevance'
                      ? 'text-[#0b8442] border-b-2 border-[#0b8442]'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Relevance
                </button>

                <button
                  id="sort-price-low-high"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'price_low_high' }))}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filters.sortBy === 'price_low_high'
                      ? 'text-[#0b8442] border-b-2 border-[#0b8442]'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Price: Low to High
                </button>

                <button
                  id="sort-price-high-low"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'price_high_low' }))}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filters.sortBy === 'price_high_low'
                      ? 'text-[#0b8442] border-b-2 border-[#0b8442]'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Price: High to Low
                </button>

                <button
                  id="sort-rating"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'rating' }))}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filters.sortBy === 'rating'
                      ? 'text-[#0b8442] border-b-2 border-[#0b8442]'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Customer Rating
                </button>

                <button
                  id="sort-discount"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'discount' }))}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filters.sortBy === 'discount'
                      ? 'text-[#0b8442] border-b-2 border-[#0b8442]'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Discount
                </button>
              </div>

              {/* View Grid/List toggle */}
              <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded p-0.5">
                <button
                  id="view-mode-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#0b8442] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  id="view-mode-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#0b8442] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Detailed List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Catalog Layout: Full Width Product Grid (Filters Removed Per Request) */}
          <div className="w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-md p-12 text-center border border-slate-200 shadow-xs space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for another keyword or browse our categories above.
                  </p>
                </div>
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="px-5 py-2 bg-[#0b8442] text-white font-bold rounded text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
                  : 'space-y-3'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 3. Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onMoveToWishlist={handleMoveToWishlist}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Secure Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        superCoins={superCoins}
        addresses={addresses}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Address Management Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
      />

      {/* Order Confirmed Celebration Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* My Orders Modal (strictly filtered to active user's phone/UID) */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={userOrders}
        currentUser={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div 
          id="apnidukaan-live-toast"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile OTP Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          showToast(isAdmin ? 'Welcome, Store Admin!' : 'Logged in successfully with OTP!');
        }}
      />

      {/* Store Admin Dashboard Modal (Admin Sells Everything) */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
