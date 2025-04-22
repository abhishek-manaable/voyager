import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { AuthContextType, UserRole } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    authUser,
    initialize,
    updateUser,
    hasPermission,
    resetState
  } = useAuthStore();

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;
    setLoading(true);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);

          // ユーザードキュメントの確認と作成/更新
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // 新規ユーザーの場合
            const userData = {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: UserRole.EMPLOYEE,
              isActive: true,
              lastLogin: serverTimestamp(),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, userData);
          }

          // Firestoreリスナーの設定
          unsubscribeFirestore = initialize(user.uid);
          
          // 最終ログイン時間の更新
          await updateUser(user.uid, { lastLogin: serverTimestamp() });
        } else {
          setUser(null);
          resetState();
          if (unsubscribeFirestore) {
            unsubscribeFirestore();
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [initialize, updateUser, resetState]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.email?.endsWith('@manaable.com')) {
        await firebaseSignOut(auth);
        throw new Error('Only @manaable.com accounts are allowed');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      resetState();
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    authUser,
    loading: loading || useAuthStore.getState().loading,
    error,
    signInWithGoogle,
    signOut,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};