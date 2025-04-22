import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  Star,
  FileSignature,
  Building2,
  Users,
  CalendarDays,
  ClipboardList,
  FileCheck,
  Target,
  Bird, // For Japan (Crane)
  Squirrel // For India (closest to Elephant in lucide-react)
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import TimeSheet from './pages/attendance/TimeSheet';
import TimeOff from './pages/attendance/TimeOff';
import OrganizationManagement from './pages/organization/OrganizationManagement';
import EmployeeManagement from './pages/employees/EmployeeManagement';
import ComingSoon from '../../components/common/ComingSoon';
import { UserRole } from '../../types/auth';

export const SaturnApp = () => {
  const { t } = useTranslation();
  const { authUser } = useAuth();

  const isHRAdmin = authUser?.role === UserRole.ADMIN || authUser?.role === UserRole.HR_MANAGER;

  const navigation = {
    title: t('apps.saturn'),
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/saturn'
      },
      {
        icon: Clock,
        label: 'Attendance',
        children: [
          {
            icon: Bird,
            label: 'Japan',
            children: [
              {
                label: 'Time Sheet',
                path: '/saturn/attendance/jp/timesheet'
              },
              {
                label: 'Time Off',
                path: '/saturn/attendance/jp/timeoff'
              }
            ]
          },
          {
            icon: Squirrel,
            label: 'India',
            children: [
              {
                label: 'Time Sheet',
                path: '/saturn/attendance/in/timesheet'
              },
              {
                label: 'Time Off',
                path: '/saturn/attendance/in/timeoff'
              }
            ]
          }
        ]
      },
      {
        icon: FileText,
        label: 'Reports',
        children: [
          {
            icon: ClipboardList,
            label: 'Daily Report',
            path: '/saturn/reports/daily'
          },
          {
            icon: FileCheck,
            label: 'Self Assessment',
            path: '/saturn/reports/assessment'
          },
          {
            icon: Target,
            label: 'Quarterly Commitment',
            path: '/saturn/reports/commitment'
          }
        ]
      },
      {
        icon: Star,
        label: 'Evaluation',
        path: '/saturn/evaluation'
      },
      {
        icon: FileSignature,
        label: 'Applications',
        path: '/saturn/applications'
      },
      {
        icon: Building2,
        label: 'Settings',
        requiredRole: UserRole.HR_MANAGER,
        children: [
          {
            icon: Building2,
            label: 'Organization',
            path: '/saturn/organization-management/organization'
          },
          {
            icon: Users,
            label: 'Employees',
            path: '/saturn/organization-management/employees'
          }
        ]
      }
    ].filter(item => !item.requiredRole || isHRAdmin)
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Attendance Routes */}
        <Route path="/attendance/:country/timesheet" element={<TimeSheet />} />
        <Route path="/attendance/:country/timeoff" element={<TimeOff />} />

        {/* Reports Routes */}
        <Route path="/reports/daily" element={<ComingSoon name="Daily Report" />} />
        <Route path="/reports/assessment" element={<ComingSoon name="Self Assessment" />} />
        <Route path="/reports/commitment" element={<ComingSoon name="Quarterly Commitment" />} />

        {/* Evaluation Route */}
        <Route path="/evaluation" element={<ComingSoon name="Evaluation" />} />

        {/* Applications Route */}
        <Route path="/applications" element={<ComingSoon name="Applications" />} />

        {/* Organization Management Routes - Protected */}
        {isHRAdmin ? (
          <>
            <Route 
              path="/organization-management/organization/*" 
              element={<OrganizationManagement />} 
            />
            <Route 
              path="/organization-management/employees/*" 
              element={<EmployeeManagement />} 
            />
          </>
        ) : (
          <Route 
            path="/organization-management/*" 
            element={<Navigate to="/saturn" replace />} 
          />
        )}
      </Routes>
    </AppLayout>
  );
};

export default SaturnApp;