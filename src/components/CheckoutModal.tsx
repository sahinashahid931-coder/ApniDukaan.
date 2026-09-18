import React, { useState, useEffect } from 'react';
import { CartItem, Address, PaymentMethodType, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  MapPin,
  Home,
  Briefcase,
  Loader2,
  ArrowRight,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { formatPrice, getEstimatedDeliveryDate } from '../utils/formatters';
import { INDIAN_STATES, lookupPincode } from '../utils/pincode';

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

  const { user, sendMobileOtp, verifyMobileOtp, logout } = useAuth();

  // Checkout Steps: 
  // Step 1: Login Check (if user is not logged in)
  // Step 2: Delivery Address
  // Step 3: Order Summary
  // Step 4: Payment Options (UPI Only)
  const [activeStep, setActiveStep] = useState<number>(() => {
    if (!user) return 1; // Needs login
    if (addresses.length === 0) return 2; // Needs address
    return 2; // Start at address confirmation
  });

  // Step 1: In-checkout Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginName, setLoginName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);

  // Address state
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

  // If user logs in while modal is open, advance from step 1 to step 2
  useEffect(() => {
    if (user && activeStep === 1) {
      setActiveStep(2);
    }
  }, [user]);

  // New Address Form State - blank by default (no hardcoded Bangalore)
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    name: user?.displayName || '',
    phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    type: 'HOME'
  });

  const [addrError, setAddrError] = useState<string | null>(null);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState<boolean>(false);
  const [pincodeSuccessMsg, setPincodeSuccessMsg] = useState<string | null>(null);

  // Automatic Pincode Lookup when 6 digits are typed
  useEffect(() => {
    const cleanPin = (newAddr.pincode || '').replace(/\D/g, '').trim();
    if (cleanPin.length === 6) {
      let isMounted = true;
      setIsLookingUpPincode(true);
      setPincodeSuccessMsg(null);

      lookupPincode(cleanPin)
        .then((res) => {
          if (!isMounted) return;
          if (res.success) {
            setNewAddr((prev) => ({
              ...prev,
              city: res.city,
              state: res.state,
              locality: (!prev.locality && res.localities && res.localities.length > 0) ? res.localities[0] : prev.locality
            }));
            setPincodeSuccessMsg(`Auto-detected: ${res.city}, ${res.state}`);
            setAddrError(null);
          } else {
            setPincodeSuccessMsg(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLookingUpPincode(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setPincodeSuccessMsg(null);
    }
  }, [newAddr.pincode]);

  // UPI Only Payment States
  const selectedPaymentMethod: PaymentMethodType = 'UPI';
  const [selectedUpiOption, setSelectedUpiOption] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM' | 'CUSTOM'>('GPAY');
  const [upiIdentifier, setUpiIdentifier] = useState<string>(() => {
    return user?.phone?.replace(/\D/g, '').slice(-10) || '';
  });
  const [isVerifyingUpi, setIsVerifyingUpi] = useState<boolean>(false);
  const [isUpiVerified, setIsUpiVerified] = useState<boolean>(false);
  const [upiError, setUpiError] = useState<string | null>(null);
  const [verifiedUpiDetails, setVerifiedUpiDetails] = useState<{
    identifier: string;
    accountHolder: string;
    bankName: string;
  } | null>(null);

  // SuperCoins applied
  const [useSuperCoins, setUseSuperCoins] = useState(false);

  // Payment processing & UPI MPIN modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiPinModal, setShowUpiPinModal] = useState(false);
  const [upiMpin, setUpiMpin] = useState('');

  // Calculate pricing
  const totalMRP = cartItems.reduce((sum, i) => sum + i.product.originalPrice * i.quantity, 0);
  const totalSelling = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalDiscount = totalMRP - totalSelling;
  const platformFee = 3;
  const coinsDiscount = useSuperCoins ? Math.min(superCoins, 200) : 0;
  const finalAmount = Math.max(0, totalSelling + platformFee - coinsDiscount);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || null;

  // Login handlers in Step 1
  const handleSendLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    const cleanDigits = loginPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setLoginError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await sendMobileOtp(cleanDigits);
      setOtpSent(true);
      setLoginSuccessMsg(`OTP sent to +91 ${cleanDigits.slice(-10)} (Testing code: ${res.otp || '123456'})`);
      if (res.otp) setLoginOtp(res.otp);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to send OTP');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    if (!loginOtp.trim() || loginOtp.trim().length !== 6) {
      setLoginError('Please enter the 6-digit OTP');
      return;
    }
    setLoginLoading(true);
    try {
      await verifyMobileOtp(loginPhone, loginOtp, loginName || 'Customer');
      setActiveStep(2); // Proceed to address
    } catch (err: any) {
      setLoginError(err.message || 'Invalid OTP. Please check or use code 123456');
    } finally {
      setLoginLoading(false);
    }
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
    if (!newAddr.city?.trim()) {
      setAddrError('Please enter City / District');
      return;
    }
    if (!newAddr.state?.trim()) {
      setAddrError('Please select State');
      return;
    }

    const created: Address = {
      id: `addr-${Date.now()}`,
      name: newAddr.name.trim(),
      phone: newAddr.phone.trim(),
      pincode: newAddr.pincode.trim(),
      locality: newAddr.locality?.trim() || 'Locality',
      address: newAddr.address.trim(),
      city: newAddr.city.trim(),
      state: newAddr.state.trim(),
      landmark: newAddr.landmark?.trim() || undefined,
      type: newAddr.type || 'HOME',
      isDefault: addresses.length === 0
    };

    onSaveAddress(created);
    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
    setAddrError(null);
    setPincodeSuccessMsg(null);
    setActiveStep(3); // Advance to Order Summary
  };

  // UPI Verification handler
  const handleVerifyUpi = () => {
    setUpiError(null);
    const id = upiIdentifier.trim();
    if (!id) {
      setUpiError('Please enter your 10-digit mobile number or UPI ID (e.g. 9876543210 or yourname@okhdfcbank)');
      return;
    }

    // Check if valid mobile or valid UPI ID
    const isMobile = /^\d{10}$/.test(id.replace(/\D/g, ''));
    const isUpiVpa = id.includes('@') && id.split('@')[1]?.length >= 2;

    if (!isMobile && !isUpiVpa) {
      setUpiError('Please enter a valid 10-digit mobile number OR a valid UPI ID (e.g. mobile@upi or name@okaxis)');
      return;
    }

    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
      const appName = 
        selectedUpiOption === 'GPAY' ? 'Google Pay' :
        selectedUpiOption === 'PHONEPE' ? 'PhonePe' :
        selectedUpiOption === 'PAYTM' ? 'Paytm' :
        selectedUpiOption === 'BHIM' ? 'BHIM UPI' : 'UPI Direct';

      setVerifiedUpiDetails({
        identifier: isMobile ? `${id.replace(/\D/g, '')}@${selectedUpiOption === 'GPAY' ? 'okhdfcbank' : selectedUpiOption === 'PHONEPE' ? 'ybl' : 'paytm'}` : id,
        accountHolder: user?.displayName || 'Sahina Shahid',
        bankName: `${appName} • Verified via NPCI Network`
      });
      setUpiError(null);
    }, 700);
  };

  const handleSelectUpiApp = (opt: 'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM' | 'CUSTOM') => {
    setSelectedUpiOption(opt);
    setIsUpiVerified(false);
    setVerifiedUpiDetails(null);
    setUpiError(null);
    // If empty and user has phone, pre-fill
    if (!upiIdentifier && user?.phone) {
      setUpiIdentifier(user.phone.replace(/\D/g, '').slice(-10));
    }
  };

  const handleTriggerPayment = () => {
    if (!user) {
      alert('Please complete the login step first.');
      setActiveStep(1);
      return;
    }

    if (!selectedAddress) {
      alert('Please add and select a delivery address before placing order.');
      setActiveStep(2);
      setShowNewAddressForm(true);
      return;
    }

    if (!isUpiVerified) {
      alert('Please enter and verify your mobile number or UPI ID before proceeding to payment.');
      return;
    }

    // Open UPI PIN verification modal
    setShowUpiPinModal(true);
  };

  const finalizeOrder = () => {
    if (!selectedAddress) {
      alert('Please add and select your delivery address to place this order.');
      setActiveStep(2);
      setShowNewAddressForm(true);
      return;
    }

    setShowUpiPinModal(false);
    setIsProcessing(true);

    const appLabel = 
      selectedUpiOption === 'GPAY' ? 'Google Pay' :
      selectedUpiOption === 'PHONEPE' ? 'PhonePe' :
      selectedUpiOption === 'PAYTM' ? 'Paytm UPI' :
      selectedUpiOption === 'BHIM' ? 'BHIM' : 'UPI';

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
        paymentMethod: 'UPI',
        paymentDetails: {
          transactionId: `UPI${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          upiId: verifiedUpiDetails?.identifier || `${upiIdentifier}@upi`,
          bankName: verifiedUpiDetails?.bankName || `${appLabel} UPI`
        },
        trackingStatus: 'CONFIRMED',
        estimatedDeliveryDate: getEstimatedDeliveryDate(true)
      };

      onOrderSuccess(newOrder);
    }, 1800);
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
            <h2 className="text-base sm:text-lg font-bold">ApniDukaan Checkout</h2>
            <div className="hidden sm:flex items-center gap-1 bg-emerald-700/60 px-2.5 py-0.5 rounded text-xs font-medium border border-emerald-500/30">
              <Lock className="w-3 h-3 text-emerald-300" />
              <span>100% Secure UPI Payment</span>
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
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sm:justify-center sm:gap-8 text-xs font-bold">
          {/* Step 1: Login */}
          <button 
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 1 ? 'text-[#0b8442]' : user ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              user ? 'bg-emerald-100 text-emerald-700 font-bold' : activeStep === 1 ? 'bg-[#0b8442] text-white' : 'bg-slate-200'
            }`}>
              {user ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">1. LOGIN</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          {/* Step 2: Address */}
          <button 
            onClick={() => {
              if (!user) {
                alert('Please login first to manage address.');
                setActiveStep(1);
                return;
              }
              setActiveStep(2);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 2 ? 'text-[#0b8442]' : activeStep > 2 ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 2 ? 'bg-[#0b8442] text-white' : activeStep > 2 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-200'
            }`}>
              {activeStep > 2 ? '✓' : '2'}
            </span>
            <span>2. DELIVERY ADDRESS</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          {/* Step 3: Order Summary */}
          <button 
            onClick={() => {
              if (!selectedAddress) {
                alert('Please enter and confirm your delivery address before proceeding.');
                setActiveStep(2);
                setShowNewAddressForm(true);
                return;
              }
              if (activeStep >= 3) setActiveStep(3);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 3 ? 'text-[#0b8442]' : activeStep > 3 ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 3 ? 'bg-[#0b8442] text-white' : activeStep > 3 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-200'
            }`}>
              {activeStep > 3 ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">3. ORDER SUMMARY</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          {/* Step 4: UPI Payment */}
          <button 
            onClick={() => {
              if (!selectedAddress) {
                alert('Please add your delivery address before proceeding to Payment.');
                setActiveStep(2);
                setShowNewAddressForm(true);
                return;
              }
              setActiveStep(4);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 4 ? 'text-[#0b8442]' : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              activeStep === 4 ? 'bg-[#0b8442] text-white' : 'bg-slate-200'
            }`}>
              4
            </span>
            <span>4. UPI PAYMENT</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Checkout Steps (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Step 1: Login Status / Active Login Form */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 1 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              {user ? (
                /* Compact Logged-in State */
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">1</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">LOGIN / ACCOUNT</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        {user.displayName || 'Customer'} ({user.phone || user.email || 'Logged in'})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">VERIFIED</span>
                    <button
                      onClick={() => {
                        logout();
                        setActiveStep(1);
                      }}
                      className="text-xs text-slate-500 hover:text-red-600 font-bold ml-2 underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                /* Unauthenticated Step 1: Enter Mobile & OTP */
                <div className="p-4 space-y-4 text-xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-[#0b8442] text-white font-bold flex items-center justify-center text-xs">1</span>
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                      LOGIN OR SIGNUP TO PROCEED
                    </h3>
                  </div>

                  <p className="text-slate-600 text-xs">
                    Please enter your mobile number. We will send an SMS OTP to verify your account.
                  </p>

                  {loginError && (
                    <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded font-semibold text-xs">
                      {loginError}
                    </div>
                  )}

                  {loginSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-xs flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{loginSuccessMsg}</span>
                    </div>
                  )}

                  {!otpSent ? (
                    <form onSubmit={handleSendLoginOtp} className="space-y-3 max-w-sm">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Enter 10-Digit Mobile Number *</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l text-slate-600 font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="e.g. 9876543210"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 p-2.5 border border-slate-300 rounded-r bg-white text-slate-900 focus:border-[#0b8442] outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Your Name (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Sahina Shahid"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="bg-[#0b8442] hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>GET OTP & CONTINUE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginPhone('9876543210');
                            setLoginName('Sahina Shahid');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded text-xs cursor-pointer"
                        >
                          Use Demo Mobile
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyLoginOtp} className="space-y-3 max-w-sm animate-in fade-in duration-150">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-700 font-bold">Enter 6-Digit OTP *</label>
                          <button
                            type="button"
                            onClick={() => setLoginOtp('123456')}
                            className="text-[11px] text-[#0b8442] font-bold hover:underline cursor-pointer"
                          >
                            Auto-fill OTP
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          placeholder="123456"
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 font-mono text-center tracking-widest text-lg font-bold focus:border-[#0b8442] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="bg-[#0b8442] hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          <span>VERIFY & CONTINUE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-slate-500 font-semibold text-xs hover:text-slate-700 cursor-pointer underline px-2"
                        >
                          Change Number
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 2 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div 
                onClick={() => {
                  if (!user) {
                    setActiveStep(1);
                    return;
                  }
                  setActiveStep(2);
                }}
                className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 2 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>2</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    Delivery Address
                  </span>
                </div>
                {activeStep !== 2 && (
                  <button className="text-xs text-[#0b8442] font-bold cursor-pointer">
                    {selectedAddress ? 'CHANGE' : 'ADD ADDRESS'}
                  </button>
                )}
              </div>

              {activeStep === 2 ? (
                <div className="p-4 space-y-4">
                  {/* Warning banner when NO address is saved - Requirement 2 */}
                  {addresses.length === 0 && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 flex items-start gap-3 text-amber-900 shadow-xs">
                      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          <span>No Saved Address Found</span>
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black uppercase">Action Needed</span>
                        </h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          You do not have any saved delivery address. Please enter your complete shipping address below to deliver your order.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Saved Address Radio List - Only shown if user actually has saved addresses */}
                  {addresses.length > 0 && (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label 
                          key={addr.id}
                          className={`block p-3.5 rounded border transition-all cursor-pointer ${
                            selectedAddressId === addr.id
                              ? 'border-[#0b8442] bg-emerald-50/30 ring-1 ring-emerald-500'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="selected-address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 text-[#0b8442] focus:ring-[#0b8442]"
                            />
                            <div className="flex-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-sm">{addr.name}</span>
                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                  {addr.type === 'HOME' ? <Home className="w-3 h-3 text-emerald-600" /> : <Briefcase className="w-3 h-3 text-blue-600" />}
                                  {addr.type}
                                </span>
                                <span className="text-slate-500 font-medium ml-auto">{addr.phone}</span>
                              </div>
                              <p className="text-slate-600 mt-1.5 leading-relaxed">
                                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pincode}</span>
                              </p>
                              {addr.landmark && (
                                <p className="text-slate-400 text-[11px] mt-0.5">Landmark: {addr.landmark}</p>
                              )}

                              {selectedAddressId === addr.id && (
                                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                                  <button
                                    type="button"
                                    onClick={() => setActiveStep(3)}
                                    className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2 px-5 rounded text-xs transition-colors shadow-xs cursor-pointer"
                                  >
                                    DELIVER HERE
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
                        <span className="text-[11px] text-slate-500 font-medium">All fields marked * are required</span>
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
                            placeholder="Recipient's Name"
                            value={newAddr.name}
                            onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">10-Digit Mobile Number *</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l text-slate-600 font-semibold text-xs">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="10-digit mobile"
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                              className="w-full p-2.5 border border-slate-300 rounded-r bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Requirement 3: Pincode Auto-fill City & State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-slate-700 font-bold">6-Digit Pincode *</label>
                            {isLookingUpPincode && (
                              <span className="text-[10px] text-[#0b8442] font-semibold flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Fetching details...
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="e.g. 560001 or 110001"
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                          {pincodeSuccessMsg && (
                            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {pincodeSuccessMsg}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Locality / Colony / Area *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Colony, Area or Street"
                            value={newAddr.locality}
                            onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Flat, House No., Building Name, Street Address *</label>
                        <textarea
                          required
                          placeholder="e.g. Flat 302, Green Valley Apartments"
                          rows={2}
                          value={newAddr.address}
                          onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">City / District *</label>
                          <input
                            type="text"
                            required
                            placeholder="City or District"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">State *</label>
                          <select
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
                          >
                            <option value="">-- Select State --</option>
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
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none"
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
                          className="bg-[#0b8442] text-white font-bold py-2.5 px-6 rounded text-xs hover:bg-emerald-700 cursor-pointer shadow-xs transition-colors"
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
              activeStep === 3 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div 
                onClick={() => {
                  if (!selectedAddress) {
                    alert('Please enter and confirm your delivery address.');
                    setActiveStep(2);
                    return;
                  }
                  setActiveStep(3);
                }}
                className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 3 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>3</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    Order Summary ({cartItems.length} items)
                  </span>
                </div>
                {activeStep > 3 && (
                  <button className="text-xs text-[#0b8442] font-bold cursor-pointer">CHANGE</button>
                )}
              </div>

              {activeStep === 3 ? (
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
                      Delivery by <span className="font-bold text-slate-800">{getEstimatedDeliveryDate(true)}</span>
                    </p>
                    <button
                      id="order-summary-continue-btn"
                      onClick={() => setActiveStep(4)}
                      className="bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-2.5 px-6 rounded text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      CONTINUE TO UPI PAYMENT
                    </button>
                  </div>
                </div>
              ) : activeStep > 3 ? (
                <div className="px-4 py-2 text-xs text-slate-600">
                  {cartItems.length} item(s) selected for delivery
                </div>
              ) : null}
            </div>

            {/* Step 4: UPI ONLY Payment Options (Requirement 4) */}
            <div className={`bg-white rounded border transition-all ${
              activeStep === 4 ? 'border-[#0b8442] shadow-md ring-1 ring-emerald-100' : 'border-slate-200'
            }`}>
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-xs ${
                    activeStep === 4 ? 'bg-[#0b8442] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>4</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                    UPI Payment Options (100% Safe & Zero Fee)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#0b8442] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NPCI Unified Payments</span>
                </div>
              </div>

              {activeStep === 4 && (
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
                          <p className="text-[11px] text-amber-700">Use {Math.min(superCoins, 200)} SuperCoins to save ₹{Math.min(superCoins, 200)}</p>
                        </div>
                      </div>
                      <span className="font-black text-amber-800">Balance: {superCoins}</span>
                    </label>
                  )}

                  {/* UPI Banner */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#0b8442]" />
                      <div>
                        <span className="font-bold text-slate-800">Unified Payments Interface (UPI)</span>
                        <p className="text-[11px] text-slate-600">Select any UPI App or enter your Mobile / UPI ID below</p>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">FAST & SECURE</span>
                  </div>

                  {/* UPI Options Selection Grid - Requirement 4 */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-700 block">Select your UPI Option:</label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => handleSelectUpiApp('GPAY')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedUpiOption === 'GPAY'
                            ? 'border-[#0b8442] bg-emerald-50/60 ring-2 ring-[#0b8442]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-800">Google Pay</span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${selectedUpiOption === 'GPAY' ? 'border-[#0b8442] bg-[#0b8442]' : 'border-slate-300'}`} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">GPay App</span>
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={() => handleSelectUpiApp('PHONEPE')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedUpiOption === 'PHONEPE'
                            ? 'border-[#0b8442] bg-emerald-50/60 ring-2 ring-[#0b8442]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-800">PhonePe</span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${selectedUpiOption === 'PHONEPE' ? 'border-[#0b8442] bg-[#0b8442]' : 'border-slate-300'}`} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">UPI & Wallet</span>
                      </button>

                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={() => handleSelectUpiApp('PAYTM')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedUpiOption === 'PAYTM'
                            ? 'border-[#0b8442] bg-emerald-50/60 ring-2 ring-[#0b8442]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-800">Paytm</span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${selectedUpiOption === 'PAYTM' ? 'border-[#0b8442] bg-[#0b8442]' : 'border-slate-300'}`} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Paytm UPI</span>
                      </button>

                      {/* BHIM / Any UPI */}
                      <button
                        type="button"
                        onClick={() => handleSelectUpiApp('BHIM')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selectedUpiOption === 'BHIM'
                            ? 'border-[#0b8442] bg-emerald-50/60 ring-2 ring-[#0b8442]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-800">BHIM / Other</span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${selectedUpiOption === 'BHIM' ? 'border-[#0b8442] bg-[#0b8442]' : 'border-slate-300'}`} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Any UPI App</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Input Box - Triggered for ANY selected option */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-800">
                          Enter Mobile Number or UPI ID / VPA *
                        </label>
                        {user?.phone && (
                          <button
                            type="button"
                            onClick={() => {
                              setUpiIdentifier(user.phone!.replace(/\D/g, '').slice(-10));
                              setIsUpiVerified(false);
                            }}
                            className="text-[11px] text-[#0b8442] font-semibold hover:underline cursor-pointer"
                          >
                            Use My Mobile ({user.phone})
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiIdentifier}
                          onChange={(e) => {
                            setUpiIdentifier(e.target.value);
                            setIsUpiVerified(false);
                            setVerifiedUpiDetails(null);
                            setUpiError(null);
                          }}
                          placeholder="e.g. 9876543210 or yourname@okhdfcbank"
                          className="flex-1 p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:border-[#0b8442] outline-none font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          disabled={isVerifyingUpi}
                          className="bg-[#0b8442] hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {isVerifyingUpi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          <span>{isVerifyingUpi ? 'Verifying...' : 'VERIFY'}</span>
                        </button>
                      </div>

                      {/* Quick handle tags to append */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Quick Suffix:</span>
                        {['@okhdfcbank', '@okaxis', '@oksbi', '@paytm', '@ybl', '@upi'].map((suffix) => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => {
                              const base = upiIdentifier.includes('@') ? upiIdentifier.split('@')[0] : upiIdentifier;
                              setUpiIdentifier((base || '9876543210') + suffix);
                              setIsUpiVerified(false);
                            }}
                            className="text-[10px] bg-white border border-slate-200 hover:border-[#0b8442] hover:text-[#0b8442] px-2 py-0.5 rounded text-slate-600 transition-colors cursor-pointer"
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>
                    </div>

                    {upiError && (
                      <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold">
                        {upiError}
                      </div>
                    )}

                    {/* Verified Card display */}
                    {isUpiVerified && verifiedUpiDetails && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 space-y-1 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>UPI Verified with National Payments Corporation (NPCI)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-emerald-800 pt-1">
                          <p><span className="font-semibold">Account Holder:</span> {verifiedUpiDetails.accountHolder}</p>
                          <p><span className="font-semibold">UPI ID:</span> {verifiedUpiDetails.identifier}</p>
                          <p className="sm:col-span-2 text-emerald-700 font-medium">Status: Ready for 1-click authorization</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pay button */}
                  <div>
                    {!isUpiVerified ? (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          className="w-full sm:w-auto bg-slate-300 text-slate-600 font-bold py-3 px-8 rounded text-xs cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          <span>ENTER & VERIFY MOBILE / UPI ID TO PAY {formatPrice(finalAmount)}</span>
                        </button>
                        <p className="text-[11px] text-slate-500">
                          Please click the <span className="font-bold text-[#0b8442]">VERIFY</span> button above to authenticate your UPI account before placing the order.
                        </p>
                      </div>
                    ) : (
                      <button
                        id="pay-via-upi-btn"
                        onClick={handleTriggerPayment}
                        disabled={isProcessing}
                        className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e6550f] text-white font-bold py-3 px-8 rounded text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                      >
                        <Lock className="w-4 h-4" />
                        <span>PAY {formatPrice(finalAmount)} VIA UPI</span>
                      </button>
                    )}
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
            <div className="p-3.5 bg-white border border-slate-200 rounded text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Safe UPI Payments</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Transactions are authorized directly via your mobile banking app through NPCI with 256-bit encryption.
              </p>
            </div>
          </div>

        </div>

        {/* UPI MPIN Authorization Modal */}
        {showUpiPinModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-[#0b8442] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">UPI Payment Authorization</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Payment request of <span className="font-bold text-slate-900">{formatPrice(finalAmount)}</span> sent to <span className="font-bold text-emerald-700">{verifiedUpiDetails?.identifier || upiIdentifier}</span>
                </p>
              </div>

              <div className="py-2 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Enter 4 or 6-digit UPI MPIN</label>
                <input
                  id="upi-pin-input"
                  type="password"
                  maxLength={6}
                  value={upiMpin}
                  onChange={(e) => setUpiMpin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-44 mx-auto text-center text-2xl font-mono tracking-widest font-bold p-2.5 border-2 border-emerald-500 rounded focus:outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400">
                  Demo PIN: Enter any 4 or 6 numbers (e.g. 1234)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  id="submit-upi-pin-btn"
                  onClick={finalizeOrder}
                  className="flex-1 bg-[#0b8442] hover:bg-emerald-700 text-white font-bold py-2.5 rounded text-xs transition-colors cursor-pointer shadow-xs"
                >
                  CONFIRM & PAY
                </button>
                <button
                  onClick={() => setShowUpiPinModal(false)}
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
                <h3 className="text-base font-bold text-slate-800">Processing UPI Payment...</h3>
                <p className="text-xs text-slate-500 mt-1">Authorizing with your bank via NPCI. Please do not refresh.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted & Bank Approved</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
