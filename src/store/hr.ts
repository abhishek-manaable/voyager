import { create } from 'zustand';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Office,
  Department,
  Position,
  EmployeeProfile,
  AccessControl,
  Skill
} from '../types/hr';

interface HRStore {
  offices: Office[];
  departments: Department[];
  positions: Position[];
  employees: EmployeeProfile[];
  accessControls: AccessControl[];
  skills: Skill[];
  loading: boolean;
  error: string | null;
  
  // Initialization
  initialize: () => () => void;
  
  // Office operations
  addOffice: (office: Omit<Office, 'id'>) => Promise<void>;
  updateOffice: (id: string, office: Partial<Office>) => Promise<void>;
  
  // Department operations
  addDepartment: (department: Omit<Department, 'id'>) => Promise<void>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<void>;
  getDepartmentHierarchy: () => Department[];
  
  // Position operations
  addPosition: (position: Omit<Position, 'id'>) => Promise<void>;
  updatePosition: (id: string, position: Partial<Position>) => Promise<void>;
  
  // Employee operations
  addEmployee: (employee: Omit<EmployeeProfile, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<EmployeeProfile>) => Promise<void>;
  getEmployeesByDepartment: (departmentId: string) => EmployeeProfile[];
  getDirectReports: (managerId: string) => EmployeeProfile[];
  
  // Access Control operations
  addAccessControl: (access: Omit<AccessControl, 'id'>) => Promise<void>;
  updateAccessControl: (id: string, access: Partial<AccessControl>) => Promise<void>;
  
  // Skill operations
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
}

