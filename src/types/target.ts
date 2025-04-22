export interface ARRTarget {
  id: string;
  year: number;
  month: number;  // 1-12
  targetAmount: number;
  notes?: string;
}

export interface ARRTargetFormData {
  year: number;
  month: number;
  targetAmount: number;
  notes?: string;
}