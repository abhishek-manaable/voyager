import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AuthUser, UserRole } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

export const useUserManagement = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    if (!hasPermission('users', 'manage')) {
      setError('Insufficient permissions');
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userData = snapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id,
          lastLogin: doc.data().lastLogin?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as AuthUser[];

        setUsers(userData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hasPermission]);

  const updateUserRole = async (uid: string, role: UserRole) => {
    if (!hasPermission('users', 'manage')) {
      throw new Error('Insufficient permissions');
    }

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const updateUserStatus = async (uid: string, isActive: boolean) => {
    if (!hasPermission('users', 'manage')) {
      throw new Error('Insufficient permissions');
    }

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        isActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  return {
    users,
    loading,
    error,
    updateUserRole,
    updateUserStatus,
  };
};