export interface Contract {
  id: string;
  clientName: string;
  initialDate: string;
  renewals: ContractRenewal[];
}

export interface ContractRenewal {
  id: string;
  startDate: string;
  endDate: string;
  annualValue: number;
  status: 'active' | 'upcoming' | 'expired';
  notes?: string;
}

export interface ContractFormData {
  clientName: string;
  startDate: string;
  endDate: string;
  annualValue: number;
  notes?: string;
}