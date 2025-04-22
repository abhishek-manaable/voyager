import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Contract, ContractRenewal } from '../types/contract';

interface ContractStore {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  addContract: (clientName: string, initialDate: string, renewal: ContractRenewal) => Promise<void>;
  addRenewal: (contractId: string, renewal: ContractRenewal) => Promise<void>;
  updateRenewal: (contractId: string, renewalId: string, renewal: Partial<ContractRenewal>) => Promise<void>;
  getARRData: (startDate: Date, endDate: Date) => {
    date: string;
    totalARR: number;
  }[];
  initialize: () => () => void;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  loading: true,
  error: null,

  initialize: () => {
    const q = query(collection(db, 'contracts'), orderBy('initialDate'));
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const contracts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            clientName: data.clientName,
            initialDate: data.initialDate,
            renewals: data.renewals.map((renewal: any) => ({
              ...renewal,
              startDate: renewal.startDate,
              endDate: renewal.endDate,
            })),
          };
        }) as Contract[];
        
        set({ contracts, loading: false, error: null });
      },
      (error) => {
        console.error('Firestore error:', error);
        set({ error: error.message, loading: false });
        throw error;
      }
    );

    return unsubscribe;
  },
  
  addContract: async (clientName, initialDate, renewal) => {
    try {
      const newRenewal = { 
        ...renewal,
        id: crypto.randomUUID(),
      };

      await addDoc(collection(db, 'contracts'), {
        clientName,
        initialDate,
        renewals: [newRenewal],
      });
    } catch (error) {
      console.error('Error adding contract:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  addRenewal: async (contractId, renewal) => {
    try {
      const contractRef = doc(db, 'contracts', contractId);
      const newRenewal = { 
        ...renewal,
        id: crypto.randomUUID(),
      };
      const contract = get().contracts.find(c => c.id === contractId);
      
      if (!contract) throw new Error('Contract not found');
      
      await updateDoc(contractRef, {
        renewals: [...contract.renewals, newRenewal],
      });
    } catch (error) {
      console.error('Error adding renewal:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateRenewal: async (contractId, renewalId, renewalUpdate) => {
    try {
      const contractRef = doc(db, 'contracts', contractId);
      const contract = get().contracts.find(c => c.id === contractId);
      
      if (!contract) throw new Error('Contract not found');
      
      const updatedRenewals = contract.renewals.map(renewal => 
        renewal.id === renewalId 
          ? { ...renewal, ...renewalUpdate }
          : renewal
      );
      
      await updateDoc(contractRef, {
        renewals: updatedRenewals,
      });
    } catch (error) {
      console.error('Error updating renewal:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  getARRData: (startDate, endDate) => {
    const contracts = get().contracts;
    const monthlyData = new Map<string, number>();
    
    // Initialize monthly data
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const key = currentDate.toISOString().slice(0, 7);
      monthlyData.set(key, 0);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Calculate ARR for each contract
    contracts.forEach(contract => {
      contract.renewals.forEach(renewal => {
        const renewalStart = new Date(renewal.startDate);
        const renewalEnd = new Date(renewal.endDate);
        const annualValue = Number(renewal.annualValue);

        // Check each month in the data range
        for (let [monthKey] of monthlyData) {
          const currentMonth = new Date(monthKey + '-01');
          
          // Add ARR if the contract is active in this month
          if (currentMonth >= renewalStart && currentMonth <= renewalEnd) {
            const currentValue = monthlyData.get(monthKey) || 0;
            monthlyData.set(monthKey, currentValue + annualValue);
          }
        }
      });
    });

    // Convert to array and sort by date
    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, totalARR]) => ({
        date,
        totalARR,
      }));
  },
}));