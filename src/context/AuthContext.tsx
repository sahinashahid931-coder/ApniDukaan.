import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile, UserProfile, UserRole } from '../services/firebase';

interface OtpResponse {
  success: boolean;
  otp: string;
  message: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  sendMobileOtp: (phone: string) => Promise<OtpResponse>;
  verifyMobileOtp: (phone: string, otp: string, displayName?: string, role?: UserRole) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ADMIN: UserProfile = {
  uid: 'admin-apnidukaan-store',
  phone: '+91 98765 00001',
  displayName: 'ApniDukaan Admin (Store Owner)',
  role: 'admin',
  email: 'admin@apnidukaan.com',
  createdAt: new Date().toISOString(),
};

export const DEMO_CUSTOMER: UserProfile = {
  uid: 'customer-apnidukaan-sahina',
  phone: '+91 98765 12345',
  displayName: 'Sahina Shahid',
  role: 'customer',
  email: 'sahinashahid931@gmail.com',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('apnidukaan_active_user');
      return saved ? JSON.parse(saved) : DEMO_CUSTOMER;
    } catch {
      return DEMO_CUSTOMER;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // In-memory active OTP storage mapped to phone numbers
  const [activeOtps, setActiveOtps] = useState<Record<string, { code: string; expiresAt: number }>>({});

  // Synchronize active profile with local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('apnidukaan_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('apnidukaan_active_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Clean phone helper
  const sanitizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    if (digits.length > 10 && digits.startsWith('91')) {
      const last10 = digits.slice(-10);
      return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }
    return phone.trim();
  };

  /**
   * Request 6-digit OTP to mobile number
   */
  const sendMobileOtp = async (phone: string): Promise<OtpResponse> => {
    const rawDigits = phone.replace(/\D/g, '');
    const clean10 = rawDigits.slice(-10);
    if (clean10.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }

    // Generate a 6-digit OTP (for demo admin number 9876500001 or standard numbers, generate memorable code)
    const code = clean10 === '9876500001' 
      ? '999999' 
      : Math.floor(100000 + Math.random() * 900000).toString();

    setActiveOtps(prev => ({
      ...prev,
      [clean10]: {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes validity
      }
    }));

    return {
      success: true,
      otp: code,
      message: `OTP sent successfully to +91 ${clean10}`
    };
  };

  /**
   * Verify mobile OTP and create or log into account
   */
  const verifyMobileOtp = async (
    phone: string, 
    enteredOtp: string, 
    displayName?: string, 
    forcedRole?: UserRole
  ) => {
    setIsLoading(true);
    try {
      const rawDigits = phone.replace(/\D/g, '');
      const clean10 = rawDigits.slice(-10);
      
      const record = activeOtps[clean10];
      // Allow entered OTP if it matches generated code OR master universal testing code 123456
      const isValid = (record && record.code === enteredOtp.trim()) || enteredOtp.trim() === '123456' || (clean10 === '9876500001' && enteredOtp.trim() === '999999');
      
      if (!isValid) {
        throw new Error('Invalid OTP. Please check the 6-digit code or click Auto-fill OTP.');
      }

      // Determine role: Admin if requested or admin number
      const isAdminNumber = clean10 === '9876500001' || clean10 === '9999999999';
      const role: UserRole = forcedRole === 'admin' || isAdminNumber ? 'admin' : 'customer';

      const formattedPhone = `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}`;
      const uid = `user-phone-${clean10}`;
      
      // Check existing profile in Firestore
      const existing = await getUserProfile(uid);
      const nameToUse = displayName?.trim() || existing?.displayName || (role === 'admin' ? 'ApniDukaan Admin' : 'Shopper ' + clean10.slice(-4));

      const profile: UserProfile = {
        uid,
        phone: formattedPhone,
        displayName: nameToUse,
        role: existing?.role === 'admin' || role === 'admin' ? 'admin' : 'customer',
        createdAt: existing?.createdAt || new Date().toISOString()
      };

      await saveUserProfile(profile);
      setUser(profile);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const account = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
      setUser(account);
      await saveUserProfile(account);
    } catch (err) {
      console.warn('Demo login fallback:', err);
      setUser(role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        sendMobileOtp,
        verifyMobileOtp,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