export const useHRStore = create<HRStore>((set, get) => ({
  offices: [],
  departments: [],
  positions: [],
  employees: [],
  accessControls: [],
  skills: [],
  loading: true,
  error: null,

  initialize: () => {
    const unsubscribes: (() => void)[] = [];
    set({ loading: true, error: null });

    // Offices listener
    const officesQuery = query(
      collection(db, 'offices'),
      orderBy('country'),
      orderBy('name')
    );
    unsubscribes.push(
      onSnapshot(
        officesQuery,
        (snapshot) => {
          const offices = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Office[];
          set(state => ({ ...state, offices, loading: false }));
        },
        (error) => {
          console.error('Error fetching offices:', error);
          set(state => ({ ...state, error: error.message, loading: false }));
        }
      )
    );

    // Departments listener
    const departmentsQuery = query(
      collection(db, 'departments'),
      orderBy('order')
    );
    unsubscribes.push(
      onSnapshot(
        departmentsQuery,
        (snapshot) => {
          const departments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Department[];
          set(state => ({ ...state, departments }));
        },
        (error) => {
          console.error('Error fetching departments:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Positions listener
    const positionsQuery = query(
      collection(db, 'positions'),
      orderBy('level')
    );
    unsubscribes.push(
      onSnapshot(
        positionsQuery,
        (snapshot) => {
          const positions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Position[];
          set(state => ({ ...state, positions }));
        },
        (error) => {
          console.error('Error fetching positions:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Employees listener
    const employeesQuery = query(collection(db, 'employees'));
    unsubscribes.push(
      onSnapshot(
        employeesQuery,
        (snapshot) => {
          const employees = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              joinDate: data.joinDate.toDate(),
              personalInfo: {
                ...data.personalInfo,
                dateOfBirth: data.personalInfo.dateOfBirth.toDate(),
              },
              workInfo: {
                ...data.workInfo,
                contractEndDate: data.workInfo.contractEndDate?.toDate(),
                visaStatus: data.workInfo.visaStatus ? {
                  ...data.workInfo.visaStatus,
                  expiryDate: data.workInfo.visaStatus.expiryDate.toDate(),
                } : undefined,
              },
              certifications: data.certifications?.map((cert: any) => ({
                ...cert,
                acquiredDate: cert.acquiredDate.toDate(),
                expiryDate: cert.expiryDate?.toDate(),
              })),
            };
          }) as EmployeeProfile[];
          set(state => ({ ...state, employees }));
        },
        (error) => {
          console.error('Error fetching employees:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Access Controls listener
    const accessControlsQuery = query(collection(db, 'accessControls'));
    unsubscribes.push(
      onSnapshot(
        accessControlsQuery,
        (snapshot) => {
          const accessControls = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AccessControl[];
          set(state => ({ ...state, accessControls }));
        },
        (error) => {
          console.error('Error fetching access controls:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Skills listener
    const skillsQuery = query(
      collection(db, 'skills'),
      orderBy('category'),
      orderBy('nameEn')
    );
    unsubscribes.push(
      onSnapshot(
        skillsQuery,
        (snapshot) => {
          const skills = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Skill[];
          set(state => ({ ...state, skills }));
        },
        (error) => {
          console.error('Error fetching skills:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  },

  // Office operations
  addOffice: async (office) => {
    try {
      await addDoc(collection(db, 'offices'), {
        ...office,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding office:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateOffice: async (id, office) => {
    try {
      const officeRef = doc(db, 'offices', id);
      await updateDoc(officeRef, {
        ...office,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating office:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  // Department operations
  addDepartment: async (department) => {
    try {
      await addDoc(collection(db, 'departments'), {
        ...department,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding department:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateDepartment: async (id, department) => {
    try {
      const departmentRef = doc(db, 'departments', id);
      await updateDoc(departmentRef, {
        ...department,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating department:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getDepartmentHierarchy: () => {
    const departments = get().departments;
    const buildHierarchy = (parentId?: string): Department[] => {
      return departments
        .filter(dept => dept.parentId === parentId)
        .map(dept => ({
          ...dept,
          children: buildHierarchy(dept.id),
        }));
    };
    return buildHierarchy();
  },

  // Position operations
  addPosition: async (position) => {
    try {
      await addDoc(collection(db, 'positions'), {
        ...position,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding position:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updatePosition: async (id, position) => {
    try {
      const positionRef = doc(db, 'positions', id);
      await updateDoc(positionRef, {
        ...position,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating position:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  // Employee operations
  addEmployee: async (employee) => {
    try {
      await addDoc(collection(db, 'employees'), {
        ...employee,
        joinDate: Timestamp.fromDate(employee.joinDate),
        personalInfo: {
          ...employee.personalInfo,
          dateOfBirth: Timestamp.fromDate(employee.personalInfo.dateOfBirth),
        },
        workInfo: {
          ...employee.workInfo,
          contractEndDate: employee.workInfo.contractEndDate 
            ? Timestamp.fromDate(employee.workInfo.contractEndDate)
            : null,
          visaStatus: employee.workInfo.visaStatus
            ? {
                ...employee.workInfo.visaStatus,
                expiryDate: Timestamp.fromDate(employee.workInfo.visaStatus.expiryDate),
              }
            : null,
        },
        certifications: employee.certifications?.map(cert => ({
          ...cert,
          acquiredDate: Timestamp.fromDate(cert.acquiredDate),
          expiryDate: cert.expiryDate ? Timestamp.fromDate(cert.expiryDate) : null,
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateEmployee: async (id, employee) => {
    try {
      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, {
        ...employee,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getEmployeesByDepartment: (departmentId: string) => {
    return get().employees.filter(emp => emp.departmentId === departmentId);
  },

  getDirectReports: (managerId: string) => {
    return get().employees.filter(emp => emp.reportingTo === managerId);
  },

  // Access Control operations
  addAccessControl: async (access) => {
    try {
      await addDoc(collection(db, 'accessControls'), {
        ...access,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding access control:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateAccessControl: async (id, access) => {
    try {
      const accessRef = doc(db, 'accessControls', id);
      await updateDoc(accessRef, {
        ...access,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating access control:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  // Skill operations
  addSkill: async (skill) => {
    try {
      await addDoc(collection(db, 'skills'), {
        ...skill,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateSkill: async (id, skill) => {
    try {
      const skillRef = doc(db, 'skills', id);
      await updateDoc(skillRef, {
        ...skill,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating skill:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));