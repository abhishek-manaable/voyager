import { User } from 'firebase/auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
}