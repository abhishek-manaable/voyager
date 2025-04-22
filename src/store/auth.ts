import { create } from 'zustand';
import { 
  collection,
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AuthUser, UserRole } from '../types/auth';

interface AuthStore {
  authUser: AuthUser | null;
  loading: boolean;
  error: string | null;
  users: AuthUser[];
  initialize: (uid: string) => () => void;
  createUser: (uid: string, email: string, displayName: string, photoURL: string) => Promise<void>;
  updateUser: (uid: string, data: Partial<Omit<AuthUser, 'uid'>>) => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  getAllUsers: () => Promise<AuthUser[]>;
  resetState: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  loading: true,
  error: null,
  users: [],

  initialize: (uid: string) => {
    set({ loading: true, error: null });
    
    const unsubscribes: (() => void)[] = [];
    
    // Listen for current user's document
    unsubscribes.push(onSnapshot(
      doc(db, 'users', uid),
      {
        next: (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            set({
              authUser: {
                uid: doc.id,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                role: data.role,
                isActive: data.isActive,
                lastLogin: data.lastLogin?.toDate(),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
              },
              loading: false,
              error: null,
            });
          } else {
            set({ 
              authUser: null,
              loading: false,
              error: 'User document not found'
            });
          }
        },
        error: (error) => {
          set({ 
            authUser: null,
            error: error.message, 
            loading: false 
          });
        }
      }
    ));
    
    // Listen for all users
    const usersQuery = query(collection(db, 'users'), orderBy('displayName'));
    unsubscribes.push(onSnapshot(
      usersQuery,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          lastLogin: doc.data().lastLogin?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as AuthUser[];
        set(state => ({ ...state, users }));
      },
      (error) => {
        console.error('Error fetching users:', error);
        set(state => ({ ...state, error: error.message }));
      }
    ));

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  },

  createUser: async (uid: string, email: string, displayName: string, photoURL: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const now = Timestamp.now();

      const userData = {
        email,
        displayName,
        photoURL,
        role: UserRole.EMPLOYEE,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userRef, userData);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateUser: async (uid: string, data: Partial<Omit<AuthUser, 'uid'>>) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  hasPermission: (resource: string, action: string) => {
    const { authUser } = get();
    if (!authUser) return false;

    switch (authUser.role) {
      case UserRole.ADMIN:
        return true;
      case UserRole.HR_MANAGER:
        return resource.startsWith('hr_') || resource === 'employees';
      case UserRole.MANAGER:
        return ['view_reports', 'approve_leave'].includes(`${resource}_${action}`);
      case UserRole.EMPLOYEE:
        return ['view_profile', 'submit_leave'].includes(`${resource}_${action}`);
      default:
        return false;
    }
  },

  getAllUsers: async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        role: doc.data().role,
        isActive: doc.data().isActive,
        lastLogin: doc.data().lastLogin?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as AuthUser[];
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  resetState: () => {
    set({
      authUser: null,
      loading: false,
      error: null,
    });
  },
}));