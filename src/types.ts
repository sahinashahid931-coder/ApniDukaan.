export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  assured: boolean;
  inStock: boolean;
  fastDelivery: boolean;
  superCoins: number;
  specs: Record<string, string>;
  highlights: string[];
  offers: string[];
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  type: 'HOME' | 'WORK';
  isDefault: boolean;
}

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD' | 'EMI' | 'PAY_LATER';

export interface Order {
  id: string;
  userId?: string;
  userPhone?: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  deliveryCharge: number;
  address: Address;
  paymentMethod: PaymentMethodType;
  paymentDetails: {
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
    transactionId: string;
  };
  trackingStatus: 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  estimatedDeliveryDate: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  assuredOnly: boolean;
  selectedBrands: string[];
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price_low_high' | 'price_high_low' | 'rating' | 'discount';
}
