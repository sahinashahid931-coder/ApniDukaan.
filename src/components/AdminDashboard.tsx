import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  Edit3, 
  Trash2, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  X, 
  Save, 
  Search,
  ShieldCheck,
  Truck,
  Layers,
  Shield,
  Tag,
  Boxes,
  Sparkles
} from 'lucide-react';
import { Product, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['trackingStatus']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add-product'>('inventory');
  
  // Product Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('mobiles');
  const [newSubcategory, setNewSubcategory] = useState('smartphones');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscount, setNewDiscount] = useState('15');
  const [newStock, setNewStock] = useState(true);
  const [newAssured, setNewAssured] = useState(true);
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newBrand) {
      alert('Please fill in product title, brand and price.');
      return;
    }

    const priceNum = Number(newPrice);
    const origPriceNum = newOriginalPrice ? Number(newOriginalPrice) : Math.round(priceNum * 1.25);
    const discountNum = Number(newDiscount) || Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);

    const product: Product = {
      id: `prod-admin-${Date.now()}`,
      title: newTitle,
      brand: newBrand,
      category: newCategory,
      subcategory: newSubcategory,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discountNum,
      rating: 4.8,
      ratingCount: 18,
      reviewsCount: 6,
      image: newImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      gallery: [
        newImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
      ],
      assured: newAssured,
      inStock: newStock,
      fastDelivery: true,
      superCoins: Math.floor(priceNum * 0.01),
      specs: {
        'Seller': 'ApniDukaan Official (Admin)',
        'Dispatch Time': '1 Business Day',
        'Warranty': '1 Year Brand Warranty',
        'Inspection': '100% Quality Checked'
      },
      highlights: [
        'Genuine Brand Guarantee',
        '7-Day Return / Replacement Policy',
        'Secure Tamper-Proof Packaging'
      ],
      offers: [
        'Bank Offer: 5% Unlimited Cashback on ApniDukaan Axis Bank Credit Card',
        'Special Price: Extra ₹500 off on first purchase'
      ],
      description: newDescription || `${newTitle} by ${newBrand}. Genuine authentic stock sold directly by ApniDukaan.`
    };

    onAddProduct(product);
    showNotification(`Product "${product.title}" added to store catalog!`);
    
    // Reset Form
    setNewTitle('');
    setNewBrand('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewImage('');
    setNewDescription('');
    setActiveTab('inventory');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
    showNotification(`Product "${editingProduct.title}" updated!`);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overall Statistics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const inStockCount = products.filter(p => p.inStock).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="apnidukaan-admin-dashboard"
        className="bg-slate-100 rounded-lg shadow-2xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="bg-[#0b8442] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ffe500] text-[#0b8442] flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">ApniDukaan Admin Portal</h2>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Store Owner Access
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Central management for all products, inventory, pricing and customer order fulfillments.
              </p>
            </div>
          </div>

          <button
            id="close-admin-portal-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer text-white"
            title="Exit Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {feedbackMsg && (
          <div className="bg-emerald-700 text-white text-xs px-4 py-2 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ffe500]" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-white hover:text-slate-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Analytics Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0b8442] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Store Catalog</p>
              <p className="text-base font-bold text-slate-800">{products.length} Products</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Customer Orders</p>
              <p className="text-base font-bold text-slate-800">{orders.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Gross Sales</p>
              <p className="text-base font-bold text-slate-800">{formatPrice(totalRevenue)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Active Stock</p>
              <p className="text-base font-bold text-emerald-600">{inStockCount} Available</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white px-4 sm:px-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'border-[#0b8442] text-[#0b8442]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catalog Inventory ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-[#0b8442] text-[#0b8442]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add-product')}
              className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add-product'
                  ? 'border-[#0b8442] text-[#0b8442]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:outline-hidden focus:ring-1 focus:ring-[#0b8442]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* 1. INVENTORY CATALOG TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing <strong>{filteredProducts.length}</strong> products sold directly on ApniDukaan.
                </p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="bg-[#0b8442] hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price / MRP</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-contain bg-slate-50 rounded border border-slate-100 p-1 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">{p.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-slate-500 font-semibold uppercase">{p.brand}</span>
                                {p.assured && (
                                  <span className="text-[10px] text-[#0b8442] font-black italic">Apni-Assured</span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3 capitalize text-slate-600 font-medium">
                            {p.category} <span className="text-slate-400">/ {p.subcategory}</span>
                          </td>

                          <td className="p-3">
                            <p className="font-bold text-slate-900">{formatPrice(p.price)}</p>
                            <p className="text-[11px] text-slate-400 line-through">{formatPrice(p.originalPrice)}</p>
                          </td>

                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                              {p.discountPercent}% OFF
                            </span>
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => onUpdateProduct({ ...p, inStock: !p.inStock })}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                              title="Click to toggle stock"
                            >
                              {p.inStock ? 'In Stock (Active)' : 'Out of Stock'}
                            </button>
                          </td>

                          <td className="p-3">
                            <span className="bg-[#0b8442] text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                              {p.rating} ★
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-slate-600 hover:text-[#0b8442] hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                title="Edit product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove "${p.title}" from store?`)) {
                                    onDeleteProduct(p.id);
                                    showNotification(`Removed "${p.title}"`);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS & FULFILLMENT TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Manage and dispatch customer orders placed on ApniDukaan.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded border border-slate-200 p-8 text-center space-y-2">
                  <Truck className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Orders Yet</p>
                  <p className="text-xs text-slate-400">
                    When shoppers complete checkout, their orders will appear here for Admin to process and deliver.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white rounded border border-slate-200 shadow-xs p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">Order #{ord.id}</span>
                          <span className="text-slate-400 ml-2">• {ord.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">Update Lifecycle:</span>
                          <select
                            value={ord.trackingStatus}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:ring-1 focus:ring-[#0b8442]"
                          >
                            <option value="CONFIRMED">Order Confirmed</option>
                            <option value="PACKED">Packed in Warehouse</option>
                            <option value="SHIPPED">Shipped with Carrier</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered to Customer</option>
                          </select>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img
                                src={it.product.image}
                                alt={it.product.title}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 object-contain bg-slate-50 rounded border border-slate-100 p-0.5"
                              />
                              <div>
                                <p className="font-semibold text-slate-800 line-clamp-1">{it.product.title}</p>
                                <p className="text-[11px] text-slate-400">
                                  Qty: <strong>{it.quantity}</strong> × {formatPrice(it.product.price)}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-800">
                              {formatPrice(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address & Summary */}
                      <div className="bg-slate-50 p-2.5 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200/60">
                        <div className="text-slate-600">
                          <span className="font-bold text-slate-800">Ship to: </span>
                          <span>{ord.address.name}, {ord.address.locality}, {ord.address.city} - {ord.address.pincode} (Ph: {ord.address.phone})</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-slate-500 mr-2">Paid via: <strong>{ord.paymentMethod}</strong></span>
                          <span className="font-black text-sm text-[#0b8442]">{formatPrice(ord.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ADD NEW PRODUCT TAB */}
          {activeTab === 'add-product' && (
            <div className="max-w-2xl mx-auto bg-white rounded border border-slate-200 shadow-xs p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">List New Product on ApniDukaan</h3>
                <p className="text-xs text-slate-500">
                  Add a brand new item directly to the storefront catalog. Sold officially by ApniDukaan.
                </p>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Apple iPhone 16 Pro Max 256GB Desert Titanium"
                    className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g. Apple, Samsung, Nike"
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden capitalize"
                    >
                      <option value="mobiles">Mobiles</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="appliances">Appliances</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="grocery">Grocery & Essentials</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 12999"
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Price / MRP (₹)</label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      placeholder="e.g. 15999"
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Image URL</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or direct image link"
                    className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Leave blank to use a high-resolution Unsplash default.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description & Highlights</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Key specifications, features, warranty details..."
                    className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0b8442] focus:outline-hidden"
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newStock}
                      onChange={(e) => setNewStock(e.target.checked)}
                      className="w-4 h-4 text-[#0b8442] rounded"
                    />
                    <span className="font-semibold text-slate-700">Mark In-Stock Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newAssured}
                      onChange={(e) => setNewAssured(e.target.checked)}
                      className="w-4 h-4 text-[#0b8442] rounded"
                    />
                    <span className="font-semibold text-slate-700">Apni-Assured Guarantee Badge</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0b8442] hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish to Live Store</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT PRODUCT MODAL OVERLAY */}
          {editingProduct && (
            <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800">Edit Catalog Product</h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={editingProduct.discountPercent}
                        onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                        className="w-4 h-4 text-[#0b8442] rounded"
                      />
                      <span>In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.assured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, assured: e.target.checked })}
                        className="w-4 h-4 text-[#0b8442] rounded"
                      />
                      <span>Apni-Assured</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0b8442] text-white font-bold rounded flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
