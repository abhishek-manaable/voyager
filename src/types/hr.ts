import { UserRole } from './auth';

export interface Office {
  id: string;
  name: string;
  country: 'JP' | 'IN';
  timezone: string;
  address: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  code: string;
  nameJa: string;
  nameEn: string;
  parentId?: string;
  managerId?: string;
  order: number;
  isActive: boolean;
}

export interface Position {
  id: string;
  code: string;
  nameJa: string;
  nameEn: string;
  level: number;
  isActive: boolean;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  fullName: string;
  employeeCode: string;
  officeId: string;
  departmentId: string;
  positionId: string;
  reportingTo?: string;
  joinDate: Date;
  status: 'active' | 'leave' | 'retired';
  personalInfo: {
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    nationality: string;
    address: string;
    phone: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  workInfo: {
    employmentType: 'full-time' | 'contract' | 'part-time';
    contractEndDate?: Date;
    visaStatus?: {
      type: string;
      expiryDate: Date;
    };
  };
  skills: {
    id: string;
    level: 1 | 2 | 3 | 4 | 5;
    yearsOfExperience: number;
  }[];
  certifications: {
    name: string;
    acquiredDate: Date;
    expiryDate?: Date;
    verificationUrl?: string;
  }[];
}

export interface AccessControl {
  id: string;
  roleId: UserRole;
  departmentId?: string;
  permissions: {
    resource: 'employees' | 'timeoff' | 'attendance' | 'reports';
    actions: ('view' | 'create' | 'update' | 'delete' | 'approve')[];
    conditions?: {
      departmentScope?: 'own' | 'managed' | 'all';
      employeeScope?: 'self' | 'direct-reports' | 'all';
    };
  }[];
}

export interface Skill {
  id: string;
  nameJa: string;
  nameEn: string;
  category: string;
  isActive: boolean;
}