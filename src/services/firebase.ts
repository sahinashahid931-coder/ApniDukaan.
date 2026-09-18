import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, CartItem, Address, Order } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  role: UserRole;
  email?: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

/**
 * Fetch user profile from Firestore or create one if not existing
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

/**
 * Create or update user profile document in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${profile.uid}`);
  }
}

/**
 * Upload & save product directly into Firestore products collection
 */
export async function addProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Update existing product in Firestore products collection
 */
export async function updateProductInFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete product from Firestore products collection
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Fetch all products from Firestore products collection
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map(d => d.data() as Product);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Real-time subscription to Firestore products collection
 */
export function subscribeToProductsFromFirestore(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (!snapshot.empty) {
        const prods = snapshot.docs.map(d => d.data() as Product);
        onUpdate(prods);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onError?.(error);
    }
  );
}

/**
 * Seed initial catalog into Firestore if collection is empty
 */
export async function seedProductsToFirestoreIfEmpty(initialProducts: Product[]): Promise<void> {
  try {
    const existing = await getProductsFromFirestore();
    if (existing.length === 0) {
      // Seed first 8 high-priority products into Firestore
      for (const p of initialProducts.slice(0, 10)) {
        await addProductToFirestore(p);
      }
    }
  } catch (e) {
    console.warn('Seeding initial products failed:', e);
  }
}

/**
 * Save user cart strictly isolated to a specific user UID/phone
 */
export async function saveUserCartToFirestore(userId: string, cart: CartItem[]): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      cart,
      cartUpdatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch user cart from Firestore
 */
export async function getUserCartFromFirestore(userId: string): Promise<CartItem[] | null> {
  if (!userId) return null;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.cart as CartItem[]) || [];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save user wishlist strictly isolated to a specific user UID/phone
 */
export async function saveUserWishlistToFirestore(userId: string, wishlist: string[]): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      wishlist,
      wishlistUpdatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch user wishlist from Firestore
 */
export async function getUserWishlistFromFirestore(userId: string): Promise<string[] | null> {
  if (!userId) return null;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.wishlist as string[]) || [];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save user delivery addresses strictly isolated to a specific user UID/phone
 */
export async function saveUserAddressesToFirestore(userId: string, addresses: Address[]): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      addresses,
      addressesUpdatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch user delivery addresses from Firestore
 */
export async function getUserAddressesFromFirestore(userId: string): Promise<Address[] | null> {
  if (!userId) return null;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.addresses as Address[]) || [];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save an order to Firestore orders collection with userId and userPhone
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, {
      ...order,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Fetch all orders from Firestore (used by admin or for local synchronization)
 */
export async function getAllOrdersFromFirestore(): Promise<Order[]> {
  const path = 'orders';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map(d => d.data() as Order);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Real-time subscription to Firestore orders collection
 */
export function subscribeToOrdersFromFirestore(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'orders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (!snapshot.empty) {
        const ords = snapshot.docs.map(d => d.data() as Order);
        onUpdate(ords);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onError?.(error);
    }
  );
}

