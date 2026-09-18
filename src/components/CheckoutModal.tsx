import React, { useState, useEffect } from 'react';
import { CartItem, Address, PaymentMethodType, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  CalendarClock,
  Sparkles,
  QrCode,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowLeft,
  MapPin,
  Home,
  Briefcase
} from 'lucide-react';
import { formatPrice, formatCardNumber, formatExpiry, getEstimatedDeliveryDate } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  superCoins: number;
  addresses: Address[];
  onSaveAddress: (address: Address) => void;
  onDeleteAddress?: (addressId: string) => void;
  onOrderSuccess: (order: Order) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 
  'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  superCoins,
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const { user } = useAuth();

  // Checkout Steps: 1: Address, 2: Order Summary, 3: Payment
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '';
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(addresses.length === 0);

  // Synchronize selected address when addresses change
  useEffect(() => {
    if (addresses.length === 0) {
      setShowNewAddressForm(true);
      setSelectedAddressId('');
    } else if (!selectedAddressId || !addresses.some(a => a.id === selectedAddressId)) {
      setSelectedAddressId(addresses.find(a => a.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // New Address Form State
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    name: user?.displayName || '',
    phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
    pincode: '',
    locality: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: '',
    type: 'HOME'
  });

  const [addrError, setAddrError] = useState<string | null>(null);

  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [upiOption, setUpiOption] = useState<'app' | 'id' | 'qr'>('app');
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState('Google Pay');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // COD Captcha
  const [captchaCode, setCaptchaCode] = useState('8492');
  const [userCaptcha, setUserCaptcha] = useState('');

  // SuperCoins applied
  const [useSuperCoins, setUseSuperCoins] = useState(false);

  // Payment processing & 2FA modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');
  const [otpTimer, setOtpTimer] = useState(30);

  // Calculate pricing
  const totalMRP = cartItems.reduce((sum, i) => sum + i.product.originalPrice * i.quantity, 0);
  const totalSelling = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalDiscount = totalMRP - totalSelling;
  const platformFee = 3;
  const coinsDiscount = useSuperCoins ? Math.min(superCoins, 200) : 0;
  const finalAmount = Math.max(0, totalSelling + platformFee - coinsDiscount);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || null;

  const handleFillDemoAddress = () => {
    setNewAddr({
      name: user?.displayName || 'Sahina Shahid',
      phone: user?.phone?.replace(/\D/g, '').slice(-10) || '9876543210',
      pincode: '560001',
      locality: 'MG Road, Ashok Nagar',
      address: '#42, Prestige Meridian Towers, 5th Floor',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Trinity Metro Station',
      type: 'HOME'
    });
    setAddrError(null);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name?.trim()) {
      setAddrError('Please enter your full name');
      return;
    }
    if (!newAddr.phone || newAddr.phone.replace(/\D/g, '').length < 10) {
      setAddrError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!newAddr.pincode || newAddr.pincode.replace(/\D/g, '').length !== 6) {
      setAddrError('Please enter a valid 6-digit pincode');
      return;
    }
    if (!newAddr.address?.trim()) {
      setAddrError('Please enter flat/house no. and building address');
      return;
    }

    const created: Address = {
      id: `addr-${Date.now()}`,
      name: newAddr.name.trim(),
      phone: newAddr.phone.trim(),
      pincode: newAddr.pincode.trim(),
      locality: newAddr.locality?.trim() || 'City Center',
      address: newAddr.address.trim(),
      city: newAddr.city?.trim() || 'Bengaluru',
      state: newAddr.state?.trim() || 'Karnataka',
      landmark: newAddr.landmark?.trim() || undefined,
      type: newAddr.type || 'HOME',
      isDefault: addresses.length === 0
    };

    onSaveAddress(created);
    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
    setAddrError(null);
    // Smoothly advance to Order Summary
    setActiveStep(2);
  };

  const handleTriggerPayment = () => {
    if (!selectedAddress) {
      alert('Please provide and select a delivery address before placing order.');
      setActiveStep(1);
      setShowNewAddressForm(true);
      return;
    }

    if (selectedPaymentMethod === 'CARD') {
      // Show simulated 3D Secure / OTP Verification
      setShowOtpModal(true);
      return;
    }

    if (selectedPaymentMethod === 'COD') {
      if (userCaptcha !== captchaCode) {
        alert('Please enter the correct verification code for Cash on Delivery');
        return;
      }
    }

    // Direct process
    finalizeOrder();
  };

  const finalizeOrder = () => {
    if (!selectedAddress) {
      alert('Please add and select your delivery address to place this order.');
      setActiveStep(1);
      setShowNewAddressForm(true);
      return;
    }

    setIsProcessing(true);
    setShowOtpModal(false);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        id: `OD${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: cartItems,
        totalAmount: finalAmount,
        discountAmount: totalDiscount + coinsDiscount,
        deliveryCharge: 0,
        address: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: {
          transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          upiId: selectedPaymentMethod === 'UPI' ? (upiId || `${upiApp.toLowerCase().replace(/\s/g, '')}@okaxis`) : undefined,
          cardLast4: selectedPaymentMethod === 'CARD' ? (cardNumber.slice(-4) || '4242') : undefined,
          bankName: selectedPaymentMethod === 'NET_BANKING' ? selectedBank : undefined
        },
        trackingStatus: 'CONFIRMED',
        estimatedDeliveryDate: getEstimatedDeliveryDate(true)
      };

      onOrderSuccess(newOrder);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        id="checkout-modal-container"
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header with Security Badge */}
        <div className="bg-[#0b8442] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold">ApniDukaan Secure Checkout</h2>
            <div className="hidden sm:flex items-center gap-1 bg-emerald-700/60 px-2.5 py-0.5 rounded text-xs font-medium border border-emerald-500/30">
              <Lock className="w-3 h-3 text-emerald-300" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sm:justify-center sm:gap-12 text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">✓</span>
            <span className="hidden sm:inline">1. LOGIN</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <button 
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 1 ? 'text-[#0b8442]' : activeStep > 1 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 1 ? 'bg-[#0b8442] text-white' : activeStep > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200'
            }`}>
              {activeStep > 1 ? '✓' : '2'}
            </span>
            <span>DELIVERY ADDRESS</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <button 
            onClick={() => {
              if (!selectedAddress) {
                alert('Please enter and confirm your delivery address before proceeding to Order Summary.');
                setActiveStep(1);
                setShowNewAddressForm(true);
                return;
              }
              if (activeStep >= 2) setActiveStep(2);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 2 ? 'text-[#0b8442]' : activeStep > 2 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 2 ? 'bg-[#0b8442] text-white' : activeStep > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200'
            }`}>
              {activeStep > 2 ? '✓' : '3'}
            </span>
            <span>ORDER SUMMARY</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <button 
            onClick={() => {
              if (!selectedAddress) {
                alert('Please enter and confirm your delivery address before proceeding to Payment.');
                setActiveStep(1);
                setShowNewAddressForm(true);
                return;
              }
              if (activeStep >= 3) setActiveStep(3);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 3 ? 'text-[#0b8442]' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 3 ? 'bg-[#0b8442] text-white' : 'bg-slate-200'
            }`}>
              4
            </span>
            <span>PAYMENT OPTIONS</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Checkout Steps (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Step 1: Login status (Always compact & confirmed) */}
            <div className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center">1</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">CUSTOMER</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {user?.displayName || 'Customer'} ({user?.phone || '+91 Mobile'})
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">VERIFIED</span>
            </div>

            {/* Step 2: Delivery Address */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 1 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div 
                onClick={() => setActiveStep(1)}
                className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 1 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>2</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    Delivery Address
                  </span>
                </div>
                {activeStep !== 1 && (
                  <button className="text-xs text-[#0b8442] font-bold cursor-pointer">
                    {selectedAddress ? 'CHANGE' : 'ADD ADDRESS'}
                  </button>
                )}
              </div>

              {activeStep === 1 ? (
                <div className="p-4 space-y-4">
                  {/* Warning banner when no address exists */}
                  {addresses.length === 0 && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 flex items-start gap-3 text-amber-900 shadow-xs">
                      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          <span>Delivery Address Required</span>
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black uppercase">Action Needed</span>
                        </h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          You do not have any delivery address saved. Please provide your shipping address below so we can deliver your order to your door.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Address Selection Radio List */}
                  {addresses.length > 0 && (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label 
                          key={addr.id}
                          id={`addr-option-${addr.id}`}
                          className={`block p-3.5 rounded border cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-[#0b8442] bg-emerald-50/40'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="delivery-address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 text-[#0b8442] focus:ring-emerald-500"
                            />
                            <div className="flex-1 text-xs space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900">{addr.name}</span>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                                  {addr.type === 'HOME' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                  {addr.type}
                                </span>
                                <span className="font-bold text-slate-800">{addr.phone}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                              </p>
                              {addr.landmark && (
                                <p className="text-slate-400 text-[11px]">Landmark: {addr.landmark}</p>
                              )}

                              {selectedAddressId === addr.id && (
                                <div className="pt-2">
                                  <button
                                    id="deliver-here-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveStep(2);
                                    }}
                                    className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2 px-5 rounded text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>DELIVER HERE</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Toggle / Form */}
                  {!showNewAddressForm && addresses.length > 0 ? (
                    <button
                      id="add-new-address-toggle-btn"
                      onClick={() => setShowNewAddressForm(true)}
                      className="w-full py-2.5 px-3 border border-dashed border-slate-300 rounded text-xs text-[#0b8442] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add a new delivery address</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddNewAddress} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#0b8442]" />
                          <span>{addresses.length === 0 ? 'Enter Delivery Address' : 'Add New Delivery Address'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={handleFillDemoAddress}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>Autofill Sample Address</span>
                        </button>
                      </div>

                      {addrError && (
                        <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold">
                          {addrError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name *"
                            value={newAddr.name}
                            onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">10-Digit Mobile Number *</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l text-slate-600 font-semibold text-xs">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="Mobile Number *"
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                              className="w-full p-2 border border-slate-300 rounded-r bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">6-Digit Pincode *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Pincode *"
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Locality / Area *</label>
                          <input
                            type="text"
                            required
                            placeholder="Locality / Area *"
                            value={newAddr.locality}
                            onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Flat / House No., Building Name, Street Address *</label>
                        <textarea
                          required
                          placeholder="Flat / House No., Building Name, Street Address *"
                          rows={2}
                          value={newAddr.address}
                          onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">City / District *</label>
                          <input
                            type="text"
                            required
                            placeholder="City *"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">State *</label>
                          <select
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Landmark (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Near Metro Station"
                            value={newAddr.landmark}
                            onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 items-center pt-1">
                        <span className="text-slate-600 font-bold">Address Type:</span>
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="address-type"
                            checked={newAddr.type === 'HOME'}
                            onChange={() => setNewAddr({ ...newAddr, type: 'HOME' })}
                            className="text-[#0b8442]"
                          />
                          <span>Home (All day delivery)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="address-type"
                            checked={newAddr.type === 'WORK'}
                            onChange={() => setNewAddr({ ...newAddr, type: 'WORK' })}
                            className="text-[#0b8442]"
                          />
                          <span>Work (10 AM - 6 PM)</span>
                        </label>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#0b8442] text-white font-bold py-2.5 px-5 rounded text-xs hover:bg-emerald-700 cursor-pointer shadow-xs transition-colors"
                        >
                          SAVE AND DELIVER HERE
                        </button>
                        {addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewAddressForm(false);
                              setAddrError(null);
                            }}
                            className="bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded text-xs hover:bg-slate-300 cursor-pointer transition-colors"
                          >
                            CANCEL
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="px-4 py-2.5 text-xs text-slate-600 flex items-center justify-between">
                  {selectedAddress ? (
                    <div>
                      <span className="font-bold text-slate-800">{selectedAddress.name}</span>, {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}
                    </div>
                  ) : (
                    <div className="text-amber-700 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No delivery address selected. Click to add your address.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Order Summary */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 2 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div 
                onClick={() => activeStep > 2 && setActiveStep(2)}
                className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 2 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>3</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    Order Summary ({cartItems.length} items)
                  </span>
                </div>
                {activeStep > 2 && (
                  <button className="text-xs text-[#0b8442] font-bold cursor-pointer">CHANGE</button>
                )}
              </div>

              {activeStep === 2 ? (
                <div className="p-4 space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3 pb-3 border-b border-slate-100 text-xs">
                        <img src={product.image} alt={product.title} className="w-14 h-14 object-contain rounded p-1 bg-slate-50" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{product.title}</h4>
                          <p className="text-slate-500">Qty: {quantity} • Brand: {product.brand}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold text-slate-900">{formatPrice(product.price * quantity)}</span>
                            <span className="text-slate-400 line-through text-[11px]">{formatPrice(product.originalPrice * quantity)}</span>
                            <span className="text-[#388e3c] font-bold text-[11px]">{product.discountPercent}% off</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Order confirmation email will be sent to <span className="font-bold text-slate-800">sahinashahid931@gmail.com</span>
                    </p>
                    <button
                      id="order-summary-continue-btn"
                      onClick={() => setActiveStep(3)}
                      className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </div>
              ) : activeStep > 2 ? (
                <div className="px-4 py-2 text-xs text-slate-600">
                  {cartItems.length} item(s) selected for delivery
                </div>
              ) : null}
            </div>

            {/* Step 4: Payment Options (The Secure Payment Integration) */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 3 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 3 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>4</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    Payment Options (100% Safe & Secure)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#388e3c] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RBI Compliant</span>
                </div>
              </div>

              {activeStep === 3 && (
                <div className="p-4 space-y-4">
                  {/* SuperCoins Redemption Checkbox */}
                  {superCoins > 0 && (
                    <label className="flex items-center justify-between p-3 rounded bg-amber-50 border border-amber-200 cursor-pointer text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useSuperCoins}
                          onChange={(e) => setUseSuperCoins(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <div>
                          <span className="font-bold text-amber-900">Pay using SuperCoins</span>
                          <p className="text-[11px] text-amber-700">Use {Math.min(superCoins, 200)} SuperCoins to get ₹{Math.min(superCoins, 200)} discount</p>
                        </div>
                      </div>
                      <span className="font-black text-amber-800">Balance: {superCoins}</span>
                    </label>
                  )}

                  {/* Payment Methods Accordion */}
                  <div className="space-y-3">
                    
                    {/* 1. UPI */}
                    <div className={`border rounded p-3 transition-all ${
                      selectedPaymentMethod === 'UPI' ? 'border-[#0b8442] bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === 'UPI'}
                          onChange={() => setSelectedPaymentMethod('UPI')}
                          className="text-[#0b8442]"
                        />
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#0b8442]" />
                          <span className="text-xs font-bold text-slate-800">UPI (Instant & Zero Fee)</span>
                        </div>
                      </label>

                      {selectedPaymentMethod === 'UPI' && (
                        <div className="mt-3 pl-6 space-y-3 text-xs">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setUpiOption('app')}
                              className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
                                upiOption === 'app' ? 'bg-[#0b8442] text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              Popular UPI Apps
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiOption('id')}
                              className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
                                upiOption === 'id' ? 'bg-[#0b8442] text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              Your UPI ID / VPA
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiOption('qr')}
                              className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer ${
                                upiOption === 'qr' ? 'bg-[#0b8442] text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              QR Code
                            </button>
                          </div>

                          {upiOption === 'app' && (
                            <div className="space-y-2 pt-1">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                                <label key={app} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-100">
                                  <input
                                    type="radio"
                                    name="upi-app"
                                    checked={upiApp === app}
                                    onChange={() => setUpiApp(app)}
                                  />
                                  <span className="font-semibold text-slate-800">{app}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {upiOption === 'id' && (
                            <div className="flex gap-2 max-w-sm pt-1">
                              <input
                                type="text"
                                placeholder="e.g. mobile@okaxis"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="flex-1 p-2 border border-slate-300 rounded bg-white text-slate-900"
                              />
                            </div>
                          )}

                          {upiOption === 'qr' && (
                            <div className="p-4 bg-white border border-slate-200 rounded max-w-xs text-center space-y-2">
                              <div className="w-32 h-32 mx-auto bg-slate-100 border border-slate-300 flex items-center justify-center rounded">
                                <QrCode className="w-24 h-24 text-slate-800" />
                              </div>
                              <p className="text-[11px] text-slate-500">Scan using any UPI app on your phone</p>
                            </div>
                          )}

                          <button
                            id="pay-via-upi-btn"
                            onClick={handleTriggerPayment}
                            disabled={isProcessing}
                            className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-sm flex items-center gap-2 mt-2 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>PAY {formatPrice(finalAmount)}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Credit / Debit / ATM Card */}
                    <div className={`border rounded p-3 transition-all ${
                      selectedPaymentMethod === 'CARD' ? 'border-[#0b8442] bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === 'CARD'}
                          onChange={() => setSelectedPaymentMethod('CARD')}
                          className="text-[#0b8442]"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#0b8442]" />
                          <span className="text-xs font-bold text-slate-800">Credit / Debit / ATM Card</span>
                        </div>
                      </label>

                      {selectedPaymentMethod === 'CARD' && (
                        <div className="mt-3 pl-6 space-y-3 text-xs max-w-md">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Card Number</label>
                            <input
                              id="card-number-input"
                              type="text"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder="4532 8901 2345 6789"
                              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-semibold text-slate-700">Valid Thru</label>
                              <input
                                id="card-expiry-input"
                                type="text"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/YY"
                                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold text-slate-700">CVV</label>
                              <input
                                id="card-cvv-input"
                                type="password"
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                placeholder="123"
                                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Name on Card</label>
                            <input
                              id="card-holder-input"
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="Cardholder Name"
                              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Your card details are protected by bank-level 256-bit encryption</span>
                          </div>

                          <button
                            id="pay-via-card-btn"
                            onClick={handleTriggerPayment}
                            disabled={isProcessing}
                            className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-sm flex items-center gap-2 mt-2 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>PAY {formatPrice(finalAmount)}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Net Banking */}
                    <div className={`border rounded p-3 transition-all ${
                      selectedPaymentMethod === 'NET_BANKING' ? 'border-[#0b8442] bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === 'NET_BANKING'}
                          onChange={() => setSelectedPaymentMethod('NET_BANKING')}
                          className="text-[#0b8442]"
                        />
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0b8442]" />
                          <span className="text-xs font-bold text-slate-800">Net Banking</span>
                        </div>
                      </label>

                      {selectedPaymentMethod === 'NET_BANKING' && (
                        <div className="mt-3 pl-6 space-y-3 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`p-2 rounded border text-left font-semibold transition-colors cursor-pointer ${
                                  selectedBank === bank ? 'border-[#0b8442] bg-emerald-50 text-[#0b8442]' : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {bank}
                              </button>
                            ))}
                          </div>

                          <button
                            id="pay-via-netbanking-btn"
                            onClick={handleTriggerPayment}
                            disabled={isProcessing}
                            className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-sm flex items-center gap-2 mt-2 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>PAY {formatPrice(finalAmount)}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 4. Cash on Delivery */}
                    <div className={`border rounded p-3 transition-all ${
                      selectedPaymentMethod === 'COD' ? 'border-[#0b8442] bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === 'COD'}
                          onChange={() => setSelectedPaymentMethod('COD')}
                          className="text-[#0b8442]"
                        />
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-800">Cash on Delivery</span>
                        </div>
                      </label>

                      {selectedPaymentMethod === 'COD' && (
                        <div className="mt-3 pl-6 space-y-3 text-xs max-w-sm">
                          <p className="text-slate-600">
                            Pay with cash or UPI at the doorstep when your order arrives.
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold tracking-widest text-base bg-slate-200 px-3 py-1 rounded text-slate-800 select-none">
                              {captchaCode}
                            </span>
                            <input
                              id="cod-captcha-input"
                              type="text"
                              maxLength={4}
                              value={userCaptcha}
                              onChange={(e) => setUserCaptcha(e.target.value)}
                              placeholder="Enter numbers"
                              className="w-32 p-2 border border-slate-300 rounded bg-white text-slate-900"
                            />
                          </div>

                          <button
                            id="confirm-cod-order-btn"
                            onClick={handleTriggerPayment}
                            disabled={isProcessing}
                            className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-sm flex items-center gap-2 mt-2 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>CONFIRM ORDER</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 5. EMI (Easy Installments) */}
                    <div className={`border rounded p-3 transition-all ${
                      selectedPaymentMethod === 'EMI' ? 'border-[#0b8442] bg-emerald-50/20' : 'border-slate-200'
                    }`}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === 'EMI'}
                          onChange={() => setSelectedPaymentMethod('EMI')}
                          className="text-[#0b8442]"
                        />
                        <div className="flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-[#0b8442]" />
                          <span className="text-xs font-bold text-slate-800">EMI (Easy Installments / No Cost EMI)</span>
                        </div>
                      </label>

                      {selectedPaymentMethod === 'EMI' && (
                        <div className="mt-3 pl-6 space-y-3 text-xs">
                          <div className="space-y-2">
                            <div className="p-2 border rounded border-emerald-300 bg-emerald-50 text-emerald-800 flex justify-between items-center">
                              <span>3 Months No-Cost EMI</span>
                              <span className="font-bold">{formatPrice(Math.round(finalAmount / 3))}/month</span>
                            </div>
                            <div className="p-2 border rounded border-slate-200 flex justify-between items-center">
                              <span>6 Months Standard EMI</span>
                              <span className="font-bold">{formatPrice(Math.round(finalAmount / 6))}/month</span>
                            </div>
                          </div>

                          <button
                            id="pay-via-emi-btn"
                            onClick={handleTriggerPayment}
                            disabled={isProcessing}
                            className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-sm flex items-center gap-2 mt-2 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>PROCEED WITH EMI</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Price Details Summary (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
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

                {coinsDiscount > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold">
                    <span>SuperCoins Discount</span>
                    <span>- {formatPrice(coinsDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-[#388e3c]">
                    <span className="line-through text-slate-400 mr-1">₹40</span>
                    FREE
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Secured Packaging Fee</span>
                  <span>₹{platformFee}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between text-sm font-black text-slate-900">
                <span>Total Payable</span>
                <span>{formatPrice(finalAmount)}</span>
              </div>

              <div className="bg-emerald-50 text-[#388e3c] p-2 rounded text-xs font-bold text-center">
                Your Total Savings on this order: {formatPrice(totalDiscount + coinsDiscount)}
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Safe and Secure Payments</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ApniDukaan guarantees 100% purchase protection for your shopping. Easy returns and instant customer support.
              </p>
            </div>
          </div>

        </div>

        {/* 3D Secure / OTP Simulation Modal for Card Payments */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-[#0b8442] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Verified by Visa / RuPay Secure</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit OTP sent to your registered mobile number (+91 98*** **210)
                </p>
              </div>

              <div className="py-2">
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-48 mx-auto text-center text-xl font-mono tracking-widest font-bold p-2 border-2 border-emerald-500 rounded focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Auto-filled OTP for secure sandbox simulation (123456)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  id="submit-otp-btn"
                  onClick={finalizeOrder}
                  className="flex-1 bg-[#0b8442] hover:bg-emerald-700 text-white font-bold py-2.5 rounded text-xs transition-colors cursor-pointer"
                >
                  VERIFY & SUBMIT
                </button>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner during Transaction Verification */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-emerald-200 border-t-[#0b8442] animate-spin"></div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Processing Secure Payment...</h3>
                <p className="text-xs text-slate-500 mt-1">Contacting your payment gateway. Please do not refresh or press back.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Connection</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
