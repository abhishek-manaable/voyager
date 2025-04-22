import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ARRTarget } from '../types/target';

interface TargetStore {
  targets: ARRTarget[];
  loading: boolean;
  error: string | null;
  addTarget: (target: Omit<ARRTarget, 'id'>) => Promise<void>;
  updateTarget: (id: string, target: Partial<ARRTarget>) => Promise<void>;
  getTargetForMonth: (year: number, month: number) => ARRTarget | undefined;
  initialize: () => () => void;
}

export const useTargetStore = create<TargetStore>((set, get) => ({
  targets: [],
  loading: true,
  error: null,

  initialize: () => {
    // 単一のフィールドでの orderBy に変更
    const q = query(
      collection(db, 'targets'),
      orderBy('year')
    );
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const targets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ARRTarget[];
        
        // クライアント側でソート
        targets.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          }
          return a.month - b.month;
        });
        
        set({ targets, loading: false, error: null });
      },
      (error) => {
        console.error('Firestore error:', error);
        set({ error: error.message, loading: false });
        throw error;
      }
    );

    return unsubscribe;
  },
  
  addTarget: async (target) => {
    try {
      await addDoc(collection(db, 'targets'), target);
    } catch (error) {
      console.error('Error adding target:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  updateTarget: async (id, target) => {
    try {
      const targetRef = doc(db, 'targets', id);
      await updateDoc(targetRef, target);
    } catch (error) {
      console.error('Error updating target:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  getTargetForMonth: (year, month) => {
    return get().targets.find(
      (t) => t.year === year && t.month === month
    );
  },
}));