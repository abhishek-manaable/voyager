# SATURN - HR Management System

## Overview
SATURN is a comprehensive HR management system designed to handle employee information, organizational structure, and HR-related processes for a company with offices in Japan and India.

## Core Features

### Organization Management

1. **Office Management**
   - Office registration and management
   - Support for multiple locations (Japan and India)
   - Office attributes:
     - Name
     - Country (JP/IN)
     - Timezone
     - Address
     - Active status

2. **Department Management**
   - Hierarchical department structure
   - Department attributes:
     - Department code
     - Name (Japanese/English)
     - Parent department
     - Manager assignment
     - Display order
     - Active status
   - Department tree visualization
   - Department hierarchy management

3. **Position Management**
   - Position definition and management
   - Position attributes:
     - Position code
     - Name (Japanese/English)
     - Level (1-10)
     - Active status
   - Position hierarchy based on levels

### Employee Management

1. **Basic Information**
   - Employee profile creation and management
   - Integration with Voyager user accounts
   - Core attributes:
     - Employee code
     - Office assignment
     - Department assignment
     - Position assignment
     - Reporting line
     - Join date
     - Employment status (Active/Leave/Retired)

2. **Personal Information**
   - Comprehensive personal details:
     - Date of birth
     - Gender
     - Nationality
     - Address
     - Contact information
   - Emergency contact:
     - Name
     - Relationship
     - Contact information

3. **Work Information**
   - Employment details:
     - Employment type (Full-time/Contract/Part-time)
     - Contract end date (for contract employees)
   - Visa information (if applicable):
     - Visa type
     - Expiry date

4. **Skills Management**
   - Skill registration and tracking
   - Skill attributes:
     - Skill category
     - Name (Japanese/English)
     - Proficiency level (1-5)
     - Years of experience
   - Skill categorization and filtering

5. **Certification Management**
   - Professional certification tracking
   - Certification attributes:
     - Name
     - Acquisition date
     - Expiry date
     - Verification URL
   - Expiry monitoring
   - Renewal tracking

6. **Employment History**
   - Track changes in:
     - Department assignments
     - Position changes
     - Office transfers
   - Historical record maintenance

### Access Control

1. **Role-Based Access Control (RBAC)**
   - Integration with Voyager's role system:
     - ADMIN
     - HR_MANAGER
     - MANAGER
     - EMPLOYEE

2. **Department-Based Access Control**
   - Access restrictions based on:
     - Department hierarchy
     - Reporting line
   - Granular permission settings

3. **Permission Management**
   - Resource-level permissions:
     - View
     - Create
     - Update
     - Delete
     - Approve
   - Scope-based restrictions:
     - Own department
     - Managed departments
     - All departments

## Technical Implementation

### Data Models

1. **Office**
```typescript
interface Office {
  id: string;
  name: string;
  country: 'JP' | 'IN';
  timezone: string;
  address: string;
  isActive: boolean;
}
```

2. **Department**
```typescript
interface Department {
  id: string;
  code: string;
  nameJa: string;
  nameEn: string;
  parentId?: string;
  managerId?: string;
  order: number;
  isActive: boolean;
}
```

3. **Position**
```typescript
interface Position {
  id: string;
  code: string;
  nameJa: string;
  nameEn: string;
  level: number;
  isActive: boolean;
}
```

4. **Employee Profile**
```typescript
interface EmployeeProfile {
  id: string;
  userId: string;
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
```

5. **Access Control**
```typescript
interface AccessControl {
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
```

### Security Rules

1. **Base Rules**
```typescript
function canAccessHRDocuments() {
  return isAuthenticated() && 
    hasManaableDomain() && 
    (isAdmin() || isHRManager()) &&
    (
      request.method == 'read' ||
      request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['createdAt', 'updatedAt', 'isActive', 'name', 'nameEn', 'nameJa', 
                 'code', 'country', 'timezone', 'address', 'parentId', 'managerId', 
                 'order', 'level'])
    );
}
```

2. **Collection Rules**
```typescript
match /offices/{officeId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if canAccessHRDocuments();
}

match /departments/{departmentId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if canAccessHRDocuments();
}

match /positions/{positionId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if canAccessHRDocuments();
}

match /employees/{employeeId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if isAuthenticated() && hasManaableDomain() && 
               (isAdmin() || isHRManager());
  allow delete: if isAdmin();
}

match /skills/{skillId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if canAccessHRDocuments();
}

match /accessControls/{controlId} {
  allow read: if isAuthenticated() && hasManaableDomain();
  allow write: if isAdmin();
}
```

## Future Enhancements

### Phase 1 (Current)
- Basic organization management
- Employee profile management
- Basic access control

### Phase 2 (Planned)
- Time-off management
- Attendance tracking
- Performance evaluations
- Document management

### Phase 3 (Future)
- Advanced reporting
- Analytics dashboard
- Mobile application
- Integration with other systems