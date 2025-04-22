# Voyager - SaaS Analytics Dashboard

## Overview
Voyager is a comprehensive SaaS analytics dashboard designed to track and manage Annual Recurring Revenue (ARR), contracts, and business targets. The application provides real-time insights into business performance with a focus on revenue metrics and contract management.

## System Architecture

### Applications
Voyager consists of multiple specialized applications:

1. **Dashboard (Main)**
   - ARR metrics and KPIs
   - Contract management
   - Target management
   - User management

2. **SUN (Sales)**
   - Sales pipeline management
   - Lead tracking
   - Opportunity management
   - Quote generation

3. **MERCURY (Marketing)**
   - Campaign management
   - Contact management
   - Form management
   - Marketing analytics

4. **VENUS (Customer Success)**
   - Customer health monitoring
   - Usage analytics
   - Feedback management
   - Customer engagement

5. **MARS (Renewal)**
   - Renewal pipeline
   - Risk management
   - Schedule management
   - Historical tracking

6. **JUPITER (Product)**
   - Product roadmap
   - Release management
   - Issue tracking
   - Feature requests

7. **SATURN (HR)**
   - Employee management
   - Organization management
   - Time-off management
   - Performance evaluation

8. **URANUS (Development)**
   - Feature development
   - Integration management
   - Technical documentation
   - API management

9. **NEPTUNE (Discovery)**
   - Market research
   - Competitive analysis
   - User research
   - Product discovery

## Core Features

### Authentication & Authorization
- Single Sign-On (SSO) with Google
- Domain restriction to @manaable.com emails
- Persistent authentication state
- Role-based access control (RBAC)
- Department-based access control
- Secure route protection

### Dashboard Analytics
- Real-time ARR metrics display
- Key Performance Indicators (KPIs):
  - Current ARR with YoY growth
  - Quarterly target progress (Fiscal Year: Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar)
  - Net Revenue Retention (NRR) with YoY comparison
  - Training applicants count with MoM growth
  - Training completion rate with MoM change
- Interactive ARR trend visualization:
  - Multiple time range views (1Y, 2Y, 3Y, All-time)
  - Actual vs Target comparison
  - Future target projections
  - Responsive chart design

### Contract Management
- Comprehensive contract lifecycle management
- Features:
  - Create new contracts
  - Add contract renewals
  - Edit existing contracts
  - Track contract status
  - Monitor contract values
- Contract details:
  - Client name
  - Initial contract date
  - Contract renewals
  - Annual value (ARR)
  - Start and end dates
  - Optional notes
- Real-time updates with Firestore synchronization

### ARR Target Management
- Monthly target setting and tracking
- Features:
  - Set targets by year/month
  - Edit existing targets
  - Track target vs actual performance
  - Visual progress indicators
- Fiscal year alignment
- Rolling 3-year view (previous, current, next)

### User Management
- User roles:
  - Administrator
  - HR Manager
  - Manager
  - Employee
- User status management
- Access control management
- Activity logging
- Profile management

## Technical Architecture

### Frontend Technologies
- React 18.3.1
- TypeScript
- Vite build system
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation
- React Hook Form for form handling
- i18next for internationalization
- Lucide React for icons

### State Management
- Zustand for global state
- React Context for auth state
- Persistent storage for user preferences
- Real-time data synchronization

### Backend Integration
- Firebase Authentication
- Firestore Database
- Real-time data synchronization
- Optimized query performance

### Security
- Protected routes
- Domain-restricted access
- Secure authentication flow
- Data validation
- Error handling

## Data Models

### Contract
```typescript
interface Contract {
  id: string;
  clientName: string;
  initialDate: string;
  renewals: ContractRenewal[];
}

interface ContractRenewal {
  id: string;
  startDate: string;
  endDate: string;
  annualValue: number;
  status: 'active' | 'upcoming' | 'expired';
  notes?: string;
}
```

### ARR Target
```typescript
interface ARRTarget {
  id: string;
  year: number;
  month: number;
  targetAmount: number;
  notes?: string;
}
```

### User
```typescript
interface AuthUser {
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

enum UserRole {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}
```

## Internationalization
- Multi-language support:
  - English (en)
  - Japanese (ja)
- Complete localization of:
  - Navigation elements
  - Form labels
  - Error messages
  - Date formats
  - Currency formats
- Real-time language switching
- Persistent language preference

## Theme Support
- Light and dark mode
- System theme detection
- Persistent theme preference
- Real-time theme switching
- Consistent styling across components

## Performance Optimizations
- Efficient state management with Zustand
- Optimized Firestore queries
- Responsive design patterns
- Lazy loading of components
- Memoization of expensive calculations
- Debounced user inputs
- Optimized chart rendering

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement
- Responsive design
- Dark mode support
- Accessibility compliance

## Development Guidelines
- Component-based architecture
- Type-safe development
- Consistent error handling
- State management patterns
- Responsive design principles
- Dark mode compatibility
- Accessibility standards
- Code splitting
- Performance monitoring