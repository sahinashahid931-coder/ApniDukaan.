import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  KeyRound,
  RotateCcw,
  Check,
  Shield,
  Smartphone
} from 'lucide-react';
import { useAuth, DEMO_ADMIN, DEMO_CUSTOMER } from '../context/AuthContext';
import { UserRole } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialRole = 'customer',
  onSuccess
}) => {
  const { sendMobileOtp, verifyMobileOtp, demoLogin } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setStep('MOBILE');
      setPhone('');
      setOtp('');
      setName('');
      setGeneratedOtp(null);
      setError(null);
      setInfoMessage(null);
    }
  }, [isOpen, initialRole]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setError(null);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await sendMobileOtp(cleanDigits);
      setGeneratedOtp(res.otp);
      setInfoMessage(`Verification OTP dispatched: ${res.otp}`);
      setStep('OTP');
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setLoading(true);
    try {
      const res = await sendMobileOtp(phone);
      setGeneratedOtp(res.otp);
      setInfoMessage(`New OTP sent: ${res.otp}`);
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyMobileOtp(phone, otp.trim(), name, selectedRole);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please check the code and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtp(generatedOtp);
      setError(null);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin(role);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#0b8442] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-yellow-400 text-[#0b8442] font-black text-xs px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
              {selectedRole === 'admin' ? 'Store Administrator' : 'ApniDukaan'}
            </span>
            <span className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" /> 100% Secure OTP Login
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {selectedRole === 'admin' 
              ? 'Admin Portal Login' 
              : (step === 'MOBILE' ? 'Login or Sign Up' : 'Verify Mobile Number')}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {selectedRole === 'admin'
              ? 'Store Admin access to manage entire catalog, pricing & customer orders'
              : 'Enter your 10-digit mobile number to access your account & orders'}
          </p>
        </div>

        {/* Role Toggle Strip */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('customer');
              setStep('MOBILE');
              setError(null);
            }}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'bg-white text-[#0b8442] border-b-2 border-[#0b8442] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Shopper / Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setStep('MOBILE');
              setError(null);
            }}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-white text-[#0b8442] border-b-2 border-[#0b8442] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Store Admin (Owner)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter Mobile Number */}
          {step === 'MOBILE' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="flex rounded-md border border-slate-300 focus-within:border-[#0b8442] focus-within:ring-2 focus-within:ring-emerald-500/20 overflow-hidden shadow-xs">
                  <div className="bg-slate-100 border-r border-slate-300 px-3 py-2.5 flex items-center gap-1 text-xs font-bold text-slate-700 select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    id="auth-mobile-input"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium tracking-wide"
                    autoFocus
                    maxLength={10}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  By continuing, you agree to ApniDukaan's Terms of Use and Privacy Policy.
                </p>
              </div>

              {selectedRole === 'admin' && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                  <p className="font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-700" /> Store Owner Privileges
                  </p>
                  <p className="mt-0.5 text-amber-800">
                    Admin has full authority to list, edit, discount, and sell everything on ApniDukaan, as well as process all customer orders.
                  </p>
                </div>
              )}

              <button
                type="submit"
                id="request-otp-btn"
                disabled={loading || phone.length !== 10}
                className="w-full py-3 px-4 bg-[#0b8442] hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Sending OTP...</span>
                  </span>
                ) : (
                  <>
                    <span>Request OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter & Verify 6-digit OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500">OTP sent to: </span>
                  <span className="font-bold text-slate-800">+91 {phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('MOBILE');
                    setOtp('');
                    setError(null);
                  }}
                  className="text-[#0b8442] hover:underline font-bold cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Simulated Instant SMS Notification Card */}
              {generatedOtp && (
                <div className="p-3 bg-emerald-50 rounded-md border border-emerald-300 text-xs text-emerald-950">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-[#0b8442]">
                      <Smartphone className="w-3.5 h-3.5" /> SMS Message (Instant Simulation)
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2 py-0.5 bg-[#0b8442] text-white rounded text-[11px] font-bold hover:bg-emerald-800 cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Auto-fill OTP
                    </button>
                  </div>
                  <p className="text-slate-700">
                    Your ApniDukaan verification OTP is{' '}
                    <strong className="text-base text-slate-900 tracking-wider font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                      {generatedOtp}
                    </strong>
                    . Valid for 10 minutes.
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="auth-otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    className="w-full text-center text-xl font-bold tracking-[0.4em] py-2.5 px-4 rounded-md border border-slate-300 focus:border-[#0b8442] focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden font-mono"
                    maxLength={6}
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Full Name input (for personalization/account creation) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name <span className="font-normal text-slate-400">(Optional / Setup)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'e.g. ApniDukaan Admin' : 'e.g. Sahina Shahid'}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900 focus:border-[#0b8442] focus:outline-hidden"
                />
              </div>

              {/* Resend OTP countdown */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive the code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#0b8442] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Resend OTP
                  </button>
                ) : (
                  <span className="text-slate-400 font-medium">
                    Resend in <strong className="text-slate-700">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="submit"
                id="verify-otp-btn"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 bg-[#0b8442] hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying OTP...</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Helpers */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-customer-login-btn"
                onClick={() => handleQuickDemo('customer')}
                className="p-2.5 rounded border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 group-hover:text-emerald-950">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Shopper Demo</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-0.5">Sahina (+91 98765 12345)</p>
              </button>

              <button
                type="button"
                id="demo-admin-login-btn"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:text-amber-950">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Store Admin Demo</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-0.5">Sells everything (Full Access)</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
