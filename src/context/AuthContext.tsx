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
  verifyMobileOtp: (phone: string, otp: string, displayName?: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_PHONE_NUMBER = '9125387290';

export const DEMO_ADMIN: UserProfile = {
  uid: 'admin-apnidukaan-9125387290',
  phone: '+91 91253 87290',
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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In-memory active OTP storage mapped to phone numbers
  const [activeOtps, setActiveOtps] = useState<Record<string, { code: string; expiresAt: number }>>({});

  // Check whether user is already logged in with Firebase Auth or saved session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
          }
        } catch (e) {
          console.warn('Error fetching firebase profile:', e);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

    const isAdminNumber = clean10 === ADMIN_PHONE_NUMBER;
    // Generate a 6-digit OTP (for admin 9125387290 generate 999999 or random code)
    const code = isAdminNumber
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
      message: isAdminNumber 
        ? `Store Admin OTP sent to +91 ${clean10}` 
        : `OTP sent successfully to +91 ${clean10}`
    };
  };

  /**
   * Verify mobile OTP and create or log into account
   * Verifies if the phone number matches the admin phone number (9125387290)
   */
  const verifyMobileOtp = async (
    phone: string, 
    enteredOtp: string, 
    displayName?: string
  ) => {
    setIsLoading(true);
    try {
      const rawDigits = phone.replace(/\D/g, '');
      const clean10 = rawDigits.slice(-10);
      
      const record = activeOtps[clean10];
      // Allow entered OTP if it matches generated code OR master testing code 123456 OR admin code 999999
      const isValid = (record && record.code === enteredOtp.trim()) || 
                      enteredOtp.trim() === '123456' || 
                      (clean10 === ADMIN_PHONE_NUMBER && enteredOtp.trim() === '999999');
      
      if (!isValid) {
        throw new Error('Invalid OTP. Please check the 6-digit code or click Auto-fill OTP.');
      }

      // CRITICAL: Verify if number logged in with is 9125387290 for admin
      const isAdminNumber = clean10 === ADMIN_PHONE_NUMBER;
      const role: UserRole = isAdminNumber ? 'admin' : 'customer';

      const formattedPhone = `+91 ${clean10.slice(0, 5)} ${clean10.slice(5)}`;
      const uid = isAdminNumber ? `admin-apnidukaan-${clean10}` : `user-phone-${clean10}`;
      
      // Check existing profile in Firestore
      const existing = await getUserProfile(uid);
      const nameToUse = displayName?.trim() || existing?.displayName || (isAdminNumber ? 'ApniDukaan Admin (Store Owner)' : 'Customer ' + clean10.slice(-4));

      const profile: UserProfile = {
        uid,
        phone: formattedPhone,
        displayName: nameToUse,
        role,
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
